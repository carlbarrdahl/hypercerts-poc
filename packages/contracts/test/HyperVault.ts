import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("HyperVault", async function () {
  const { viem } = await network.connect();

  it("deposit pushes upstream to parent and mints shares on child", async function () {
    const wallets = await viem.getWalletClients();
    const [deployer, alice] = wallets;

    const token = await viem.deployContract("TestToken");

    const parent = await viem.deployContract("HyperVault", [
      {
        asset: token.address,
        parent: "0x0000000000000000000000000000000000000000",
        percent: 0n,
        metadata: "",
      },
    ]);

    const child = await viem.deployContract("HyperVault", [
      {
        asset: token.address,
        parent: parent.address,
        percent: 1000n, // 10%
        metadata: "",
      },
    ]);

    const amount = 100n * 10n ** 18n;

    await token.write.mint([alice.account.address, amount], { account: deployer.account });
    await token.write.approve([child.address, amount], { account: alice.account });

    await child.write.deposit([amount, alice.account.address], { account: alice.account });

    const childAssets = await child.read.totalAssets();
    const parentAssets = await parent.read.totalAssets();
    const childShares = await child.read.balanceOf([alice.account.address]);
    const upstreamSent = await child.read.totalUpstreamSent();
    const registered = await parent.read.isChildVault([child.address]);

    assert.equal(childAssets, 90n * 10n ** 18n);
    assert.equal(parentAssets, 10n * 10n ** 18n);
    assert.equal(childShares, 90n * 10n ** 18n);
    assert.equal(upstreamSent, 10n * 10n ** 18n);
    assert.equal(registered, true);
  });

  it("fund without upstream keeps full amount in local vault", async function () {
    const wallets = await viem.getWalletClients();
    const [deployer, alice] = wallets;

    const token = await viem.deployContract("TestToken");
    const parent = await viem.deployContract("HyperVault", [
      {
        asset: token.address,
        parent: "0x0000000000000000000000000000000000000000",
        percent: 0n,
        metadata: "",
      },
    ]);
    const child = await viem.deployContract("HyperVault", [
      {
        asset: token.address,
        parent: parent.address,
        percent: 1000n, // 10%
        metadata: "",
      },
    ]);

    const amount = 100n * 10n ** 18n;
    await token.write.mint([alice.account.address, amount], { account: deployer.account });
    await token.write.approve([child.address, amount], { account: alice.account });

    await child.write.fund([amount, false], { account: alice.account });

    const childAssets = await child.read.totalAssets();
    const parentAssets = await parent.read.totalAssets();

    assert.equal(childAssets, amount);
    assert.equal(parentAssets, 0n);
  });

  it("fund with upstream and multi-level propagation distributes value correctly", async function () {
    const wallets = await viem.getWalletClients();
    const [deployer, alice] = wallets;

    const token = await viem.deployContract("TestToken");

    const root = await viem.deployContract("HyperVault", [
      {
        asset: token.address,
        parent: "0x0000000000000000000000000000000000000000",
        percent: 0n,
        metadata: "",
      },
    ]);

    const middle = await viem.deployContract("HyperVault", [
      {
        asset: token.address,
        parent: root.address,
        percent: 1000n, // 10%
        metadata: "",
      },
    ]);

    const leaf = await viem.deployContract("HyperVault", [
      {
        asset: token.address,
        parent: middle.address,
        percent: 1000n, // 10%
        metadata: "",
      },
    ]);

    const amount = 100n * 10n ** 18n;
    await token.write.mint([alice.account.address, amount], { account: deployer.account });
    await token.write.approve([leaf.address, amount], { account: alice.account });

    await leaf.write.deposit([amount, alice.account.address], { account: alice.account });

    const leafAssets = await leaf.read.totalAssets();
    const middleAssets = await middle.read.totalAssets();
    const rootAssets = await root.read.totalAssets();
    const levels = await Promise.all([
      root.read.getTreeLevel(),
      middle.read.getTreeLevel(),
      leaf.read.getTreeLevel(),
    ]);

    assert.equal(leafAssets, 90n * 10n ** 18n);
    assert.equal(middleAssets, 9n * 10n ** 18n);
    assert.equal(rootAssets, 1n * 10n ** 18n);
    assert.equal(levels[0], 0n);
    assert.equal(levels[1], 1n);
    assert.equal(levels[2], 2n);
  });
});
