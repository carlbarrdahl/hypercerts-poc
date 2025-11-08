// one-earth-framework.ts
// Type definitions
export interface SolutionPathway {
  id: string;
  name: string;
  summary: string; // Short summary/overview
  description?: string; // Longer detailed description
  image?: string; // Image URL for the pathway
  examples?: string[];
  relatedThemes?: string[]; // e.g., ["Gender Equity", "Biodiversity"]
  relatedLevers?: string[];
  tags?: string[]; // e.g., ["Policy & Governance", "Finance"]
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

// Pathway image mappings from OneEarth website
const pathwayImages: Record<string, string> = {
  "Solar Photovoltaic":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg",
  "Solar Thermoelectric":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/89e4725e-2afc-46e8-a07a-d747ad1c8748/Nevada%20Cresent%20Dunes-2-Solar-CC-BLM%20Nevada-2015_resized%20(1).jpg",
  "Geothermal Power":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4e5cf7b5-40e4-4a6a-9101-8f1636d8b405/geothermal%20energy%20heat%20dreamstime_xxl_36725375%20(1).jpg",
  "Onshore Wind":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4529134f-421c-4aa0-b168-afa12f756cb6/wind%20turbine%20farm%20at%20sunset%20dreamstime_xxl_16800093%20(1).jpg",
  "Offshore Wind":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e44d703a-7667-4c34-817d-a20a1150d4d7/Coastal%20wind%20turbines%20sunset%20dreamstime_xxl_14338512%20(1)%20(1).jpg",
  "Wave Energy":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/55b6cfee-c224-4d7c-91a7-f30af173008a/breaking%20ocean%20wave%20falling%20down%20at%20sunset%20time%20shutterstock_65093608%20(1).jpg",
  "Hydropower (low-impact)":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8aaa9d86-50c2-42c2-9d9a-7559820d7264/Sustainable%20Hydropower.jpg",
  "Biomass Power (sustainable)":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/407ad8a7-0bcc-4bee-8e1a-2c50d11ffef2/biomass%20farm.jpg",
  "Green Hydrogen":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7a114fd4-5cd0-45b3-80c9-ea6100d5fbcf/hydrogen%20power%20(1).jpg",
  "Solar Thermal Heat":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6330d246-99fc-4736-b069-c406b0660aad/direct%20solar%20(1).jpg",
  "Sustainable Biomass Heat":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f9c9878a-37e0-4a20-8a02-5b2ccc5d7761/Sustainable%20Biomass.jpg",
  "Geothermal Heat (GSHP)":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0a4d3eb4-8f18-40f1-907e-db29ecea8da0/Steam%20rising%20from%20the%20Nesjavellir%20Geothermal%20Power%20Station%20in%20Iceland..jpg",
  "Electric Heat Pumps":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f62b07a5-4be2-4a91-b636-ffa51a5d6e59/electric%20heat%20(1).jpg",
  "Electric Vehicles (EVs)":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/55914c00-b8fd-400b-afc3-6e9d16212968/Electric%20Vehicle%20charging%20station%20system%20storing%20power%20on%20white%20modern%20car.%20EV%20fuel%20for%20advanced%20hybrid%20car.%20automobile%20industry%20new%20technology%2C%20clean%20energy%2C%20or%20environmental%20conservation%20concept%20dreamstime_xxl_114496245%20(1).jpg",
  "Hydrogen Fuels for Transport":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/13d86cb7-a74e-4f68-bb68-ebaba88fe8e2/Hydrogen%20transport.jpg",
  "Building Retrofits & Standards":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/caefd8a5-50bf-4486-9bf7-8ae54f0b1972/Aerial%20view%20oveTokyo%20tower%20and%20Tokyo%20cityscape%20with%20high%20rise%20architecture%20at%20sunset%20in%20Tokyo%2C%20Japan%20dreamstime_xxl_116635775%20(1).jpg",
  "Smart Grids & Storage":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/067763c0-9030-4f55-a677-60f1bf93303f/Transmission%20and%20storage%20(1).jpg",
  "Forest Protection":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/eee7386b-d434-4eba-afcc-d48c5a5b2dee/Salonga%20National%20Park%20South_resized.jpg",
  "Wetland & Peatland Protection":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/63e4255d-28e6-499f-b5e9-f02f8688f6f2/Gambia%20Mangroves.%20Aerial%20view%20of%20mangrove%20forest%20in%20Gambia.%20Photo%20made%20by%20drone%20from%20above.%20iStock.jpeg",
  "Grassland & Savanna Conservation":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b9a93d61-bad6-4768-a239-4eb62ac90c35/Bard's%20tapir%20dreamstime.jpg",
  "Indigenous & Community Land Rights":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4d4bf710-f662-4f58-b6fc-a0e8b1de4890/Restoring%20the%20Serengeti-Mara%20Ecosystem%20and%20its%20Wildlife%20Through%20Indigenous-led%20Conservation2.jpeg",
  "Marine Protected Areas (MPAs)":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/88cfb686-ab4a-46fc-8720-545741d3faff/Great%20Barrier%20Reef.%20Heart%20Reef.%20Whitsundays.%20Queensland%20Australia%20shutterstock_1597510444.jpg",
  "Coral Reef Restoration & Resilience":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e490e41e-2bee-49b2-a330-2993fc568368/kelp%20forest%20views%20from%20below%20shutterstock_1331702939%20(1).jpg",
  "Sustainable Fisheries & Marine Management":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/75b07a8c-e94e-4f53-8f8d-0193ffe62d3f/videoblocks-school-of-fish-sharks-swim-in-a-circle_sqhnhov3m_1080__D%20(0-00-02-03).png",
  "Blue Carbon Habitats (mangroves, seagrass)":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/20321b45-afc5-4b86-822c-8f85aa5e6d1a/Underwater%20image%20of%20kelp%20off%20the%20shores%20of%20Catalina%20shutterstock_610509038.jpg",
  "Reforestation & Afforestation":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3b27fd7-e463-4f93-875a-0174c4e6eb9e/hands%20holding%20aplingdreamstime_xxl_38295437%20(1).jpg",
  "Peatland Restoration":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b06382da-3a5e-4956-812a-f6880b55a40e/Landscape%20of%20Kakerdaja%20Bog%2C%20sunrise%20dreamstime_xxl_21747723%20(1).jpg",
  "Mangrove Restoration":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2bfee827-be0f-49ea-8f28-9d9d95a28b9a/Guinean%20Mangroves-WikiCommons2.webp",
  "River & Wetland Restoration":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b06382da-3a5e-4956-812a-f6880b55a40e/Landscape%20of%20Kakerdaja%20Bog%2C%20sunrise%20dreamstime_xxl_21747723%20(1).jpg",
  "Habitat Corridors & Connectivity":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5c311b44-a853-4fc7-85e8-04da91a52b99/elephants%20in%20background%20walking%20shutterstock_60854854%20(1).jpg",
  "Protected Area Expansion & Management":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/92020367-3ebf-490f-a92b-b4912f4adaea/Jungle%20river%20in%20Thapom%20mangrove%20forest%2C%20Krabi%2CThailand%20iStock.jpg",
  Agroforestry:
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4b461add-35ce-408e-bf74-ee1776e89f59/Bombus%20of%20the%20genus%20Hymenoptera%20of%20the%20Apidae%20family.%20Pollinator%20bee%20on%20flower%20iStock.jpeg",
  "Cover Crops & Green Manures":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/bb5e797d-f8b0-41aa-8574-0608f4d29d65/Forest-aerial-view.jpeg",
  "Composting & Organic Amendments":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3b27fd7-e463-4f93-875a-0174c4e6eb9e/hands%20holding%20aplingdreamstime_xxl_38295437%20(1).jpg",
  "Rotational & Adaptive Grazing":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b9a93d61-bad6-4768-a239-4eb62ac90c35/Bard's%20tapir%20dreamstime.jpg",
  Silvopasture:
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/92020367-3ebf-490f-a92b-b4912f4adaea/Jungle%20river%20in%20Thapom%20mangrove%20forest%2C%20Krabi%2CThailand%20iStock.jpg",
  "Sustainable Textiles & Fibers":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4fa85c8e-a93f-4d17-8695-3b1821c36205/Green%20textles%20(1).jpg",
  "Circular Design & Recycling":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/dbd963d3-1628-4d18-a878-586b95441be9/donate%20box%20dreamstime_109594371.jpg",
};

// Helper function to get image URL for a pathway
function getPathwayImage(pathwayName: string): string | undefined {
  return pathwayImages[pathwayName];
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
              description: "Solar photovoltaic (PV) power utilizes sheets or panels of semiconducting materials capable of capturing photons from the sun and turning them into an electrical current.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Energy Access"],
              relatedLevers: ["Policy & Governance", "Finance"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "solar-thermal",
              name: "Solar Thermoelectric",
              summary:
                "Concentrated solar power / solar thermal for electricity and heat.",
              description: "Solar thermoelectric technology utilizes mirrors or lenses to concentrate sunlight onto a small area, generating heat that drives a turbine or heat engine to produce electricity.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/89e4725e-2afc-46e8-a07a-d747ad1c8748/Nevada%20Cresent%20Dunes-2-Solar-CC-BLM%20Nevada-2015_resized%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Energy Resilience"],
              relatedLevers: ["Science & Technology", "Finance"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "geothermal-power",
              name: "Geothermal Power",
              summary: "Baseload geothermal electricity where resources allow.",
              description: "Geothermal power involves harnessing naturally occurring underground heat—typically found in regions near volcanic activity, geysers, or hot springs—to generate steam for powering turbines and producing electricity.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4e5cf7b5-40e4-4a6a-9101-8f1636d8b405/geothermal%20energy%20heat%20dreamstime_xxl_36725375%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Local Jobs"],
              relatedLevers: ["Finance", "Policy & Governance"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "onshore-wind",
              name: "Onshore Wind",
              summary: "Utility-scale and distributed onshore wind energy.",
              description: "Onshore wind power is generated through the use of large wind turbines equipped with long blades that harness the kinetic energy of the wind to drive a connected electric generator.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4529134f-421c-4aa0-b168-afa12f756cb6/wind%20turbine%20farm%20at%20sunset%20dreamstime_xxl_16800093%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Science & Technology"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "offshore-wind",
              name: "Offshore Wind",
              summary:
                "Coastal and deep-water wind farms for large-scale generation.",
              description: "Offshore wind power involves the installation of wind turbines anchored to the sea floor, capitalizing on the consistently higher wind speeds over the ocean and enabling the use of larger turbines, thus enhancing their efficiency compared to onshore counterparts, ultimately generating electricity through the rotation of an electric generator.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e44d703a-7667-4c34-817d-a20a1150d4d7/Coastal%20wind%20turbines%20sunset%20dreamstime_xxl_14338512%20(1)%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Ocean Health"],
              relatedLevers: ["Policy & Governance", "Finance"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "wave-energy",
              name: "Wave Energy",
              summary: "Harnessing wave energy where suitable.",
              description: "Wave energy, or ocean power, involves harnessing the kinetic energy produced by the natural oscillation of waves, typically achieved through a weighted buoy system that converts the wave motion into electrical energy via a linear or rotary generator.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/55b6cfee-c224-4d7c-91a7-f30af173008a/breaking%20ocean%20wave%20falling%20down%20at%20sunset%20time%20shutterstock_65093608%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Ocean Innovation"],
              relatedLevers: ["Science & Technology"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "tidal-energy",
              name: "Tidal Energy",
              summary:
                "Tidal stream and barrage technologies for predictable power.",
              relatedThemes: ["Ocean Health"],
              relatedLevers: ["Science & Technology"],
            tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "hydropower",
              name: "Hydropower (low-impact)",
              summary:
                "Small/low-impact hydro and pumped storage while avoiding ecologically harmful large dams.",
              description: "Sustainable hydropower refers to using smaller-scale dams that generate electricity through the controlled flow of water but preserve aquatic ecosystems and ensure unobstructed fish migration pathways.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8aaa9d86-50c2-42c2-9d9a-7559820d7264/Sustainable%20Hydropower.jpg?auto=compress%2Cformat",
              relatedThemes: ["Water Stewardship", "Biodiversity"],
              relatedLevers: ["Policy & Governance"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "biomass-power",
              name: "Biomass Power (sustainable)",
              summary:
                "Sustainably sourced biomass energy with strict ecological safeguards.",
              description: "Sustainable biomass power uses cellulosic waste products such as wood scraps, agricultural residues, and organic landfill materials for combustion in a thermoelectric generator to produce electricity while ensuring that harvested trees are not used as a fuel source to maintain forest sustainability.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/407ad8a7-0bcc-4bee-8e1a-2c50d11ffef2/biomass%20farm.jpg?auto=compress%2Cformat",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Policy & Governance", "Legal Empowerment"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "renewable-hydrogen",
              name: "Green Hydrogen",
              summary:
                "Electrolysis-based hydrogen produced with renewable electricity for industry and transport.",
              description: "Green hydrogen power involves the production of hydrogen using renewable energy to electrolyze water, which allows for the storage and on-demand use of hydrogen in a fuel cell to provide a clean and sustainable power source.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7a114fd4-5cd0-45b3-80c9-ea6100d5fbcf/hydrogen%20power%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Energy Transition"],
              relatedLevers: ["Science & Technology", "Finance"],
              tags: ["Energy Transition", "Renewable Power"],
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
              description: "Solar heat is the process of harnessing thermal energy from the sun, commonly achieved through a sealed flat plate with copper pipes, utilized for residential, commercial, or industrial space heating or water heating.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6330d246-99fc-4736-b069-c406b0660aad/direct%20solar%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Energy Efficiency"],
              relatedLevers: ["Policy & Governance"],
              tags: ["Energy Transition", "Renewable Heat"],
            },
            {
              id: "geothermal-heat",
              name: "Geothermal Heat (GSHP)",
              summary:
                "Ground-source heat pumps and district geothermal heating.",
              description: "Geothermal heat involves the extraction and distribution of subsurface latent heat for residential or industrial heating.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0a4d3eb4-8f18-40f1-907e-db29ecea8da0/Steam%20rising%20from%20the%20Nesjavellir%20Geothermal%20Power%20Station%20in%20Iceland..jpg?auto=compress%2Cformat",
              relatedThemes: ["Energy Access"],
              relatedLevers: ["Finance", "Science & Technology"],
              tags: ["Energy Transition", "Renewable Heat"],
            },
            {
              id: "biomass-heat",
              name: "Sustainable Biomass Heat",
              summary:
                "Low-carbon biomass for heat with sustainable sourcing and pollution controls.",
              description: "Sustainable biomass heat refers to the controlled combustion of cellulosic waste products, including wood scraps, agricultural residues, and other organic materials, to generate renewable heat without depleting forests or croplands.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f9c9878a-37e0-4a20-8a02-5b2ccc5d7761/Sustainable%20Biomass.jpg?auto=compress%2Cformat",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Legal Empowerment", "Policy & Governance"],
              tags: ["Energy Transition", "Renewable Heat"],
            },
            {
              id: "electric-heat-pumps",
              name: "Electric Heat Pumps",
              summary:
                "Electrify heating via efficient heat pump technologies.",
              description: "Electric heat encompasses several technologies, such as heat pumps, space heaters, and induction ovens, that can convert renewable electricity into heat through electric resistance, radiation, induction, or efficient heat transfer.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f62b07a5-4be2-4a91-b636-ffa51a5d6e59/electric%20heat%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Energy Efficiency", "Public Health"],
              relatedLevers: ["Finance", "Policy & Governance"],
              tags: ["Energy Transition", "Renewable Heat"],
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
              description: "Electric transport refers to any mode of transportation, including trains, trams, cars, buses, and bikes, powered by renewable electricity either directly from the grid or through stored battery energy. About 80% of all energy used to power a gasoline vehicle is lost to various inefficiencies. In comparison, an electric vehicle only loses about 11% of the original energy used to power it.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/55914c00-b8fd-400b-afc3-6e9d16212968/Electric%20Vehicle%20charging%20station%20system%20storing%20power%20on%20white%20modern%20car.%20EV%20fuel%20for%20advanced%20hybrid%20car.%20automobile%20industry%20new%20technology%2C%20clean%20energy%2C%20or%20environmental%20conservation%20concept%20dreamstime_xxl_114496245%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Equity", "Air Quality"],
              relatedLevers: ["Policy & Governance", "Finance"],
              tags: ["Energy Transition", "Renewable Transport"],
            },
            {
              id: "rail-electrification",
              name: "Rail Electrification",
              summary: "Electrify rail networks and boost public transit.",
              description:
                "Electric transport refers to any mode of transportation, including trains, trams, cars, buses, and bikes, powered by renewable electricity either directly from the grid or through stored battery energy.",
              relatedThemes: ["Urban Mobility"],
              relatedLevers: ["Policy & Governance", "Finance"],
            tags: ["Energy Transition", "Renewable Transport"],
            },
            {
              id: "hydrogen-fuels-transport",
              name: "Hydrogen Fuels for Transport",
              summary:
                "Hydrogen for heavy freight, shipping, and aviation where electrification is hard.",
              description: "Green hydrogen fuel is produced using renewable energy to electrolyze water (splitting water into hydrogen and oxygen). The resulting hydrogen can be stored and used on demand in a fuel cell to create renewable power.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/13d86cb7-a74e-4f68-bb68-ebaba88fe8e2/Hydrogen%20transport.jpg?auto=compress%2Cformat",
              relatedThemes: ["Industrial Decarbonization"],
              relatedLevers: ["Science & Technology"],
              tags: ["Energy Transition", "Renewable Transport"],
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
            tags: ["Energy Transition", "Renewable Transport"],
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
              description: "Built environment encompasses any constructed structure or system, including whole cities, residential homes, commercial buildings, government facilities, roads, bridges, and factories, designed with a focus on minimizing energy needs, material usage, and associated emissions.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/caefd8a5-50bf-4486-9bf7-8ae54f0b1972/Aerial%20view%20oveTokyo%20tower%20and%20Tokyo%20cityscape%20with%20high%20rise%20architecture%20at%20sunset%20in%20Tokyo%2C%20Japan%20dreamstime_xxl_116635775%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Public Health", "Energy Access"],
              relatedLevers: ["Policy & Governance", "Finance"],
              tags: ["Energy Transition", "Energy Efficiency"],
            },
            {
              id: "smart-grids",
              name: "Smart Grids & Storage",
              summary:
                "Grid modernization, demand response and energy storage integration.",
              description:
                "Transmission and storage measures refer to techniques that minimize energy loss during power transmission from production to consumption points, encompassing the deployment of smart grids, smart meters, demand response systems, integrated grid storage solutions, utility-scale batteries, and load-shedding techniques.",
              image: getPathwayImage("Smart Grids & Storage"),
              relatedThemes: ["Resilience"],
              relatedLevers: ["Science & Technology", "Finance"],
            tags: ["Energy Transition", "Energy Efficiency"],
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
            tags: ["Energy Transition", "Energy Efficiency"],
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
            tags: ["Energy Transition", "Energy Efficiency"],
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
              description: "Protected lands are places already protected or recognized by governments, including all International Union for the Conservation of Nature (IUCN)-protected area classes and Other Effective Conservation Measures (OECMs) as defined by the World Conservation Monitoring Centre (WCMC).",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/eee7386b-d434-4eba-afcc-d48c5a5b2dee/Salonga%20National%20Park%20South_resized.jpg?auto=compress%2Cformat",
              relatedThemes: ["Indigenous Rights", "Biodiversity"],
              relatedLevers: ["Legal Empowerment", "Community Action"],
              tags: ["Nature Conservation", "Land Conservation"],
            },
            {
              id: "wetland-protection",
              name: "Wetland & Peatland Protection",
              summary:
                "Conserve wetlands and peatlands to protect biodiversity and carbon stores.",
              description: "Climate refugia refers to unprotected areas not included in other designations of the Global Safety Net that help to stabilize our global climate system by absorbing and storing more than 50 metric tons of carbon per hectare of land.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/63e4255d-28e6-499f-b5e9-f02f8688f6f2/Gambia%20Mangroves.%20Aerial%20view%20of%20mangrove%20forest%20in%20Gambia.%20Photo%20made%20by%20drone%20from%20above.%20iStock.jpeg?auto=compress%2Cformat",
              relatedThemes: ["Water Stewardship"],
              relatedLevers: ["Policy & Governance"],
              tags: ["Nature Conservation", "Land Conservation"],
            },
            {
              id: "grassland-conservation",
              name: "Grassland & Savanna Conservation",
              summary:
                "Protect native grasslands and rangelands from conversion.",
              description: "Land habitats are unprotected land areas with groupings of plants and animals vital to maintaining healthy ecosystems.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b9a93d61-bad6-4768-a239-4eb62ac90c35/Bard&#39;s%20tapir%20dreamstime.jpg?auto=compress%2Cformat",
              relatedThemes: ["Biodiversity", "Sustainable Livelihoods"],
              relatedLevers: ["Policy & Governance"],
              tags: ["Nature Conservation", "Land Conservation"],
            },
            {
              id: "indigenous-stewardship",
              name: "Indigenous & Community Land Rights",
              summary:
                "Secure land tenure and support Indigenous-led conservation.",
              description: "Indigenous tenure refers to land currently occupied or managed by Indigenous People or Local Communities (IPLCs) that are legally recognized by governments as belonging to those communities.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4d4bf710-f662-4f58-b6fc-a0e8b1de4890/Restoring%20the%20Serengeti-Mara%20Ecosystem%20and%20its%20Wildlife%20Through%20Indigenous-led%20Conservation2.jpeg?auto=compress%2Cformat",
              relatedThemes: ["Indigenous Rights", "Climate Justice"],
              relatedLevers: ["Legal Empowerment", "Philanthro-Activism"],
              tags: ["Nature Conservation", "Land Conservation"],
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
              description: "Protected seas, or Marine Protected Areas (MPAs), are sections of the ocean that are currently protected or recognized by governments, with limits placed on human activity in an effort to conserve marine biodiversity and habitats. This includes all IUCN-protected area classes as well as Other Effective Conservation Measures (OECMs).",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/88cfb686-ab4a-46fc-8720-545741d3faff/Great%20Barrier%20Reef.%20Heart%20Reef.%20Whitsundays.%20Queensland%20Australia%20shutterstock_1597510444.jpg?auto=compress%2Cformat",
              relatedThemes: ["Ocean Health"],
              relatedLevers: ["Policy & Governance", "Community Action"],
              tags: ["Nature Conservation", "Ocean Conservation"],
            },
            {
              id: "coral-reef-restoration",
              name: "Coral Reef Restoration & Resilience",
              summary:
                "Active restoration and reducing local stressors for reef recovery.",
              description: "Marine habitats are currently unprotected areas with groupings of plants and animals that are vital to maintaining healthy ocean ecosystems.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e490e41e-2bee-49b2-a330-2993fc568368/kelp%20forest%20views%20from%20below%20shutterstock_1331702939%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Biodiversity", "Public Health"],
              relatedLevers: ["Science & Technology"],
              tags: ["Nature Conservation", "Ocean Conservation"],
            },
            {
              id: "sustainable-fisheries",
              name: "Sustainable Fisheries & Marine Management",
              summary:
                "Sustainable quotas, monitoring and community-based fisheries management.",
              description: "Sustainable fisheries are fishing operations managed in a manner that ensures the long-term health and productivity of fish stocks and the marine ecosystems in which they live. This involves harvesting at a rate where the fish population can replenish itself naturally, thereby avoiding overfishing.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/75b07a8c-e94e-4f53-8f8d-0193ffe62d3f/videoblocks-school-of-fish-sharks-swim-in-a-circle_sqhnhov3m_1080__D%20(0-00-02-03).png?auto=compress%2Cformat",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Policy & Governance", "Legal Empowerment"],
              tags: ["Nature Conservation", "Ocean Conservation"],
            },
            {
              id: "blue-carbon-habitats",
              name: "Blue Carbon Habitats (mangroves, seagrass)",
              summary:
                "Protect and restore mangroves, seagrass and saltmarsh for carbon and co-benefits.",
              description: "Marine carbon sinks are natural reservoirs in the ocean that absorb and store carbon dioxide from the atmosphere through various physical and biological processes.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/20321b45-afc5-4b86-822c-8f85aa5e6d1a/Underwater%20image%20of%20kelp%20off%20the%20shores%20of%20Catalina%20shutterstock_610509038.jpg?auto=compress%2Cformat",
              relatedThemes: ["Biodiversity", "Coastal Resilience"],
              relatedLevers: ["Community Action", "Finance"],
                tags: ["Nature Conservation", "Ocean Conservation"],
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
              description: "Reforestation involves planting native trees in areas affected by man-made disturbances (e.g., logging, mining, agricultural clearing, and development) or by natural disturbances (e.g., wildfires, drought, and insect and disease infestations).",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3b27fd7-e463-4f93-875a-0174c4e6eb9e/hands%20holding%20aplingdreamstime_xxl_38295437%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Finance", "Community Action"],
              tags: ["Nature Conservation", "Ecosystem Restoration"],
            },
            {
              id: "peatland-restoration",
              name: "Peatland Restoration",
              summary:
                "Rewetting and restoring peatlands to prevent emissions.",
              description:
                "Wetland restoration involves assisting the recovery of degraded wetland ecosystems and their natural processes through measures including reforestation, habitat regeneration, and the rewilding of keystone species.",
              image: getPathwayImage("Peatland Restoration"),
              relatedThemes: ["Water Stewardship"],
              relatedLevers: ["Science & Technology"],
            tags: ["Nature Conservation", "Ecosystem Restoration"],
            },
            {
              id: "mangrove-restoration",
              name: "Mangrove Restoration",
              summary:
                "Restore mangrove forests for coastal protection and carbon.",
              description: "Mangrove restoration consists of reviving or rehabilitating coastal mangrove ecosystems, which help sequester carbon, safeguard coastlines against storms and erosion, and foster biodiversity.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2bfee827-be0f-49ea-8f28-9d9d95a28b9a/Guinean%20Mangroves-WikiCommons2.webp?auto=compress%2Cformat",
              relatedThemes: ["Coastal Resilience"],
              relatedLevers: ["Community Action"],
              tags: ["Nature Conservation", "Ecosystem Restoration"],
            },
            {
              id: "river-restoration",
              name: "River & Wetland Restoration",
              summary:
                "Restore river flows, wetlands and floodplains for biodiversity and flood control.",
              description: "Wetland restoration refers to a combination of management practices and planting native species to restore and enhance the health of all types of wetlands, including marshes, swamps, bogs, fens, seagrass, and kelp forests.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b06382da-3a5e-4956-812a-f6880b55a40e/Landscape%20of%20Kakerdaja%20Bog%2C%20sunrise%20dreamstime_xxl_21747723%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Water Stewardship"],
              relatedLevers: ["Policy & Governance"],
              tags: ["Nature Conservation", "Ecosystem Restoration"],
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
              image: getPathwayImage("Habitat Corridors & Connectivity"),
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Policy & Governance", "Community Action"],
            tags: ["Nature Conservation", "Wildlife Connectivity & Protected Area Expansion"],
            },
            {
              id: "protected-area-expansion",
              name: "Protected Area Expansion & Management",
              summary:
                "Expand and effectively manage land and sea protected areas.",
              description:
                "Intact wilderness refers to unprotected areas with a large extent of intact wilderness, such as continuous forests, shrublands, and grasslands, that aren't identified in previous layers of the Global Safety Net.",
              image: getPathwayImage("Protected Area Expansion & Management"),
              relatedThemes: ["Indigenous Rights", "Biodiversity"],
              relatedLevers: ["Policy & Governance", "Finance"],
            tags: ["Nature Conservation", "Wildlife Connectivity & Protected Area Expansion"],
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
            tags: ["Nature Conservation", "Wildlife Connectivity & Protected Area Expansion"],
            },
            {
              id: "species-recovery",
              name: "Species Recovery & Conservation Programs",
              summary: "Targeted conservation for endangered species.",
              description:
                "Species recovery involves targeted conservation efforts for endangered species and their habitats.",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Science & Technology", "Community Action"],
            tags: ["Nature Conservation", "Wildlife Connectivity & Protected Area Expansion"],
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
              description: "Agroforestry is the practice of cultivating trees, crops, and sometimes livestock in a complementary manner, allowing for multi-story production of diverse products that promote biodiversity, improve soil health, and enhance ecosystem resilience.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/69656b16-dc30-447e-8393-058f51102d04/shared%20forest%20system%20agroforestry%20dreamstime_xxl_270798972%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Community Action", "Finance"],
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
            },
            {
              id: "cover-crops",
              name: "Cover Crops & Green Manures",
              summary:
                "Use cover crops to protect soil, fix nitrogen and improve fertility.",
              description: "Cropland restoration is converting degraded or abandoned agricultural land into sustainable use by applying regenerative agriculture practices that help regenerate ecosystems, promote biodiversity, and enhance soil quality for long-term food production.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7866553c-de80-4f31-9ef1-577d83f53fc9/Growing%20vegetables%20in%20a%20editable%20garden.%20The%20vegetables%20are%20grown%20based%20on%20permaculture%20in%20polycultures%20in%20raised%20beds.%20shutterstock_1321094690%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Soil Health"],
              relatedLevers: ["Science & Technology"],
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
            },
            {
              id: "no-till",
              name: "No-Till & Reduced Tillage",
              summary:
                "Minimize soil disturbance to increase carbon retention.",
              description: "Soil management encompasses a range of holistic farming practices, including cover crops, erosion control, microbial inoculants, and non-fertilizer soil improvers, designed to foster soil health, resilience, and carbon content, ensuring sustainable and productive agricultural systems while minimizing negative environmental impacts.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5c670f6c-da37-42fd-bc10-5e5ac50f13f5/Closeup%20hand%20of%20person%20holding%20abundance%20soil%20%20dreamstime_xxl_118015269%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Soil Health"],
              relatedLevers: ["Policy & Governance"],
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
            },
            {
              id: "composting",
              name: "Composting & Organic Amendments",
              summary:
                "Return organic matter to soils for fertility and carbon.",
              description: "Sustainable biochar refers to turning sustainably sourced biomass into charcoal, which can enrich and fortify agricultural soil, enhancing its fertility, water retention, and structure while sequestering carbon.",
              image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2cd44ee7-9443-4517-8715-a9bf9ba2db74/Rice%20husk%20charcoal%20(biochar)%20for%20fertilizer%20shutterstock_591577631%20(1)%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Circularity"],
              relatedLevers: ["Community Action"],
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
            },
            {
              id: "precision-agriculture",
              name: "Precision Agriculture & Soil Management",
              summary:
                "Use data and tech to optimize inputs and minimize impacts.",
              description: "Sustainable fertilizers are organic-based fertilizers, including compost, herbivore manures, vermiculture, microbial soil amendments, and domestic sewage, fostering nutrient-rich soil, promoting healthy crop growth, and minimizing detrimental environmental impacts.",
              relatedThemes: ["Science & Technology"],
              relatedLevers: ["Science & Technology", "Finance"],
            image: "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/da3af5bb-ee1e-482b-a57b-ff6c60a29ca8/Hand%20holding%20compost%20with%20redworms.%20A%20farmer%20showing%20the%20worms%20in%20his%20hands%20at%20Chuadanga%2C%20Bangladesh.%20shutterstock_1706531374%20(1)%20(1).jpg?auto=compress%2Cformat",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
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
              image: getPathwayImage("Rotational & Adaptive Grazing"),
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Community Action"],
            tags: ["Regenerative Agriculture", "Sustainable Rangelands & Pastures"],
            },
            {
              id: "silvopasture",
              name: "Silvopasture",
              summary:
                "Integrate trees into pasture systems for shade, fodder and carbon.",
              description:
                "Silvopasture integrates trees into pasture systems for shade, fodder, and carbon sequestration while maintaining livestock production.",
              image: getPathwayImage("Silvopasture"),
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Finance", "Community Action"],
            tags: ["Regenerative Agriculture", "Sustainable Rangelands & Pastures"],
            },
            {
              id: "rangeland-restoration",
              name: "Rangeland Restoration & Invasive Species Control",
              summary: "Restore degraded rangelands and remove invasives.",
              description:
                "Rangeland restoration involves restoring degraded rangelands and removing invasive species to improve ecosystem health and productivity.",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Science & Technology", "Policy & Governance"],
            tags: ["Regenerative Agriculture", "Sustainable Rangelands & Pastures"],
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
            tags: ["Regenerative Agriculture", "Food Waste Reduction & Circularity"],
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
            tags: ["Regenerative Agriculture", "Food Waste Reduction & Circularity"],
            },
            {
              id: "food-recovery",
              name: "Food Recovery & Redistribution",
              summary: "Systems to redirect surplus food to people in need.",
              description:
                "Food recovery involves redirecting surplus food to people in need, reducing waste while addressing food insecurity.",
              relatedThemes: ["Equity"],
              relatedLevers: ["Community Action"],
            tags: ["Regenerative Agriculture", "Food Waste Reduction & Circularity"],
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
            tags: ["Regenerative Agriculture", "Food Waste Reduction & Circularity"],
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
              image: getPathwayImage("Sustainable Textiles & Fibers"),
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Policy & Governance", "Finance"],
            tags: ["Regenerative Agriculture", "Circular Fibers & Sustainable Materials"],
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
            tags: ["Regenerative Agriculture", "Circular Fibers & Sustainable Materials"],
            },
            {
              id: "circular-design",
              name: "Circular Design & Recycling",
              summary: "Design for reuse, repair and high-value recycling.",
              description:
                'Recycle and Reuse refers to the adoption of sustainable fashion practices, including the concept of "slow fashion," which encourages the use, repair, and repurposing of second-hand apparel, along with the recycling and upcycling of fibers for additional purposes, all aimed at mitigating the environmental impact of the prevailing culture of "fast fashion."',
              image: getPathwayImage("Circular Design & Recycling"),
              relatedThemes: ["Circularity"],
              relatedLevers: ["Policy & Governance", "Finance"],
            tags: ["Regenerative Agriculture", "Circular Fibers & Sustainable Materials"],
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
            tags: ["Regenerative Agriculture", "Diet, Sustainable Consumption & Land-Use Choices"],
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
            tags: ["Regenerative Agriculture", "Diet, Sustainable Consumption & Land-Use Choices"],
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
            tags: ["Regenerative Agriculture", "Diet, Sustainable Consumption & Land-Use Choices"],
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
