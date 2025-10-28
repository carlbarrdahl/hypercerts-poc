import { Context, ponder } from "ponder:registry";
import { vault } from "../ponder.schema";
import {
  Address,
  erc20Abi,
  erc4626Abi,
  zeroAddress,
  getAbiItem,
  Hex,
  parseAbiParameters,
  decodeAbiParameters,
} from "viem";
import pRetry from "p-retry";
import { cachedFetchWithRetry } from "./lib/fetch";
import {
  contributor,
  deposit,
  funder,
  funding,
  withdraw,
  attestation,
} from "ponder:schema";
import deployments from "../abis/deployments.json";
import { shouldIndexSchema } from "./config";

const MAX_RETRY_COUNT = 5;

ponder.on("HyperVaultFactory:Created", async ({ event, context }) => {
  const {
    id,
    config: { asset, parent, percent, metadataURI, owner },
  } = event.args;

  const [decimals, symbol] = await fetchToken(asset, context.client);
  console.log(event.args);
  const metadata = await fetchMetadata(metadataURI);
  await context.db.insert(vault).values({
    id,
    owner,
    parent: parent === zeroAddress ? null : parent,
    token: { address: asset, symbol, decimals },
    percent,
    metadata,
    createdAt: toTimestamp(event.block.timestamp),
  });
});

ponder.on("HyperVault:Deposit", async ({ event, context }) => {
  const {
    log: { address: id },
    args: { sender, owner, assets, shares },
  } = event;

  console.log("Deposit event:", event.args);
  const asset = await fetchAsset(id, context.client);
  const [decimals, symbol] = await fetchToken(asset, context.client);
  await context.db.insert(deposit).values({
    id: event.id,
    vault: id,
    owner,
    sender,
    assets,
    shares,
    token: { address: asset, symbol, decimals },
    createdAt: toTimestamp(event.block.timestamp),
  });
  await context.db
    .insert(contributor)
    .values({
      id: event.id,
      vault: id,
      address: sender,
      assets,
      shares,
      token: { address: asset, symbol, decimals },
      createdAt: toTimestamp(event.block.timestamp),
    })
    .onConflictDoUpdate((row) => ({
      address: sender,
      vault: id,
      assets: (row.assets ?? 0n) + BigInt(assets),
      shares: (row.shares ?? 0n) + BigInt(shares),
    }));
});

ponder.on("HyperVault:Withdraw", async ({ event, context }) => {
  const {
    log: { address: id },
    args: { sender, owner, assets, shares },
  } = event;

  const asset = await fetchAsset(id, context.client);
  const [decimals, symbol] = await fetchToken(asset, context.client);
  await context.db.insert(withdraw).values({
    id: event.id,
    vault: id,
    owner,
    sender,
    assets,
    shares,
    token: { address: asset, symbol, decimals },
    createdAt: toTimestamp(event.block.timestamp),
  });
  await context.db
    .insert(contributor)
    .values({
      id: event.id,
      vault: id,
      address: sender,
      assets,
      shares,
      token: { address: asset, symbol, decimals },
      createdAt: toTimestamp(event.block.timestamp),
    })
    .onConflictDoUpdate((row) => ({
      address: sender,
      vault: id,
      assets: (row.assets ?? 0n) - BigInt(assets),
      shares: (row.shares ?? 0n) - BigInt(shares),
      updatedAt: toTimestamp(event.block.timestamp),
    }));
});

ponder.on("HyperVault:Funded", async ({ event, context }) => {
  const {
    log: { address: id },
    args: { sender, owner, assets },
  } = event;

  const asset = await fetchAsset(id, context.client);
  const [decimals, symbol] = await fetchToken(asset, context.client);
  const token = { address: asset, symbol, decimals };
  await context.db.insert(funding).values({
    id: event.id,
    vault: id,
    owner,
    sender,
    assets,
    token,
    createdAt: toTimestamp(event.block.timestamp),
  });

  await context.db
    .insert(funder)
    .values({
      id: event.id,
      vault: id,
      address: sender,
      assets,
      token,
      createdAt: toTimestamp(event.block.timestamp),
    })
    .onConflictDoUpdate((row) => ({
      address: sender,
      vault: id,
      assets: (row.assets ?? 0n) + BigInt(assets),
      updatedAt: toTimestamp(event.block.timestamp),
    }));
});

