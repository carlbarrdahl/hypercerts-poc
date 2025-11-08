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
      resolve(
        process.cwd(),
        "../../apps/hypercerts/contracts/deployments.json"
      ),
      "utf8"
    )
  );
  const createdEventAbi = deployments["31337"]["HyperVaultFactory"].abi.filter(
    (x: any) => x.type === "event" && x.name === "Created"
  );

  it("fund pushes upstream to parent based on percent", async function () {
    const wallets = await viem.getWalletClients();
    const [deployer, alice] = wallets;

    const token = await viem.deployContract("TestToken");

    const deployerContract = await viem.deployContract("HyperVaultFactory");

    const rootConfig = {
      asset: token.address,
      parent: "0x0000000000000000000000000000000000000000",
      owner: deployer.account.address,
      percent: 0n,
      shares: 0n,
      metadataURI: "ipfs://root",
    } as const;
    const rootTx = await deployerContract.write.create([rootConfig], {
      account: deployer.account,
    });
    const publicClient = await viem.getPublicClient();
    const rootReceipt = await publicClient.waitForTransactionReceipt({
      hash: rootTx,
    });

    const rootEvents = parseEventLogs({
      abi: createdEventAbi,
      logs: rootReceipt.logs,
    });
    const parentAddress = (rootEvents[0]!.args as any).id as `0x${string}`;
    const parent = await viem.getContractAt("HyperVault", parentAddress);

    const childConfig = {
      asset: token.address,
      parent: parent.address,
      owner: deployer.account.address,
      percent: 1000n, // 10%
      shares: 0n,
      metadataURI: "ipfs://child",
    } as const;
    const childTx = await deployerContract.write.create([childConfig], {
      account: deployer.account,
    });
    const childReceipt = await publicClient.waitForTransactionReceipt({
      hash: childTx,
    });
    const childEvents = parseEventLogs({
      abi: createdEventAbi,
      logs: childReceipt.logs,
    });
    const childAddress = (childEvents[0]!.args as any).id as `0x${string}`;
    const child = await viem.getContractAt("HyperVault", childAddress);

    const amount = 100n * 10n ** 18n;

    await token.write.mint([alice.account.address, amount], {
      account: deployer.account,
    });
    await token.write.approve([child.address, amount], {
      account: alice.account,
    });

    await child.write.fund([amount, alice.account.address], {
      account: alice.account,
    });

    const childAssets = await child.read.totalAssets();
    const parentAssets = await parent.read.totalAssets();
    const upstreamSent = await child.read.totalUpstreamSent();
    const registered = await parent.read.isChildVault([child.address]);

    assert.equal(childAssets, 90n * 10n ** 18n);
    assert.equal(parentAssets, 10n * 10n ** 18n);
    assert.equal(upstreamSent, 10n * 10n ** 18n);
    assert.equal(registered, true);
  });

  it("root vault with no parent keeps full amount", async function () {
    const wallets = await viem.getWalletClients();
    const [deployer, alice] = wallets;

    const token = await viem.deployContract("TestToken");
    const deployerContract = await viem.deployContract("HyperVaultFactory");
    const publicClient = await viem.getPublicClient();

    const rootConfig = {
      asset: token.address,
      parent: "0x0000000000000000000000000000000000000000",
      owner: deployer.account.address,
      percent: 0n,
      shares: 0n,
      metadataURI: "ipfs://root",
    } as const;
    const rootTx = await deployerContract.write.create([rootConfig], {
      account: deployer.account,
    });
    const rootReceipt = await publicClient.waitForTransactionReceipt({
      hash: rootTx,
    });
    const rootEvents = parseEventLogs({
      abi: createdEventAbi,
      logs: rootReceipt.logs,
    });
    const rootAddress = (rootEvents[0]!.args as any).id as `0x${string}`;
    const root = await viem.getContractAt("HyperVault", rootAddress);

    const amount = 100n * 10n ** 18n;
    await token.write.mint([alice.account.address, amount], {
      account: deployer.account,
    });
    await token.write.approve([root.address, amount], {
      account: alice.account,
    });

    await root.write.fund([amount, alice.account.address], {
      account: alice.account,
    });

    const rootAssets = await root.read.totalAssets();
    const level = await root.read.getTreeLevel();

    assert.equal(rootAssets, amount);
    assert.equal(level, 0n);
  });

  it("multi-level hierarchy (pillar => sub-pillar => pathway) distributes value correctly", async function () {
    const wallets = await viem.getWalletClients();
    const [deployer, alice] = wallets;

    const token = await viem.deployContract("TestToken");
    const deployerContract = await viem.deployContract("HyperVaultFactory");
    const publicClient = await viem.getPublicClient();

    // Create pillar (root level)
    const pillarConfig = {
      asset: token.address,
      parent: "0x0000000000000000000000000000000000000000",
      owner: deployer.account.address,
      percent: 0n,
      shares: 0n,
      metadataURI: "ipfs://pillar",
    } as const;
    const pillarTx = await deployerContract.write.create([pillarConfig], {
      account: deployer.account,
    });
    const pillarReceipt = await publicClient.waitForTransactionReceipt({
      hash: pillarTx,
    });
    const pillarEvents = parseEventLogs({
      abi: createdEventAbi,
      logs: pillarReceipt.logs,
    });
    const pillarAddress = (pillarEvents[0]!.args as any).id as `0x${string}`;
    const pillar = await viem.getContractAt("HyperVault", pillarAddress);

    // Create sub-pillar
    const subPillarConfig = {
      asset: token.address,
      parent: pillar.address,
      owner: deployer.account.address,
      percent: 1000n, // 10% to parent
      shares: 0n,
      metadataURI: "ipfs://sub-pillar",
    } as const;
    const subPillarTx = await deployerContract.write.create([subPillarConfig], {
      account: deployer.account,
    });
    const subPillarReceipt = await publicClient.waitForTransactionReceipt({
      hash: subPillarTx,
    });
    const subPillarEvents = parseEventLogs({
      abi: createdEventAbi,
      logs: subPillarReceipt.logs,
    });
    const subPillarAddress = (subPillarEvents[0]!.args as any)
      .id as `0x${string}`;
    const subPillar = await viem.getContractAt("HyperVault", subPillarAddress);

    // Create pathway
    const pathwayConfig = {
      asset: token.address,
      parent: subPillar.address,
      owner: deployer.account.address,
      percent: 1000n, // 10% to parent
      shares: 0n,
      metadataURI: "ipfs://pathway",
    } as const;
    const pathwayTx = await deployerContract.write.create([pathwayConfig], {
      account: deployer.account,
    });
    const pathwayReceipt = await publicClient.waitForTransactionReceipt({
      hash: pathwayTx,
    });
    const pathwayEvents = parseEventLogs({
      abi: createdEventAbi,
      logs: pathwayReceipt.logs,
    });
    const pathwayAddress = (pathwayEvents[0]!.args as any).id as `0x${string}`;
    const pathway = await viem.getContractAt("HyperVault", pathwayAddress);

    const amount = 100n * 10n ** 18n;
    await token.write.mint([alice.account.address, amount], {
      account: deployer.account,
    });
    await token.write.approve([pathway.address, amount], {
      account: alice.account,
    });

    await pathway.write.fund([amount, alice.account.address], {
      account: alice.account,
    });

    const pathwayAssets = await pathway.read.totalAssets();
    const subPillarAssets = await subPillar.read.totalAssets();
    const pillarAssets = await pillar.read.totalAssets();

    const levels = await Promise.all([
      pillar.read.getTreeLevel(),
      subPillar.read.getTreeLevel(),
      pathway.read.getTreeLevel(),
    ]);

    const children = await Promise.all([
      pillar.read.getChildVaults(),
      subPillar.read.getChildVaults(),
    ]);

    // Pathway keeps 90%, sends 10% to sub-pillar
    assert.equal(pathwayAssets, 90n * 10n ** 18n);
    // Sub-pillar receives 10 and keeps 9, sends 1 to pillar
    assert.equal(subPillarAssets, 9n * 10n ** 18n);
    // Pillar receives 1
    assert.equal(pillarAssets, 1n * 10n ** 18n);

    // Verify tree levels
    assert.equal(levels[0], 0n); // Pillar is root
    assert.equal(levels[1], 1n); // Sub-pillar is level 1
    assert.equal(levels[2], 2n); // Pathway is level 2

    // Verify parent-child relationships
    assert.equal(children[0].length, 1); // Pillar has 1 child (sub-pillar)
    assert.equal(children[1].length, 1); // Sub-pillar has 1 child (pathway)
  });
});
