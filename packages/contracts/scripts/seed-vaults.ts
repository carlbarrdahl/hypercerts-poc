import { createWalletClient, createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { zeroAddress } from "viem";
// @ts-ignore - Workspace package, resolved at runtime
import { HypercertsSDK } from "../../sdk/src/index.js";
import { oneEarthFramework, oneEarthBioregions } from "../../oneearth";

/**
 * Seed vaults for all pillars, subPillars, pathways from the One Earth Solutions Framework,
 * and bioregions from the One Earth Bioregions dataset.
 *
 * This script creates vaults using the SDK, which handles IPFS metadata uploads automatically.
 * - Solutions (pillars, subPillars, pathways) are created with type: "solution"
 * - Bioregions are created with type: "region"
 *
 * Usage:
 *   bun run scripts/seed-vaults.ts
 *   or
 *   npx tsx scripts/seed-vaults.ts
 */

async function main() {
  // Get private key from environment or use hardhat default
  const privateKey =
    process.env.PRIVATE_KEY ||
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat account #0

  const account = privateKeyToAccount(privateKey as `0x${string}`);
  console.log("Seeding vaults with account:", account.address);

  // Create wallet client
  const walletClient = createWalletClient({
    account,
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  // Initialize SDK
  const sdk = new HypercertsSDK(walletClient);

  if (!sdk.test?.token) {
    throw new Error(
      "TestToken address not found in SDK. Make sure contracts are deployed first."
    );
  }

  const tokenAddress = sdk.test.token;
  console.log("Using token address:", tokenAddress);

  // Track created vaults
  const pillarVaults: Record<string, string> = {};
  const subPillarVaults: Record<string, string> = {};
  const pathwayVaults: Record<string, string> = {};
  const bioregionVaults: Record<string, string> = {};

  console.log("\n🌱 Starting vault seeding...\n");

  // Create pillar vaults (root level, no parent)
  for (const pillar of oneEarthFramework.pillars) {
    console.log(`Creating pillar vault: ${pillar.name} (${pillar.id})`);

    try {
      const vaultAddress = await sdk.vault.create({
        owner: account.address,
        parent: zeroAddress,
        asset: tokenAddress,
        percent: 0n, // No upstream for root level
        shares: 0n,
        metadata: {
          title: pillar.name,
          description: pillar.description,
          type: "solution",
        },
      });

      pillarVaults[pillar.id] = vaultAddress;
      console.log(`  ✅ Created: ${vaultAddress}\n`);

      // Create subPillar vaults (parent = pillar)
      for (const subPillar of pillar.subPillars) {
        console.log(
          `  Creating subPillar vault: ${subPillar.name} (${subPillar.id})`
        );

        try {
          const subPillarVaultAddress = await sdk.vault.create({
            owner: account.address,
            parent: vaultAddress,
            asset: tokenAddress,
            percent: 1000n, // 10%
            shares: 0n,
            metadata: {
              title: subPillar.name,
              description: subPillar.description,
              type: "solution",
            },
          });

          const subPillarKey = `${pillar.id}-${subPillar.id}`;
          subPillarVaults[subPillarKey] = subPillarVaultAddress;
          console.log(`    ✅ Created: ${subPillarVaultAddress}`);

          // Create pathway vaults (parent = subPillar)
          for (const pathway of subPillar.pathways) {
            console.log(
              `      Creating pathway vault: ${pathway.name} (${pathway.id})`
            );

            try {
              const pathwayVaultAddress = await sdk.vault.create({
                owner: account.address,
                parent: subPillarVaultAddress,
                asset: tokenAddress,
                percent: 1000n, // 10%
                shares: 0n,
                metadata: {
                  title: pathway.name,
                  description: pathway.summary || pathway.description || "",
                  image: pathway.image,
                  type: "solution",
                },
              });

              console.log(pathway.image);

              const pathwayKey = `${pillar.id}-${subPillar.id}-${pathway.id}`;
              pathwayVaults[pathwayKey] = pathwayVaultAddress;
              console.log(`        ✅ Created: ${pathwayVaultAddress}`);
            } catch (error) {
              console.error(
                `        ❌ Failed to create pathway vault ${pathway.id}:`,
                error
              );
            }
          }
          console.log("");
        } catch (error) {
          console.error(
            `    ❌ Failed to create subPillar vault ${subPillar.id}:`,
            error
          );
        }
      }
    } catch (error) {
      console.error(`  ❌ Failed to create pillar vault ${pillar.id}:`, error);
    }
  }

  // Create bioregion vaults (root level, no parent, type = "region")
  console.log("\n🌍 Starting bioregion vault seeding...\n");
  for (const bioregion of oneEarthBioregions.bioregions) {
    if (!bioregion._enabled) {
      console.log(
        `  Skipping disabled bioregion: ${bioregion.name} (${bioregion.id})`
      );
      continue;
    }

    console.log(
      `Creating bioregion vault: ${bioregion.name} (${bioregion.id})`
    );

    try {
      const vaultAddress = await sdk.vault.create({
        owner: account.address,
        parent: zeroAddress,
        asset: tokenAddress,
        percent: 0n, // No upstream for root level
        shares: 0n,
        metadata: {
          title: bioregion.name,
          description: bioregion.description || "",
          image: bioregion.image,
          type: "region",
        },
      });

      bioregionVaults[bioregion.id] = vaultAddress;
      console.log(`  ✅ Created: ${vaultAddress}`);
    } catch (error) {
      console.error(
        `  ❌ Failed to create bioregion vault ${bioregion.id}:`,
        error
      );
    }
  }

  // Summary
  console.log("\n📊 Seeding Summary:");
  console.log(`  Pillars: ${Object.keys(pillarVaults).length}`);
  console.log(`  SubPillars: ${Object.keys(subPillarVaults).length}`);
  console.log(`  Pathways: ${Object.keys(pathwayVaults).length}`);
  console.log(`  Bioregions: ${Object.keys(bioregionVaults).length}`);
  console.log(
    `  Total vaults: ${Object.keys(pillarVaults).length + Object.keys(subPillarVaults).length + Object.keys(pathwayVaults).length + Object.keys(bioregionVaults).length}`
  );

  // Optionally save vault addresses to a file
  const vaultMap = {
    pillars: pillarVaults,
    subPillars: subPillarVaults,
    pathways: pathwayVaults,
    bioregions: bioregionVaults,
  };

  console.log("\n✅ Vault seeding completed!");
  console.log("\nVault addresses:");
  console.log(JSON.stringify(vaultMap, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
