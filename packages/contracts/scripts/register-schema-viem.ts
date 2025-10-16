import { createWalletClient, createPublicClient, http, parseAbi, keccak256, encodeAbiParameters } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import deployments from "../deployments.json";

/**
 * Register a schema in the EAS SchemaRegistry using viem
 *
 * This script registers the hypercerts attestation schema:
 * - type: string (e.g., "region", "builder", etc.)
 * - metadata: string (IPFS CID or JSON string)
 * - visibility: string ("private", "organization", "draft", "published")
 */

const schemaRegistryAbi = parseAbi([
  "function register(string schema, address resolver, bool revocable) external returns (bytes32)",
  "function getSchema(bytes32 uid) external view returns (bytes32 uid, address resolver, bool revocable, string schema)",
  "event Registered(bytes32 indexed uid, address indexed registerer, (bytes32 uid, address resolver, bool revocable, string schema) schema)",
]) as const;

async function main() {
  // Get private key from environment or use hardhat default
  const privateKey = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat account #0
  
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  console.log("Registering schema with account:", account.address);

  // Create clients
  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  const walletClient = createWalletClient({
    account,
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  // Get SchemaRegistry contract address
  const schemaRegistryAddress = deployments["31337"].SchemaRegistry.address as `0x${string}`;
  console.log("SchemaRegistry address:", schemaRegistryAddress);

  // Define the schema
  const schema = "string type, string metadata, string visibility";
  const resolver = "0x0000000000000000000000000000000000000000" as `0x${string}`; // Zero address
  const revocable = true;

  console.log("\nSchema details:");
  console.log("- Schema:", schema);
  console.log("- Resolver:", resolver);
  console.log("- Revocable:", revocable);

  // Calculate expected schema UID
  const schemaUID = keccak256(
    encodeAbiParameters(
      [
        { type: "string", name: "schema" },
        { type: "address", name: "resolver" },
        { type: "bool", name: "revocable" },
      ],
      [schema, resolver, revocable]
    )
  );

  console.log("\nExpected Schema UID:", schemaUID);

  // Check if schema already exists
  try {
    const result = await publicClient.readContract({
      address: schemaRegistryAddress,
      abi: schemaRegistryAbi,
      functionName: "getSchema",
      args: [schemaUID],
    });

    const [uid, resolverAddr, isRevocable, schemaStr] = result as [string, string, boolean, string];

    if (uid !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
      console.log("\n✅ Schema already registered!");
      console.log("Schema UID:", uid);
      console.log("Schema:", schemaStr);
      console.log("Resolver:", resolverAddr);
      console.log("Revocable:", isRevocable);
      return;
    }
  } catch (error) {
    console.log("Schema not found, proceeding with registration...");
  }

  // Register the schema
  console.log("\n📝 Registering schema...");
  
  const hash = await walletClient.writeContract({
    address: schemaRegistryAddress,
    abi: schemaRegistryAbi,
    functionName: "register",
    args: [schema, resolver, revocable],
  });

  console.log("Transaction hash:", hash);

  // Wait for transaction confirmation
  console.log("Waiting for confirmation...");
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("✅ Schema registered successfully!");
  console.log("Block number:", receipt.blockNumber);
  console.log("Gas used:", receipt.gasUsed);

  // Verify registration
  console.log("\n📋 Verifying registration...");
  const verifyResult = await publicClient.readContract({
    address: schemaRegistryAddress,
    abi: schemaRegistryAbi,
    functionName: "getSchema",
    args: [schemaUID],
  });

  const [regUid, regResolver, regRevocable, regSchema] = verifyResult as [string, string, boolean, string];

  console.log("\n✅ Registered Schema Details:");
  console.log("Schema UID:", regUid);
  console.log("Schema:", regSchema);
  console.log("Resolver:", regResolver);
  console.log("Revocable:", regRevocable);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

