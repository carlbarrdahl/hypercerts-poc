import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AllContractsModule", (m) => {
  // Deploy EAS contracts
  const schemaRegistry = m.contract("SchemaRegistry");
  const eas = m.contract("EAS", [schemaRegistry]);

  // Deploy HyperVault contracts
  const token = m.contract("TestToken");
  const hyperVault = m.contract("HyperVault");
  const hyperVaultFactory = m.contract("HyperVaultFactory");

  return {
    schemaRegistry,
    eas,
    token,
    hyperVault,
    hyperVaultFactory,
  };
});
