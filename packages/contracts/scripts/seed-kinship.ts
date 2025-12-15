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
import {
  oneEarthFramework,
  kinshipProjects,
  type KinshipProject,
} from "@workspace/oneearth";

/**
 * Seed Kinship Earth Flow Fund projects as vaults
 *
 * This script creates vaults for each Kinship project with:
 * - Appropriate pathway mapping based on project description
 * - GeoJSON location data
 * - Combined description and learnings
 *
 * Usage:
 *   bun run scripts/seed-kinship.ts
 */

// Extract pathways from oneEarthFramework for easier access
const pathways = {
  // Nature Conservation - Land
  indigenousRights: oneEarthFramework.pillars[1].subPillars[0].pathways.find(
    (p) => p.id === "indigenous-stewardship"
  )!,
  forestProtection: oneEarthFramework.pillars[1].subPillars[0].pathways.find(
    (p) => p.id === "forest-protection"
  )!,
  wetlandProtection: oneEarthFramework.pillars[1].subPillars[0].pathways.find(
    (p) => p.id === "wetland-protection"
  )!,
  // Nature Conservation - Ocean
  marineProtected: oneEarthFramework.pillars[1].subPillars[1].pathways.find(
    (p) => p.id === "marine-protected-areas"
  )!,
  // Nature Conservation - Restoration
  reforestation: oneEarthFramework.pillars[1].subPillars[2].pathways.find(
    (p) => p.id === "reforestation"
  )!,
  riverRestoration: oneEarthFramework.pillars[1].subPillars[2].pathways.find(
    (p) => p.id === "river-restoration"
  )!,
  // Regenerative Agriculture
  agroforestry: oneEarthFramework.pillars[2].subPillars[0].pathways.find(
    (p) => p.id === "agroforestry"
  )!,
  smallholderFarming: oneEarthFramework.pillars[2].subPillars[0].pathways.find(
    (p) => p.id === "smallholder-farming"
  )!,
  seedDiversity: oneEarthFramework.pillars[2].subPillars[0].pathways.find(
    (p) => p.id === "seed-diversity"
  )!,
  composting: oneEarthFramework.pillars[2].subPillars[0].pathways.find(
    (p) => p.id === "composting"
  )!,
};

// Keywords to pathway mapping
const keywordMappings: Array<{
  keywords: string[];
  pathway: (typeof pathways)[keyof typeof pathways];
}> = [
  {
    keywords: [
      "indigenous",
      "native",
      "tribal",
      "lakota",
      "pomo",
      "oglala",
      "sioux",
      "ojibwe",
      "muskogee",
      "creek",
      "treaty",
      "sovereignty",
      "spiritual",
      "ceremony",
      "elder",
      "ancestral",
    ],
    pathway: pathways.indigenousRights,
  },
  {
    keywords: [
      "water",
      "watershed",
      "river",
      "lake",
      "dam",
      "tailings",
      "mining",
      "wetland",
      "stream",
    ],
    pathway: pathways.riverRestoration,
  },
  {
    keywords: [
      "forest",
      "tree",
      "reforestation",
      "planting",
      "woodland",
      "rainforest",
    ],
    pathway: pathways.reforestation,
  },
  {
    keywords: [
      "permaculture",
      "agroforestry",
      "food forest",
      "regenerative",
      "garden",
      "farm",
      "agriculture",
      "crop",
      "harvest",
      "soil",
      "compost",
    ],
    pathway: pathways.agroforestry,
  },
  {
    keywords: [
      "food",
      "nutrition",
      "hunger",
      "feed",
      "meal",
      "produce",
      "vegetable",
      "fruit",
      "seed",
      "freeze dryer",
    ],
    pathway: pathways.smallholderFarming,
  },
  {
    keywords: ["ocean", "marine", "coral", "fish", "coastal", "sea", "beach"],
    pathway: pathways.marineProtected,
  },
];

// Categorize a project based on its description
function categorizeProject(
  project: KinshipProject
): (typeof pathways)[keyof typeof pathways] {
  const text =
    `${project.description} ${project.learnings} ${project.recipientName}`.toLowerCase();

  for (const mapping of keywordMappings) {
    for (const keyword of mapping.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return mapping.pathway;
      }
    }
  }

  // Default to Indigenous & Community Land Rights for community-focused projects
  return pathways.indigenousRights;
}

