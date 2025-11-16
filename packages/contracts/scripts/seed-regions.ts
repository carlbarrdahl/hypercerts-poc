import {
  createWalletClient,
  createPublicClient,
  http,
  parseAbi,
  getContract,
} from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { zeroAddress } from "viem";
// @ts-ignore - Workspace package, resolved at runtime
import { HypercertsSDK } from "../../sdk/src/index.js";

/**
 * Seed 5 bioregion vaults with funders and contributors
 *
 * This script creates:
 * - 5 bioregion vaults based on One Earth Framework bioregions
 * - 5 funders per region (larger contributions)
 * - 10-15 contributors per region (smaller contributions)
 *
 * Usage:
 *   bun run scripts/seed-regions.ts
 *   or
 *   npx tsx scripts/seed-regions.ts
 */

// Bioregion templates from One Earth Framework
const bioregionTemplates = [
  {
    id: "a4a890b5-d832-4b4a-8e69-b12038f6ec03",
    regionId: "NT20",
    slug: "northern-amazonian-forests-nt20",
    name: "Northern Amazonian Forests (NT20)",
    description:
      "The Northern Amazonian Forests bioregion represents one of the most biodiverse areas on Earth. Home to the iconic Capybara and countless other species, this region contains the Japurá-Solimões-Negro Moist Forests. Supporting conservation and sustainable development in this critical ecosystem helps protect the lungs of our planet.",
    iconicSpecies: "Capybara",
    image:
      "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8f6d4192-e749-4db0-bb23-7825544d4c51/473--Japurá-Solimões-Negro-Moist-Forests-Capybara.jpeg?auto=compress%2Cformat&w=800",
    geoJSON: "https://www.oneearth.org/geoData/bioregions/NT20.kml",
  },
  {
    id: "932ec2be-c238-4d62-ae5b-5a9a117c252a",
    regionId: "PA3",
    slug: "scandinavian-birch-coastal-conifer-forests-pa3",
    name: "Scandinavian Birch & Coastal Conifer Forests (PA3)",
    description:
      "The Scandinavian Birch & Coastal Conifer Forests span the northern reaches of Europe, encompassing pristine mountain birch forests and coastal conifer ecosystems. Home to the Norway lemming and featuring unique montane grasslands, this bioregion plays a crucial role in carbon sequestration and biodiversity conservation in the Arctic region.",
    iconicSpecies: "Norway lemming",
    image:
      "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0777a34d-7cdc-4654-bbca-2307d80f3eb9/780--Scandinavian-Montane-Birch-Forest-and-Grasslands--Norway-lemming.jpeg?auto=compress%2Cformat&w=800",
    geoJSON: "https://www.oneearth.org/geoData/bioregions/PA3.kml",
  },
  {
    id: "79347e9f-5492-4a10-96b2-1e63b4937ded",
    regionId: "AT6",
    slug: "madagascar-island-at6",
    name: "Madagascar Island (AT6)",
    description:
      "Madagascar Island is a biodiversity hotspot like no other, with over 90% of its wildlife found nowhere else on Earth. Home to the iconic Fossa and featuring unique dry deciduous forests and tropical ecosystems, this island bioregion is critically important for global biodiversity. Conservation efforts here protect lemurs, chameleons, and countless endemic species.",
    iconicSpecies: "Fossa",
    image:
      "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/1f0aada3-1687-4c14-a632-9d0c4d1325b4/32-Madagascar-Dry-Deciduous-Forests-Fossa-.jpeg?auto=compress%2Cformat&w=800",
    geoJSON: "https://www.oneearth.org/geoData/bioregions/AT6.kml",
  },
  {
    id: "f4fe2f56-4d80-4cef-ba98-f2ba5d101ae5",
    regionId: "AT15",
    slug: "north-congolian-lowland-forests-at15",
    name: "North Congolian Lowland Forests (AT15)",
    description:
      "The North Congolian Lowland Forests represent the second-largest tropical rainforest on Earth. Home to the critically endangered Western lowland gorilla, this bioregion is essential for carbon storage and contains incredible biodiversity. Supporting conservation here protects great apes, forest elephants, and vital ecosystem services for millions of people.",
    iconicSpecies: "Western lowland gorilla",
    image:
      "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4cd2e530-c071-4fc1-aa58-8702cb127143/26-Northwest-Congolian-Lowland-Forests-Western-Lowland-gorilla-.jpeg?auto=compress%2Cformat&w=800",
    geoJSON: "https://www.oneearth.org/geoData/bioregions/AT15.kml",
  },
  {
    id: "7fb46ba0-ce86-4c48-b7af-829feec77288",
    regionId: "AU10",
    slug: "coral-sea-new-caledonia-islands-au10",
    name: "Coral Sea & New Caledonia Islands (AU10)",
    description:
      "The Coral Sea & New Caledonia Islands bioregion encompasses one of the world's most pristine marine environments and unique island ecosystems. Home to the rare Kagu bird and featuring spectacular coral reefs and rainforests, this region is a global priority for marine and island biodiversity conservation. The area faces threats from climate change and requires urgent protection.",
    iconicSpecies: "Kagu",
    image:
      "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ee2fc857-34a7-4a2d-8a74-15ac72618734/572--Llanos-Arrau-turtle.jpeg?auto=compress%2Cformat&w=800",
    geoJSON: "https://www.oneearth.org/geoData/bioregions/AU10.kml",
  },
];

