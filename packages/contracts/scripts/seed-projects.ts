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
            description: `## Community Engagement - Northern Region

Successfully engaged with 5 communities across the Northern region of Kenya between July and August 2024. This work included:

### Activities Completed
- **Community Meetings**: Held 15 community meetings with 450+ participants
- **Site Assessments**: Conducted technical assessments at 5 locations
- **Solar Irradiance Studies**: Collected 3 months of solar data at each site
- **Infrastructure Surveys**: Mapped existing electrical infrastructure

### Key Outcomes
- ✅ All communities expressed strong support for the project
- ✅ Identified optimal locations for solar installations
- ✅ Established local project committees in each community
- ✅ Confirmed grid connection points and backup requirements

### Technical Findings
Average solar irradiance across sites: **5.8 kWh/m²/day** - excellent for PV systems. All sites have adequate space and structural integrity for installations.`,
            image:
              "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
            verifications: [
              {
                verified: true,
                verifier: "Technical Lead",
                comment: `## Verification Report - Northern Communities

I have thoroughly reviewed all documentation and site assessments for the 5 northern communities. The work completed meets all technical and community engagement standards.

### Verification Details
- **Sites Verified**: All 5 locations (Marsabit, Isiolo, Moyale, Wajir, Mandera)
- **Documentation Reviewed**: Complete site reports, community meeting minutes, solar data
- **Physical Inspections**: Visited all 5 sites personally

### Technical Assessment
Each site demonstrates excellent potential:
- Solar irradiance data shows consistent 5.6-6.1 kWh/m²/day
- Structural assessments confirm adequate foundations
- Grid connection points identified and verified with local utility
- Battery storage locations planned and approved

### Community Engagement Quality
The community consultation process was exemplary:
- High attendance rates (avg 90 participants per meeting)
- Strong leadership buy-in from local chiefs and elders
- Local committees established with clear roles
- Training needs assessment completed

✅ **Recommendation**: Approve for Phase 1 installation`,
                image:
                  "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
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
            description: `## Community Engagement - Southern Region

Completed comprehensive community consultations across 5 southern communities in August-September 2024.

### Consultation Process
- **Total Participants**: 520+ community members
- **Meetings Held**: 18 consultation sessions
- **Site Visits**: Conducted with community representatives
- **Feedback Sessions**: 5 follow-up sessions to address concerns

### Community Priorities Identified
1. **Reliable Electricity**: Priority for healthcare and education facilities
2. **Economic Development**: Interest in using power for small businesses
3. **Maintenance Training**: Strong interest in local job creation
4. **Environmental Benefits**: Enthusiasm for clean energy transition

### Agreed Implementation Plan
- Community committees established with gender balance
- Local procurement preferences for construction materials
- Training programs designed with community input
- Monthly reporting and feedback mechanisms established`,
            image:
              "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
            verifications: [
              {
                verified: true,
                verifier: "Community Liaison",
                comment: `## Community Verification Report - Southern Region

As the Community Liaison Officer, I verify that the consultation process in the southern region was conducted with integrity and achieved meaningful community buy-in.

### Engagement Quality Metrics
- **Participation Rate**: 89% of targeted households represented
- **Women's Participation**: 45% (exceeding 40% target)
- **Youth Involvement**: 30 young people trained as community mobilizers
- **Minority Groups**: Active inclusion of minority communities

### Key Achievements
✅ **Consensus Building**: All 5 communities reached unanimous support decisions  
✅ **Local Leadership**: Strong backing from traditional and administrative leaders  
✅ **Gender Inclusion**: Women's groups actively involved in planning  
✅ **Transparency**: All meeting minutes publicly shared in local languages

### Community Readiness
The communities are well-prepared for project implementation:
- Clear understanding of project scope and timeline
- Realistic expectations about benefits and responsibilities
- Commitment to long-term participation and maintenance
- Strong social cohesion around project goals

**Status**: Communities ready to proceed with installation phase.`,
                image:
                  "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
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
            description: `## Solar Installation - First 2 Communities

Successfully completed solar PV installation for the first two communities (Marsabit and Isiolo) with full battery backup systems.

### Installation Specifications
- **Total Capacity**: 100kW (50kW per community)
- **Solar Panels**: 320 high-efficiency monocrystalline panels (315W each)
- **Battery Storage**: 400kWh lithium-ion battery banks (200kWh per site)
- **Inverters**: 6 x 20kW hybrid solar inverters
- **Backup Duration**: 24-48 hours without sun

### Technical Features
- **Grid Connection**: Bidirectional meters for net metering
- **Monitoring**: Real-time IoT monitoring with cloud dashboard
- **Safety Systems**: Automatic disconnect, surge protection, fire suppression
- **Warranty**: 25-year panel warranty, 10-year battery warranty

### Installation Timeline
- **Site Preparation**: September 1-15, 2024
- **Panel Installation**: September 16-25, 2024
- **Electrical Work**: September 26-30, 2024
- **Testing & Commissioning**: October 1-7, 2024
- **Community Handover**: October 8, 2024

### Performance Metrics
- Peak generation: **85-92 kW** during optimal sunlight
- Average daily generation: **450 kWh**
- System efficiency: **18.2%**
- Grid export: **~15% of generation** (when battery full)`,
            image:
              "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
            verifications: [
              {
                verified: true,
                verifier: "Engineering Team",
                comment: `## Engineering Verification - Communities 1 & 2

I have completed comprehensive testing and verification of the solar installations at Marsabit and Isiolo communities.

### Installation Quality Assessment
✅ **Panel Installation**: All 160 panels properly mounted with optimal tilt angles (15° for latitude)  
✅ **Structural Integrity**: Mounting systems exceed wind load requirements (180 km/h)  
✅ **Electrical Work**: All wiring compliant with IEC 62446 standards  
✅ **Battery Systems**: Proper ventilation, temperature control, and BMS configuration

### Performance Testing Results
Conducted 7 days of intensive testing (Oct 1-7, 2024):

**Marsabit Site:**
- Daily generation: 220-235 kWh (weather dependent)
- Peak power: 46.2 kW
- Battery efficiency: 94.5% round-trip
- System uptime: **99.8%**

**Isiolo Site:**
- Daily generation: 215-230 kWh
- Peak power: 45.8 kW
- Battery efficiency: 95.1% round-trip
- System uptime: **99.9%**

### Safety Verification
- ✅ All emergency shutoff systems tested and operational
- ✅ Fire suppression systems armed and tested
- ✅ Lightning protection verified
- ✅ Ground fault detection working properly
- ✅ Anti-islanding protection confirmed

### Community Training Completed
- 12 community members trained on basic operations
- 4 technicians trained on maintenance procedures
- Emergency contact procedures established
- Monitoring dashboard access provided

**Overall Assessment**: Systems exceed all specifications and ready for full operation. Recommend proceeding with remaining 3 communities.`,
                image:
                  "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
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
            description: `## Solar Installation - Remaining 3 Communities

Completed solar PV installations for Moyale, Wajir, and Mandera communities with enhanced battery backup and monitoring systems.

### Installation Summary
- **Total Capacity**: 150kW (50kW per community)
- **Solar Panels**: 480 high-efficiency monocrystalline panels
- **Battery Storage**: 600kWh total (200kWh per site)
- **Smart Monitoring**: Advanced ML-based predictive maintenance
- **Community Buildings**: 15 buildings connected across 3 sites

### Enhanced Features
Based on lessons from first 2 installations, we added:
- **Predictive Maintenance**: AI algorithms predict component failures
- **Mobile App**: Community members can track energy usage in real-time
- **Microgrid Control**: Intelligent load balancing across community buildings
- **Solar Water Pumping**: Integrated water pumps for 3 community wells

### Installation Timeline
- **October 8-28, 2024**: Parallel installation across all 3 sites
- **October 29-31, 2024**: System integration and testing
- **November 1, 2024**: Official commissioning ceremony

### Community Impact
- **Households Connected**: 380 households now have reliable electricity
- **Businesses Powered**: 45 small businesses (shops, workshops, phone charging)
- **Public Services**: 6 health clinics, 9 schools, 3 community centers
- **Job Creation**: 18 local technicians hired for ongoing maintenance

### Performance Highlights
- Total daily generation: **~700 kWh** across 3 sites
- Peak combined output: **138 kW**
- Average system efficiency: **18.5%**
- Community satisfaction score: **9.2/10**`,
            image:
              "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
            verifications: [
              {
                verified: true,
                verifier: "Engineering Team",
                comment: `## Final Engineering Verification - Communities 3, 4 & 5

Comprehensive verification completed for Moyale, Wajir, and Mandera solar installations. All systems operational and performing above expectations.

### Technical Verification Summary

**Moyale Site (Community 3):**
- Capacity: 50.2 kW (measured at STC)
- Daily avg: 235 kWh
- Battery: 200kWh, 95.3% efficiency
- Status: ✅ **Fully Operational**

**Wajir Site (Community 4):**
- Capacity: 49.8 kW (measured at STC)
- Daily avg: 228 kWh
- Battery: 200kWh, 94.8% efficiency
- Status: ✅ **Fully Operational**

**Mandera Site (Community 5):**
- Capacity: 50.1 kW (measured at STC)
- Daily avg: 232 kWh
- Battery: 200kWh, 95.0% efficiency
- Status: ✅ **Fully Operational**

### Quality Standards Met
All installations meet or exceed:
- ✅ IEC 61730 (Solar panel safety)
- ✅ IEC 62446 (Grid-connected PV systems)
- ✅ ISO 9001 (Quality management)
- ✅ Local electrical codes and regulations

### Advanced Features Testing
Successfully tested all enhanced features:
- **ML Predictive Maintenance**: Algorithms trained and running
- **Mobile App**: 156 downloads, 4.8★ rating
- **Microgrid Load Balancing**: Reducing peak loads by 15-20%
- **Solar Water Pumps**: Pumping 15,000L/day across 3 wells

### Long-term Performance Projections
Based on first month of data:
- Expected annual generation: **425 MWh** (all 5 sites)
- CO₂ emissions avoided: **~300 tons/year**
- Diesel offset: **~120,000 liters/year**
- Financial savings: **~$85,000/year** for communities

### Maintenance Plan Activated
- Monthly inspections scheduled
- Spare parts inventory established
- 24/7 remote monitoring active
- Local technician team trained and certified

**Final Recommendation**: Project Phase 1 complete and exceeds all targets. Ready to proceed with Phase 2 (remaining 5 communities).`,
                image:
                  "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
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
            description: `## Reforestation Phase 1 - 200 Hectares

Successfully completed first phase of Amazon reforestation with Indigenous community partners, planting 100,000 native tree seedlings across 200 hectares of degraded rainforest land.

### Planting Campaign Details
- **Duration**: October 15 - November 15, 2024
- **Location**: Degraded areas adjacent to primary forest (optimal for natural regeneration)
- **Species Planted**: 45 native species including Brazil nut, mahogany, açaí palm, rubber tree
- **Planting Density**: 500 trees/hectare (optimal for rainforest restoration)
- **Community Workers**: 120 Indigenous community members employed

### Species Diversity Strategy
Our planting followed natural forest composition:
- **Canopy Layer (30%)**: Slow-growing hardwoods (Brazil nut, mahogany, cedar)
- **Mid-Story (40%)**: Medium-height trees providing structure
- **Understory (20%)**: Shade-tolerant species and palms
- **Pioneer Species (10%)**: Fast-growing trees to establish forest structure

### GPS Tracking & Monitoring
Every planting site geo-referenced with precision:
- **Total Planting Points**: 100,000+ GPS coordinates recorded
- **Grid System**: 10m × 10m planting grid for optimal spacing
- **Quality Control**: Random verification of 500+ planting sites
- **Mobile App**: Field teams used custom app for real-time data collection

### Community Benefits
- **Employment**: 120 jobs × 30 days = 3,600 person-days of work
- **Traditional Knowledge**: Elder guidance on species selection and placement
- **Capacity Building**: Training in restoration techniques for 45 young people
- **Cultural Connection**: Strengthened community ties to ancestral lands

### Survival Strategy
To ensure high survival rates:
- Planted during optimal rainy season
- Mulching around each seedling
- Natural pest deterrents from traditional knowledge
- Follow-up watering for first 3 months
- Wildlife corridors maintained for seed dispersers`,
            image:
              "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3b27fd7-e463-4f93-875a-0174c4e6eb9e/hands%20holding%20aplingdreamstime_xxl_38295437%20(1).jpg?auto=compress%2Cformat",
            verifications: [
              {
                verified: true,
                verifier: "Field Coordinator",
                comment: `## Field Verification Report - Phase 1 Planting

I conducted extensive field verification of the Phase 1 planting campaign across all 200 hectares. The work quality and documentation exceed our expectations.

### Verification Methodology
- **Field Visits**: Visited 25 of 200 hectares (12.5% sample rate)
- **GPS Validation**: Cross-checked 500+ random GPS points against field conditions
- **Species Verification**: Confirmed species identity at 100+ planting sites
- **Community Interviews**: Spoke with 30+ community planters about process
- **Photo Documentation**: Collected 200+ field photos

### Planting Quality Assessment
✅ **Planting Technique**: Excellent - proper hole depth, mulching, and spacing  
✅ **Species Distribution**: Matches planned diversity (45 species confirmed)  
✅ **GPS Accuracy**: 98.5% of checked coordinates within 3m of actual planting  
✅ **Seedling Health**: 96% of observed seedlings healthy and properly established

### Coverage Analysis
Using GPS data and field verification:
- **Total Area**: 203.2 hectares (exceeded 200 ha target by 1.6%)
- **Tree Count**: 101,600 trees planted (1.6% over target)
- **Density**: Average 500 trees/ha (meets specification)
- **Coverage**: No gaps >20m² detected in degraded areas

### Indigenous Partnership Assessment
The collaboration with Indigenous communities was exemplary:
- Strong attendance and work quality throughout campaign
- Elder knowledge integrated effectively (especially species placement)
- Youth leadership emergence (15 young coordinators trained)
- Cultural protocols respected (spiritual ceremonies at key sites)
- Fair payment and working conditions maintained

### Early Survival Indicators
Three-week follow-up assessment (preliminary):
- **Visible Survival Rate**: 94% (excellent for this early stage)
- **Growth Observed**: Many seedlings showing new leaf growth
- **Pest Damage**: Minimal (<2% showing significant damage)
- **Water Stress**: Low (rainy season providing good conditions)

### Data Quality
The GPS and documentation quality is exceptional:
- All 100,000+ trees geo-referenced with species tags
- Real-time data upload prevented errors and duplications
- Photos linked to GPS points provide visual verification
- Quality control protocols consistently followed

**Overall Assessment**: Phase 1 demonstrates excellence in execution, documentation, and community partnership. Data quality and planting technique position the project for long-term success.

**Recommendation**: Approve and proceed immediately with Phase 2.`,
                image:
                  "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3b27fd7-e463-4f93-875a-0174c4e6eb9e/hands%20holding%20aplingdreamstime_xxl_38295437%20(1).jpg?auto=compress%2Cformat",
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
            description: `## Reforestation Phase 2 - 225 Hectares (Target Exceeded!)

Completed second phase of Amazon restoration, exceeding our target by 25 hectares. Planted 100,000+ additional native trees, bringing total restored area to 425+ hectares.

### Phase 2 Achievements
- **Area Restored**: 225 hectares (target was 200 ha)
- **Trees Planted**: 112,500 trees (12.5% over target)
- **Planting Period**: November 16-30, 2024 (optimal rainy season)
- **Community Engagement**: 150 workers (30 more than Phase 1)

### Why We Exceeded the Target
The communities were so motivated and efficient that we had:
- **Extra Seedlings**: Nurseries produced 12% more viable seedlings than planned
- **Additional Funding**: Community-led crowdfunding raised extra $15,000
- **Faster Progress**: Improved techniques from Phase 1 increased efficiency
- **Strategic Opportunity**: Identified 25 additional degraded hectares connecting two forest fragments

### Enhanced Planting Strategy
Building on Phase 1 lessons learned:
- **Wildlife Corridors**: Created 5 continuous corridors (3-5 hectares each) connecting forest fragments
- **Seed Trees**: Strategically placed fruit trees for wildlife attraction
- **Water Features**: Protected 8 small streams within planting areas
- **Enrichment Planting**: Added rare/endangered species (200 individuals of 5 threatened species)

### Biodiversity Highlights
Increased focus on threatened species:
- **Mahogany** (Swietenia macrophylla): 500 trees
- **Brazil Nut** (Bertholletia excelsa): 800 trees  
- **Rosewood** (Dalbergia spruceana): 200 trees
- **Açaí Palm** (Euterpe oleracea): 1,500 palms
- **Kapok** (Ceiba pentandra): 150 trees

### Community Impact - Phase 2
- **Total Employment**: 150 workers × 15 days = 2,250 person-days
- **Women's Participation**: 45% of workforce (up from 30% in Phase 1)
- **Youth Training**: 20 young people trained as restoration technicians
- **Traditional Practices**: 12 elders led cultural ceremonies and knowledge sharing
- **Economic Benefit**: $112,500 in direct wages to Indigenous communities

### Long-term Monitoring Setup
Established comprehensive monitoring system:
- **Permanent Plots**: 20 monitoring plots (0.25 ha each) across both phases
- **Photo Points**: 50 fixed photo stations for annual comparison
- **Community Monitors**: Trained 10 community members as long-term monitors
- **Camera Traps**: 15 wildlife cameras installed to track forest recovery

### Connection to Uncontacted Territories
The 425 hectares now form a restored buffer zone protecting territories of uncontacted Indigenous peoples, reducing encroachment pressure and strengthening forest connectivity.`,
            image:
              "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3b27fd7-e463-4f93-875a-0174c4e6eb9e/hands%20holding%20aplingdreamstime_xxl_38295437%20(1).jpg?auto=compress%2Cformat",
            verifications: [
              {
                verified: true,
                verifier: "Field Coordinator",
                comment: `## Field Verification - Phase 2 Final Report

Completed comprehensive field verification of Phase 2 planting. The work not only met targets but exceeded them significantly, with exceptional quality maintained throughout.

### Coverage Verification
- **Target**: 200 hectares
- **Achieved**: 225.3 hectares (**+12.6% over target**)
- **Trees Planted**: 112,650 trees verified via GPS
- **Verification Sample**: 30 hectares physically inspected (13.3%)

### Quality Metrics - Phase 2
✅ **Planting Quality**: Excellent - consistent with Phase 1 standards  
✅ **Species Mix**: 45 species + 5 additional threatened species  
✅ **GPS Accuracy**: 99.1% (improved from Phase 1's 98.5%)  
✅ **Seedling Health**: 97% healthy establishment rate  
✅ **Corridor Connectivity**: All 5 wildlife corridors successfully established

### Enhanced Documentation
Phase 2 showed improved systems:
- Real-time GPS tracking with 99%+ uptime
- Every tree photographed at planting (sample-based)
- Species verification by Indigenous botanical experts
- Integration with satellite monitoring system

### Wildlife Corridor Assessment
The 5 corridors (totaling 18 hectares) are strategically placed:
- **Corridor A**: 4.2 ha - connects to primary forest on north side
- **Corridor B**: 3.8 ha - links to stream ecosystem
- **Corridor C**: 3.5 ha - bridges to neighboring restoration project
- **Corridor D**: 3.7 ha - connects to protected uncontacted territory
- **Corridor E**: 2.8 ha - links two large forest fragments

Early signs of wildlife use already observed: jaguar tracks, tapir scat, and bird nesting activity.

### Community Partnership Strengthened
Phase 2 demonstrated growing community leadership:
- Indigenous coordinators managed daily operations
- Women's participation increased to 45% of workforce
- Youth took on more responsibility (20 trainee technicians)
- Traditional ecological knowledge increasingly integrated
- Community pride and ownership highly visible

**Overall Assessment**: Phase 2 represents exceptional achievement. By exceeding targets while maintaining quality and deepening community partnership, the project sets new standards for Amazon restoration.`,
                image:
                  "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3b27fd7-e463-4f93-875a-0174c4e6eb9e/hands%20holding%20aplingdreamstime_xxl_38295437%20(1).jpg?auto=compress%2Cformat",
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
                comment: `## Satellite Verification - Complete Project Assessment

Using high-resolution satellite imagery and remote sensing analysis, I have verified the complete 425+ hectare restoration area across both Phase 1 and Phase 2.

### Satellite Analysis Methodology
- **Imagery Sources**: Sentinel-2 (10m), Planet Labs (3m), drone orthomosaics (0.1m)
- **Temporal Coverage**: Pre-planting (Aug 2024) vs. Post-planting (Dec 2024)
- **Analysis Methods**: NDVI time-series, canopy cover change detection, precision mapping
- **Validation**: Ground-truthing with GPS data and field photos

### Total Coverage Verified
**Phase 1 + Phase 2 Combined:**
- **Total Area**: **428.5 hectares** (target was 400 ha - **+7.1% achievement**)
- **Continuous Coverage**: 94% of area shows consistent planting signature
- **Gap Analysis**: Only 6% gaps, mostly due to streams, rocks (appropriate)
- **Tree Count Validation**: GPS data shows 214,150+ trees (matches density targets)

### Vegetation Index Changes
Comparing pre/post imagery shows clear restoration signature:

**August 2024 (Pre-Planting):**
- NDVI Mean: 0.22 (degraded/bare soil)
- Canopy Cover: <5%
- Biomass: ~2 tons/ha

**December 2024 (Post-Planting):**
- NDVI Mean: 0.41 (establishing vegetation)
- Canopy Cover: 15-20% (seedlings establishing)
- Biomass: ~8 tons/ha (rapid establishment)

These changes confirm successful planting and early establishment.

### Corridor Connectivity Analysis
Using landscape connectivity modeling:
- **Forest Fragmentation**: Reduced by 18% in project area
- **Corridor Effectiveness**: All 5 corridors provide structural connectivity
- **Least-Cost Paths**: Wildlife movement costs reduced by 25-30%
- **Buffer Zone**: Creates 428 ha buffer protecting uncontacted territories

### Comparison to Reference Sites
Compared to 5 natural regeneration reference sites nearby:
- Our planting density: **500 trees/ha** (optimal)
- Natural regeneration: **200-300 trees/ha** (slower)
- Species diversity: **45 species** (higher than natural regen at this stage)
- **Estimated time savings**: 10-15 years faster than natural regeneration alone

### Before/After Visual Analysis
Processed hundreds of field photos and drone imagery:
- Clear transformation from degraded land to young forest
- Consistent planting patterns visible across all 428 hectares
- Natural landscape features (streams, rock outcrops) appropriately preserved
- No signs of encroachment or damage in planted areas

### Long-term Monitoring Baseline
Established satellite monitoring baseline:
- Quarterly Sentinel-2 analysis scheduled
- Annual high-resolution imagery (Planet/drone)
- Automated change detection alerts
- 10-year monitoring protocol activated

### Carbon Sequestration Projections
Based on species mix and satellite-verified establishment:
- **Year 1-5**: ~3 tons CO₂/ha/year
- **Year 6-15**: ~10 tons CO₂/ha/year
- **Year 16-30**: ~15 tons CO₂/ha/year
- **30-year total**: ~6,000 tons CO₂ sequestered (428 ha × ~14 tons average)

### Independent Verification
All satellite analysis data and methods are:
- ✅ Published in project database (fully transparent)
- ✅ Available for independent verification
- ✅ Compliant with international restoration standards (IUCN, WRI)
- ✅ Integrated with global forest monitoring platforms

**Final Assessment**: Satellite data provides independent confirmation that 428.5 hectares of degraded Amazon rainforest have been successfully planted with 214,000+ native trees. The restoration shows all signs of successful early establishment and exceeds project targets by 7%.

**Recommendation**: Continue with annual monitoring. Project is on trajectory for full forest recovery within 15-20 years.`,
                image:
                  "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3b27fd7-e463-4f93-875a-0174c4e6eb9e/hands%20holding%20aplingdreamstime_xxl_38295437%20(1).jpg?auto=compress%2Cformat",
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
            description: `## Electric Bus Deployment - Routes A & B (First 10 Buses)

Successfully deployed and operationalized the first 10 electric buses on Routes A and B, marking the beginning of Nairobi's electric public transit revolution.

### Deployment Details
- **Routes Launched**: Route A (City Center - Eastlands) and Route B (CBD - Westlands)
- **Fleet Size**: 10 buses (12-meter, 80-passenger capacity each)
- **Deployment Date**: November 5-10, 2024
- **Launch Event**: Public ceremony attended by 2,000+ citizens

### Bus Specifications
Each electric bus features:
- **Battery**: 350 kWh lithium-ion (BYD technology)
- **Range**: 280-320 km per full charge (sufficient for daily routes)
- **Charging Time**: 2-3 hours at high-capacity stations
- **Passenger Capacity**: 80 (60 seated + 20 standing)
- **Accessibility**: Wheelchair ramps, low-floor design, priority seating
- **Comfort**: Air conditioning, USB charging ports, real-time info displays

### Route Performance - First Month

**Route A (City Center - Eastlands):**
- **Daily Trips**: 18 round trips per bus
- **Passengers**: ~3,200 passengers/day (all 5 buses)
- **Punctuality**: 94% on-time performance
- **Energy Efficiency**: 1.15 kWh/km average
- **Uptime**: 98.2% (exceptional for launch phase)

**Route B (CBD - Westlands):**
- **Daily Trips**: 16 round trips per bus
- **Passengers**: ~2,800 passengers/day (all 5 buses)
- **Punctuality**: 96% on-time performance
- **Energy Efficiency**: 1.10 kWh/km average
- **Uptime**: 98.5%

### Environmental Impact - First Month
Comparing to replaced diesel buses:
- **Diesel Fuel Saved**: ~8,200 liters
- **CO₂ Emissions Avoided**: ~22 tons
- **NOx Reduction**: ~180 kg
- **Particulate Matter**: ~12 kg reduction
- **Noise Reduction**: 60-70 dB (diesel) → 40-45 dB (electric)

### Passenger Satisfaction
Conducted 500+ passenger surveys:
- **Overall Satisfaction**: 92%
- **Comfort**: 95% (AC, smooth ride, quiet)
- **Reliability**: 89% (some teething issues)
- **Cleanliness**: 94%
- **Value for Money**: 87% (same fare as diesel buses)

### Operational Learning
Key insights from first month:
- **Charging Strategy**: Optimized schedule to charge during off-peak hours (cheaper electricity)
- **Driver Adaptation**: Drivers quickly adapted to regenerative braking (extends range by 15%)
- **Maintenance**: Minimal maintenance compared to diesel (no oil changes, fewer parts)
- **Peak Demand**: Buses consistently at capacity during rush hours

### Community Response
Public reception has been overwhelmingly positive:
- Social media mentions: 15,000+ positive comments
- Media coverage: 25+ news articles, 5 TV features
- Political support: Strong backing from city government
- International interest: Delegations from 3 other African cities visited`,
            image:
              "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/45d9d6c3-d308-428b-b715-fe1586e1c5ca/Chinese%20electric%20train%20cut%20across%20railway%20station%20dreamstime_xxl_17824938%20(1).jpg?auto=compress%2Cformat",
            verifications: [
              {
                verified: true,
                verifier: "Fleet Manager",
                comment: `## Fleet Performance Verification - Routes A & B

As Fleet Manager, I'm pleased to report that the first 10 electric buses have exceeded our performance expectations during the critical launch phase.

### Operational Verification
I've monitored the fleet 24/7 since deployment using our real-time telematics system:

**Route A (5 Buses):**
- **Service Reliability**: 98.2% uptime (target was 95%)
- **Energy Efficiency**: 1.15 kWh/km (within spec)
- **Daily Distance**: Averaging 185 km per bus
- **Charging Cycles**: Average 1.2 charges per day
- **Maintenance Events**: Only 3 minor issues (software updates, tire pressure)

**Route B (5 Buses):**
- **Service Reliability**: 98.5% uptime (exceptional)
- **Energy Efficiency**: 1.10 kWh/km (better than Route A due to less traffic)
- **Daily Distance**: Averaging 170 km per bus
- **Charging Cycles**: Average 1.1 charges per day
- **Maintenance Events**: 2 minor issues (cleaning sensors)

### Comparison to Diesel Fleet (Routes A & B Previous Performance)
The electric buses dramatically outperform the diesel buses they replaced:

| Metric | Diesel Buses | Electric Buses | Improvement |
|--------|-------------|----------------|-------------|
| Uptime | 82% | 98.3% | **+16.3%** |
| Fuel/Energy Cost per km | KSh 45 | KSh 18 | **-60%** |
| Maintenance Cost per km | KSh 12 | KSh 3 | **-75%** |
| Breakdowns per month | 8-12 | 0 | **-100%** |
| Passenger Complaints | 45/month | 8/month | **-82%** |

### Charging Infrastructure Performance
All 4 charging stations serving Routes A & B working perfectly:
- **Station A1** (City Center): 99.8% uptime
- **Station A2** (Eastlands): 99.5% uptime
- **Station B1** (CBD): 100% uptime
- **Station B2** (Westlands): 99.2% uptime

Solar hybrid system working as designed:
- **Grid Power**: 65% of charging energy
- **Solar Power**: 35% of charging energy
- **Peak Solar Hours**: Buses charge during midday when solar output highest

### Driver Performance & Training Effectiveness
All 20 drivers (2 per bus, working shifts) are performing excellently:
- ✅ Smooth acceleration/braking techniques mastered
- ✅ Regenerative braking maximized (adding 10-15% range)
- ✅ Pre-trip inspection protocols followed consistently
- ✅ Passenger service excellence maintained
- ✅ Zero safety incidents in first month

### Financial Performance
Operating costs are significantly lower than projected:
- **Energy Cost**: $0.08/km (vs. $0.22/km for diesel)
- **Maintenance**: $0.015/km (vs. $0.065/km for diesel)
- **Driver Efficiency**: 10% higher productivity (fewer refueling stops)
- **Total Savings**: ~$12,000/month for 10 buses vs. diesel equivalent

### Recommendations
✅ **Immediate**: Proceed with Routes C, D, E deployment  
✅ **Short-term**: Consider expanding fleet beyond original 50-bus target  
✅ **Long-term**: Plan for full electric conversion of all city bus routes

**Overall Assessment**: The first 10 electric buses have proven the concept beyond any doubt. Performance, reliability, cost savings, and public acceptance all exceed expectations. This is a transformational success for Nairobi.`,
                image:
                  "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/45d9d6c3-d308-428b-b715-fe1586e1c5ca/Chinese%20electric%20train%20cut%20across%20railway%20station%20dreamstime_xxl_17824938%20(1).jpg?auto=compress%2Cformat",
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
            description: `## Electric Bus Deployment - Routes C, D, E (Remaining 15 Buses)

Completed Phase 1 deployment with 15 additional electric buses across three high-demand routes, bringing total fleet to 25 buses and establishing Nairobi as a leader in African electric transit.

### Deployment Summary
- **Routes**: C (Airport - City), D (South C - CBD), E (Thika Road Corridor)
- **Fleet**: 15 buses (same 12m, 80-passenger model)
- **Deployment Period**: November 12-15, 2024
- **Total Phase 1**: 25 electric buses operational

### Enhanced Features - Learning from Routes A & B
Based on first 10 buses, we added improvements:
- **Advanced Battery Management**: ML algorithms optimize charging to extend battery life
- **Predictive Maintenance**: IoT sensors predict component failures before they occur
- **Enhanced Passenger Info**: Real-time route tracking accessible via SMS (no smartphone needed)
- **Priority Lane Integration**: GPS system triggers traffic signal priority (reduces delays by 8-12%)

### Route Performance - First 2 Weeks

**Route C (Airport - City) - 5 Buses:**
- **Strategic Importance**: First impression for international visitors
- **Daily Passengers**: ~3,800 (high tourist and business traffic)
- **Punctuality**: 97% (excellent for airport route)
- **Luggage Capacity**: Enhanced cargo space for traveler luggage
- **International Recognition**: Featured in 12 international news outlets

**Route D (South C - CBD) - 5 Buses:**
- **Community Focus**: Serves working-class residential area
- **Daily Passengers**: ~3,400
- **Peak Capacity**: Consistently full during morning/evening rush
- **Affordability Impact**: Saves passengers ~$30/month vs. matatus (minibuses)
- **Women's Safety**: 85% of women surveyed feel safer on electric buses (better lighting, cameras)

**Route E (Thika Road Corridor) - 5 Buses:**
- **High-Density Route**: Nairobi's busiest corridor
- **Daily Passengers**: ~4,200 (highest of all routes)
- **Traffic Signal Priority**: Cutting 12 minutes off journey time
- **Air Quality Impact**: Major reduction in one of Nairobi's most polluted corridors
- **Commercial Success**: Standing room only during peak hours

### Combined Fleet Impact (All 25 Buses)

**Environmental Benefits:**
- **Daily Diesel Offset**: ~2,100 liters/day
- **Monthly CO₂ Reduction**: ~450 tons (as projected!)
- **Annual Projection**: ~5,400 tons CO₂ avoided
- **Air Quality**: Measurable PM2.5 reduction along Route E corridor
- **Noise Pollution**: Significant reduction in all route corridors

**Social & Economic Impact:**
- **Daily Passengers**: ~21,000 people (630,000/month)
- **Cost Savings for Commuters**: Average $25-35/month per regular rider
- **Jobs Created**: 75 drivers + 100 support staff (charging, maintenance, cleaning)
- **Women's Employment**: 35% of drivers are women (vs. 5% in traditional matatu industry)
- **Accessibility**: 400+ wheelchair users served monthly

**Operational Excellence:**
- **Fleet Average Uptime**: 98.6% (world-class)
- **Energy Efficiency**: 1.12 kWh/km average across fleet
- **Charging Network**: 10 stations, 99.4% average uptime
- **Solar Integration**: 38% of charging energy from solar
- **Predictive Maintenance**: Catching 95% of issues before failures

### Media & Policy Impact
The project has catalyzed broader change:
- **National EV Policy**: Kenya fast-tracking EV incentives based on this success
- **Other Cities**: Mombasa and Kisumu planning similar programs
- **Investment**: 3 private operators expressing interest in electric fleets
- **International Delegations**: Officials from 8 African countries have visited
- **Climate Finance**: Project showcased at COP29 as best practice

### Passenger Testimonials
Over 2,000 passenger surveys conducted across all routes:

> "This is the Nairobi I want my children to grow up in - clean, quiet, modern." - Margaret K., Route D passenger

> "As a wheelchair user, these buses have given me freedom I never had before." - David M., Route C passenger

> "The air on Thika Road is noticeably cleaner since these buses started. My children's asthma has improved." - Grace W., Route E resident

### Financial Sustainability
The project is exceeding financial projections:
- **Fare Revenue**: On track to recover operating costs in Year 2
- **Government Savings**: Diesel subsidies reduced
- **Carbon Credits**: Generating $85,000/year in voluntary carbon credits
- **Reduced Healthcare**: Estimated $2.5M/year in air pollution health cost savings

### Looking Ahead - Phase 2
Based on Phase 1 success, planning is underway for:
- **25 Additional Buses**: Routes F-J in 2025
- **Depot Expansion**: Building second charging depot
- **Battery Recycling**: Establishing East Africa's first EV battery recycling facility
- **Skills Training**: Technical college program for EV maintenance technicians`,
            image:
              "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/45d9d6c3-d308-428b-b715-fe1586e1c5ca/Chinese%20electric%20train%20cut%20across%20railway%20station%20dreamstime_xxl_17824938%20(1).jpg?auto=compress%2Cformat",
            verifications: [
              {
                verified: true,
                verifier: "Fleet Manager",
                comment: `## Complete Fleet Verification - All 25 Buses Operational

Comprehensive verification completed for entire Phase 1 fleet. All 25 electric buses are operational and performing at or above specifications across all 5 routes.

### Fleet-Wide Performance Summary

**Overall Uptime**: 98.6% (exceeds 95% target)  
**Total Daily Service**: 21,400 passengers  
**Energy Efficiency**: 1.12 kWh/km fleet average  
**Safety Record**: Zero accidents, zero injuries in 1,000+ service hours

### Individual Route Performance

| Route | Buses | Daily Passengers | Uptime | Energy Efficiency |
|-------|-------|-----------------|--------|-------------------|
| A | 5 | 3,200 | 98.2% | 1.15 kWh/km |
| B | 5 | 2,800 | 98.5% | 1.10 kWh/km |
| C | 5 | 3,800 | 99.1% | 1.08 kWh/km |
| D | 5 | 3,400 | 98.8% | 1.14 kWh/km |
| E | 5 | 4,200 | 98.2% | 1.13 kWh/km |

**All routes exceeding targets** ✅

### Advanced Features Performance

**Predictive Maintenance System:**
- Prevented 12 potential failures before they occurred
- Reduced unplanned downtime by 85% vs. baseline
- Saving ~$15,000/month in emergency repairs

**Battery Management System:**
- Extended effective range by 8-12% through optimization
- Battery degradation: <0.5% (excellent for first month)
- Charging efficiency: 94% (better than spec)

**Traffic Signal Priority:**
- Operating on Route E (Thika Road)
- Average time savings: 11 minutes per journey
- Passenger satisfaction increased from 89% to 96%
- Planning rollout to other routes

### Charging Infrastructure Status
All 10 charging stations operating optimally:
- **Total Energy Delivered**: 45,000 kWh in first month
- **Solar Contribution**: 17,100 kWh (38%)
- **Grid Energy**: 27,900 kWh (62%, mostly off-peak hours)
- **Cost per kWh**: $0.07 average (vs. diesel equivalent of $0.22/km)

Each station equipped with:
- Dual 150kW fast chargers
- Solar canopy (50kW average)
- Battery buffer (200kWh per station)
- 24/7 monitoring and automatic alerts

### Driver Excellence Program Results
All 50 drivers (2 per bus) completed enhanced training:
- ✅ Advanced EV operation techniques
- ✅ Customer service excellence
- ✅ Emergency procedures
- ✅ Accessibility awareness

**Driver Performance Metrics:**
- Safety score: 98.5/100 average
- Passenger service ratings: 4.7/5.0 average
- Energy efficiency bonus: 40 drivers earning bonuses for optimal driving
- Zero safety incidents across 15,000+ service hours

### Maintenance Economics
Detailed cost tracking confirms dramatic savings:

**Monthly Maintenance Costs (25 Buses):**
- Electric fleet: $1,875 ($75/bus)
- Equivalent diesel: $8,125 ($325/bus)
- **Savings**: $6,250/month ($75,000/year)

**Cost Breakdown:**
- Tire rotation: $800
- Brake inspection: $300 (minimal wear due to regen braking)
- Software updates: $400
- Cleaning/detailing: $375
- Battery monitoring: $0 (automated)

### Reliability Comparison
Electric buses dramatically more reliable than replaced diesel fleet:

**Mean Distance Between Failures:**
- Diesel buses: 2,800 km
- Electric buses: 45,000+ km (ongoing, no failures yet)
- **Improvement**: 16x more reliable

**Unscheduled Downtime:**
- Diesel: 18% of fleet time
- Electric: 1.4% of fleet time
- **Improvement**: 92% reduction

### Passenger Safety & Comfort
Comprehensive monitoring shows excellence in passenger experience:
- **Safety**: Zero passenger injuries
- **Comfort**: 94% satisfaction (A/C, smooth ride, quiet)
- **Accessibility**: 100% wheelchair access success rate
- **Cleanliness**: 96% satisfaction (daily deep cleaning)
- **Security**: Onboard cameras + GPS tracking = 98% safety perception

### Financial Performance Tracking
Real-time tracking shows strong financial performance:
- **Revenue**: On track (fare collection 99.2% efficient with digital payment)
- **Operating Costs**: 62% below diesel equivalent
- **Energy Costs**: $0.08/km (vs. $0.22/km diesel)
- **ROI Timeline**: Projected 6.5 years (better than 8-year projection)

**Overall Assessment**: The 25-bus Phase 1 deployment is an unqualified success. Every metric—operational, environmental, financial, social—exceeds targets. This provides clear justification for Phase 2 expansion and demonstrates scalability of electric bus transit in African cities.

**Recommendation**: Accelerate Phase 2 procurement and begin planning for city-wide electric bus conversion by 2030.`,
                image:
                  "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/45d9d6c3-d308-428b-b715-fe1586e1c5ca/Chinese%20electric%20train%20cut%20across%20railway%20station%20dreamstime_xxl_17824938%20(1).jpg?auto=compress%2Cformat",
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
                comment: `## Environmental Impact Verification - First Month Results

As Environmental Monitor, I have completed comprehensive analysis of the environmental benefits from the first month of electric bus operations. The results exceed our projections and represent significant progress toward Nairobi's climate goals.

### Emissions Reduction Verification

**CO₂ Emissions Avoided - First Month:**
- **Measured**: 452 tons CO₂e
- **Projected**: 450 tons CO₂e
- **Achievement**: 100.4% of target ✅

**Methodology:**
- Calculated diesel bus baseline from historical data (Route A-E previous 12 months)
- Measured actual electric bus energy consumption via charging station meters
- Applied Kenya grid emission factor (0.41 kg CO₂/kWh)
- Solar energy treated as zero emissions
- Verified calculations with independent auditor

### Air Quality Monitoring Results

Deployed 15 air quality sensors along all 5 routes:

**Particulate Matter (PM2.5) Reductions:**
- **Route A corridor**: -18% PM2.5
- **Route B corridor**: -15% PM2.5
- **Route C corridor**: -12% PM2.5 (lower traffic volume)
- **Route D corridor**: -16% PM2.5
- **Route E corridor**: -22% PM2.5 (highest impact - busiest route)

**Nitrogen Oxides (NOx) Reductions:**
- Average reduction along routes: **-185 kg NOx per month**
- Most significant on Route E (Thika Road): -65 kg NOx

**Particulate Matter (PM10):**
- Average reduction: **-12 kg PM10 per month**
- Health benefit equivalent: ~450 respiratory illness cases avoided/year

### Noise Pollution Assessment

Conducted acoustic monitoring at 20 points along routes:

**Average Noise Levels:**
- Diesel buses: 68-72 dB(A) at 7.5m distance
- Electric buses: 42-46 dB(A) at 7.5m distance
- **Reduction**: 24-26 dB(A) (perceived as 75% quieter)

**Community Impact:**
- Resident surveys show 89% report improved sleep quality (routes pass residential areas)
- School noise levels reduced along Route D (2 schools on route)
- Business districts report calmer, more pleasant environment

### Energy & Carbon Analysis

**Total Energy Consumption (First Month):**
- **Grid electricity**: 27,900 kWh (62%)
- **Solar electricity**: 17,100 kWh (38%)
- **Total**: 45,000 kWh

**Carbon Footprint Comparison:**
- Diesel buses (equivalent service): 622 tons CO₂e
- Electric buses: 170 tons CO₂e (grid + lifecycle emissions)
- **Net Reduction**: 452 tons CO₂e (72.7% reduction)

**Renewable Energy Achievement:**
38% solar contribution exceeds 30% target ✅

### Diesel Fuel Offset

**Fuel Savings - First Month:**
- Diesel avoided: 63,400 liters
- Cost savings: $88,760 (at $1.40/liter)
- Imported fuel avoided: Positive trade balance impact

**Annual Projections:**
- Diesel offset: 760,800 liters/year
- CO₂ avoided: 5,424 tons/year
- Cost savings: $1,065,120/year

### Health Impact Assessment

Collaborated with Nairobi County Health Department:

**Estimated Health Benefits (Annual):**
- Respiratory illnesses avoided: ~450 cases
- Asthma attacks prevented: ~200 cases
- Premature deaths avoided: ~2-3 deaths/year
- Healthcare cost savings: ~$2.5 million/year

**Most Impacted Areas:**
- Route E (Thika Road): Highest air quality improvement
- Route D (South C): Benefits to working-class residential area
- School zones: 8 schools along routes benefit from cleaner air

### Climate Leadership Impact

This project positions Nairobi as climate leader:
- **First** major African city with electric bus fleet at scale
- **Fastest** deployment (25 buses in 30 days)
- **Best** performance metrics (99% uptime, 38% solar)
- **Replicable** model for other African cities

### Long-term Climate Trajectory

**If scaled to full bus fleet (500 buses):**
- Annual CO₂ reduction: ~108,000 tons
- Equivalent to: Planting 1.8 million trees
- Progress toward Nairobi's net-zero 2050 target: Significant

### Verification & Transparency

All data independently verified:
- ✅ Emissions calculations reviewed by Kenya Climate Innovation Center
- ✅ Air quality data validated against government monitoring stations
- ✅ Energy consumption verified via utility company records
- ✅ Health impacts peer-reviewed by public health researchers

Data publicly available:
- Real-time dashboard at electricnairobi.ke
- Monthly reports published
- Raw data available for researchers
- Carbon credits registered and tracked

### Comparison to International Standards

**Performance vs. Global Electric Bus Projects:**
- Uptime: 98.6% (global avg: 95%) ✅
- Solar integration: 38% (global avg: 15%) ✅
- Energy efficiency: 1.12 kWh/km (global avg: 1.3 kWh/km) ✅
- Cost per km: $0.08 (competitive with Chinese cities)

Nairobi's project ranks in **top 10%** globally for electric bus performance.

### Community Air Quality Testimony

Residents living along routes report dramatic changes:

> "I can finally open my windows. Before, the diesel fumes were unbearable. Now the air is clean." - Rose K., Route E resident

> "My daughter's asthma improved significantly since these buses started. Fewer hospital visits." - John M., parent, Route D

> "As a street vendor near the bus stop, I can breathe easier and my goods don't get covered in black soot anymore." - Mary N., Route A vendor

**Final Assessment**: The environmental benefits of the electric bus project are verified, substantial, and exceed targets. First-month results show 452 tons CO₂ avoided, significant air quality improvements, and measurable health benefits. This project sets a new standard for urban transport in Africa.

**Recommendation**: Scale rapidly. Every month of delay is a lost opportunity for health, climate, and quality of life benefits for Nairobi residents.`,
                image:
                  "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/45d9d6c3-d308-428b-b715-fe1586e1c5ca/Chinese%20electric%20train%20cut%20across%20railway%20station%20dreamstime_xxl_17824938%20(1).jpg?auto=compress%2Cformat",
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
