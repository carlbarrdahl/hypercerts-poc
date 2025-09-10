import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("HyperVaultModule", (m) => {
  const token = m.contract("TestToken");

  const args = [
    {
      asset: token,
      parent: "0x0000000000000000000000000000000000000000",
      percent: 0n,
      metadata: "",
    },
  ]
  const hyperVault = m.contract("HyperVault");

  const HyperVaultFactory = m.contract("HyperVaultFactory");

  return { token, hyperVault, HyperVaultFactory };
});
