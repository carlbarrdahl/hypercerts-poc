import { createWalletClient, createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { zeroAddress } from "viem";
// @ts-ignore - Workspace package, resolved at runtime
import { HypercertsSDK } from "../../sdk/src/index.js";
import { oneEarthFramework } from "../../oneearth";

/**
 * Seed 5 example projects with milestone and evaluation attestations
 * 
 * This script creates:
 * - 5 project vaults based on One Earth Solutions pathways
 * - 2-3 milestone attestations per project
 * - 1-2 evaluation attestations per milestone
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
      description: "Installing 500kW of solar PV systems across 10 rural communities in Kenya to provide clean, affordable electricity access.",
      image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
      region: "East Africa",
      budget: 500000,
    },
    milestones: [
      {
        title: "Community Consultation & Site Assessment",
        description: "Completed consultations with 10 communities and technical site assessments for optimal solar panel placement.",
        status: "completed",
        completedDate: "2024-09-15",
        verifications: [
          { verified: true, verifier: "Technical Lead", comment: "All 10 sites assessed and approved" },
          { verified: true, verifier: "Community Liaison", comment: "Community buy-in achieved" },
        ]
      },
      {
        title: "Solar Panel Installation - Phase 1",
        description: "Installed 250kW capacity across first 5 communities (50kW each). Systems include battery storage for 24/7 power availability.",
        status: "completed",
        completedDate: "2024-11-01",
        image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
        verifications: [
          { verified: true, verifier: "Engineering Team", comment: "All systems tested and operational" },
        ]
      },
      {
        title: "Training Local Maintenance Teams",
        description: "Training 20 local technicians on solar panel maintenance, battery management, and basic electrical safety.",
        status: "in-progress",
        targetDate: "2025-01-15",
        verifications: [
          { verified: false, verifier: "Project Manager", comment: "Training ongoing, 60% complete" },
        ]
      },
    ]
  },
  {
    // Reforestation project
    pathway: oneEarthFramework.pillars[1].subPillars[2].pathways[0],
    project: {
      name: "Amazon Rainforest Restoration Project",
      description: "Restoring 1,000 hectares of degraded Amazon rainforest in collaboration with Indigenous communities through native species reforestation.",
      image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3b27fd7-e463-4f93-875a-0174c4e6eb9e/hands%20holding%20aplingdreamstime_xxl_38295437%20(1).jpg?auto=compress%2Cformat",
      region: "Amazon Basin",
      budget: 750000,
    },
    milestones: [
      {
        title: "Indigenous Partnership Agreement",
        description: "Formalized partnership with 3 Indigenous communities, establishing collaborative governance structure and benefit-sharing mechanisms.",
        status: "completed",
        completedDate: "2024-08-20",
        verifications: [
          { verified: true, verifier: "Indigenous Council", comment: "Agreement signed and ratified by all communities" },
          { verified: true, verifier: "Legal Team", comment: "All documentation in order" },
        ]
      },
      {
        title: "Native Seedling Production",
        description: "Established 2 community-run nurseries producing 500,000 native tree seedlings from 45 different species.",
        status: "completed",
        completedDate: "2024-10-10",
        image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3b27fd7-e463-4f93-875a-0174c4e6eb9e/hands%20holding%20aplingdreamstime_xxl_38295437%20(1).jpg?auto=compress%2Cformat",
        verifications: [
          { verified: true, verifier: "Botanist", comment: "Excellent seedling quality and species diversity" },
        ]
      },
      {
        title: "Planting Campaign - 400 Hectares",
        description: "Community-led planting of 200,000 trees across 400 hectares of degraded land, with GPS monitoring of all planting sites.",
        status: "completed",
        completedDate: "2024-11-30",
        verifications: [
          { verified: true, verifier: "Field Coordinator", comment: "Target exceeded: 425 hectares planted" },
          { verified: true, verifier: "Remote Sensing Team", comment: "Satellite imagery confirms coverage" },
        ]
      },
    ]
  },
  {
    // Regenerative Agriculture project
    pathway: oneEarthFramework.pillars[2].subPillars[0].pathways[0],
    project: {
      name: "Regenerative Agroforestry - Guatemala Highlands",
      description: "Supporting 200 smallholder coffee farmers to transition to agroforestry systems, integrating native shade trees and improving soil health.",
      image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/69656b16-dc30-447e-8393-058f51102d04/shared%20forest%20system%20agroforestry%20dreamstime_xxl_270798972%20(1).jpg?auto=compress%2Cformat",
      region: "Central America",
      budget: 300000,
    },
    milestones: [
      {
        title: "Farmer Training Program Launch",
        description: "Launched 6-month training program on agroforestry techniques, soil management, and organic pest control for 200 participating farmers.",
        status: "completed",
        completedDate: "2024-09-01",
        verifications: [
          { verified: true, verifier: "Agricultural Extension Agent", comment: "95% attendance rate across all sessions" },
        ]
      },
      {
        title: "Shade Tree Distribution",
        description: "Distributed 15,000 native shade trees (including nitrogen-fixing species) to participating farms. Trees provide shade for coffee, improve soil, and increase biodiversity.",
        status: "completed",
        completedDate: "2024-10-20",
        image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/69656b16-dc30-447e-8393-058f51102d04/shared%20forest%20system%20agroforestry%20dreamstime_xxl_270798972%20(1).jpg?auto=compress%2Cformat",
        verifications: [
          { verified: true, verifier: "Project Agronomist", comment: "All farms received trees, planting in progress" },
          { verified: true, verifier: "Monitoring Team", comment: "85% survival rate after first month" },
        ]
      },
      {
        title: "Organic Certification Process",
        description: "Supporting 150 farmers through organic certification process to access premium markets for their agroforestry coffee.",
        status: "in-progress",
        targetDate: "2025-03-01",
        verifications: [
          { verified: false, verifier: "Certification Coordinator", comment: "50 farmers submitted initial applications" },
        ]
      },
    ]
  },
  {
    // Marine Protected Area project
    pathway: oneEarthFramework.pillars[1].subPillars[1].pathways[0],
    project: {
      name: "Coral Triangle Marine Protected Area",
      description: "Establishing and managing 50,000 hectares of marine protected area in the Coral Triangle region, working with local fishing communities.",
      image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/88cfb686-ab4a-46fc-8720-545741d3faff/Great%20Barrier%20Reef.%20Heart%20Reef.%20Whitsundays.%20Queensland%20Australia%20shutterstock_1597510444.jpg?auto=compress%2Cformat",
      region: "Southeast Asia",
      budget: 900000,
    },
    milestones: [
      {
        title: "Marine Ecosystem Baseline Survey",
        description: "Completed comprehensive underwater surveys documenting coral cover, fish populations, and key species across proposed MPA zones.",
        status: "completed",
        completedDate: "2024-08-30",
        verifications: [
          { verified: true, verifier: "Marine Biologist", comment: "Identified 320 fish species and 45 coral species" },
          { verified: true, verifier: "Research Coordinator", comment: "Baseline data collected for all zones" },
        ]
      },
      {
        title: "Community Fisheries Management Agreement",
        description: "Negotiated co-management agreement with 12 fishing communities establishing no-take zones, seasonal closures, and sustainable fishing practices.",
        status: "completed",
        completedDate: "2024-10-15",
        verifications: [
          { verified: true, verifier: "Community Representatives", comment: "Agreement ratified by all 12 communities" },
        ]
      },
      {
        title: "Patrol Boat & Monitoring System",
        description: "Deployed 4 patrol boats and installed GPS-based vessel monitoring system to enforce MPA regulations and support sustainable fishing.",
        status: "in-progress",
        targetDate: "2025-02-01",
        image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/88cfb686-ab4a-46fc-8720-545741d3faff/Great%20Barrier%20Reef.%20Heart%20Reef.%20Whitsundays.%20Queensland%20Australia%20shutterstock_1597510444.jpg?auto=compress%2Cformat",
        verifications: [
          { verified: false, verifier: "Operations Manager", comment: "2 boats deployed, 2 in final preparation" },
        ]
      },
    ]
  },
  {
    // Electric Vehicles project
    pathway: oneEarthFramework.pillars[0].subPillars[2].pathways[0],
    project: {
      name: "Electric Bus Transit System - Nairobi",
      description: "Launching fleet of 50 electric buses and charging infrastructure to provide clean public transportation in Nairobi, reducing emissions and air pollution.",
      image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/55914c00-b8fd-400b-afc3-6e9d16212968/Electric%20Vehicle%20charging%20station%20system%20storing%20power%20on%20white%20modern%20car.%20EV%20fuel%20for%20advanced%20hybrid%20car.%20automobile%20industry%20new%20technology%2C%20clean%20energy%2C%20or%20environmental%20conservation%20concept%20dreamstime_xxl_114496245%20(1).jpg?auto=compress%2Cformat",
      region: "East Africa",
      budget: 12000000,
    },
    milestones: [
      {
        title: "Charging Station Infrastructure",
        description: "Installed 10 high-capacity charging stations at strategic locations, powered by grid + solar hybrid system.",
        status: "completed",
        completedDate: "2024-09-30",
        verifications: [
          { verified: true, verifier: "Electrical Engineer", comment: "All stations tested and grid-connected" },
          { verified: true, verifier: "Solar Integration Team", comment: "Solar panels operational, 30% of charging energy from solar" },
        ]
      },
      {
        title: "Electric Bus Fleet Deployment - Phase 1",
        description: "Deployed first 25 electric buses on 5 high-traffic routes, replacing diesel buses and reducing emissions.",
        status: "completed",
        completedDate: "2024-11-15",
        image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/45d9d6c3-d308-428b-b715-fe1586e1c5ca/Chinese%20electric%20train%20cut%20across%20railway%20station%20dreamstime_xxl_17824938%20(1).jpg?auto=compress%2Cformat",
        verifications: [
          { verified: true, verifier: "Fleet Manager", comment: "All 25 buses operational, 98% uptime" },
          { verified: true, verifier: "Environmental Monitor", comment: "Estimated 450 tons CO2 reduction in first month" },
        ]
      },
      {
        title: "Driver Training & Job Creation",
        description: "Trained 75 drivers on electric bus operation and hired 100 local staff for charging station operations and maintenance.",
        status: "completed",
        completedDate: "2024-11-01",
        verifications: [
          { verified: true, verifier: "HR Manager", comment: "All positions filled, 40% women hired" },
        ]
      },
    ]
  },
];

async function main() {
  // Use hardhat accounts for different roles
  const accounts = [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // Account #0 - Project Creator
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", // Account #1 - Verifier 1
    "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a", // Account #2 - Verifier 2
  ];

  const projectOwner = privateKeyToAccount(accounts[0] as `0x${string}`);
  const verifier1 = privateKeyToAccount(accounts[1] as `0x${string}`);
  const verifier2 = privateKeyToAccount(accounts[2] as `0x${string}`);

  console.log("🌱 Seeding projects with accounts:");
  console.log("  Project Owner:", projectOwner.address);
  console.log("  Verifier 1:", verifier1.address);
  console.log("  Verifier 2:", verifier2.address);

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

  // Initialize SDK
  const sdk = new HypercertsSDK(ownerWallet);
  const sdk1 = new HypercertsSDK(verifier1Wallet);
  const sdk2 = new HypercertsSDK(verifier2Wallet);

  if (!sdk.test?.token) {
    throw new Error("TestToken address not found in SDK. Make sure contracts are deployed first.");
  }

  const tokenAddress = sdk.test.token;
  console.log("Using token address:", tokenAddress);

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

    // Create milestone attestations
    for (let j = 0; j < milestones.length; j++) {
      const milestone = milestones[j];
      console.log(`\n  📌 Milestone ${j + 1}/${milestones.length}: ${milestone.title}`);

      // Small delay to ensure transactions are processed
      await new Promise(resolve => setTimeout(resolve, 1000));

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

      // Create evaluation/verification attestations
      for (let k = 0; k < milestone.verifications.length; k++) {
        const verification = milestone.verifications[k];
        
        // Alternate between verifiers
        const verifierSDK = k % 2 === 0 ? sdk1 : sdk2;
        const verifierAccount = k % 2 === 0 ? verifier1.address : verifier2.address;

        console.log(`    🔍 Creating evaluation by ${verification.verifier}...`);

        // Small delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
          await verifierSDK.cert.create({
            recipient: vaultAddress,
            refUID: milestoneAttestationUID,
            visibility: "published",
            data: {
              type: "verification",
              metadata: {
                title: verification.verified 
                  ? `✅ Verified: ${milestone.title}` 
                  : `⚠️ Under Review: ${milestone.title}`,
                description: verification.comment,
                verified: verification.verified,
                verifier: verification.verifier,
                verifierAddress: verifierAccount,
                refAttestationId: milestoneAttestationUID,
              },
            },
          });

          console.log(`      ✅ Evaluation created by ${verification.verifier} (${verification.verified ? 'VERIFIED' : 'UNDER REVIEW'})`);
        } catch (error) {
          console.error(`      ❌ Failed to create evaluation:`, error);
        }
      }
    }

    console.log(`\n  ✨ Project ${i + 1} complete!\n`);
  }

  console.log("\n" + "=".repeat(80));
  console.log("📊 SEEDING SUMMARY");
  console.log("=".repeat(80));
  console.log(`✅ Projects created: ${projectTemplates.length}`);
  console.log(`✅ Total milestones: ${projectTemplates.reduce((sum, t) => sum + t.milestones.length, 0)}`);
  console.log(`✅ Total evaluations: ${projectTemplates.reduce((sum, t) => sum + t.milestones.reduce((mSum, m) => mSum + m.verifications.length, 0), 0)}`);
  console.log("\n🎉 Project seeding completed successfully!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

