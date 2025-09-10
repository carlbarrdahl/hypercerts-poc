import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { getAddress, parseEventLogs } from "viem";

describe("HyperVaultFactory - create()", async function () {
  const { viem } = await network.connect();

  it("creates a HyperVault, emits Created, and sets correct config", async function () {
    const wallets = await viem.getWalletClients();
    const [deployer, alice] = wallets;

    const token = await viem.deployContract("TestToken");
    const deployerContract = await viem.deployContract("HyperVaultFactory");

    // Create a root vault (no parent)
    const rootConfig = {
      asset: token.address,
      parent: "0x0000000000000000000000000000000000000000",
      percent: 0n,
      metadata: "root",
    } as const;

    const rootHash = await deployerContract.write.create([rootConfig], {
      account: deployer.account,
    });
    const publicClient = await viem.getPublicClient();
    const rootReceipt = await publicClient.waitForTransactionReceipt({
      hash: rootHash,
    });

    const createdEventAbi = [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "id",
            type: "address",
          },
          {
            indexed: false,
            internalType: "struct Config",
            name: "config",
            type: "tuple",
            components: [
              {
                internalType: "contract IERC20",
                name: "asset",
                type: "address",
              },
              {
                internalType: "contract HyperVault",
                name: "parent",
                type: "address",
              },
              { internalType: "uint256", name: "percent", type: "uint256" },
              { internalType: "string", name: "metadata", type: "string" },
            ],
          },
        ],
        name: "Created",
        type: "event",
      },
    ] as const;

    const rootEvents = parseEventLogs({
      abi: createdEventAbi,
      logs: rootReceipt.logs,
    });
    assert.equal(rootEvents.length > 0, true);
    const rootAddress = (rootEvents[0]!.args as any).id as `0x${string}`;

    const rootVault = await viem.getContractAt("HyperVault", rootAddress);
    const rootConfigOnChain = await rootVault.read.config();
    assert.equal(rootConfigOnChain[0], getAddress(token.address)); // asset
    assert.equal(
      rootConfigOnChain[1],
      "0x0000000000000000000000000000000000000000"
    ); // parent
    assert.equal(rootConfigOnChain[2], 0n); // percent
    assert.equal(rootConfigOnChain[3], "root"); // metadata

    // Create a child vault with the root as parent
    const childConfig = {
      asset: token.address,
      parent: rootAddress,
      percent: 1000n, // 10%
      metadata: "child",
    } as const;

    const childHash = await deployerContract.write.create([childConfig], {
      account: alice.account,
    });
    const childReceipt = await publicClient.waitForTransactionReceipt({
      hash: childHash,
    });
    const childEvents = parseEventLogs({
      abi: createdEventAbi,
      logs: childReceipt.logs,
    });
    assert.equal(childEvents.length > 0, true);
    const childAddress = (childEvents[0]!.args as any).id as `0x${string}`;

    const childVault = await viem.getContractAt("HyperVault", childAddress);
    const childConfigOnChain = await childVault.read.config();
    assert.equal(childConfigOnChain[0], getAddress(token.address)); // asset
    assert.equal(childConfigOnChain[1], getAddress(rootAddress)); // parent
    assert.equal(childConfigOnChain[2], 1000n); // percent
    assert.equal(childConfigOnChain[3], "child"); // metadata

    // Parent should recognize child registration
    const registered = await rootVault.read.isChildVault([childAddress]);
    assert.equal(registered, true);
  });
});
