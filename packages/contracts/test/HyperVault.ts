import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseEventLogs } from "viem";

import { network } from "hardhat";

describe("HyperVault", async function () {
  const { viem } = await network.connect();
  const deployments = JSON.parse(
    readFileSync(
      resolve(process.cwd(), "../../apps/hypercerts/contracts/deployments.json"),
      "utf8",
    ),
  );
  const createdEventAbi = deployments["31337"]["HyperVaultFactory"].abi.filter(
    (x: any) => x.type === "event" && x.name === "Created",
  );

  it("deposit pushes upstream to parent and mints shares on child", async function () {
    const wallets = await viem.getWalletClients();
    const [deployer, alice] = wallets;

    const token = await viem.deployContract("TestToken");

    const deployerContract = await viem.deployContract("HyperVaultFactory");

    const rootConfig = {
      asset: token.address,
      parent: "0x0000000000000000000000000000000000000000",
      percent: 0n,
      metadata: "",
    } as const;
    const rootTx = await deployerContract.write.create([rootConfig], { account: deployer.account });
    const publicClient = await viem.getPublicClient();
    const rootReceipt = await publicClient.waitForTransactionReceipt({ hash: rootTx });

    const rootEvents = parseEventLogs({ abi: createdEventAbi, logs: rootReceipt.logs });
    const parentAddress = (rootEvents[0]!.args as any).id as `0x${string}`;
    const parent = await viem.getContractAt("HyperVault", parentAddress);

    const childConfig = {
      asset: token.address,
      parent: parent.address,
      percent: 1000n,
      metadata: "",
    } as const;
    const childTx = await deployerContract.write.create([childConfig], { account: deployer.account });
    const childReceipt = await publicClient.waitForTransactionReceipt({ hash: childTx });
    const childEvents = parseEventLogs({ abi: createdEventAbi, logs: childReceipt.logs });
    const childAddress = (childEvents[0]!.args as any).id as `0x${string}`;
    const child = await viem.getContractAt("HyperVault", childAddress);

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
    const deployerContract = await viem.deployContract("HyperVaultFactory");
    const publicClient = await viem.getPublicClient();

    const rootConfig = {
      asset: token.address,
      parent: "0x0000000000000000000000000000000000000000",
      percent: 0n,
      metadata: "",
    } as const;
    const rootTx = await deployerContract.write.create([rootConfig], { account: deployer.account });
    const rootReceipt = await publicClient.waitForTransactionReceipt({ hash: rootTx });
    const rootEvents = parseEventLogs({ abi: createdEventAbi, logs: rootReceipt.logs });
    const parentAddress = (rootEvents[0]!.args as any).id as `0x${string}`;
    const parent = await viem.getContractAt("HyperVault", parentAddress);

    const childConfig = {
      asset: token.address,
      parent: parent.address,
      percent: 1000n,
      metadata: "",
    } as const;
    const childTx = await deployerContract.write.create([childConfig], { account: deployer.account });
    const childReceipt = await publicClient.waitForTransactionReceipt({ hash: childTx });
    const childEvents = parseEventLogs({ abi: createdEventAbi, logs: childReceipt.logs });
    const childAddress = (childEvents[0]!.args as any).id as `0x${string}`;
    const child = await viem.getContractAt("HyperVault", childAddress);

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
    const deployerContract = await viem.deployContract("HyperVaultFactory");
    const publicClient = await viem.getPublicClient();
    const rootConfig = {
      asset: token.address,
      parent: "0x0000000000000000000000000000000000000000",
      percent: 0n,
      metadata: "",
    } as const;
    const rootTx = await deployerContract.write.create([rootConfig], { account: deployer.account });
    const rootReceipt = await publicClient.waitForTransactionReceipt({ hash: rootTx });
    const rootEvents = parseEventLogs({ abi: createdEventAbi, logs: rootReceipt.logs });
    const rootAddress = (rootEvents[0]!.args as any).id as `0x${string}`;
    const root = await viem.getContractAt("HyperVault", rootAddress);

    const middleConfig = {
      asset: token.address,
      parent: root.address,
      percent: 1000n,
      metadata: "",
    } as const;
    const middleTx = await deployerContract.write.create([middleConfig], { account: deployer.account });
    const middleReceipt = await publicClient.waitForTransactionReceipt({ hash: middleTx });
    const middleEvents = parseEventLogs({ abi: createdEventAbi, logs: middleReceipt.logs });
    const middleAddress = (middleEvents[0]!.args as any).id as `0x${string}`;
    const middle = await viem.getContractAt("HyperVault", middleAddress);

    const leafConfig = {
      asset: token.address,
      parent: middle.address,
      percent: 1000n,
      metadata: "",
    } as const;
    const leafTx = await deployerContract.write.create([leafConfig], { account: deployer.account });
    const leafReceipt = await publicClient.waitForTransactionReceipt({ hash: leafTx });
    const leafEvents = parseEventLogs({ abi: createdEventAbi, logs: leafReceipt.logs });
    const leafAddress = (leafEvents[0]!.args as any).id as `0x${string}`;
    const leaf = await viem.getContractAt("HyperVault", leafAddress);

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
