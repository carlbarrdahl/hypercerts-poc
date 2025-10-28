import hre from "hardhat";
import deployments from "../deployments.json";

/**
 * Register a schema in the EAS SchemaRegistry
 *
 * This script registers the hypercerts attestation schema:
 * - type: string (e.g., "region", "builder", etc.)
 * - metadata: string (IPFS CID or JSON string)
 * - visibility: string ("private", "organization", "draft", "published")
 */
async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Registering schema with account:", signer.address);

  // Get SchemaRegistry contract
  const schemaRegistryAddress = deployments["31337"].SchemaRegistry.address;
  const SchemaRegistry = await hre.ethers.getContractAt(
    "SchemaRegistry",
    schemaRegistryAddress
  );

  // Define the schema
  const schema = "string type, string metadata, string visibility";
  const resolver = hre.ethers.ZeroAddress; // No resolver
  const revocable = true; // Allow revocations

  console.log("\nSchema details:");
  console.log("- Schema:", schema);
  console.log("- Resolver:", resolver);
  console.log("- Revocable:", revocable);

  // Check if schema already exists
  const schemaUID = hre.ethers.keccak256(
    hre.ethers.AbiCoder.defaultAbiCoder().encode(
      ["string", "address", "bool"],
      [schema, resolver, revocable]
    )
  );

  console.log("\nExpected Schema UID:", schemaUID);

  const existingSchema = await SchemaRegistry.getSchema(schemaUID);
  if (existingSchema.uid !== hre.ethers.ZeroHash) {
    console.log("\n✅ Schema already registered!");
    console.log("Schema UID:", existingSchema.uid);
    return;
  }

  // Register the schema
  console.log("\n📝 Registering schema...");
  const tx = await SchemaRegistry.register(schema, resolver, revocable);
  console.log("Transaction hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("✅ Schema registered successfully!");

  // Get the registered schema UID from the event
  const registeredEvent = receipt?.lognpx hardhat run scripts/register-schema.ts --network localhosts.find((log: any) => {
    try {
      const parsed = SchemaRegistry.interface.parseLog(log);
      return parsed?.name === "Registered";
    } catch {
      return false;
    }
  });

  if (registeredEvent) {
    const parsed = SchemaRegistry.interface.parseLog(registeredEvent);
    console.log("\n📋 Registered Schema Details:");
    console.log("Schema UID:", parsed?.args.uid);
    console.log("Registerer:", parsed?.args.registerer);
  }

  // Verify registration
  const registeredSchema = await SchemaRegistry.getSchema(schemaUID);
  console.log("\n✅ Verification:");
  console.log("Schema UID:", registeredSchema.uid);
  console.log("Schema:", registeredSchema.schema);
  console.log("Resolver:", registeredSchema.resolver);
  console.log("Revocable:", registeredSchema.revocable);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