async function main() {
  // Use hardhat accounts for different roles
  const accounts = [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Account #0 - Region Creator
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", // Account #1 - Funder 1
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", // Account #2 - Funder 2
    "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6", // Account #3 - Funder 3
    "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a", // Account #4 - Funder 4
    "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba", // Account #5 - Funder 5
    "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e", // Account #6 - Contributor 1
    "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356", // Account #7 - Contributor 2
    "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97", // Account #8 - Contributor 3
    "0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6", // Account #9 - Contributor 4
    "0xf214f2b2cd398c806f84e317254e0f0b801d0643303237d97a22a48e01628897", // Account #10 - Contributor 5
    "0x701b615bbdfb9de65240bc28bd21bbc0d996645a3dd57e7b12bc2bdf6f192c82", // Account #11 - Contributor 6
    "0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1", // Account #12 - Contributor 7
    "0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd", // Account #13 - Contributor 8
    "0xc526ee95bf44d8fc405a158bb884d9d1238d99f0612e9f33d006bb0789009aaa", // Account #14 - Contributor 9
    "0x8166f546bab6da521a8369cab06c5d2b9e46670292d85c875ee9ec20e84ffb61", // Account #15 - Contributor 10
    "0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0", // Account #16 - Contributor 11
    "0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd", // Account #17 - Contributor 12
    "0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0", // Account #18 - Contributor 13
    "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e", // Account #19 - Contributor 14
  ];

  const regionCreator = privateKeyToAccount(accounts[0] as `0x${string}`);
  const funders = accounts
    .slice(1, 6)
    .map((key) => privateKeyToAccount(key as `0x${string}`));
  const contributors = accounts
    .slice(6, 20)
    .map((key) => privateKeyToAccount(key as `0x${string}`));

  console.log("🌍 Seeding bioregion vaults with accounts:");
  console.log("  Region Creator:", regionCreator.address);
  console.log(
    `  Funders (${funders.length}):`,
    funders.map((f) => f.address)
  );
  console.log(
    `  Contributors (${contributors.length}):`,
    contributors.map((c) => c.address)
  );

  // Create wallet clients
  const creatorWallet = createWalletClient({
    account: regionCreator,
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  const funderWallets = funders.map((funder) =>
    createWalletClient({
      account: funder,
      chain: hardhat,
      transport: http("http://localhost:8545"),
    })
  );

  const contributorWallets = contributors.map((contributor) =>
    createWalletClient({
      account: contributor,
      chain: hardhat,
      transport: http("http://localhost:8545"),
    })
  );

  // Initialize SDK
  const creatorSDK = new HypercertsSDK(creatorWallet);
  const funderSDKs = funderWallets.map((wallet) => new HypercertsSDK(wallet));
  const contributorSDKs = contributorWallets.map(
    (wallet) => new HypercertsSDK(wallet)
  );

  if (!creatorSDK.test?.token) {
    throw new Error(
      "TestToken address not found in SDK. Make sure contracts are deployed first."
    );
  }

  const tokenAddress = creatorSDK.test.token;
  console.log("Using token address:", tokenAddress);

  // Create public client for reading
  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  // TestToken ABI (minimal for our needs)
  const tokenAbi = parseAbi([
    "function mint(address to, uint256 amount) external",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
  ]);

  // Helper function to mint and approve tokens
  async function mintAndApprove(
    wallet: any,
    amount: bigint,
    vaultAddress: string
  ) {
    const tokenContract = getContract({
      address: tokenAddress,
      abi: tokenAbi,
      client: { public: publicClient, wallet },
    });

    // Mint tokens
    const mintTx = await tokenContract.write.mint([
      wallet.account.address,
      amount,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });

    // Approve vault to spend tokens
    const approveTx = await tokenContract.write.approve([
      vaultAddress as `0x${string}`,
      amount,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: approveTx });
  }

  console.log("\n🚀 Creating bioregion vaults...\n");

  let totalFunds = 0;
  let totalContributions = 0;

  for (let i = 0; i < bioregionTemplates.length; i++) {
    const region = bioregionTemplates[i];

    console.log(`\n${"=".repeat(80)}`);
    console.log(`🌿 REGION ${i + 1}/5: ${region.name}`);
    console.log(`${"=".repeat(80)}\n`);
    console.log(`  Iconic Species: ${region.iconicSpecies}`);
    console.log(`  Region ID: ${region.regionId}`);
    console.log(`  Slug: ${region.slug}\n`);

    // Create bioregion vault
    console.log(`Creating vault for: ${region.name}`);
    const vaultAddress = await creatorSDK.vault.create({
      owner: regionCreator.address,
      parent: zeroAddress,
      asset: tokenAddress,
      percent: 0n,
      shares: 0n,
      metadata: {
        title: region.name,
        description: region.description,
        image: region.image,
        geoJSON: region.geoJSON,
        type: "region",
        regionId: region.regionId,
        slug: region.slug,
        iconicSpecies: region.iconicSpecies,
      },
    });

    console.log(`  ✅ Vault created: ${vaultAddress}`);

    // Create funds (5 funders with larger amounts)
    console.log(`\n  🎁 Creating funds from ${funders.length} funders...`);

    // Varying fund amounts (20,000 - 100,000 tokens)
    const fundAmounts = [
      100000n * 10n ** 18n, // 100,000 tokens
      75000n * 10n ** 18n, // 75,000 tokens
      50000n * 10n ** 18n, // 50,000 tokens
      35000n * 10n ** 18n, // 35,000 tokens
      20000n * 10n ** 18n, // 20,000 tokens
    ];

    for (let f = 0; f < funders.length; f++) {
      try {
        const wallet = funderWallets[f];
        const sdk = funderSDKs[f];
        const amount = fundAmounts[f];

        await mintAndApprove(wallet, amount, vaultAddress);
        await sdk.vault.fund(vaultAddress, amount);

        console.log(
          `    ✅ Fund from Funder ${f + 1}: ${amount / 10n ** 18n} tokens`
        );
        totalFunds++;
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(
          `    ❌ Failed to create fund from Funder ${f + 1}:`,
          error
        );
      }
    }

    // Create contributions (10-15 contributors with smaller amounts)
    const numContributors = 10 + Math.floor(Math.random() * 6); // 10-15 contributors
    console.log(
      `\n  💚 Creating contributions from ${numContributors} contributors...`
    );

    // Varying contribution amounts (100 - 5,000 tokens)
    const contributionAmounts = [
      5000n * 10n ** 18n, // 5,000 tokens
      4000n * 10n ** 18n, // 4,000 tokens
      3500n * 10n ** 18n, // 3,500 tokens
      3000n * 10n ** 18n, // 3,000 tokens
      2500n * 10n ** 18n, // 2,500 tokens
      2000n * 10n ** 18n, // 2,000 tokens
      1500n * 10n ** 18n, // 1,500 tokens
      1000n * 10n ** 18n, // 1,000 tokens
      750n * 10n ** 18n, // 750 tokens
      500n * 10n ** 18n, // 500 tokens
      400n * 10n ** 18n, // 400 tokens
      300n * 10n ** 18n, // 300 tokens
      200n * 10n ** 18n, // 200 tokens
      150n * 10n ** 18n, // 150 tokens
      100n * 10n ** 18n, // 100 tokens
    ];

    for (let c = 0; c < numContributors; c++) {
      try {
        const wallet = contributorWallets[c];
        const sdk = contributorSDKs[c];
        const amount = contributionAmounts[c % contributionAmounts.length];

        await mintAndApprove(wallet, amount, vaultAddress);
        await sdk.vault.deposit(vaultAddress, amount);

        console.log(
          `    ✅ Contribution from Contributor ${c + 1}: ${amount / 10n ** 18n} tokens`
        );
        totalContributions++;
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(
          `    ❌ Failed to create contribution from Contributor ${c + 1}:`,
          error
        );
      }
    }

    console.log(`\n  ✨ Region ${i + 1} complete!\n`);
  }

  console.log("\n" + "=".repeat(80));
  console.log("📊 SEEDING SUMMARY");
  console.log("=".repeat(80));
  console.log(`✅ Bioregion vaults created: ${bioregionTemplates.length}`);
  console.log(`✅ Total funds: ${totalFunds}`);
  console.log(`✅ Total contributions: ${totalContributions}`);
  console.log(
    `✅ Average contributions per region: ${Math.round(totalContributions / bioregionTemplates.length)}`
  );
  console.log("\n🎉 Bioregion seeding completed successfully!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