// GeoJSON types
interface GeoJSONPoint {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    name: string;
    location: string;
  };
}

// Convert coordinates to GeoJSON Point
function toGeoJSON(project: KinshipProject): GeoJSONPoint | null {
  if (!project.coordinates) return null;

  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [project.coordinates.lng, project.coordinates.lat],
    },
    properties: {
      name: project.recipientName,
      location: project.location,
    },
  };
}

// Convert URLs in text to markdown links
function linkifyUrls(text: string): string {
  // Match URLs that aren't already in markdown link format
  const urlRegex = /(?<!\]\()https?:\/\/[^\s\)]+/g;
  return text.replace(urlRegex, (url) => `[${url}](${url})`);
}

// Format text as markdown paragraphs
function formatParagraphs(text: string): string {
  if (!text) return "";

  // Split by double newlines or single newlines
  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Join with proper markdown paragraph breaks
  return paragraphs.join("\n\n");
}

// Format project description as markdown (without learnings - those go in work-claim)
function formatDescription(project: KinshipProject): string {
  const parts: string[] = [];

  // Add funding info header
  if (project.funderName || project.amount) {
    const fundingInfo: string[] = [];
    if (project.funderName) {
      fundingInfo.push(`**Flow Funder:** ${project.funderName}`);
    }
    if (project.amount) {
      fundingInfo.push(`**Amount:** ${project.amount}`);
    }
    if (project.disbursementDate) {
      fundingInfo.push(`**Date:** ${project.disbursementDate}`);
    }
    if (project.location) {
      fundingInfo.push(`**Location:** ${project.location}`);
    }
    parts.push(fundingInfo.join(" | "));
    parts.push("---");
  }

  // Add main description
  if (project.description && project.description.trim()) {
    const formattedDesc = formatParagraphs(linkifyUrls(project.description));
    parts.push(formattedDesc);
  }

  return parts.join("\n\n");
}

// Format learnings as markdown for work-claim
function formatLearnings(project: KinshipProject): string | null {
  if (
    !project.learnings ||
    !project.learnings.trim() ||
    project.learnings.trim() === project.description?.trim()
  ) {
    return null;
  }

  return formatParagraphs(linkifyUrls(project.learnings));
}

