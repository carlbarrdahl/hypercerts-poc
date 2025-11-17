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
import { oneEarthFramework } from "@workspace/oneearth";
import { oneEarthBioregions } from "@workspace/oneearth";

/**
 * Simplified demo seed script for hypercerts PoC
 *
 * This script creates:
 * - 5 inspiring environmental projects as vaults
 * - Each project has 1-2 milestones
 * - Some milestones have work claims and verifications
 * - Each project receives deposits (smaller amounts) and funds (larger amounts)
 * - Projects are linked to pathways and regions via metadata
 *
 * Usage:
 *   bun run scripts/seed-demo.ts
 *   or
 *   npx tsx scripts/seed-demo.ts
 */

// Select 4 pathways from One Earth Framework
const solarPVPathway = oneEarthFramework.pillars[0].subPillars[0].pathways[0]; // Solar Photovoltaic
const reforestationPathway =
  oneEarthFramework.pillars[1].subPillars[2].pathways[0]; // Reforestation & Afforestation
const coralReefPathway = oneEarthFramework.pillars[1].subPillars[1].pathways[1]; // Coral Reef Restoration & Resilience
const wetlandProtectionPathway =
  oneEarthFramework.pillars[1].subPillars[0].pathways[1]; // Wetland & Peatland Protection

// Select 4 bioregions from One Earth Bioregions
const amazonRegion = oneEarthBioregions.bioregions.find(
  (b) => b.regionId === "NT20"
); // Northern Amazonian Forests
const africaRegion = oneEarthBioregions.bioregions.find(
  (b) => b.regionId === "AT21"
); // Lake Turkana-Sudd Grasslands, Bushlands & Forests
const hawaiiRegion = oneEarthBioregions.bioregions.find(
  (b) => b.regionId === "OC11"
); // Hawai'i Tropical Islands
const borneoRegion = oneEarthBioregions.bioregions.find(
  (b) => b.regionId === "IM16"
); // Borneo Tropical Forests & Sundaland Heath Forests

