# EAS (Ethereum Attestation Service)

---

## 1. Contracts

### Core Contracts

#### Attestation Data Structure

```solidity
// Common.sol
struct Attestation {
    bytes32 uid;           // Unique identifier
    bytes32 schema;        // Schema UID
    uint64 time;           // Creation time
    uint64 expirationTime; // 0 = no expiration
    uint64 revocationTime; // 0 = not revoked
    bytes32 refUID;        // Reference to another attestation
    address recipient;     // Who receives the attestation
    address attester;      // Who created it
    bool revocable;        // Can be revoked
    bytes data;            // Encoded attestation data
}
```

#### Schema Registry

```solidity
// ISchemaRegistry.sol
struct SchemaRecord {
    bytes32 uid;
    string schema;          // e.g., "string type, string metadata, string visibility"
    ISchemaResolver resolver;
    bool revocable;
}

// Register schema
function register(string schema, ISchemaResolver resolver, bool revocable) returns (bytes32 uid);

// Get schema
function getSchema(bytes32 uid) returns (SchemaRecord);
```

#### EAS Core Functions

```solidity
// IEAS.sol - Key functions only
interface IEAS {
    // Events
    event Attested(address indexed recipient, address indexed attester, bytes32 uid, bytes32 indexed schemaUID);
    event Revoked(address indexed recipient, address indexed attester, bytes32 uid, bytes32 indexed schemaUID);

    // Create attestation
    function attest(AttestationRequest request) payable returns (bytes32 uid);

    // Revoke attestation
    function revoke(RevocationRequest request) payable;

    // Read attestation
    function getAttestation(bytes32 uid) view returns (Attestation);
    function isAttestationValid(bytes32 uid) view returns (bool);
}

struct AttestationRequest {
    bytes32 schema;
    AttestationRequestData data;
}

struct AttestationRequestData {
    address recipient;
    uint64 expirationTime;  // 0 = no expiration
    bool revocable;
    bytes32 refUID;         // Reference UID (optional)
    bytes data;             // Encoded data
    uint256 value;          // ETH to send to resolver
}
```

---

## 2. SDK extension

### Core Functions

#### Configuration

```typescript
import {
  EAS,
  SchemaEncoder,
  NO_EXPIRATION,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";

export const config = {
  eas: {
    [hardhat.id]: deployments["31337"].EAS.address,
    [baseSepolia.id]: "0x4200000000000000000000000000000000000021",
  },
  registry: {
    [hardhat.id]: deployments["31337"].SchemaRegistry.address,
    [baseSepolia.id]: "0x4200000000000000000000000000000000000020",
  },
};
```

#### Input Schema

```typescript
export const AttestationInputSchema = z.object({
  recipient: z.string(),
  refUID: z.string().optional(),
  data: z.object({
    type: z.string(),
    metadata: z.object({
      title: z.string(),
      description: z.string().optional(),
      image: z.string().optional(),
      geoJSON: z.string().optional(),
    }),
  }),
  visibility: z.enum(["private", "organization", "draft", "published"]),
});

export type AttestationInput = z.infer<typeof AttestationInputSchema>;
```

#### Create Attestation Function

```typescript
export async function createAttestation(
  input: AttestationInput,
  client: WalletClient
): Promise<string> {
  const signer = clientToSigner(client);
  const EASContractAddress = config.eas[client.chain?.id];

  const eas = new EAS(EASContractAddress);
  eas.connect(signer);

  const schema = "string type, string metadata, string visibility";
  const schemaEncoder = new SchemaEncoder(schema);
  const metadataURI = JSON.stringify(input.data.metadata);

  const data = schemaEncoder.encodeData([
    { name: "type", value: input.data.type, type: "string" },
    { name: "metadata", value: metadataURI, type: "string" },
    { name: "visibility", value: input.visibility, type: "string" },
  ]);

  const schemaUID = await registerSchema(schema, signer);

  // Only onchain for 'published' visibility
  if (input.visibility === "published") {
    return eas
      .attest({
        schema: schemaUID,
        data: {
          recipient: input.recipient,
          refUID: input.refUID,
          expirationTime: NO_EXPIRATION,
          revocable: true,
          data,
        },
      })
      .then((tx) => tx.wait());
  }

  throw new Error("Offchain attestations not implemented");
}
```

#### Register Schema Helper

```typescript
async function registerSchema(schema: string, signer: JsonRpcSigner) {
  const resolver = zeroAddress;
  const revocable = true;

  // Calculate expected UID
  const schemaUID = keccak256(
    encodePacked(["string", "address", "bool"], [schema, resolver, revocable])
  );

  const schemaRegistry = new SchemaRegistry(config.registry[hardhat.id]);
  schemaRegistry.connect(signer);

  // Check if already exists
  const existingSchema = await schemaRegistry
    .getSchema({ uid: schemaUID })
    .catch(() => null);
  if (existingSchema?.uid && existingSchema.uid !== zeroHash) {
    return schemaUID;
  }

  // Register new schema
  const tx = await schemaRegistry.register({
    schema,
    resolverAddress: resolver,
    revocable,
  });
  await tx.wait();

  return schemaUID;
}
```

---

## 3. Indexer

### Ponder Config