async function main() {
  // Use hardhat accounts
  const accounts = [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Account #0 - Project Creator
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", // Account #1 - Depositor 1
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", // Account #2 - Depositor 2
  ];

  const projectOwner = privateKeyToAccount(accounts[0] as `0x${string}`);
  const depositor1 = privateKeyToAccount(accounts[1] as `0x${string}`);
  const depositor2 = privateKeyToAccount(accounts[2] as `0x${string}`);

  console.log("🌱 Seeding Kinship Earth Flow Fund projects...\n");
  console.log("  Project Owner:", projectOwner.address);
  console.log("  Depositor 1:", depositor1.address);
  console.log("  Depositor 2:", depositor2.address);

  // Create wallet clients
  const ownerWallet = createWalletClient({
    account: projectOwner,
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

  // Initialize SDK
  const sdk = new HypercertsSDK(ownerWallet);
  const sdkDepositor1 = new HypercertsSDK(depositor1Wallet);
  const sdkDepositor2 = new HypercertsSDK(depositor2Wallet);

  if (!sdk.test?.token) {
    throw new Error(
      "TestToken address not found in SDK. Make sure contracts are deployed first."
    );
  }

  const tokenAddress = sdk.test.token;
  console.log("\nUsing token address:", tokenAddress);

  // Create public client for reading
  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http("http://localhost:8545"),
  });

  // TestToken ABI
  const tokenAbi = parseAbi([
    "function mint(address to, uint256 amount) external",
    "function approve(address spender, uint256 amount) external returns (bool)",
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

    const mintTx = await tokenContract.write.mint([
      wallet.account.address,
      amount,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });

    const approveTx = await tokenContract.write.approve([
      vaultAddress as `0x${string}`,
      amount,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: approveTx });
  }

  console.log(
    `\n📦 Creating ${kinshipProjects.length} Kinship project vaults...\n`
  );

  // Track statistics
  const stats = {
    created: 0,
    withCoordinates: 0,
    totalFunded: 0n,
    workClaims: 0,
    pathwayCounts: new Map<string, number>(),
  };

  for (let i = 0; i < kinshipProjects.length; i++) {
    const project = kinshipProjects[i];

    // Skip projects without essential data
    if (!project.recipientName && !project.funderName) {
      console.log(`  ⏭️  Skipping project ${i + 1}: No name`);
      continue;
    }

    const pathway = categorizeProject(project);
    const geoJSON = toGeoJSON(project);
    const description = formatDescription(project);
    const learnings = formatLearnings(project);
    const title = project.recipientName || project.funderName;

    console.log(`\n${"-".repeat(60)}`);
    console.log(`📌 Project ${i + 1}/${kinshipProjects.length}: ${title}`);
    console.log(`   Pathway: ${pathway.name}`);
    console.log(`   Location: ${project.location || "Not specified"}`);
    console.log(`   Amount: ${project.amount || "Not specified"}`);

    try {
      // Create vault
      const vaultAddress = await sdk.vault.create({
        owner: projectOwner.address,
        parent: zeroAddress,
        asset: tokenAddress,
        percent: 0n,
        shares: 0n,
        metadata: {
          title,
          description,
          image: "",
          type: "kinship-flow-fund",
          pathway: pathway.name,
          pathwayId: pathway.id,
          funder: project.funderName,
          disbursementDate: project.disbursementDate,
          amount: project.amountNumeric,
          location: project.location,
          geoJSON: geoJSON ? JSON.stringify(geoJSON) : undefined,
        },
      });

      console.log(`   ✅ Vault created: ${vaultAddress}`);
      stats.created++;

      if (geoJSON) {
        stats.withCoordinates++;
      }

      // Track pathway counts
      const currentCount = stats.pathwayCounts.get(pathway.name) || 0;
      stats.pathwayCounts.set(pathway.name, currentCount + 1);

      // Create a deposit matching the project amount (scaled to 18 decimals)
      if (project.amountNumeric > 0) {
        const depositAmount =
          BigInt(Math.floor(project.amountNumeric)) * 10n ** 18n;

        // Alternate between depositors
        const depositorWallet =
          i % 2 === 0 ? depositor1Wallet : depositor2Wallet;
        const depositorSDK = i % 2 === 0 ? sdkDepositor1 : sdkDepositor2;

        await mintAndApprove(depositorWallet, depositAmount, vaultAddress);
        await depositorSDK.vault.deposit(vaultAddress, depositAmount);

        stats.totalFunded += depositAmount;
        console.log(`   💰 Deposited: ${project.amountNumeric} tokens`);
      }

      // Create work-claim for learnings if present
      if (learnings) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          await sdk.cert.create({
            recipient: vaultAddress,
            visibility: "published",
            data: {
              type: "work-claim",
              metadata: {
                title: `Learnings: ${title}`,
                description: learnings,
              },
            },
          });
          stats.workClaims++;
          console.log(`   📝 Work claim created (learnings)`);
        } catch (error) {
          console.error(`   ❌ Failed to create work claim:`, error);
        }
      }

      // Small delay between transactions
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`   ❌ Failed to create vault:`, error);
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 KINSHIP SEEDING SUMMARY");
  console.log("=".repeat(60));
  console.log(`✅ Vaults created: ${stats.created}`);
  console.log(`📝 Work claims (learnings): ${stats.workClaims}`);
  console.log(`🗺️  With coordinates: ${stats.withCoordinates}`);
  console.log(
    `💰 Total funded: ${(stats.totalFunded / 10n ** 18n).toString()} tokens`
  );
  console.log("\n📁 Projects by pathway:");
  for (const [pathway, count] of stats.pathwayCounts.entries()) {
    console.log(`   ${pathway}: ${count}`);
  }
  console.log("\n🎉 Kinship project seeding completed!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