// Project templates
const projectTemplates = [
  {
    project: {
      name: "Solar Power for Rural Schools",
      description:
        "Installing solar panels on 10 rural schools to provide reliable electricity for 2,000 students. This project will reduce diesel generator use and provide clean energy for education.",
      image:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
      pathway: solarPVPathway.name,
      pathwayId: solarPVPathway.id,
      budget: 75000,
    },
    milestones: [
      {
        title: "Solar Installation - First 5 Schools",
        description:
          "Completed solar panel installation on first 5 schools, providing clean energy to 1,000 students. Systems include battery storage for evening classes.",
        status: "completed",
        completedDate: "2024-10-15",
        workClaims: [
          {
            title: "Installed 50kW solar systems on 5 schools",
            description:
              "Successfully installed solar PV systems on 5 schools with battery backup. Each system provides 10kW capacity with 20kWh storage. All systems tested and operational.",
            verifications: [
              {
                verified: true,
                verifier: "Technical Inspector",
                comment:
                  "Verified all installations meet specifications. Systems are operational and providing clean energy. Installation quality is excellent with proper safety measures in place.",
              },
            ],
          },
        ],
      },
      {
        title: "Solar Installation - Remaining 5 Schools",
        description:
          "Planning installation for remaining 5 schools. Equipment ordered and site preparations underway.",
        status: "in-progress",
        targetDate: "2025-02-28",
      },
    ],
  },
  {
    project: {
      name: "Amazon Rainforest Restoration",
      description:
        "Planting 100,000 native trees across 200 hectares of degraded Amazon rainforest in partnership with Indigenous communities. This project will restore biodiversity and sequester carbon.",
      image:
        "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
      pathway: reforestationPathway.name,
      pathwayId: reforestationPathway.id,
      region: amazonRegion?.name,
      regionId: amazonRegion?.regionId,
      latitude: amazonRegion?.iconicSpeciesEcoregion.flagshipSpecies.latitude,
      longitude: amazonRegion?.iconicSpeciesEcoregion.flagshipSpecies.longitude,
      budget: 120000,
    },
    milestones: [
      {
        title: "Native Seedling Production",
        description:
          "Established community nursery and produced 100,000 native tree seedlings from 30 different species. Seedlings are healthy and ready for planting.",
        status: "completed",
        completedDate: "2024-09-30",
        workClaims: [
          {
            title: "Produced 100,000 native seedlings",
            description:
              "Community nursery successfully produced 100,000 seedlings of 30 native species including Brazil nut, mahogany, and rubber trees. Survival rate is 95%.",
            verifications: [
              {
                verified: true,
                verifier: "Forestry Specialist",
                comment:
                  "Verified seedling count and quality. Species diversity is excellent. All seedlings are healthy with strong root systems. Ready for field planting.",
              },
            ],
          },
        ],
      },
      {
        title: "Tree Planting Campaign",
        description:
          "Planting 100,000 trees across 200 hectares with GPS tracking of all planting locations. Target completion by end of rainy season.",
        status: "in-progress",
        targetDate: "2025-03-31",
      },
    ],
  },
  {
    project: {
      name: "Coral Reef Restoration",
      description:
        "Restoring 5 hectares of damaged coral reef in Borneo through coral gardening and transplantation. Working with local fishing communities to establish marine protected areas.",
      image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800",
      pathway: coralReefPathway.name,
      pathwayId: coralReefPathway.id,
      region: borneoRegion?.name,
      regionId: borneoRegion?.regionId,
      latitude: borneoRegion?.iconicSpeciesEcoregion.flagshipSpecies.latitude,
      longitude: borneoRegion?.iconicSpeciesEcoregion.flagshipSpecies.longitude,
      budget: 90000,
    },
    milestones: [
      {
        title: "Coral Nursery Establishment",
        description:
          "Built underwater coral nursery with 5,000 coral fragments. Corals are growing well with 90% survival rate after 6 months.",
        status: "completed",
        completedDate: "2024-11-01",
        workClaims: [
          {
            title: "Established nursery with 5,000 coral fragments",
            description:
              "Set up underwater coral nursery using rope and frame methods. Currently growing 5,000 fragments from 15 coral species. Monthly monitoring shows excellent growth rates.",
            verifications: [
              {
                verified: true,
                verifier: "Marine Biologist",
                comment:
                  "Conducted underwater survey of coral nursery. Fragment survival rate is 90% which exceeds expectations. Growth rates are strong across all species. Excellent work.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    project: {
      name: "Community Wind Energy",
      description:
        "Installing 3 small wind turbines to power rural community facilities including a health clinic, school, and community center. This cooperative project is owned by the community.",
      image:
        "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800",
      pathway: solarPVPathway.name,
      pathwayId: solarPVPathway.id,
      budget: 150000,
    },
    milestones: [
      {
        title: "Wind Resource Assessment",
        description:
          "Completed 6-month wind monitoring study showing excellent wind resources. Site is optimal for small wind turbines with average speeds of 6.5 m/s.",
        status: "completed",
        completedDate: "2024-08-15",
        workClaims: [
          {
            title: "Wind monitoring and site assessment completed",
            description:
              "Installed monitoring equipment and collected 6 months of wind data. Analysis shows consistent wind speeds averaging 6.5 m/s, excellent for small turbines. Site permits obtained.",
            verifications: [
              {
                verified: true,
                verifier: "Wind Energy Consultant",
                comment:
                  "Reviewed wind data and analysis. Site has excellent wind resources with low turbulence. Projected energy production is 85,000 kWh/year. Recommend proceeding with installation.",
              },
            ],
          },
        ],
      },
      {
        title: "Turbine Installation",
        description:
          "Installing 3 x 10kW wind turbines with grid connection and battery storage. Foundation work completed, turbine delivery expected next month.",
        status: "in-progress",
        targetDate: "2025-01-31",
      },
    ],
  },
  {
    project: {
      name: "Mangrove Forest Restoration",
      description:
        "Planting 50,000 mangrove trees across 25 hectares of coastal areas in Borneo. Mangroves protect coastlines, support fisheries, and sequester carbon at high rates.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      pathway: reforestationPathway.name,
      pathwayId: reforestationPathway.id,
      region: borneoRegion?.name,
      regionId: borneoRegion?.regionId,
      latitude: borneoRegion?.iconicSpeciesEcoregion.flagshipSpecies.latitude,
      longitude: borneoRegion?.iconicSpeciesEcoregion.flagshipSpecies.longitude,
      budget: 60000,
    },
    milestones: [
      {
        title: "Mangrove Planting - Phase 1",
        description:
          "Planted 25,000 mangrove propagules across 12.5 hectares. Early survival rate is 88% with strong growth observed.",
        status: "completed",
        completedDate: "2024-10-30",
        workClaims: [
          {
            title: "Planted 25,000 mangroves on 12.5 hectares",
            description:
              "Community volunteers planted 25,000 mangrove propagules during optimal tidal conditions. GPS tracking of all planting zones completed. First monitoring shows 88% establishment.",
            verifications: [
              {
                verified: true,
                verifier: "Coastal Ecologist",
                comment:
                  "Field verification completed across all planting zones. Mangroves are establishing well with 88% survival rate. Planting density and distribution are optimal. Phase 2 can proceed.",
              },
            ],
          },
        ],
      },
      {
        title: "Mangrove Planting - Phase 2",
        description:
          "Planting remaining 25,000 mangroves on 12.5 hectares. Propagules are ready and community training completed.",
        status: "in-progress",
        targetDate: "2025-04-30",
      },
    ],
  },
  {
    project: {
      name: "Wetland Conservation",
      description:
        "Protecting and restoring 500 hectares of wetlands in Ethiopia, providing critical habitat for migratory birds and supporting local water security. Working with communities to establish sustainable use practices.",
      image:
        "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=800",
      pathway: wetlandProtectionPathway.name,
      pathwayId: wetlandProtectionPathway.id,
      region: africaRegion?.name,
      regionId: africaRegion?.regionId,
      latitude: africaRegion?.iconicSpeciesEcoregion.flagshipSpecies.latitude,
      longitude: africaRegion?.iconicSpeciesEcoregion.flagshipSpecies.longitude,
      budget: 80000,
    },
    milestones: [
      {
        title: "Community Engagement & Planning",
        description:
          "Completed stakeholder mapping and community workshops with 150 participants. Management plan developed with input from local communities and conservation experts.",
        status: "completed",
        completedDate: "2024-09-20",
        workClaims: [
          {
            title: "Community workshops and management plan completed",
            description:
              "Conducted 12 community workshops reaching 150 stakeholders. Co-developed wetland management plan with traditional ecological knowledge integrated. All communities signed agreements.",
            verifications: [
              {
                verified: true,
                verifier: "Community Liaison Officer",
                comment:
                  "Verified community participation records and management plan. Engagement process was inclusive and culturally appropriate. Management plan is comprehensive and feasible.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    project: {
      name: "Native Species Reforestation",
      description:
        "Planting 75,000 native tree species across 150 hectares in Hawaii, focusing on endangered endemic species. This project will restore critical habitat for native birds and reduce invasive species.",
      image:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800",
      pathway: reforestationPathway.name,
      pathwayId: reforestationPathway.id,
      region: hawaiiRegion?.name,
      regionId: hawaiiRegion?.regionId,
      latitude: hawaiiRegion?.iconicSpeciesEcoregion.flagshipSpecies.latitude,
      longitude: hawaiiRegion?.iconicSpeciesEcoregion.flagshipSpecies.longitude,
      budget: 95000,
    },
    milestones: [
      {
        title: "Invasive Species Removal",
        description:
          "Cleared 150 hectares of invasive species including albizia and strawberry guava. Site preparation completed for native tree planting.",
        status: "completed",
        completedDate: "2024-11-15",
      },
      {
        title: "Native Tree Planting",
        description:
          "Planting 75,000 native Hawaiian trees including koa, ʻōhiʻa lehua, and sandalwood. Target completion by March 2025.",
        status: "in-progress",
        targetDate: "2025-03-15",
      },
    ],
  },
  {
    project: {
      name: "Borneo Peatland Restoration",
      description:
        "Restoring 300 hectares of degraded peatland in Borneo, blocking drainage canals and replanting native vegetation. This will reduce carbon emissions and restore habitat for endangered species.",
      image:
        "https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=800",
      pathway: wetlandProtectionPathway.name,
      pathwayId: wetlandProtectionPathway.id,
      region: borneoRegion?.name,
      regionId: borneoRegion?.regionId,
      latitude: borneoRegion?.iconicSpeciesEcoregion.flagshipSpecies.latitude,
      longitude: borneoRegion?.iconicSpeciesEcoregion.flagshipSpecies.longitude,
      budget: 110000,
    },
    milestones: [
      {
        title: "Canal Blocking Phase 1",
        description:
          "Constructed 50 canal blocks to rewet 150 hectares of peatland. Water levels rising successfully, native vegetation beginning to regenerate.",
        status: "completed",
        completedDate: "2024-10-20",
        workClaims: [
          {
            title: "Built 50 canal blocks across degraded peatland",
            description:
              "Successfully installed 50 canal blocking structures using local materials. Hydrological monitoring shows water table rising 30cm. Spontaneous vegetation recovery observed.",
            verifications: [
              {
                verified: true,
                verifier: "Peatland Restoration Specialist",
                comment:
                  "Site visit confirmed all canal blocks are properly installed and functioning. Water table measurements show excellent rewetting progress. Project is on track.",
              },
            ],
          },
        ],
      },
    ],
  },
];

async function main() {
  // Vault owner address
  const vaultOwnerAddress =
    "0x79837AAc6631a242d371CE1755fF25f4B050FFA7" as `0x${string}`;

  // Use hardhat accounts for different roles (but not as owner)
  const accounts = [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Account #0 - Admin for transactions
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", // Account #1 - Verifier 1
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", // Account #2 - Verifier 2
    "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6", // Account #3 - Depositor 1
    "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a", // Account #4 - Depositor 2
    "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba", // Account #5 - Depositor 3
    "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e", // Account #6 - Depositor 4
    "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356", // Account #7 - Funder 1
    "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97", // Account #8 - Funder 2
  ];

  const adminAccount = privateKeyToAccount(accounts[0] as `0x${string}`);
  const verifier1 = privateKeyToAccount(accounts[1] as `0x${string}`);
  const verifier2 = privateKeyToAccount(accounts[2] as `0x${string}`);
  const depositor1 = privateKeyToAccount(accounts[3] as `0x${string}`);
  const depositor2 = privateKeyToAccount(accounts[4] as `0x${string}`);
  const depositor3 = privateKeyToAccount(accounts[5] as `0x${string}`);
  const depositor4 = privateKeyToAccount(accounts[6] as `0x${string}`);
  const funder1 = privateKeyToAccount(accounts[7] as `0x${string}`);
  const funder2 = privateKeyToAccount(accounts[8] as `0x${string}`);

  console.log("🌱 Demo Seeding - Hypercerts PoC");
  console.log("=".repeat(80));
  console.log("\n📋 Account Setup:");
  console.log("  Vault Owner:", vaultOwnerAddress);
  console.log("  Admin Account:", adminAccount.address);
  console.log("  Verifier 1:", verifier1.address);
  console.log("  Verifier 2:", verifier2.address);
  console.log("  Depositor 1:", depositor1.address);
  console.log("  Depositor 2:", depositor2.address);
  console.log("  Depositor 3:", depositor3.address);
  console.log("  Depositor 4:", depositor4.address);
  console.log("  Funder 1:", funder1.address);
  console.log("  Funder 2:", funder2.address);

  // Create wallet clients (admin will create the vaults on behalf of owner)
  const ownerWallet = createWalletClient({
    account: adminAccount,
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  const verifier1Wallet = createWalletClient({
    account: verifier1,
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  const verifier2Wallet = createWalletClient({
    account: verifier2,
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  const depositor1Wallet = createWalletClient({
    account: depositor1,
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  const depositor2Wallet = createWalletClient({
    account: depositor2,
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  const depositor3Wallet = createWalletClient({
    account: depositor3,
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  const depositor4Wallet = createWalletClient({
    account: depositor4,
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  const funder1Wallet = createWalletClient({
    account: funder1,
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  const funder2Wallet = createWalletClient({
    account: funder2,
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  // Initialize SDK instances
  const sdk = new HypercertsSDK(ownerWallet);
  const sdk1 = new HypercertsSDK(verifier1Wallet);
  const sdk2 = new HypercertsSDK(verifier2Wallet);
  const sdkDepositor1 = new HypercertsSDK(depositor1Wallet);
  const sdkDepositor2 = new HypercertsSDK(depositor2Wallet);
  const sdkDepositor3 = new HypercertsSDK(depositor3Wallet);
  const sdkDepositor4 = new HypercertsSDK(depositor4Wallet);
  const sdkFunder1 = new HypercertsSDK(funder1Wallet);
  const sdkFunder2 = new HypercertsSDK(funder2Wallet);

  if (!sdk.test?.token) {
    throw new Error(
      "TestToken address not found in SDK. Make sure contracts are deployed first."
    );
  }

  const tokenAddress = sdk.test.token;
  console.log("\n💰 Token Address:", tokenAddress);

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
    "function transfer(address to, uint256 amount) external returns (bool)",
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

  // Step 1: Create Pathway Vaults
  console.log("\n🌐 Creating pathway vaults...\n");
  const pathwayVaults: Record<string, string> = {};

  // Create Solar PV Pathway vault
  console.log("Creating Solar Photovoltaic pathway vault...");
  const solarPVVault = await sdk.vault.create({
    owner: vaultOwnerAddress,
    parent: zeroAddress,
    asset: tokenAddress,
    percent: 0n,
    shares: 0n,
    metadata: {
      title: solarPVPathway.name,
      description: solarPVPathway.description,
      image: solarPVPathway.image,
      type: "pathway",
      pathwayId: solarPVPathway.id,
    },
  });
  pathwayVaults[solarPVPathway.id] = solarPVVault;
  console.log(`  ✅ Solar PV Pathway vault: ${solarPVVault}`);

  // Create Reforestation Pathway vault
  console.log("\nCreating Reforestation & Afforestation pathway vault...");
  const reforestationVault = await sdk.vault.create({
    owner: vaultOwnerAddress,
    parent: zeroAddress,
    asset: tokenAddress,
    percent: 0n,
    shares: 0n,
    metadata: {
      title: reforestationPathway.name,
      description: reforestationPathway.description,
      image: reforestationPathway.image,
      type: "pathway",
      pathwayId: reforestationPathway.id,
    },
  });
  pathwayVaults[reforestationPathway.id] = reforestationVault;
  console.log(`  ✅ Reforestation Pathway vault: ${reforestationVault}`);

  // Create Coral Reef Pathway vault
  console.log("\nCreating Coral Reef Restoration pathway vault...");
  const coralReefVault = await sdk.vault.create({
    owner: vaultOwnerAddress,
    parent: zeroAddress,
    asset: tokenAddress,
    percent: 0n,
    shares: 0n,
    metadata: {
      title: coralReefPathway.name,
      description: coralReefPathway.description,
      image: coralReefPathway.image,
      type: "pathway",
      pathwayId: coralReefPathway.id,
    },
  });
  pathwayVaults[coralReefPathway.id] = coralReefVault;
  console.log(`  ✅ Coral Reef Pathway vault: ${coralReefVault}`);

  // Create Wetland Protection Pathway vault
  console.log("\nCreating Wetland & Peatland Protection pathway vault...");
  const wetlandProtectionVault = await sdk.vault.create({
    owner: vaultOwnerAddress,
    parent: zeroAddress,
    asset: tokenAddress,
    percent: 0n,
    shares: 0n,
    metadata: {
      title: wetlandProtectionPathway.name,
      description: wetlandProtectionPathway.description,
      image: wetlandProtectionPathway.image,
      type: "pathway",
      pathwayId: wetlandProtectionPathway.id,
    },
  });
  pathwayVaults[wetlandProtectionPathway.id] = wetlandProtectionVault;
  console.log(
    `  ✅ Wetland Protection Pathway vault: ${wetlandProtectionVault}`
  );

  // Step 2: Create Region Vaults
  console.log("\n\n🗺️  Creating region vaults...\n");
  const regionVaults: Record<string, string> = {};

  // Create Amazon Region vault
  if (amazonRegion) {
    console.log("Creating Northern Amazonian Forests region vault...");
    const amazonVault = await sdk.vault.create({
      owner: vaultOwnerAddress,
      parent: zeroAddress,
      asset: tokenAddress,
      percent: 0n,
      shares: 0n,
      metadata: {
        title: amazonRegion.name,
        description: amazonRegion.description,
        image: amazonRegion.image,
        type: "region",
        regionId: amazonRegion.regionId,
        geoJSON: amazonRegion.geoJSON,
      },
    });
    regionVaults[amazonRegion.regionId] = amazonVault;
    console.log(`  ✅ Amazon Region vault: ${amazonVault}`);
  }

  // Create Africa Region vault (Lake Turkana-Sudd)
  if (africaRegion) {
    console.log("\nCreating Lake Turkana-Sudd region vault...");
    const africaVault = await sdk.vault.create({
      owner: vaultOwnerAddress,
      parent: zeroAddress,
      asset: tokenAddress,
      percent: 0n,
      shares: 0n,
      metadata: {
        title: africaRegion.name,
        description: africaRegion.description,
        image: africaRegion.image,
        type: "region",
        regionId: africaRegion.regionId,
        geoJSON: africaRegion.geoJSON,
      },
    });
    regionVaults[africaRegion.regionId] = africaVault;
    console.log(`  ✅ Africa Region vault: ${africaVault}`);
  }

  // Create Hawaii Region vault
  if (hawaiiRegion) {
    console.log("\nCreating Hawai'i Tropical Islands region vault...");
    const hawaiiVault = await sdk.vault.create({
      owner: vaultOwnerAddress,
      parent: zeroAddress,
      asset: tokenAddress,
      percent: 0n,
      shares: 0n,
      metadata: {
        title: hawaiiRegion.name,
        description: hawaiiRegion.description,
        image: hawaiiRegion.image,
        type: "region",
        regionId: hawaiiRegion.regionId,
        geoJSON: hawaiiRegion.geoJSON,
      },
    });
    regionVaults[hawaiiRegion.regionId] = hawaiiVault;
    console.log(`  ✅ Hawaii Region vault: ${hawaiiVault}`);
  }

  // Create Borneo Region vault
  if (borneoRegion) {
    console.log("\nCreating Borneo Tropical Forests region vault...");
    const borneoVault = await sdk.vault.create({
      owner: vaultOwnerAddress,
      parent: zeroAddress,
      asset: tokenAddress,
      percent: 0n,
      shares: 0n,
      metadata: {
        title: borneoRegion.name,
        description: borneoRegion.description,
        image: borneoRegion.image,
        type: "region",
        regionId: borneoRegion.regionId,
        geoJSON: borneoRegion.geoJSON,
      },
    });
    regionVaults[borneoRegion.regionId] = borneoVault;
    console.log(`  ✅ Borneo Region vault: ${borneoVault}`);
  }

  // Add funds to pathway and region vaults (using .fund())
  console.log("\n\n💰 Funding pathway and region vaults...\n");

  // Fund pathway vaults
  console.log("Funding pathway vaults...");
  const pathwayFundConfigs = [
    {
      wallet: funder1Wallet,
      sdk: sdkFunder1,
      amount: 10000n * 10n ** 18n,
      name: "Funder 1",
    },
  ];

  for (const [pathwayId, vaultAddr] of Object.entries(pathwayVaults)) {
    for (const { wallet, sdk: funderSDK, amount, name } of pathwayFundConfigs) {
      try {
        await mintAndApprove(wallet, amount, vaultAddr);
        await funderSDK.vault.fund(vaultAddr as `0x${string}`, amount);
        console.log(
          `  ✅ Fund from ${name} to pathway vault: ${amount / 10n ** 18n} tokens`
        );
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`  ❌ Failed to fund pathway vault from ${name}:`, error);
      }
    }
  }

  // Fund region vaults
  console.log("\nFunding region vaults...");
  const regionFundConfigs = [
    {
      wallet: funder2Wallet,
      sdk: sdkFunder2,
      amount: 15000n * 10n ** 18n,
      name: "Funder 2",
    },
  ];

  for (const [regionId, vaultAddr] of Object.entries(regionVaults)) {
    for (const { wallet, sdk: funderSDK, amount, name } of regionFundConfigs) {
      try {
        await mintAndApprove(wallet, amount, vaultAddr);
        await funderSDK.vault.fund(vaultAddr as `0x${string}`, amount);
        console.log(
          `  ✅ Fund from ${name} to region vault: ${amount / 10n ** 18n} tokens`
        );
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`  ❌ Failed to fund region vault from ${name}:`, error);
      }
    }
  }

  // Step 3: Create Project Vaults
  console.log("\n\n🚀 Creating project vaults...\n");

  let totalMilestones = 0;
  let totalWorkClaims = 0;
  let totalVerifications = 0;
  let totalDeposits = 0;

  for (let i = 0; i < projectTemplates.length; i++) {
    const template = projectTemplates[i];
    const { project, milestones } = template;

    console.log(`\n${"=".repeat(80)}`);
    console.log(`📦 PROJECT ${i + 1}/5: ${project.name}`);
    console.log(`${"=".repeat(80)}`);
    console.log(`  Pathway: ${project.pathway || "N/A"}`);
    console.log(`  Region: ${project.region || "N/A"}`);
    console.log(`  Budget: $${project.budget.toLocaleString()}\n`);

    // Create project vault - link to pathway or region vault as parent
    console.log(`Creating vault...`);

    // Determine parent vault: prefer pathway, fallback to region
    let parentVault = zeroAddress;
    if (project.pathwayId && pathwayVaults[project.pathwayId]) {
      parentVault = pathwayVaults[project.pathwayId];
    } else if (project.regionId && regionVaults[project.regionId]) {
      parentVault = regionVaults[project.regionId];
    }

    const vaultAddress = await sdk.vault.create({
      owner: vaultOwnerAddress,
      parent: parentVault as `0x${string}`,
      asset: tokenAddress,
      percent: 0n,
      shares: 0n,
      metadata: {
        title: project.name,
        description: project.description,
        image: project.image,
        type: "project",
        pathway: project.pathway,
        pathwayId: project.pathwayId,
        region: project.region,
        regionId: project.regionId,
        latitude: project.latitude,
        longitude: project.longitude,
        budget: project.budget,
      },
    });

    console.log(`  ✅ Vault created: ${vaultAddress}`);

    // Create deposits (smaller amounts from community members)
    console.log(`\n  💰 Creating deposits...`);

    const depositConfigs = [
      {
        wallet: depositor1Wallet,
        sdk: sdkDepositor1,
        amount: 500n * 10n ** 18n,
        name: "Depositor 1",
      },
      {
        wallet: depositor2Wallet,
        sdk: sdkDepositor2,
        amount: 1000n * 10n ** 18n,
        name: "Depositor 2",
      },
      {
        wallet: depositor3Wallet,
        sdk: sdkDepositor3,
        amount: 750n * 10n ** 18n,
        name: "Depositor 3",
      },
      {
        wallet: depositor4Wallet,
        sdk: sdkDepositor4,
        amount: 2000n * 10n ** 18n,
        name: "Depositor 4",
      },
    ];

    for (const { wallet, sdk: depositorSDK, amount, name } of depositConfigs) {
      try {
        await mintAndApprove(wallet, amount, vaultAddress);
        await depositorSDK.vault.deposit(vaultAddress, amount);
        console.log(
          `    ✅ Deposit from ${name}: ${amount / 10n ** 18n} tokens`
        );
        totalDeposits++;
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`    ❌ Failed to create deposit from ${name}:`, error);
      }
    }

    // Create milestone attestations
    for (let j = 0; j < milestones.length; j++) {
      const milestone = milestones[j];
      console.log(
        `\n  📌 Milestone ${j + 1}/${milestones.length}: ${milestone.title}`
      );

      await new Promise((resolve) => setTimeout(resolve, 500));

      const milestoneAttestationUID = await sdk.cert.create({
        recipient: vaultAddress,
        visibility: "published",
        data: {
          type: "milestone",
          metadata: {
            title: milestone.title,
            description: milestone.description,
            status: milestone.status,
            completedDate: milestone.completedDate,
            targetDate: milestone.targetDate,
          },
        },
      });

      console.log(`    ✅ Milestone attestation created`);
      totalMilestones++;

      // Create work claims if they exist
      if (milestone.workClaims && milestone.workClaims.length > 0) {
        for (let w = 0; w < milestone.workClaims.length; w++) {
          const workClaim = milestone.workClaims[w];
          console.log(`    📝 Creating work claim: ${workClaim.title}`);

          await new Promise((resolve) => setTimeout(resolve, 500));

          try {
            const workClaimUID = await sdk.cert.create({
              recipient: vaultAddress,
              refUID: milestoneAttestationUID,
              visibility: "published",
              data: {
                type: "work-claim",
                metadata: {
                  title: workClaim.title,
                  description: workClaim.description,
                },
              },
            });
            console.log(`      ✅ Work claim created`);
            totalWorkClaims++;

            // Create verifications for this work claim
            if (workClaim.verifications && workClaim.verifications.length > 0) {
              for (let v = 0; v < workClaim.verifications.length; v++) {
                const verification = workClaim.verifications[v];

                // Alternate between verifiers
                const verifierSDK = v % 2 === 0 ? sdk1 : sdk2;
                const verifierAccount =
                  v % 2 === 0 ? verifier1.address : verifier2.address;

                console.log(
                  `        🔍 Creating verification by ${verification.verifier}...`
                );

                await new Promise((resolve) => setTimeout(resolve, 500));

                try {
                  await verifierSDK.cert.create({
                    recipient: vaultAddress,
                    refUID: workClaimUID,
                    visibility: "published",
                    data: {
                      type: "verification",
                      metadata: {
                        title: verification.verified
                          ? `✅ Verified: ${workClaim.title}`
                          : `⚠️ Under Review: ${workClaim.title}`,
                        description: verification.comment,
                        verified: verification.verified,
                        verifier: verification.verifier,
                        verifierAddress: verifierAccount,
                      },
                    },
                  });

                  console.log(
                    `          ✅ Verification created (${verification.verified ? "VERIFIED" : "UNDER REVIEW"})`
                  );
                  totalVerifications++;
                } catch (error) {
                  console.error(
                    `          ❌ Failed to create verification:`,
                    error
                  );
                }
              }
            }
          } catch (error) {
            console.error(`      ❌ Failed to create work claim:`, error);
          }
        }
      }
    }

    console.log(`\n  ✨ Project ${i + 1} complete!\n`);
  }

  console.log("\n" + "=".repeat(80));
  console.log("📊 DEMO SEEDING SUMMARY");
  console.log("=".repeat(80));
  console.log(
    `✅ Pathway vaults created: ${Object.keys(pathwayVaults).length}`
  );
  console.log(`✅ Region vaults created: ${Object.keys(regionVaults).length}`);
  console.log(`✅ Project vaults created: ${projectTemplates.length}`);
  console.log(`✅ Total milestones: ${totalMilestones}`);
  console.log(`✅ Total work claims: ${totalWorkClaims}`);
  console.log(`✅ Total verifications: ${totalVerifications}`);
  console.log(`✅ Total deposits to projects: ${totalDeposits}`);
  console.log("\n🎉 Demo seeding completed successfully!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
