import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("HyperVaultModule", (m) => {
  // First deploy the SchemaRegistry
  const schemaRegistry = m.contract("SchemaRegistry");

  // Then deploy EAS with the SchemaRegistry address
  const eas = m.contract("EAS", [schemaRegistry]);

  return { schemaRegistry, eas };
});
