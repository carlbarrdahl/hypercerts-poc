import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("HyperVaultModule", (m) => {
  const token = m.contract("TestToken");

  const hyperVault = m.contract("HyperVault", [
    {
      asset: token,
      parent: "0x0000000000000000000000000000000000000000",
      percent: 0n,
      metadata: "",
    },
  ]);

  const hyperVaultDeployer = m.contract("HyperVaultDeployer");

  return { token, hyperVault, hyperVaultDeployer };
});
