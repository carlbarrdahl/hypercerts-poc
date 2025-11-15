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

/**
 * Seed 5 example projects with milestones, work claims, and verification attestations
 *
 * This script creates:
 * - 5 project vaults based on One Earth Solutions pathways
 * - 2-3 milestone attestations per project (linked to vaults)
 * - 0-2 work claims per milestone (linked to milestones via refUID)
 * - 1-2 verification attestations per work claim (linked to work claims via refUID)
 * - For milestones without work claims, verifications link directly to milestones
 *
 * Usage:
 *   bun run scripts/seed-projects.ts
 *   or
 *   npx tsx scripts/seed-projects.ts
 */

// Project templates based on One Earth Solutions
const projectTemplates = [
  {
    // Solar Photovoltaic project
    pathway: oneEarthFramework.pillars[0].subPillars[0].pathways[0],
    project: {
      name: "Community Solar Initiative - Kenya",
      description:
        "Installing 500kW of solar PV systems across 10 rural communities in Kenya to provide clean, affordable electricity access.",
      image:
        "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
      region: "East Africa",
      budget: 500000,
    },
    milestones: [
      {
        title: "Community Consultation & Site Assessment",
        description:
          "Completed consultations with 10 communities and technical site assessments for optimal solar panel placement.",
        status: "completed",
        completedDate: "2024-09-15",
        workClaims: [
          {
            title: "Consulted 5 communities in Northern region",
            description: "Held community meetings and collected site data",
            verifications: [
              {
                verified: true,
                verifier: "Technical Lead",
                comment:
                  "Northern communities - All sites assessed and approved",
                resources: [
                  {
                    title: "Site Assessment Report - North",
                    src: "https://example.com/reports/site-assessment-north-2024.pdf",
                    mime: "application/pdf",
                  },
                  {
                    title: "Solar Irradiance Data - North",
                    src: "https://example.com/data/irradiance-north.csv",
                    mime: "text/csv",
                  },
                ],
              },
            ],
          },
          {
            title: "Consulted 5 communities in Southern region",
            description: "Completed consultations and site surveys",
            verifications: [
              {
                verified: true,
                verifier: "Community Liaison",
                comment: "Southern communities - Community buy-in achieved",
                resources: [
                  {
                    title: "Community Meeting Minutes - South",
                    src: "https://example.com/meetings/community-consultation-south.pdf",
                    mime: "application/pdf",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Solar Panel Installation - Phase 1",
        description:
          "Installed 250kW capacity across first 5 communities (50kW each). Systems include battery storage for 24/7 power availability.",
        status: "completed",
        completedDate: "2024-11-01",
        image:
          "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
        workClaims: [
          {
            title: "Installed 100kW across 2 communities",
            description: "Completed installation with battery backup systems",
            verifications: [
              {
                verified: true,
                verifier: "Engineering Team",
                comment: "First 2 communities - Systems tested and operational",
                resources: [
                  {
                    title: "Installation Completion Certificate",
                    src: "https://example.com/certs/installation-phase1a.pdf",
                    mime: "application/pdf",
                  },
                ],
              },
            ],
          },
          {
            title: "Installed 150kW across 3 communities",
            description: "All systems operational and tested",
            verifications: [
              {
                verified: true,
                verifier: "Engineering Team",
                comment: "Remaining 3 communities - All systems operational",
                resources: [
                  {
                    title: "System Test Results",
                    src: "https://example.com/reports/system-tests-phase1b.pdf",
                    mime: "application/pdf",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Training Local Maintenance Teams",
        description:
          "Training 20 local technicians on solar panel maintenance, battery management, and basic electrical safety.",
        status: "in-progress",
        targetDate: "2025-01-15",
      },
    ],
  },
  {
    // Reforestation project
    pathway: oneEarthFramework.pillars[1].subPillars[2].pathways[0],
    project: {
      name: "Amazon Rainforest Restoration Project",
      description:
        "Restoring 1,000 hectares of degraded Amazon rainforest in collaboration with Indigenous communities through native species reforestation.",
      image:
        "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3b27fd7-e463-4f93-875a-0174c4e6eb9e/hands%20holding%20aplingdreamstime_xxl_38295437%20(1).jpg?auto=compress%2Cformat",
      region: "Amazon Basin",
      budget: 750000,
    },
    milestones: [
      {
        title: "Indigenous Partnership Agreement",
        description:
          "Formalized partnership with 3 Indigenous communities, establishing collaborative governance structure and benefit-sharing mechanisms.",
        status: "completed",
        completedDate: "2024-08-20",
      },
      {
        title: "Native Seedling Production",
        description:
          "Established 2 community-run nurseries producing 500,000 native tree seedlings from 45 different species.",
        status: "completed",
        completedDate: "2024-10-10",
        image:
          "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3b27fd7-e463-4f93-875a-0174c4e6eb9e/hands%20holding%20aplingdreamstime_xxl_38295437%20(1).jpg?auto=compress%2Cformat",
      },
      {
        title: "Planting Campaign - 400 Hectares",
        description:
          "Community-led planting of 200,000 trees across 400 hectares of degraded land, with GPS monitoring of all planting sites.",
        status: "completed",
        completedDate: "2024-11-30",
        workClaims: [
          {
            title: "Planted 100,000 trees across 200 hectares",
            description: "First phase completed with GPS tracking",
            verifications: [
              {
                verified: true,
                verifier: "Field Coordinator",
                comment: "First 200 hectares verified with GPS data",
                resources: [
                  {
                    title: "GPS Planting Data - Phase 1",
                    src: "https://example.com/gps/planting-coordinates-phase1.geojson",
                    mime: "application/geo+json",
                  },
                  {
                    title: "Field Photos - Phase 1",
                    src: "https://example.com/photos/planting-phase1-2024.zip",
                    mime: "application/zip",
                  },
                ],
              },
            ],
          },
          {
            title: "Planted 100,000 trees across 225 hectares",
            description: "Second phase exceeded target by 25 hectares",
            verifications: [
              {
                verified: true,
                verifier: "Field Coordinator",
                comment: "Phase 2 exceeded target: 225 hectares confirmed",
                resources: [
                  {
                    title: "GPS Planting Data - Phase 2",
                    src: "https://example.com/gps/planting-coordinates-phase2.geojson",
                    mime: "application/geo+json",
                  },
                ],
              },
              {
                verified: true,
                verifier: "Remote Sensing Team",
                comment:
                  "Satellite imagery confirms total coverage of 425 hectares",
                resources: [
                  {
                    title: "Satellite Imagery Analysis",
                    src: "https://example.com/satellite/coverage-analysis.pdf",
                    mime: "application/pdf",
                  },
                  {
                    title: "Before/After Comparison",
                    src: "https://example.com/images/satellite-comparison.jpg",
                    mime: "image/jpeg",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    // Regenerative Agriculture project
    pathway: oneEarthFramework.pillars[2].subPillars[0].pathways[0],
    project: {
      name: "Regenerative Agroforestry - Guatemala Highlands",
      description:
        "Supporting 200 smallholder coffee farmers to transition to agroforestry systems, integrating native shade trees and improving soil health.",
      image:
        "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/69656b16-dc30-447e-8393-058f51102d04/shared%20forest%20system%20agroforestry%20dreamstime_xxl_270798972%20(1).jpg?auto=compress%2Cformat",
      region: "Central America",
      budget: 300000,
    },
    milestones: [
      {
        title: "Farmer Training Program Launch",
        description:
          "Launched 6-month training program on agroforestry techniques, soil management, and organic pest control for 200 participating farmers.",
        status: "completed",
        completedDate: "2024-09-01",
      },
      {
        title: "Shade Tree Distribution",
        description:
          "Distributed 15,000 native shade trees (including nitrogen-fixing species) to participating farms. Trees provide shade for coffee, improve soil, and increase biodiversity.",
        status: "completed",
        completedDate: "2024-10-20",
        image:
          "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/69656b16-dc30-447e-8393-058f51102d04/shared%20forest%20system%20agroforestry%20dreamstime_xxl_270798972%20(1).jpg?auto=compress%2Cformat",
      },
      {
        title: "Organic Certification Process",
        description:
          "Supporting 150 farmers through organic certification process to access premium markets for their agroforestry coffee.",
        status: "in-progress",
        targetDate: "2025-03-01",
      },
    ],
  },
  {
    // Marine Protected Area project
    pathway: oneEarthFramework.pillars[1].subPillars[1].pathways[0],
    project: {
      name: "Coral Triangle Marine Protected Area",
      description:
        "Establishing and managing 50,000 hectares of marine protected area in the Coral Triangle region, working with local fishing communities.",
      image:
        "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/88cfb686-ab4a-46fc-8720-545741d3faff/Great%20Barrier%20Reef.%20Heart%20Reef.%20Whitsundays.%20Queensland%20Australia%20shutterstock_1597510444.jpg?auto=compress%2Cformat",
      region: "Southeast Asia",
      budget: 900000,
    },
    milestones: [
      {
        title: "Marine Ecosystem Baseline Survey",
        description:
          "Completed comprehensive underwater surveys documenting coral cover, fish populations, and key species across proposed MPA zones.",
        status: "completed",
        completedDate: "2024-08-30",
      },
      {
        title: "Community Fisheries Management Agreement",
        description:
          "Negotiated co-management agreement with 12 fishing communities establishing no-take zones, seasonal closures, and sustainable fishing practices.",
        status: "completed",
        completedDate: "2024-10-15",
      },
      {
        title: "Patrol Boat & Monitoring System",
        description:
          "Deployed 4 patrol boats and installed GPS-based vessel monitoring system to enforce MPA regulations and support sustainable fishing.",
        status: "in-progress",
        targetDate: "2025-02-01",
        image:
          "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/88cfb686-ab4a-46fc-8720-545741d3faff/Great%20Barrier%20Reef.%20Heart%20Reef.%20Whitsundays.%20Queensland%20Australia%20shutterstock_1597510444.jpg?auto=compress%2Cformat",
      },
    ],
  },
  {
    // Electric Vehicles project
    pathway: oneEarthFramework.pillars[0].subPillars[2].pathways[0],
    project: {
      name: "Electric Bus Transit System - Nairobi",
      description:
        "Launching fleet of 50 electric buses and charging infrastructure to provide clean public transportation in Nairobi, reducing emissions and air pollution.",
      image:
        "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/55914c00-b8fd-400b-afc3-6e9d16212968/Electric%20Vehicle%20charging%20station%20system%20storing%20power%20on%20white%20modern%20car.%20EV%20fuel%20for%20advanced%20hybrid%20car.%20automobile%20industry%20new%20technology%2C%20clean%20energy%2C%20or%20environmental%20conservation%20concept%20dreamstime_xxl_114496245%20(1).jpg?auto=compress%2Cformat",
      region: "East Africa",
      budget: 12000000,
    },
    milestones: [
      {
        title: "Charging Station Infrastructure",
        description:
          "Installed 10 high-capacity charging stations at strategic locations, powered by grid + solar hybrid system.",
        status: "completed",
        completedDate: "2024-09-30",
      },
      {
        title: "Electric Bus Fleet Deployment - Phase 1",
        description:
          "Deployed first 25 electric buses on 5 high-traffic routes, replacing diesel buses and reducing emissions.",
        status: "completed",
        completedDate: "2024-11-15",
        image:
          "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/45d9d6c3-d308-428b-b715-fe1586e1c5ca/Chinese%20electric%20train%20cut%20across%20railway%20station%20dreamstime_xxl_17824938%20(1).jpg?auto=compress%2Cformat",
        workClaims: [
          {
            title: "Deployed 10 buses on Route A and B",
            description: "First 10 buses deployed and operational",
            verifications: [
              {
                verified: true,
                verifier: "Fleet Manager",
                comment: "Routes A & B buses operational, 98% uptime",
                resources: [
                  {
                    title: "Fleet Performance Dashboard - Routes A&B",
                    src: "https://example.com/dashboards/fleet-performance-ab.html",
                    mime: "text/html",
                  },
                  {
                    title: "Maintenance Logs - Routes A&B",
                    src: "https://example.com/logs/maintenance-routes-ab.xlsx",
                    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                  },
                ],
              },
            ],
          },
          {
            title: "Deployed 15 buses on Routes C, D, and E",
            description: "Remaining 15 buses deployed successfully",
            verifications: [
              {
                verified: true,
                verifier: "Fleet Manager",
                comment:
                  "Routes C, D, E buses operational with excellent performance",
                resources: [
                  {
                    title: "Fleet Performance Dashboard - Routes CDE",
                    src: "https://example.com/dashboards/fleet-performance-cde.html",
                    mime: "text/html",
                  },
                ],
              },
              {
                verified: true,
                verifier: "Environmental Monitor",
                comment:
                  "Estimated 450 tons CO2 reduction in first month across all routes",
                resources: [
                  {
                    title: "Emissions Impact Report",
                    src: "https://example.com/reports/emissions-impact-2024.pdf",
                    mime: "application/pdf",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Driver Training & Job Creation",
        description:
          "Trained 75 drivers on electric bus operation and hired 100 local staff for charging station operations and maintenance.",
        status: "completed",
        completedDate: "2024-11-01",
      },
    ],
  },
];

async function main() {
  // Use hardhat accounts for different roles
  const accounts = [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Account #0 - Project Creator
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", // Account #1 - Verifier 1
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", // Account #2 - Verifier 2
    "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6", // Account #3 - Depositor 1
    "0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a", // Account #4 - Depositor 2
    "0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba", // Account #5 - Depositor 3
    "0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e", // Account #6 - Depositor 4
    "0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356", // Account #7 - Funder 1
    "0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97", // Account #8 - Funder 2
  ];

  const projectOwner = privateKeyToAccount(accounts[0] as `0x${string}`);
  const verifier1 = privateKeyToAccount(accounts[1] as `0x${string}`);
  const verifier2 = privateKeyToAccount(accounts[2] as `0x${string}`);
  const depositor1 = privateKeyToAccount(accounts[3] as `0x${string}`);
  const depositor2 = privateKeyToAccount(accounts[4] as `0x${string}`);
  const depositor3 = privateKeyToAccount(accounts[5] as `0x${string}`);
  const depositor4 = privateKeyToAccount(accounts[6] as `0x${string}`);
  const funder1 = privateKeyToAccount(accounts[7] as `0x${string}`);
  const funder2 = privateKeyToAccount(accounts[8] as `0x${string}`);

  console.log("🌱 Seeding projects with accounts:");
  console.log("  Project Owner:", projectOwner.address);
  console.log("  Verifier 1:", verifier1.address);
  console.log("  Verifier 2:", verifier2.address);
  console.log("  Depositor 1:", depositor1.address);
  console.log("  Depositor 2:", depositor2.address);
  console.log("  Depositor 3:", depositor3.address);
  console.log("  Depositor 4:", depositor4.address);
  console.log("  Funder 1:", funder1.address);
  console.log("  Funder 2:", funder2.address);

  // Create wallet clients
  const ownerWallet = createWalletClient({
    account: projectOwner,
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

  // Initialize SDK
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

  console.log("\n🚀 Creating projects and attestations...\n");

  for (let i = 0; i < projectTemplates.length; i++) {
    const template = projectTemplates[i];
    const { pathway, project, milestones } = template;

    console.log(`\n${"=".repeat(80)}`);
    console.log(`📦 PROJECT ${i + 1}/5: ${project.name}`);
    console.log(`${"=".repeat(80)}\n`);

    // Create project vault
    console.log(`Creating vault for: ${project.name}`);
    const vaultAddress = await sdk.vault.create({
      owner: projectOwner.address,
      parent: zeroAddress,
      asset: tokenAddress,
      percent: 0n,
      shares: 0n,
      metadata: {
        title: project.name,
        description: project.description,
        image: project.image,
        type: "project",
        pathway: pathway.name,
        region: project.region,
        budget: project.budget,
      },
    });

    console.log(`  ✅ Vault created: ${vaultAddress}`);

    // Create deposits (more frequent, smaller amounts)
    console.log(`\n  💰 Creating deposits...`);

    // Define deposit amounts (varying sizes - smaller than funds)
    const depositConfigs = [
      {
        wallet: depositor1Wallet,
        sdk: sdkDepositor1,
        amount: 1000n * 10n ** 18n,
        name: "Depositor 1",
      },
      {
        wallet: depositor2Wallet,
        sdk: sdkDepositor2,
        amount: 2500n * 10n ** 18n,
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
        amount: 1500n * 10n ** 18n,
        name: "Depositor 4",
      },
      {
        wallet: depositor1Wallet,
        sdk: sdkDepositor1,
        amount: 500n * 10n ** 18n,
        name: "Depositor 1",
      },
      {
        wallet: depositor3Wallet,
        sdk: sdkDepositor3,
        amount: 3000n * 10n ** 18n,
        name: "Depositor 3",
      },
    ];

    for (const { wallet, sdk: depositorSDK, amount, name } of depositConfigs) {
      try {
        await mintAndApprove(wallet, amount, vaultAddress);
        await depositorSDK.vault.deposit(vaultAddress, amount);
        console.log(
          `    ✅ Deposit from ${name}: ${amount / 10n ** 18n} tokens`
        );
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`    ❌ Failed to create deposit from ${name}:`, error);
      }
    }

    // Create funds (fewer, larger amounts)
    console.log(`\n  🎁 Creating funds...`);

    // Define fund amounts (larger than deposits)
    const fundConfigs = [
      {
        wallet: funder1Wallet,
        sdk: sdkFunder1,
        amount: 50000n * 10n ** 18n,
        name: "Funder 1",
      },
      {
        wallet: funder2Wallet,
        sdk: sdkFunder2,
        amount: 75000n * 10n ** 18n,
        name: "Funder 2",
      },
    ];

    for (const { wallet, sdk: funderSDK, amount, name } of fundConfigs) {
      try {
        await mintAndApprove(wallet, amount, vaultAddress);
        await funderSDK.vault.fund(vaultAddress, amount);
        console.log(`    ✅ Fund from ${name}: ${amount / 10n ** 18n} tokens`);
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`    ❌ Failed to create fund from ${name}:`, error);
      }
    }

    // Create milestone attestations
    for (let j = 0; j < milestones.length; j++) {
      const milestone = milestones[j];
      console.log(
        `\n  📌 Milestone ${j + 1}/${milestones.length}: ${milestone.title}`
      );

      // Small delay to ensure transactions are processed
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const milestoneAttestationUID = await sdk.cert.create({
        recipient: vaultAddress,
        visibility: "published",
        data: {
          type: "milestone",
          metadata: {
            title: milestone.title,
            description: milestone.description,
            image: milestone.image,
            status: milestone.status,
            completedDate: milestone.completedDate,
            targetDate: milestone.targetDate,
          },
        },
      });

      console.log(`    ✅ Milestone attestation created`);

      // Create work claims if they exist
      if (milestone.workClaims && milestone.workClaims.length > 0) {
        let verifierCounter = 0; // Track verifier alternation across all verifications

        for (let w = 0; w < milestone.workClaims.length; w++) {
          const workClaim = milestone.workClaims[w];
          console.log(`    📝 Creating work claim: ${workClaim.title}`);

          await new Promise((resolve) => setTimeout(resolve, 1000));

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

            // Create verifications for this work claim if they exist
            if (workClaim.verifications && workClaim.verifications.length > 0) {
              for (let v = 0; v < workClaim.verifications.length; v++) {
                const verification = workClaim.verifications[v];

                // Alternate between verifiers
                const verifierSDK = verifierCounter % 2 === 0 ? sdk1 : sdk2;
                const verifierAccount =
                  verifierCounter % 2 === 0
                    ? verifier1.address
                    : verifier2.address;
                verifierCounter++;

                console.log(
                  `        🔍 Creating verification by ${verification.verifier}...`
                );

                // Small delay
                await new Promise((resolve) => setTimeout(resolve, 1000));

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
                        refAttestationId: workClaimUID,
                        resources: verification.resources || [],
                      },
                    },
                  });

                  console.log(
                    `          ✅ Verification created by ${verification.verifier} (${verification.verified ? "VERIFIED" : "UNDER REVIEW"})`
                  );
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
  console.log("📊 SEEDING SUMMARY");
  console.log("=".repeat(80));
  console.log(`✅ Projects created: ${projectTemplates.length}`);
  console.log(
    `✅ Total milestones: ${projectTemplates.reduce((sum, t) => sum + t.milestones.length, 0)}`
  );
  console.log(
    `✅ Total work claims: ${projectTemplates.reduce((sum, t) => sum + t.milestones.reduce((mSum, m) => mSum + (m.workClaims?.length || 0), 0), 0)}`
  );
  console.log(
    `✅ Total verifications: ${projectTemplates.reduce((sum, t) => sum + t.milestones.reduce((mSum, m) => mSum + (m.workClaims?.reduce((wSum, w) => wSum + (w.verifications?.length || 0), 0) || 0), 0), 0)}`
  );
  console.log(`✅ Total deposits: ${projectTemplates.length * 6}`);
  console.log(`✅ Total funds: ${projectTemplates.length * 2}`);
  console.log("\n🎉 Project seeding completed successfully!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