async function fetchAsset(address: Address, client: Context["client"]) {
  return client.readContract({
    abi: erc4626Abi,
    address,
    cache: "immutable",
    functionName: "asset",
  });
}
type Metadata = {
  title: string;
  description?: string;
  image?: string;
};
async function fetchMetadata(cid: string): Promise<Metadata> {
  console.log("Fetching metadata for:", cid);
  const ipfsUrl = `http://localhost:3000/api/ipfs/${cid}`;
  return cid
    ? cachedFetchWithRetry<Metadata>(ipfsUrl).catch((err: any) => {
        console.log("fetchMetadata error:", err);
        return {} as Metadata;
      })
    : ({} as Metadata);
}

async function fetchToken(address: Address, client: Context["client"]) {
  console.log("Fetching token decimal and symbol for: ", address);
  if (address === zeroAddress) return [18, "ETH"] as const;

  return pRetry(
    () => {
      const tokenContract = {
        abi: erc20Abi,
        address,
        cache: "immutable",
      } as const;
      return Promise.all([
        client.readContract({ ...tokenContract, functionName: "decimals" }),
        client.readContract({ ...tokenContract, functionName: "symbol" }),
      ]);
    },
    { retries: MAX_RETRY_COUNT }
  );
}

// EAS Attestation indexer
ponder.on("EAS:Attested", async ({ event, context }) => {
  const { recipient, attester, uid, schemaUID } = event.args;

  console.log("Attested event:", event);

  // Filter: Only index attestations for specific schemas
  // if (!shouldIndexSchema(schemaUID)) {
  //   console.log(
  //     `Skipping attestation ${uid} - schema ${schemaUID} not in indexed list`
  //   );
  //   return;
  // }

  try {
    // Fetch full attestation data from the contract
    const data = (await context.client.readContract({
      abi: deployments[31337].EAS.abi,
      address: event.log.address as Address,
      functionName: "getAttestation",
      args: [uid],
    })) as {
      uid: Hex;
      schema: Hex;
      time: bigint;
      expirationTime: bigint;
      revocationTime: bigint;
      refUID: Hex;
      recipient: Address;
      attester: Address;
      revocable: boolean;
      data: Hex;
    };

    const schema = (await context.client.readContract({
      abi: deployments[31337].SchemaRegistry.abi,
      address: deployments[31337].SchemaRegistry.address as Address,
      functionName: "getSchema",
      args: [data.schema],
    })) as { schema: string };

    const decoded = decodeSchema(schema.schema, data.data);
    console.log(toTimestamp(event.block.timestamp));

    await context.db.insert(attestation).values({
      id: uid,
      ...data,
      decodedParsed: decoded,
      decodedDataJson: JSON.stringify(decoded),
      isOffchain: false,
      createdAt: toTimestamp(event.block.timestamp),
    });

    console.log("Stored onchain attestation:", uid);
  } catch (error) {
    console.error("Error indexing attestation:", error);
    throw error;
  }
});

const toTimestamp = (timestamp: bigint) => new Date(Number(timestamp) * 1000);
function decodeSchema(schema: string, data: Hex) {
  const values = decodeAbiParameters(parseAbiParameters(schema), data);
  const mapper: Record<string, (v: unknown) => unknown> = {
    string: (v) => v,
  };
  return schema.split(",").reduce(
    (acc, x, index) => {
      const [type, name = ""] = x.trim().split(" ");
      const map = mapper[type as keyof typeof mapper];
      return { ...acc, [name]: map ? map(values[index]) : values[index] };
    },
    {} as Record<string, any>
  );
}
