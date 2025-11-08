// one-earth-framework.ts
// Type definitions
export interface SolutionPathway {
  id: string;
  name: string;
  summary: string; // Short summary/overview
  description?: string; // Longer detailed description
  examples?: string[];
  relatedThemes?: string[]; // e.g., ["Gender Equity", "Biodiversity"]
  relatedLevers?: string[]; // e.g., ["Policy & Governance", "Finance"]
}

export interface SolutionSubPillar {
  id: string;
  name: string;
  description: string;
  pathways: SolutionPathway[];
}

export interface Pillar {
  id: string;
  name: string;
  description: string;
  subPillars: SolutionSubPillar[];
}

export interface IntersectionalTheme {
  id: string;
  name: string;
  description: string;
}

export interface LeverOfChange {
  id: string;
  name: string;
  description: string;
}

export interface OneEarthSolutionsFramework {
  pillars: Pillar[];
  intersectionalThemes: IntersectionalTheme[];
  leversOfChange: LeverOfChange[];
  lastUpdated?: string;
}

// Dataset
export const oneEarthFramework: OneEarthSolutionsFramework = {
  lastUpdated: "2025-11-07",
  pillars: [
    {
      id: "energy-transition",
      name: "Energy Transition",
      description:
        "Transform global energy systems away from fossil fuels toward clean, affordable, resilient energy.",
      subPillars: [
        {
          id: "renewable-power",
          name: "Renewable Power",
          description:
            "Clean electricity generation to replace fossil-fuel power.",
          pathways: [
            {
              id: "solar-pv",
              name: "Solar Photovoltaic",
              summary: "Utility, commercial and rooftop solar PV deployments.",
              description:
                "Solar photovoltaic (PV) power utilizes sheets or panels of semiconducting materials capable of capturing photons from the sun and turning them into an electrical current.",
              relatedThemes: ["Energy Access"],
              relatedLevers: ["Policy & Governance", "Finance"],
            },
            {
              id: "solar-thermal",
              name: "Solar Thermoelectric",
              summary:
                "Concentrated solar power / solar thermal for electricity and heat.",
              description:
                "Solar thermoelectric technology utilizes mirrors or lenses to concentrate sunlight onto a small area, generating heat that drives a turbine or heat engine to produce electricity.",
              relatedThemes: ["Energy Resilience"],
              relatedLevers: ["Science & Technology", "Finance"],
            },
            {
              id: "geothermal-power",
              name: "Geothermal Power",
              summary: "Baseload geothermal electricity where resources allow.",
              description:
                "Geothermal power involves harnessing naturally occurring underground heat—typically found in regions near volcanic activity, geysers, or hot springs—to generate steam for powering turbines and producing electricity.",
              relatedThemes: ["Local Jobs"],
              relatedLevers: ["Finance", "Policy & Governance"],
            },
            {
              id: "onshore-wind",
              name: "Onshore Wind",
              summary: "Utility-scale and distributed onshore wind energy.",
              description:
                "Onshore wind power is generated through the use of large wind turbines equipped with long blades that harness the kinetic energy of the wind to drive a connected electric generator.",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Science & Technology"],
            },
            {
              id: "offshore-wind",
              name: "Offshore Wind",
              summary:
                "Coastal and deep-water wind farms for large-scale generation.",
              description:
                "Offshore wind power involves the installation of wind turbines anchored to the sea floor, capitalizing on the consistently higher wind speeds over the ocean and enabling the use of larger turbines, thus enhancing their efficiency compared to onshore counterparts, ultimately generating electricity through the rotation of an electric generator.",
              relatedThemes: ["Ocean Health"],
              relatedLevers: ["Policy & Governance", "Finance"],
            },
            {
              id: "wave-energy",
              name: "Wave Energy",
              summary: "Harnessing wave energy where suitable.",
              description:
                "Wave energy, or ocean power, involves harnessing the kinetic energy produced by the natural oscillation of waves, typically achieved through a weighted buoy system that converts the wave motion into electrical energy via a linear or rotary generator.",
              relatedThemes: ["Ocean Innovation"],
              relatedLevers: ["Science & Technology"],
            },
            {
              id: "tidal-energy",
              name: "Tidal Energy",
              summary:
                "Tidal stream and barrage technologies for predictable power.",
              relatedThemes: ["Ocean Health"],
              relatedLevers: ["Science & Technology"],
            },
            {
              id: "hydropower",
              name: "Hydropower (low-impact)",
              summary:
                "Small/low-impact hydro and pumped storage while avoiding ecologically harmful large dams.",
              description:
                "Sustainable hydropower refers to using smaller-scale dams that generate electricity through the controlled flow of water but preserve aquatic ecosystems and ensure unobstructed fish migration pathways.",
              relatedThemes: ["Water Stewardship", "Biodiversity"],
              relatedLevers: ["Policy & Governance"],
            },
            {
              id: "biomass-power",
              name: "Biomass Power (sustainable)",
              summary:
                "Sustainably sourced biomass energy with strict ecological safeguards.",
              description:
                "Sustainable biomass power uses cellulosic waste products such as wood scraps, agricultural residues, and organic landfill materials for combustion in a thermoelectric generator to produce electricity while ensuring that harvested trees are not used as a fuel source to maintain forest sustainability.",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Policy & Governance", "Legal Empowerment"],
            },
            {
              id: "renewable-hydrogen",
              name: "Green Hydrogen",
              summary:
                "Electrolysis-based hydrogen produced with renewable electricity for industry and transport.",
              description:
                "Green hydrogen power involves the production of hydrogen using renewable energy to electrolyze water, which allows for the storage and on-demand use of hydrogen in a fuel cell to provide a clean and sustainable power source.",
              relatedThemes: ["Energy Transition"],
              relatedLevers: ["Science & Technology", "Finance"],
            },
          ],
        },
        {
          id: "renewable-heat",
          name: "Renewable Heat",
          description:
            "Decarbonize heat for buildings, industry and processes.",
          pathways: [
            {
              id: "solar-thermal-heat",
              name: "Solar Thermal Heat",
              summary:
                "Solar thermal systems for building and industrial heat.",
              description:
                "Solar heat is the process of harnessing thermal energy from the sun, commonly achieved through a sealed flat plate with copper pipes, utilized for residential, commercial, or industrial space heating or water heating.",
              relatedThemes: ["Energy Efficiency"],
              relatedLevers: ["Policy & Governance"],
            },
            {
              id: "geothermal-heat",
              name: "Geothermal Heat (GSHP)",
              summary:
                "Ground-source heat pumps and district geothermal heating.",
              description:
                "Geothermal heat involves the extraction and distribution of subsurface latent heat for residential or industrial heating.",
              relatedThemes: ["Energy Access"],
              relatedLevers: ["Finance", "Science & Technology"],
            },
            {
              id: "biomass-heat",
              name: "Sustainable Biomass Heat",
              summary:
                "Low-carbon biomass for heat with sustainable sourcing and pollution controls.",
              description:
                "Sustainable biomass heat refers to the controlled combustion of cellulosic waste products, including wood scraps, agricultural residues, and other organic materials, to generate renewable heat without depleting forests or croplands.",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Legal Empowerment", "Policy & Governance"],
            },
            {
              id: "electric-heat-pumps",
              name: "Electric Heat Pumps",
              summary:
                "Electrify heating via efficient heat pump technologies.",
              description:
                "Electric heat encompasses several technologies, such as heat pumps, space heaters, and induction ovens, that can convert renewable electricity into heat through electric resistance, radiation, induction, or efficient heat transfer.",
              relatedThemes: ["Energy Efficiency", "Public Health"],
              relatedLevers: ["Finance", "Policy & Governance"],
            },
          ],
        },
        {
          id: "renewable-transport",
          name: "Renewable Transport",
          description:
            "Decarbonize mobility and freight with electrification and low-carbon fuels.",
          pathways: [
            {
              id: "evs",
              name: "Electric Vehicles (EVs)",
              summary:
                "Passenger EV adoption, charging infrastructure, and grid integration.",
              description:
                "Electric transport refers to any mode of transportation, including trains, trams, cars, buses, and bikes, powered by renewable electricity either directly from the grid or through stored battery energy. About 80% of all energy used to power a gasoline vehicle is lost to various inefficiencies. In comparison, an electric vehicle only loses about 11% of the original energy used to power it.",
              relatedThemes: ["Equity", "Air Quality"],
              relatedLevers: ["Policy & Governance", "Finance"],
            },
            {
              id: "rail-electrification",
              name: "Rail Electrification",
              summary: "Electrify rail networks and boost public transit.",
              description:
                "Electric transport refers to any mode of transportation, including trains, trams, cars, buses, and bikes, powered by renewable electricity either directly from the grid or through stored battery energy.",
              relatedThemes: ["Urban Mobility"],
              relatedLevers: ["Policy & Governance", "Finance"],
            },
            {
              id: "hydrogen-fuels-transport",
              name: "Hydrogen Fuels for Transport",
              summary:
                "Hydrogen for heavy freight, shipping, and aviation where electrification is hard.",
              description:
                "Green hydrogen fuel is produced using renewable energy to electrolyze water (splitting water into hydrogen and oxygen). The resulting hydrogen can be stored and used on demand in a fuel cell to create renewable power.",
              relatedThemes: ["Industrial Decarbonization"],
              relatedLevers: ["Science & Technology"],
            },
            {
              id: "active-mobility",
              name: "Active & Shared Mobility",
              summary:
                "Walking, cycling, micromobility, and shared transport systems.",
              description:
                "Transportation efficiency involves strategies designed to reduce dependence on energy-inefficient modes of travel, such as automobiles and airplanes. These strategies include investments in public rail systems, buses, bicycles, and personal electric vehicles (PEVs), as well as policies that promote remote work, lightweight vehicle manufacturing, and other energy-saving measures that support sustainable transportation practices.",
              relatedThemes: ["Public Health", "Equity"],
              relatedLevers: ["Community Action", "Policy & Governance"],
            },
          ],
        },
        {
          id: "energy-efficiency",
          name: "Energy Efficiency",
          description:
            "Reduce energy demand across buildings, industry and appliances.",
          pathways: [
            {
              id: "building-retrofits",
              name: "Building Retrofits & Standards",
              summary:
                "Deep retrofit programs, insulation, ventilation, and building codes.",
              description:
                "Built environment encompasses any constructed structure or system, including whole cities, residential homes, commercial buildings, government facilities, roads, bridges, and factories, designed with a focus on minimizing energy needs, material usage, and associated emissions.",
              relatedThemes: ["Public Health", "Energy Access"],
              relatedLevers: ["Policy & Governance", "Finance"],
            },
            {
              id: "smart-grids",
              name: "Smart Grids & Storage",
              summary:
                "Grid modernization, demand response and energy storage integration.",
              description:
                "Transmission and storage measures refer to techniques that minimize energy loss during power transmission from production to consumption points, encompassing the deployment of smart grids, smart meters, demand response systems, integrated grid storage solutions, utility-scale batteries, and load-shedding techniques.",
              relatedThemes: ["Resilience"],
              relatedLevers: ["Science & Technology", "Finance"],
            },
            {
              id: "demand-management",
              name: "Demand Management & Efficiency Programs",
              summary:
                "Behavioral programs, efficiency incentives, and load shifting.",
              description:
                "Transportation efficiency involves strategies designed to reduce dependence on energy-inefficient modes of travel, such as automobiles and airplanes.",
              relatedThemes: ["Equity"],
              relatedLevers: ["Community Action", "Policy & Governance"],
            },
            {
              id: "efficient-appliances",
              name: "Efficient Appliances & Equipment",
              summary:
                "High-efficiency appliances, industrial motors and lighting.",
              description:
                "Industries and services encompass technological innovations, new systems, and upgrades that reduce the energy intensity and direct emissions from manufacturing chemicals, metals, electrical goods, textiles, materials, and cement.",
              relatedThemes: ["Energy Access"],
              relatedLevers: ["Policy & Governance", "Finance"],
            },
          ],
        },
      ],
    },
    {
      id: "nature-conservation",
      name: "Nature Conservation",
      description:
        "Protect, restore and connect natural ecosystems to safeguard biodiversity and store carbon.",
      subPillars: [
        {
          id: "land-conservation",
          name: "Land Conservation",
          description:
            "Protect intact terrestrial ecosystems and critical habitats.",
          pathways: [
            {
              id: "forest-protection",
              name: "Forest Protection",
              summary:
                "Prevent deforestation, strengthen forest governance and Indigenous stewardship.",
              description:
                "Protected lands are places already protected or recognized by governments, including all International Union for the Conservation of Nature (IUCN)-protected area classes and Other Effective Conservation Measures (OECMs) as defined by the World Conservation Monitoring Centre (WCMC).",
              relatedThemes: ["Indigenous Rights", "Biodiversity"],
              relatedLevers: ["Legal Empowerment", "Community Action"],
            },
            {
              id: "wetland-protection",
              name: "Wetland & Peatland Protection",
              summary:
                "Conserve wetlands and peatlands to protect biodiversity and carbon stores.",
              description:
                "Climate refugia refers to unprotected areas not included in other designations of the Global Safety Net that help to stabilize our global climate system by absorbing and storing more than 50 metric tons of carbon per hectare of land.",
              relatedThemes: ["Water Stewardship"],
              relatedLevers: ["Policy & Governance"],
            },
            {
              id: "grassland-conservation",
              name: "Grassland & Savanna Conservation",
              summary:
                "Protect native grasslands and rangelands from conversion.",
              description:
                "Land habitats are unprotected land areas with groupings of plants and animals vital to maintaining healthy ecosystems.",
              relatedThemes: ["Biodiversity", "Sustainable Livelihoods"],
              relatedLevers: ["Policy & Governance"],
            },
            {
              id: "indigenous-stewardship",
              name: "Indigenous & Community Land Rights",
              summary:
                "Secure land tenure and support Indigenous-led conservation.",
              description:
                "Indigenous tenure refers to land currently occupied or managed by Indigenous People or Local Communities (IPLCs) that are legally recognized by governments as belonging to those communities.",
              relatedThemes: ["Indigenous Rights", "Climate Justice"],
              relatedLevers: ["Legal Empowerment", "Philanthro-Activism"],
            },
          ],
        },
        {
          id: "ocean-conservation",
          name: "Ocean Conservation",
          description:
            "Protect marine ecosystems and sustainable use of ocean resources.",
          pathways: [
            {
              id: "marine-protected-areas",
              name: "Marine Protected Areas (MPAs)",
              summary:
                "Establish and manage MPAs to conserve marine biodiversity.",
              description:
                "Protected seas, or Marine Protected Areas (MPAs), are sections of the ocean that are currently protected or recognized by governments, with limits placed on human activity in an effort to conserve marine biodiversity and habitats. This includes all IUCN-protected area classes as well as Other Effective Conservation Measures (OECMs).",
              relatedThemes: ["Ocean Health"],
              relatedLevers: ["Policy & Governance", "Community Action"],
            },
            {
              id: "coral-reef-restoration",
              name: "Coral Reef Restoration & Resilience",
              summary:
                "Active restoration and reducing local stressors for reef recovery.",
              description:
                "Marine habitats are currently unprotected areas with groupings of plants and animals that are vital to maintaining healthy ocean ecosystems.",
              relatedThemes: ["Biodiversity", "Public Health"],
              relatedLevers: ["Science & Technology"],
            },
            {
              id: "sustainable-fisheries",
              name: "Sustainable Fisheries & Marine Management",
              summary:
                "Sustainable quotas, monitoring and community-based fisheries management.",
              description:
                "Sustainable fisheries are fishing operations managed in a manner that ensures the long-term health and productivity of fish stocks and the marine ecosystems in which they live. This involves harvesting at a rate where the fish population can replenish itself naturally, thereby avoiding overfishing.",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Policy & Governance", "Legal Empowerment"],
            },
            {
              id: "blue-carbon-habitats",
              name: "Blue Carbon Habitats (mangroves, seagrass)",
              summary:
                "Protect and restore mangroves, seagrass and saltmarsh for carbon and co-benefits.",
              description:
                "Marine carbon sinks are natural reservoirs in the ocean that absorb and store carbon dioxide from the atmosphere through various physical and biological processes.",
              relatedThemes: ["Biodiversity", "Coastal Resilience"],
              relatedLevers: ["Community Action", "Finance"],
            },
          ],
        },
        {
          id: "ecosystem-restoration",
          name: "Ecosystem Restoration",
          description:
            "Large-scale restoration to rebuild natural functions and carbon sinks.",
          pathways: [
            {
              id: "reforestation",
              name: "Reforestation & Afforestation",
              summary:
                "Replanting trees and restoring forest landscapes with ecological integrity.",
              description:
                "Reforestation involves planting native trees in areas affected by man-made disturbances (e.g., logging, mining, agricultural clearing, and development) or by natural disturbances (e.g., wildfires, drought, and insect and disease infestations).",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Finance", "Community Action"],
            },
            {
              id: "peatland-restoration",
              name: "Peatland Restoration",
              summary:
                "Rewetting and restoring peatlands to prevent emissions.",
              description:
                "Wetland restoration involves assisting the recovery of degraded wetland ecosystems and their natural processes through measures including reforestation, habitat regeneration, and the rewilding of keystone species.",
              relatedThemes: ["Water Stewardship"],
              relatedLevers: ["Science & Technology"],
            },
            {
              id: "mangrove-restoration",
              name: "Mangrove Restoration",
              summary:
                "Restore mangrove forests for coastal protection and carbon.",
              description:
                "Mangrove restoration involves assisting the recovery of degraded mangrove ecosystems and their natural processes through measures including reforestation, habitat regeneration, and the rewilding of keystone species.",
              relatedThemes: ["Coastal Resilience"],
              relatedLevers: ["Community Action"],
            },
            {
              id: "river-restoration",
              name: "River & Wetland Restoration",
              summary:
                "Restore river flows, wetlands and floodplains for biodiversity and flood control.",
              description:
                "River restoration involves assisting the recovery of degraded river ecosystems and their natural processes through measures including reforestation, habitat regeneration, and the rewilding of keystone species.",
              relatedThemes: ["Water Stewardship"],
              relatedLevers: ["Policy & Governance"],
            },
          ],
        },
        {
          id: "wildlife-connectivity",
          name: "Wildlife Connectivity & Protected Area Expansion",
          description:
            "Create connected habitats and expand protected networks for species persistence.",
          pathways: [
            {
              id: "habitat-corridors",
              name: "Habitat Corridors & Connectivity",
              summary:
                "Establish corridors to reduce fragmentation and allow species movement.",
              description:
                "Mammal assemblages refers to currently unprotected large mammal landscapes where seasonal groupings of animals occur, particularly megafauna.",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Policy & Governance", "Community Action"],
            },
            {
              id: "protected-area-expansion",
              name: "Protected Area Expansion & Management",
              summary:
                "Expand and effectively manage land and sea protected areas.",
              description:
                "Intact wilderness refers to unprotected areas with a large extent of intact wilderness, such as continuous forests, shrublands, and grasslands, that aren't identified in previous layers of the Global Safety Net.",
              relatedThemes: ["Indigenous Rights", "Biodiversity"],
              relatedLevers: ["Policy & Governance", "Finance"],
            },
            {
              id: "human-wildlife-conflict",
              name: "Human-Wildlife Conflict Mitigation",
              summary:
                "Tools and governance to reduce conflict and support coexistence.",
              description:
                "Species recovery involves targeted conservation efforts for endangered species and their habitats.",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Community Action", "Legal Empowerment"],
            },
            {
              id: "species-recovery",
              name: "Species Recovery & Conservation Programs",
              summary: "Targeted conservation for endangered species.",
              description:
                "Species recovery involves targeted conservation efforts for endangered species and their habitats.",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Science & Technology", "Community Action"],
            },
          ],
        },
      ],
    },
    {
      id: "regenerative-agriculture",
      name: "Regenerative Agriculture",
      description:
        "Transform food, fiber and land-use systems to restore soils, increase productivity and sequester carbon.",
      subPillars: [
        {
          id: "regenerative-croplands",
          name: "Regenerative Croplands",
          description:
            "Agricultural practices that rebuild soil and reduce emissions.",
          pathways: [
            {
              id: "agroforestry",
              name: "Agroforestry",
              summary:
                "Integrate trees with crops and livestock for multiple benefits.",
              description:
                "Urban biodiversity refers to methods that reintroduce nature and wildlife back into urban or suburban areas, including tree planting, microforests, pollinator meadows, and river restoration.",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Community Action", "Finance"],
            },
            {
              id: "cover-crops",
              name: "Cover Crops & Green Manures",
              summary:
                "Use cover crops to protect soil, fix nitrogen and improve fertility.",
              description:
                "Cover crops and green manures involve planting specific crops to protect and enrich soil between main crop seasons, improving soil health and reducing the need for synthetic fertilizers.",
              relatedThemes: ["Soil Health"],
              relatedLevers: ["Science & Technology"],
            },
            {
              id: "no-till",
              name: "No-Till & Reduced Tillage",
              summary:
                "Minimize soil disturbance to increase carbon retention.",
              description:
                "No-till and reduced tillage farming minimizes soil disturbance to preserve soil structure, reduce erosion, and increase carbon retention in agricultural soils.",
              relatedThemes: ["Soil Health"],
              relatedLevers: ["Policy & Governance"],
            },
            {
              id: "composting",
              name: "Composting & Organic Amendments",
              summary:
                "Return organic matter to soils for fertility and carbon.",
              description:
                "Composting involves the natural decomposition of organic matter, such as plant debris and food scraps, into a valuable fertilizer and soil amendment, contributing to soil health, improved water retention, and carbon sequestration.",
              relatedThemes: ["Circularity"],
              relatedLevers: ["Community Action"],
            },
            {
              id: "precision-agriculture",
              name: "Precision Agriculture & Soil Management",
              summary:
                "Use data and tech to optimize inputs and minimize impacts.",
              description:
                "Precision agriculture uses data and technology to optimize inputs and minimize environmental impacts while maximizing productivity.",
              relatedThemes: ["Science & Technology"],
              relatedLevers: ["Science & Technology", "Finance"],
            },
          ],
        },
        {
          id: "sustainable-rangelands",
          name: "Sustainable Rangelands & Pastures",
          description:
            "Manage grazing lands to increase resilience and carbon storage.",
          pathways: [
            {
              id: "rotational-grazing",
              name: "Rotational & Adaptive Grazing",
              summary: "Managed grazing systems to restore grasslands.",
              description:
                "Rotational and adaptive grazing involves managed grazing systems that restore grasslands and improve soil health through strategic movement of livestock.",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Community Action"],
            },
            {
              id: "silvopasture",
              name: "Silvopasture",
              summary:
                "Integrate trees into pasture systems for shade, fodder and carbon.",
              description:
                "Silvopasture integrates trees into pasture systems for shade, fodder, and carbon sequestration while maintaining livestock production.",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Finance", "Community Action"],
            },
            {
              id: "rangeland-restoration",
              name: "Rangeland Restoration & Invasive Species Control",
              summary: "Restore degraded rangelands and remove invasives.",
              description:
                "Rangeland restoration involves restoring degraded rangelands and removing invasive species to improve ecosystem health and productivity.",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Science & Technology", "Policy & Governance"],
            },
          ],
        },
        {
          id: "food-waste-circularity",
          name: "Food Waste Reduction & Circularity",
          description:
            "Reduce losses across the supply chain and create circular resource flows.",
          pathways: [
            {
              id: "supply-chain-efficiency",
              name: "Supply-Chain Efficiency & Cold Chain",
              summary:
                "Improve storage, transport and logistics to reduce loss.",
              description:
                "Storage and logistics solutions, including technologies like solar-powered refrigerators, contribute to significant reductions in crop losses due to inadequate or inaccessible cold storage, ensuring the freshness and quality of produce before it is sold or taken to market.",
              relatedThemes: ["Food Security"],
              relatedLevers: ["Finance", "Policy & Governance"],
            },
            {
              id: "consumer-waste-reduction",
              name: "Consumer & Retail Food Waste Reduction",
              summary:
                "Behavior change, packaging and redistribution to cut waste.",
              description:
                "Food waste reduction involves strategies to minimize food loss at the consumer and retail levels through better planning, storage, and distribution.",
              relatedThemes: ["Public Awareness"],
              relatedLevers: ["Education & Culture"],
            },
            {
              id: "food-recovery",
              name: "Food Recovery & Redistribution",
              summary: "Systems to redirect surplus food to people in need.",
              description:
                "Food recovery involves redirecting surplus food to people in need, reducing waste while addressing food insecurity.",
              relatedThemes: ["Equity"],
              relatedLevers: ["Community Action"],
            },
            {
              id: "anaerobic-digestion",
              name: "Anaerobic Digestion & Waste-to-Energy (organic only)",
              summary:
                "Convert food/organic waste to energy and soil amendments.",
              description:
                "Anaerobic digestion converts organic waste into energy and soil amendments through controlled decomposition processes.",
              relatedThemes: ["Circularity"],
              relatedLevers: ["Science & Technology", "Policy & Governance"],
            },
          ],
        },
        {
          id: "circular-fibersheds",
          name: "Circular Fibers & Sustainable Materials",
          description:
            "Reduce lifecycle impacts of fibers, textiles and materials.",
          pathways: [
            {
              id: "sustainable-textiles",
              name: "Sustainable Textiles & Fibers",
              summary: "Shift to low-impact fibers and responsible sourcing.",
              description:
                "Sustainable fiber and pulp is the responsible procurement of natural fibers, like linen, wool, hemp, and jute, from environmentally sustainable and ethically managed sources that support soil health, waterways, and biodiversity and enhance carbon sequestration.",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Policy & Governance", "Finance"],
            },
            {
              id: "bio-based-materials",
              name: "Bio-based & Regenerative Materials",
              summary:
                "Use renewable materials to replace fossil-derived inputs.",
              description:
                "Green textiles refer to textiles produced through eco-friendly fiber processing and dyeing methods, emphasizing reduced energy consumption and the avoidance of chemicals harmful to human and ecological health.",
              relatedThemes: ["Circularity"],
              relatedLevers: ["Science & Technology"],
            },
            {
              id: "circular-design",
              name: "Circular Design & Recycling",
              summary: "Design for reuse, repair and high-value recycling.",
              description:
                'Recycle and Reuse refers to the adoption of sustainable fashion practices, including the concept of "slow fashion," which encourages the use, repair, and repurposing of second-hand apparel, along with the recycling and upcycling of fibers for additional purposes, all aimed at mitigating the environmental impact of the prevailing culture of "fast fashion."',
              relatedThemes: ["Circularity"],
              relatedLevers: ["Policy & Governance", "Finance"],
            },
          ],
        },
        {
          id: "diet-land-use",
          name: "Diet, Sustainable Consumption & Land-Use Choices",
          description:
            "Shift diets and land allocations to reduce pressure on nature.",
          pathways: [
            {
              id: "diet-shift",
              name: "Healthy & Lower-Impact Diet Shifts",
              summary: "Promote diets with lower land and carbon footprints.",
              description:
                "Diet shifts involve promoting diets with lower land and carbon footprints, including reduced red meat consumption and increased plant-based foods.",
              relatedThemes: ["Public Health"],
              relatedLevers: ["Education & Culture", "Policy & Governance"],
            },
            {
              id: "sustainable-intensification",
              name: "Sustainable Intensification (contextual)",
              summary:
                "Raise yields sustainably to reduce conversion pressure.",
              description:
                "Sustainable intensification raises yields sustainably to reduce conversion pressure on natural lands while maintaining or improving environmental outcomes.",
              relatedThemes: ["Food Security"],
              relatedLevers: ["Science & Technology", "Finance"],
            },
            {
              id: "land-sparing-planning",
              name: "Land-Use Planning & Avoidance of Conversion",
              summary:
                "Spatial planning to avoid converting high-carbon/high-biodiversity lands.",
              description:
                "Land-use planning involves spatial planning to avoid converting high-carbon and high-biodiversity lands while meeting development needs.",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Policy & Governance", "Legal Empowerment"],
            },
          ],
        },
      ],
    },
  ],
  intersectionalThemes: [
    {
      id: "gender-equity",
      name: "Gender Equity",
      description:
        "Ensure solutions empower women and address gendered impacts.",
    },
    {
      id: "indigenous-rights",
      name: "Indigenous Rights",
      description:
        "Recognize and secure Indigenous rights, knowledge and stewardship.",
    },
    {
      id: "biodiversity",
      name: "Biodiversity",
      description: "Protect and restore species and ecosystem diversity.",
    },
    {
      id: "public-health",
      name: "Public Health",
      description: "Link ecosystem health to human health outcomes.",
    },
    {
      id: "sustainable-livelihoods",
      name: "Sustainable Livelihoods",
      description: "Support economic opportunities that are nature-positive.",
    },
    {
      id: "water-stewardship",
      name: "Water Stewardship",
      description: "Safeguard freshwater resources and hydrological cycles.",
    },
    {
      id: "climate-justice",
      name: "Climate Justice",
      description: "Prioritize equity and rights in climate solutions.",
    },
  ],
  leversOfChange: [
    {
      id: "philanthro-activism",
      name: "Philanthro-Activism",
      description:
        "Strategic philanthropy blended with advocacy to catalyze change.",
    },
    {
      id: "finance",
      name: "Nature & Climate Finance",
      description:
        "Redirect public and private capital to high-impact solutions.",
    },
    {
      id: "policy-governance",
      name: "Policy & Governance",
      description:
        "Regulatory and policy frameworks that enable rapid, just transitions.",
    },
    {
      id: "science-tech",
      name: "Science & Technology",
      description:
        "Research, monitoring and innovation to improve effectiveness.",
    },
    {
      id: "legal-empowerment",
      name: "Legal Empowerment",
      description:
        "Secure rights, enforce laws and enable equitable governance.",
    },
    {
      id: "community-action",
      name: "Community Action & Stewardship",
      description:
        "Local leadership and implementation by communities and Indigenous peoples.",
    },
    {
      id: "education-culture",
      name: "Education & Culture",
      description:
        "Behavior change, education and cultural shifts to sustain solutions.",
    },
  ],
};