```typescript
import deployments from "./abis/deployments.json";

export default createConfig({
  contracts: {
    EAS: {
      abi: deployments[31337].EAS.abi as Abi,
      chain: "hardhat",
      address: deployments[31337].EAS.address,
    },
  },
});
```

### PonderSchema

```typescript
export const attestation = onchainTable("attestation", (t) => ({
  id: t.hex().primaryKey(),
  attester: t.hex().notNull(),
  recipient: t.hex().notNull(),
  refUID: t.hex(),
  schema: t.hex(),
  time: t.bigint(),
  expirationTime: t.bigint(),
  revocable: t.boolean(),
  revocationTime: t.bigint(),
  data: t.hex(),
  decodedDataJson: t.text(),
  decodedParsed: t.json(),
  isOffchain: t.boolean().notNull(),
  createdAt: t.timestamp(),
  updatedAt: t.timestamp(),
}));
```

### Event Handler

```typescript
ponder.on("EAS:Attested", async ({ event, context }) => {
  const { recipient, attester, uid, schemaUID } = event.args;

  // Fetch full attestation data from contract
  const data = await context.client.readContract({
    abi: deployments[31337].EAS.abi,
    address: event.log.address,
    functionName: "getAttestation",
    args: [uid],
  });

  // Fetch schema definition
  const schema = await context.client.readContract({
    abi: deployments[31337].SchemaRegistry.abi,
    address: deployments[31337].SchemaRegistry.address,
    functionName: "getSchema",
    args: [data.schema],
  });

  // Decode attestation data according to schema
  const decoded = decodeSchema(schema.schema, data.data);

  await context.db.insert(attestation).values({
    id: uid,
    ...data,
    decodedParsed: decoded,
    decodedDataJson: JSON.stringify(decoded),
    isOffchain: false,
    createdAt: new Date(Number(event.block.timestamp) * 1000),
  });
});

function decodeSchema(schema: string, data: Hex) {
  const values = decodeAbiParameters(parseAbiParameters(schema), data);
  return schema.split(",").reduce((acc, x, index) => {
    const [type, name = ""] = x.trim().split(" ");
    return { ...acc, [name]: values[index] };
  }, {});
}
```

### GraphQL Query (`lib/indexer.ts`)

```typescript
const attestationsQuery = gql`
  query Attestations(
    $where: attestationFilter
    $orderBy: String
    $orderDirection: String
    $limit: Int
  ) {
    attestations(
      where: $where
      orderBy: $orderBy
      orderDirection: $orderDirection
      limit: $limit
    ) {
      items {
        id
        time
        refUID
        recipient
        attester
        schema
        decodedParsed
        createdAt
        isOffchain
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Types
export type Attestation = {
  id: string;
  refUID: string;
  recipient: Address;
  attester: Address;
  schema: string;
  decodedParsed: Record<string, unknown>;
  createdAt: Date;
};

export type AttestationFilter = {
  recipient?: string;
  attester?: string;
  schema?: string;
  // ... other filter options
};
```

---

## 4. Hooks

```typescript
// Create Attestation Mutation
export function useCreateAttestation() {
  const { sdk } = useVaultSDK();
  return useMutation({
    mutationFn: async (data: AttestationInput) => sdk?.attestation.create(data),
  });
}

// Query Attestations
export function useAttestations(
  query: AttestationVariables,
  opts?: { enabled?: boolean; refetchInterval?: number }
) {
  const { sdk } = useVaultSDK();
  return useQuery({
    queryKey: ["attestations", query],
    queryFn: async () => sdk?.indexer.attestation.query(query),
    ...opts,
  });
}
```

---

## 5. Component Usage

### Query Attestations

```tsx
const { data, isPending } = useAttestations(
  {
    orderBy: "createdAt",
    orderDirection: "desc",
    where: { recipient: vaultId },
  },
  { refetchInterval: 1000 }
);
```

### Create Attestation

```tsx
const { mutate: createAttestation, isPending } = useCreateAttestation();

createAttestation(
  {
    recipient: vaultId,
    schema: schemaUID,
    refUID: parentAttestationId, // optional
    data: {
      metadata: {
        title: "...",
        description: "...",
        image: "https://...",
      },
    },
  },
  {
    onSuccess: () => {
      /* invalidate queries */
    },
    onError: (error) => {
      /* handle error */
    },
  }
);
```

### Parsing Attestation Data

```tsx
// Attestation item structure from indexer
const parsed = item.decodedParsed;
const metadata =
  typeof parsed.metadata === "string"
    ? JSON.parse(parsed.metadata)
    : parsed.metadata;

// Access fields
const { title, description, image, ...rest } = metadata;
```

---

## Key Dependencies

```json
{
  "@ethereum-attestation-service/eas-sdk": "^2.7.0"
}
```

---

## Schema Definition

Current schema used: `string metadata`

**Fields:**

- `metadata`: JSON string containing title, description, image, etc.
  s

---

## Encapsulation Notes

To create a standalone EAS extension:

1. **Contracts**: Deploy or use existing EAS + SchemaRegistry
2. **SDK**: Export `createAttestation`, `registerSchema`, `config`
3. **Indexer**: Export schema + event handler
4. **Hooks**: Export `useCreateAttestation`, `useAttestations`
5. **Types**: Export `AttestationInput`, `Attestation`, `AttestationFilter`







