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
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
  "Solar Thermoelectric":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/89e4725e-2afc-46e8-a07a-d747ad1c8748/Nevada%20Cresent%20Dunes-2-Solar-CC-BLM%20Nevada-2015_resized%20(1).jpg?auto=compress%2Cformat",
  "Geothermal Power":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4e5cf7b5-40e4-4a6a-9101-8f1636d8b405/geothermal%20energy%20heat%20dreamstime_xxl_36725375%20(1).jpg?auto=compress%2Cformat",
  "Onshore Wind":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4529134f-421c-4aa0-b168-afa12f756cb6/wind%20turbine%20farm%20at%20sunset%20dreamstime_xxl_16800093%20(1).jpg?auto=compress%2Cformat",
  "Offshore Wind":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e44d703a-7667-4c34-817d-a20a1150d4d7/Coastal%20wind%20turbines%20sunset%20dreamstime_xxl_14338512%20(1)%20(1).jpg?auto=compress%2Cformat",
  "Wave Energy":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/55b6cfee-c224-4d7c-91a7-f30af173008a/breaking%20ocean%20wave%20falling%20down%20at%20sunset%20time%20shutterstock_65093608%20(1).jpg?auto=compress%2Cformat",
  "Hydropower (low-impact)":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8aaa9d86-50c2-42c2-9d9a-7559820d7264/Sustainable%20Hydropower.jpg?auto=compress%2Cformat",
  "Biomass Power (sustainable)":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/407ad8a7-0bcc-4bee-8e1a-2c50d11ffef2/biomass%20farm.jpg?auto=compress%2Cformat",
  "Green Hydrogen":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7a114fd4-5cd0-45b3-80c9-ea6100d5fbcf/hydrogen%20power%20(1).jpg?auto=compress%2Cformat",
  "Solar Thermal Heat":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6330d246-99fc-4736-b069-c406b0660aad/direct%20solar%20(1).jpg?auto=compress%2Cformat",
  "Sustainable Biomass Heat":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f9c9878a-37e0-4a20-8a02-5b2ccc5d7761/Sustainable%20Biomass.jpg?auto=compress%2Cformat",
  "Geothermal Heat (GSHP)":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0a4d3eb4-8f18-40f1-907e-db29ecea8da0/Steam%20rising%20from%20the%20Nesjavellir%20Geothermal%20Power%20Station%20in%20Iceland..jpg?auto=compress%2Cformat",
  "Electric Heat Pumps":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f62b07a5-4be2-4a91-b636-ffa51a5d6e59/electric%20heat%20(1).jpg?auto=compress%2Cformat",
  "Electric Vehicles (EVs)":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/55914c00-b8fd-400b-afc3-6e9d16212968/Electric%20Vehicle%20charging%20station%20system%20storing%20power%20on%20white%20modern%20car.%20EV%20fuel%20for%20advanced%20hybrid%20car.%20automobile%20industry%20new%20technology%2C%20clean%20energy%2C%20or%20environmental%20conservation%20concept%20dreamstime_xxl_114496245%20(1).jpg?auto=compress%2Cformat",
  "Hydrogen Fuels for Transport":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/13d86cb7-a74e-4f68-bb68-ebaba88fe8e2/Hydrogen%20transport.jpg?auto=compress%2Cformat",
  "Building Retrofits & Standards":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/caefd8a5-50bf-4486-9bf7-8ae54f0b1972/Aerial%20view%20oveTokyo%20tower%20and%20Tokyo%20cityscape%20with%20high%20rise%20architecture%20at%20sunset%20in%20Tokyo%2C%20Japan%20dreamstime_xxl_116635775%20(1).jpg?auto=compress%2Cformat",
  "Smart Grids & Storage":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/067763c0-9030-4f55-a677-60f1bf93303f/Transmission%20and%20storage%20(1).jpg?auto=compress%2Cformat",
  "Forest Protection":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/eee7386b-d434-4eba-afcc-d48c5a5b2dee/Salonga%20National%20Park%20South_resized.jpg?auto=compress%2Cformat",
  "Wetland & Peatland Protection":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/63e4255d-28e6-499f-b5e9-f02f8688f6f2/Gambia%20Mangroves.%20Aerial%20view%20of%20mangrove%20forest%20in%20Gambia.%20Photo%20made%20by%20drone%20from%20above.%20iStock.jpeg?auto=compress%2Cformat",
  "Grassland & Savanna Conservation":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b9a93d61-bad6-4768-a239-4eb62ac90c35/Bard&#39;s%20tapir%20dreamstime.jpg?auto=compress%2Cformat&w=600",
  "Indigenous & Community Land Rights":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4d4bf710-f662-4f58-b6fc-a0e8b1de4890/Restoring%20the%20Serengeti-Mara%20Ecosystem%20and%20its%20Wildlife%20Through%20Indigenous-led%20Conservation2.jpeg?auto=compress%2Cformat",
  "Marine Protected Areas (MPAs)":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/88cfb686-ab4a-46fc-8720-545741d3faff/Great%20Barrier%20Reef.%20Heart%20Reef.%20Whitsundays.%20Queensland%20Australia%20shutterstock_1597510444.jpg?auto=compress%2Cformat",
  "Coral Reef Restoration & Resilience":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e490e41e-2bee-49b2-a330-2993fc568368/kelp%20forest%20views%20from%20below%20shutterstock_1331702939%20(1).jpg?auto=compress%2Cformat",
  "Sustainable Fisheries & Marine Management":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/75b07a8c-e94e-4f53-8f8d-0193ffe62d3f/videoblocks-school-of-fish-sharks-swim-in-a-circle_sqhnhov3m_1080__D%20(0-00-02-03).png?auto=compress%2Cformat",
  "Blue Carbon Habitats (mangroves, seagrass)":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/20321b45-afc5-4b86-822c-8f85aa5e6d1a/Underwater%20image%20of%20kelp%20off%20the%20shores%20of%20Catalina%20shutterstock_610509038.jpg?auto=compress%2Cformat",
  "Reforestation & Afforestation":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3b27fd7-e463-4f93-875a-0174c4e6eb9e/hands%20holding%20aplingdreamstime_xxl_38295437%20(1).jpg?auto=compress%2Cformat",
  "Peatland Restoration":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b06382da-3a5e-4956-812a-f6880b55a40e/Landscape%20of%20Kakerdaja%20Bog%2C%20sunrise%20dreamstime_xxl_21747723%20(1).jpg",
  "Mangrove Restoration":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2bfee827-be0f-49ea-8f28-9d9d95a28b9a/Guinean%20Mangroves-WikiCommons2.webp?auto=compress%2Cformat",
  "River & Wetland Restoration":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b06382da-3a5e-4956-812a-f6880b55a40e/Landscape%20of%20Kakerdaja%20Bog%2C%20sunrise%20dreamstime_xxl_21747723%20(1).jpg?auto=compress%2Cformat",
  "Habitat Corridors & Connectivity":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5c311b44-a853-4fc7-85e8-04da91a52b99/elephants%20in%20background%20walking%20shutterstock_60854854%20(1).jpg?auto=compress%2Cformat",
  "Protected Area Expansion & Management":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/92020367-3ebf-490f-a92b-b4912f4adaea/Jungle%20river%20in%20Thapom%20mangrove%20forest%2C%20Krabi%2CThailand%20iStock.jpg",
  Agroforestry:
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4b461add-35ce-408e-bf74-ee1776e89f59/Bombus%20of%20the%20genus%20Hymenoptera%20of%20the%20Apidae%20family.%20Pollinator%20bee%20on%20flower%20iStock.jpeg",
  "Cover Crops & Green Manures":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/bb5e797d-f8b0-41aa-8574-0608f4d29d65/Forest-aerial-view.jpeg",
  "Composting & Organic Amendments":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/637e415f-0deb-4450-9904-9c9d626e74f5/Compost%20dreamstime.jpg?auto=compress%2Cformat",
  "Rotational & Adaptive Grazing":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b9a93d61-bad6-4768-a239-4eb62ac90c35/Bard's%20tapir%20dreamstime.jpg",
  Silvopasture:
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/92020367-3ebf-490f-a92b-b4912f4adaea/Jungle%20river%20in%20Thapom%20mangrove%20forest%2C%20Krabi%2CThailand%20iStock.jpg",
  "Sustainable Textiles & Fibers":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4fa85c8e-a93f-4d17-8695-3b1821c36205/Green%20textles%20(1).jpg",
  "Circular Design & Recycling":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/dbd963d3-1628-4d18-a878-586b95441be9/donate%20box%20dreamstime_109594371.jpg",
  "Advanced nuclear":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/c3126e46-cbf6-47f0-aca8-f9397956c422/Gradient%20dark.webp?auto=compress%2Cformat",
  "Green Hydrogen Heat":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7a114fd4-5cd0-45b3-80c9-ea6100d5fbcf/hydrogen%20power%20(1).jpg?auto=compress%2Cformat",
  "District Heat":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/292b8527-2758-42ea-9d6b-41425a9505d4/new%20district%20heat%20install.jpg?auto=compress%2Cformat",
  "Sustainable E-fuel":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0fc7c6c-eb14-41d1-b034-7c22bc2cb67e/Electrofuels%20or%20e-fuels%20or%20synthetic%20fuels%20are%20an%20emerging%20class%20of%20carbon%20neutral%20fuels%20that%20are%20made%20from%20renewable%20sources.%20ID%20266560582%20%C2%A9%20Luchschen%20_%20Dreamstime.com.jpg?auto=compress%2Cformat",
  "Sustainable Biofuel":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ed392d06-0c9b-4cdb-bf82-8308effec70d/photograph_of_test_tubes_of_algae_for_biofuel.png?auto=compress%2Cformat",
  "Efficient Appliances & Equipment":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a63717e5-fb8d-4701-a169-c9cca876a157/Industrial%20processes%20(2).jpg?auto=compress%2Cformat",
  "Rarity Sites":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ae1fb94a-4c8c-4eca-af25-9206491c4466/Conservation%20Priorities%20map%20Earth.jpg?auto=compress%2Cformat",
  "Intact Wilderness":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/92020367-3ebf-490f-a92b-b4912f4adaea/Jungle%20river%20in%20Thapom%20mangrove%20forest%2C%20Krabi%2CThailand%20iStock.jpg?auto=compress%2Cformat",
  "Urban Biodiversity":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4b461add-35ce-408e-bf74-ee1776e89f59/Bombus%20of%20the%20genus%20Hymenoptera%20of%20the%20Apidae%20family.%20Pollinator%20bee%20on%20flower%20iStock.jpeg?auto=compress%2Cformat",
  "Forest Recovery":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/bb5e797d-f8b0-41aa-8574-0608f4d29d65/Forest-aerial-view.jpeg?auto=compress%2Cformat",
  "Sustainable Forestry":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f7615eb9-3476-49a0-b6ea-8c516e807763/Reforestation%20after%20clearing%20in%20the%20forest%20shutterstock_1546410944%20(1).jpg?auto=compress%2Cformat",
  "Grassland Restoration":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/bd6a3d51-ce9f-48ed-9b87-6a7eb15b08b7/Camel%20safari%20with%20Masai%20warriors%20leading%20camels%20through%20green%20grasslands%20of%20Lewa%20Wildlife%20Conservancy%2C%20North%20Kenya%2C%20Africa.%20Photo%2052322453%20%C2%A9%20Joe%20Sohm%20_%20Dreamstime.com.jpg?auto=compress%2Cformat",
  "Coastal Restoration":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/14d8a974-e63c-42ca-988a-ba3925e42edc/growing%20coral%20garden%20branching%20out%20and%20overlapping%20eachother.%20Coral%20bay%2C%20western%20austrailia%20dreamstime_19163814%20(1).jpg?auto=compress%2Cformat",
  "Land Corridors":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7144273e-10d0-4e4f-914e-4664ad183497/Road%20traversed%20by%20wildlife%20crossing%20forming%20a%20safe%20natural%20corridor%20bridge%20for%20animals%20to%20migrate%20between%20conservancy%20areas%20shutterstock_2027125235.jpg?auto=compress%2Cformat",
  "Buffers & Greenways":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/1aa4d9d6-861f-4e51-9976-16d827b6e27b/Riparian_buffer_on_Bear_Creek_in_Story_County%2C_Iowa%20(1).jpg?auto=compress%2Cformat",
  "Rivers & Streams":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/92039c1a-210b-4890-8153-14dc007f997a/Flowing%20river%20iStock-486755202.jpg?auto=compress%2Cformat",
  "Marine Corridors":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2264e0b0-cb6f-4859-80fb-68dc36f6e72b/school%20of%20yellow%20fin%20fish%20vshutterstock_1917649865%20(1).jpg?auto=compress%2Cformat",
  "Farm Afforestation":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0c372b2d-1ec1-4cb7-9164-0769bd52aec1/Pathway%20at%20an%20orange%20orchard%20with%20large%20orange%20trees%20next%20to%20it%20full%20of%20fruit%20shutterstock_1756052696%20(1).jpg?auto=compress%2Cformat",
  "Cropland Restoration":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7866553c-de80-4f31-9ef1-577d83f53fc9/Growing%20vegetables%20in%20a%20editable%20garden.%20The%20vegetables%20are%20grown%20based%20on%20permaculture%20in%20polycultures%20in%20raised%20beds.%20shutterstock_1321094690%20(1).jpg?auto=compress%2Cformat",
  "Soil Management":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5c670f6c-da37-42fd-bc10-5e5ac50f13f5/Closeup%20hand%20of%20person%20holding%20abundance%20soil%20%20dreamstime_xxl_118015269%20(1).jpg?auto=compress%2Cformat",
  "Sustainable Biochar":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2cd44ee7-9443-4517-8715-a9bf9ba2db74/Rice%20husk%20charcoal%20(biochar)%20for%20fertilizer%20shutterstock_591577631%20(1)%20(1).jpg?auto=compress%2Cformat",
  "Sustainable Fertilizers":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/da3af5bb-ee1e-482b-a57b-ff6c60a29ca8/Hand%20holding%20compost%20with%20redworms.%20A%20farmer%20showing%20the%20worms%20in%20his%20hands%20at%20Chuadanga%2C%20Bangladesh.%20shutterstock_1706531374%20(1)%20(1).jpg?auto=compress%2Cformat",
  "Natural Pest Control":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5f579148-bdc6-4ffa-9225-c089c77cc24f/Ladybug%20on%20a%20green%20leaf.%20Image%20credit%20Roman%20Gorielov%20_%20Dreamstime.jpg?auto=compress%2Cformat",
  "Sustainable Rice Farming":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/02cfdd64-4c90-4821-8064-0ed71fda6a52/An%20aerial%20view%20of%20a%20rice%20field%20terrace%20in%20Bandung%2C%20West%20Java%20Indonesia.%20shutterstock_1135310153.jpeg?auto=compress%2Cformat",
  Agritecture:
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7edf03f2-3c95-4ccf-a7a4-53ba2169a0a4/Rooftop%20Medicine%20Farm%20operated%20by%20the%20Deep%20Medicine%20Circle%2C%20link%20our%20website%20and%20credit%20Tom%20Tompkins.jpg?auto=compress%2Cformat",
  "Crop Optimization":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/36d7efda-b0ff-458e-b920-d758e69ef893/Young%20plant%20with%20cyber%20display%20of%20technological%20smart%20farming%204.0-Smart%20Farming%20and%20Agriculture%20Innovation%20Concept.%20shutterstock_2172873109%20(1).jpg?auto=compress%2Cformat",
  "Dryland Irrigation":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/c4538258-3c5d-478d-bcd1-3f05766d7885/drip%20irrigation%20shutterstock_593060315%20(1).jpg?auto=compress%2Cformat",
  Polyculture:
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/896b9833-bc08-475c-abda-512d10fd0999/Vegetable%20cultivation%20as%20Polyculture%20Garden%2C%20organic%20farming%20shutterstock_1641716668%20(1).jpg?auto=compress%2Cformat",
  "Perennial/Superfoods":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/01ffc0b5-a56f-43b4-a7e8-786fe02907df/Fresh%20acai%20berries%20fruit%20in%20straw%20baskets%20in%20red%20boat%20and%20forest%20trees%20in%20the%20Amazon%20rainforest%2C%20Brazil.%20shutterstock_1913293120%20(1).jpg?auto=compress%2Cformat",
  "Seed Diversity":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/41a0803e-d78a-4092-b17e-a40b0ce76cee/seeds%20Women's%20Earth%20Alliance.webp?auto=compress%2Cformat",
  "Smallholder Farming":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/1cfbcc22-31e3-41bf-b6a8-867dc1bfb4d1/Regenerating%20Guatemala%E2%80%99s%20Cloud%20Forest%20Through%20Indigenous-led%C2%A0Action%20to%20Improve%20the%20Livelihoods%20of%20Smallholder%20Farmers2.png?auto=compress%2Cformat",
  "Sustainable Grazing":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/531da5ce-6dbe-4dd0-b9f2-4f2c620ec3e2/Grazing%20Aerial%20view%20at%20the%20cows.%20Farmland%20landscape%20from%20air.%20Composition%20with%20domestic%20animals.%20Photo%20from%20drone.%20iStock.jpeg?auto=compress%2Cformat",
  "Healthy Feed":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b7f92bc4-9aac-444b-8cce-9fdaae7381c3/Close%20up%20image%20of%20hands%20holding%20animal%20feed%20at%20a%20stock%20yard%20iStock.jpg?auto=compress%2Cformat",
  "Meat-free Proteins":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f9b17242-22ff-4738-9a34-70c3868df0ed/A%20selection%20of%20brightly%20coloured%20beans%20and%20pulses%20on%20sale%20in%20a%20market%20in%20Lamu%20Town%2C%20Kenya.%20dreamstime_xxl_18270049%20(1).jpg?auto=compress%2Cformat",
  "Planetarian Diet":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/cf287022-7219-4d0e-b0d9-389beb5ce452/Planetarian%20Diet%20Large.jpeg?auto=compress%2Cformat",
  "Storage & Logistics":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/22ef8c31-590c-4d41-88ae-a9c8062a145e/Old_Potato_Cellars_near_Shelley%2C_Idaho-cc.jpg?auto=compress%2Cformat",
  "Bioregional Sourcing":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/95aa16fd-7036-438a-9ee3-8a669f46c8bb/Market-2-Bhutan-CC-Yannick%20Beaudoin-2014_resized.jpg?auto=compress%2Cformat",
  "Food Upcycling":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/c50e1520-f8ba-47ea-ace7-e874a4258fcf/ugly%20organic%20carrot%2C%20beetroot%20and%20cucumber%20from%20home%20garden%20dreamstime_xxl_67412034%20(1).jpg?auto=compress%2Cformat",
  "Urban Gardening":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/3fc7cb73-36e8-4787-8c97-079f36ddefb6/vegetables%20growing%20in%20the%20yard%20shutterstock_104261645%20(1).jpg?auto=compress%2Cformat",
  "Meal Planning":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/22a631cd-1f00-4159-ac62-25ff591a7cd8/A%20colorful%20vegetable%20farmshare%20package%20in%20a%20woven%20bamboo%20box.%20Photo%20from%20Good%20Food%20Community.jpg?auto=compress%2Cformat",
  "Sustainable Fiber & Pulp":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/bb87b436-b040-4c97-923c-90f848246162/Closeup_Cotton_Bolls_Field.jpg?auto=compress%2Cformat",
  "Green Textiles":
    "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4fa85c8e-a93f-4d17-8695-3b1821c36205/Green%20textles%20(1).jpg?auto=compress%2Cformat",
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
              description:
                "Solar photovoltaic (PV) power utilizes sheets or panels of semiconducting materials capable of capturing photons from the sun and turning them into an electrical current.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0a6ced7-4400-46c5-b1ad-de5d2ed310ea/solar%20panels%20dreamstime_xxl_149200859%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Energy Access"],
              relatedLevers: ["Policy & Governance", "Finance"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "solar-thermal",
              name: "Solar Thermoelectric",
              summary:
                "Concentrated solar power / solar thermal for electricity and heat.",
              description:
                "Solar thermoelectric technology utilizes mirrors or lenses to concentrate sunlight onto a small area, generating heat that drives a turbine or heat engine to produce electricity.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/89e4725e-2afc-46e8-a07a-d747ad1c8748/Nevada%20Cresent%20Dunes-2-Solar-CC-BLM%20Nevada-2015_resized%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Energy Resilience"],
              relatedLevers: ["Science & Technology", "Finance"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "geothermal-power",
              name: "Geothermal Power",
              summary: "Baseload geothermal electricity where resources allow.",
              description:
                "Geothermal power involves harnessing naturally occurring underground heat—typically found in regions near volcanic activity, geysers, or hot springs—to generate steam for powering turbines and producing electricity.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4e5cf7b5-40e4-4a6a-9101-8f1636d8b405/geothermal%20energy%20heat%20dreamstime_xxl_36725375%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Local Jobs"],
              relatedLevers: ["Finance", "Policy & Governance"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "onshore-wind",
              name: "Onshore Wind",
              summary: "Utility-scale and distributed onshore wind energy.",
              description:
                "Onshore wind power is generated through the use of large wind turbines equipped with long blades that harness the kinetic energy of the wind to drive a connected electric generator.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4529134f-421c-4aa0-b168-afa12f756cb6/wind%20turbine%20farm%20at%20sunset%20dreamstime_xxl_16800093%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Science & Technology"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "offshore-wind",
              name: "Offshore Wind",
              summary:
                "Coastal and deep-water wind farms for large-scale generation.",
              description:
                "Offshore wind power involves the installation of wind turbines anchored to the sea floor, capitalizing on the consistently higher wind speeds over the ocean and enabling the use of larger turbines, thus enhancing their efficiency compared to onshore counterparts, ultimately generating electricity through the rotation of an electric generator.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e44d703a-7667-4c34-817d-a20a1150d4d7/Coastal%20wind%20turbines%20sunset%20dreamstime_xxl_14338512%20(1)%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Ocean Health"],
              relatedLevers: ["Policy & Governance", "Finance"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "wave-energy",
              name: "Wave Energy",
              summary: "Harnessing wave energy where suitable.",
              description:
                "Wave energy, or ocean power, involves harnessing the kinetic energy produced by the natural oscillation of waves, typically achieved through a weighted buoy system that converts the wave motion into electrical energy via a linear or rotary generator.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/55b6cfee-c224-4d7c-91a7-f30af173008a/breaking%20ocean%20wave%20falling%20down%20at%20sunset%20time%20shutterstock_65093608%20(1).jpg?auto=compress%2Cformat",
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
              description:
                "Sustainable hydropower refers to using smaller-scale dams that generate electricity through the controlled flow of water but preserve aquatic ecosystems and ensure unobstructed fish migration pathways.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8aaa9d86-50c2-42c2-9d9a-7559820d7264/Sustainable%20Hydropower.jpg?auto=compress%2Cformat",
              relatedThemes: ["Water Stewardship", "Biodiversity"],
              relatedLevers: ["Policy & Governance"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "biomass-power",
              name: "Biomass Power (sustainable)",
              summary:
                "Sustainably sourced biomass energy with strict ecological safeguards.",
              description:
                "Sustainable biomass power uses cellulosic waste products such as wood scraps, agricultural residues, and organic landfill materials for combustion in a thermoelectric generator to produce electricity while ensuring that harvested trees are not used as a fuel source to maintain forest sustainability.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/407ad8a7-0bcc-4bee-8e1a-2c50d11ffef2/biomass%20farm.jpg?auto=compress%2Cformat",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Policy & Governance", "Legal Empowerment"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "renewable-hydrogen",
              name: "Green Hydrogen",
              summary:
                "Electrolysis-based hydrogen produced with renewable electricity for industry and transport.",
              description:
                "Green hydrogen power involves the production of hydrogen using renewable energy to electrolyze water, which allows for the storage and on-demand use of hydrogen in a fuel cell to provide a clean and sustainable power source.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7a114fd4-5cd0-45b3-80c9-ea6100d5fbcf/hydrogen%20power%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Energy Transition"],
              relatedLevers: ["Science & Technology", "Finance"],
              tags: ["Energy Transition", "Renewable Power"],
            },
            {
              id: "advanced-nuclear",
              name: "Advanced nuclear",
              summary:
                "Next-generation nuclear technology with improved safety and flexibility.",
              description:
                "Advanced nuclear is a next-generation climate solution that builds on the benefits of conventional nuclear while addressing its limitations. Using innovative designs like small modular reactors and advanced fuel cycles, it offers safer, more flexible, and cost-effective carbon-free power. These reactors can provide steady, reliable electricity to complement renewables, while also delivering clean heat and hydrogen for hard-to-decarbonize industries.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/c3126e46-cbf6-47f0-aca8-f9397956c422/Gradient%20dark.webp?auto=compress%2Cformat",
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
              description:
                "Solar heat is the process of harnessing thermal energy from the sun, commonly achieved through a sealed flat plate with copper pipes, utilized for residential, commercial, or industrial space heating or water heating.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6330d246-99fc-4736-b069-c406b0660aad/direct%20solar%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Energy Efficiency"],
              relatedLevers: ["Policy & Governance"],
              tags: ["Energy Transition", "Renewable Heat"],
            },
            {
              id: "geothermal-heat",
              name: "Geothermal Heat (GSHP)",
              summary:
                "Ground-source heat pumps and district geothermal heating.",
              description:
                "Geothermal heat involves the extraction and distribution of subsurface latent heat for residential or industrial heating.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0a4d3eb4-8f18-40f1-907e-db29ecea8da0/Steam%20rising%20from%20the%20Nesjavellir%20Geothermal%20Power%20Station%20in%20Iceland..jpg?auto=compress%2Cformat",
              relatedThemes: ["Energy Access"],
              relatedLevers: ["Finance", "Science & Technology"],
              tags: ["Energy Transition", "Renewable Heat"],
            },
            {
              id: "biomass-heat",
              name: "Sustainable Biomass Heat",
              summary:
                "Low-carbon biomass for heat with sustainable sourcing and pollution controls.",
              description:
                "Sustainable biomass heat refers to the controlled combustion of cellulosic waste products, including wood scraps, agricultural residues, and other organic materials, to generate renewable heat without depleting forests or croplands.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f9c9878a-37e0-4a20-8a02-5b2ccc5d7761/Sustainable%20Biomass.jpg?auto=compress%2Cformat",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Legal Empowerment", "Policy & Governance"],
              tags: ["Energy Transition", "Renewable Heat"],
            },
            {
              id: "electric-heat-pumps",
              name: "Electric Heat Pumps",
              summary:
                "Electrify heating via efficient heat pump technologies.",
              description:
                "Electric heat encompasses several technologies, such as heat pumps, space heaters, and induction ovens, that can convert renewable electricity into heat through electric resistance, radiation, induction, or efficient heat transfer.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f62b07a5-4be2-4a91-b636-ffa51a5d6e59/electric%20heat%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Energy Efficiency", "Public Health"],
              relatedLevers: ["Finance", "Policy & Governance"],
              tags: ["Energy Transition", "Renewable Heat"],
            },
            {
              id: "green-hydrogen-heat",
              name: "Green Hydrogen Heat",
              summary:
                "Using sustainably produced hydrogen for high-heat industrial needs.",
              description:
                "Green hydrogen heat involves using sustainably produced hydrogen to generate heat through combustion for high-heat industrial needs or co-generation fuel cells for lower-heat commercial and residential markets.",
              tags: ["Energy Transition", "Renewable Heat"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7a114fd4-5cd0-45b3-80c9-ea6100d5fbcf/hydrogen%20power%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "district-heat",
              name: "District Heat",
              summary:
                "Utility-scale system for distributing heat from renewable sources.",
              description:
                "District heat is a utility-scale system for distributing heat from renewable sources (such as bioenergy, solar thermal, heat pumps, or geothermal) through a system of insulated pipes for residential and industrial needs.",
              tags: ["Energy Transition", "Renewable Heat"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/292b8527-2758-42ea-9d6b-41425a9505d4/new%20district%20heat%20install.jpg?auto=compress%2Cformat",
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
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/55914c00-b8fd-400b-afc3-6e9d16212968/Electric%20Vehicle%20charging%20station%20system%20storing%20power%20on%20white%20modern%20car.%20EV%20fuel%20for%20advanced%20hybrid%20car.%20automobile%20industry%20new%20technology%2C%20clean%20energy%2C%20or%20environmental%20conservation%20concept%20dreamstime_xxl_114496245%20(1).jpg?auto=compress%2Cformat",
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
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/45d9d6c3-d308-428b-b715-fe1586e1c5ca/Chinese%20electric%20train%20cut%20across%20railway%20station%20dreamstime_xxl_17824938%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Urban Mobility"],
              relatedLevers: ["Policy & Governance", "Finance"],
              tags: ["Energy Transition", "Renewable Transport"],
            },
            {
              id: "hydrogen-fuels-transport",
              name: "Hydrogen Fuels for Transport",
              summary:
                "Hydrogen for heavy freight, shipping, and aviation where electrification is hard.",
              description:
                "Green hydrogen fuel is produced using renewable energy to electrolyze water (splitting water into hydrogen and oxygen). The resulting hydrogen can be stored and used on demand in a fuel cell to create renewable power.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/13d86cb7-a74e-4f68-bb68-ebaba88fe8e2/Hydrogen%20transport.jpg?auto=compress%2Cformat",
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
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/45d9d6c3-d308-428b-b715-fe1586e1c5ca/Chinese%20electric%20train%20cut%20across%20railway%20station%20dreamstime_xxl_17824938%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Public Health", "Equity"],
              relatedLevers: ["Community Action", "Policy & Governance"],
              tags: ["Energy Transition", "Renewable Transport"],
            },
            {
              id: "sustainable-efuel",
              name: "Sustainable E-fuel",
              summary:
                "Synthetic fuels produced using renewable power for aviation and shipping.",
              description:
                "Sustainable e-fuels are combustible fuels similar to petroleum but synthesized using renewable power and abundant resources such as hydrogen and carbon monoxide, applicable for use in existing aircraft and maritime vessels without substantial engine modifications.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f0fc7c6c-eb14-41d1-b034-7c22bc2cb67e/Electrofuels%20or%20e-fuels%20or%20synthetic%20fuels%20are%20an%20emerging%20class%20of%20carbon%20neutral%20fuels%20that%20are%20made%20from%20renewable%20sources.%20ID%20266560582%20%C2%A9%20Luchschen%20_%20Dreamstime.com.jpg?auto=compress%2Cformat",
              tags: ["Energy Transition", "Renewable Transport"],
            },
            {
              id: "sustainable-biofuel",
              name: "Sustainable Biofuel",
              summary:
                "Liquid fuels from non-food feedstocks like algae and waste biomass.",
              description:
                "Sustainable biofuels are combustible liquid fuels produced from non-food feedstocks like algae and waste biomass, in contrast to those sourced from crops like soy and corn, which compete for critical agricultural land required for food production.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ed392d06-0c9b-4cdb-bf82-8308effec70d/photograph_of_test_tubes_of_algae_for_biofuel.png?auto=compress%2Cformat",
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
              description:
                "Built environment encompasses any constructed structure or system, including whole cities, residential homes, commercial buildings, government facilities, roads, bridges, and factories, designed with a focus on minimizing energy needs, material usage, and associated emissions.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/caefd8a5-50bf-4486-9bf7-8ae54f0b1972/Aerial%20view%20oveTokyo%20tower%20and%20Tokyo%20cityscape%20with%20high%20rise%20architecture%20at%20sunset%20in%20Tokyo%2C%20Japan%20dreamstime_xxl_116635775%20(1).jpg?auto=compress%2Cformat",
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
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/067763c0-9030-4f55-a677-60f1bf93303f/Transmission%20and%20storage%20(1).jpg?auto=compress%2Cformat",
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
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a63717e5-fb8d-4701-a169-c9cca876a157/Industrial%20processes%20(2).jpg?auto=compress%2Cformat",
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
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/eee7386b-d434-4eba-afcc-d48c5a5b2dee/Salonga%20National%20Park%20South_resized.jpg?auto=compress%2Cformat",
              relatedThemes: ["Indigenous Rights", "Biodiversity"],
              relatedLevers: ["Legal Empowerment", "Community Action"],
              tags: ["Nature Conservation", "Land Conservation"],
            },
            {
              id: "wetland-protection",
              name: "Wetland & Peatland Protection",
              summary:
                "Conserve wetlands and peatlands to protect biodiversity and carbon stores.",
              description:
                "Climate refugia refers to unprotected areas not included in other designations of the Global Safety Net that help to stabilize our global climate system by absorbing and storing more than 50 metric tons of carbon per hectare of land.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/63e4255d-28e6-499f-b5e9-f02f8688f6f2/Gambia%20Mangroves.%20Aerial%20view%20of%20mangrove%20forest%20in%20Gambia.%20Photo%20made%20by%20drone%20from%20above.%20iStock.jpeg?auto=compress%2Cformat",
              relatedThemes: ["Water Stewardship"],
              relatedLevers: ["Policy & Governance"],
              tags: ["Nature Conservation", "Land Conservation"],
            },
            {
              id: "grassland-conservation",
              name: "Grassland & Savanna Conservation",
              summary:
                "Protect native grasslands and rangelands from conversion.",
              description:
                "Land habitats are unprotected land areas with groupings of plants and animals vital to maintaining healthy ecosystems.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b9a93d61-bad6-4768-a239-4eb62ac90c35/Bard&#39;s%20tapir%20dreamstime.jpg?auto=compress%2Cformat&w=600",
              relatedThemes: ["Biodiversity", "Sustainable Livelihoods"],
              relatedLevers: ["Policy & Governance"],
              tags: ["Nature Conservation", "Land Conservation"],
            },
            {
              id: "indigenous-stewardship",
              name: "Indigenous & Community Land Rights",
              summary:
                "Secure land tenure and support Indigenous-led conservation.",
              description:
                "Indigenous tenure refers to land currently occupied or managed by Indigenous People or Local Communities (IPLCs) that are legally recognized by governments as belonging to those communities.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4d4bf710-f662-4f58-b6fc-a0e8b1de4890/Restoring%20the%20Serengeti-Mara%20Ecosystem%20and%20its%20Wildlife%20Through%20Indigenous-led%20Conservation2.jpeg?auto=compress%2Cformat",
              relatedThemes: ["Indigenous Rights", "Climate Justice"],
              relatedLevers: ["Legal Empowerment", "Philanthro-Activism"],
              tags: ["Nature Conservation", "Land Conservation"],
            },
            {
              id: "rarity-sites",
              name: "Rarity Sites",
              summary:
                "Unprotected areas needing immediate protection for rare species.",
              description:
                "Rarity sites, or Conservation Imperatives, are unprotected areas that need to be protected immediately due to the presence of rare, threatened, or range-restricted plant and animal species.",
              tags: ["Nature Conservation", "Land Conservation"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ae1fb94a-4c8c-4eca-af25-9206491c4466/Conservation%20Priorities%20map%20Earth.jpg?auto=compress%2Cformat",
            },
            {
              id: "mammal-assemblages",
              name: "Explore Mammal Assemblages",
              summary:
                "Large mammal landscapes with seasonal groupings of megafauna.",
              description:
                "Mammal assemblages refers to currently unprotected large mammal landscapes where seasonal groupings of animals occur, particularly megafauna.",
              tags: ["Nature Conservation", "Land Conservation"],
            },
            {
              id: "intact-wilderness",
              name: "Intact Wilderness",
              summary:
                "Unprotected areas with large extents of intact wilderness.",
              description:
                "Intact wilderness refers to unprotected areas with a large extent of intact wilderness, such as continuous forests, shrublands, and grasslands, that aren't identified in previous layers of the Global Safety Net.",
              tags: ["Nature Conservation", "Land Conservation"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/92020367-3ebf-490f-a92b-b4912f4adaea/Jungle%20river%20in%20Thapom%20mangrove%20forest%2C%20Krabi%2CThailand%20iStock.jpg?auto=compress%2Cformat",
            },
            {
              id: "urban-biodiversity",
              name: "Urban Biodiversity",
              summary:
                "Reintroducing nature and wildlife into urban and suburban areas.",
              description:
                "Urban biodiversity refers to methods that reintroduce nature and wildlife back into urban or suburban areas, including tree planting, microforests, pollinator meadows, and river restoration.",
              tags: ["Nature Conservation", "Land Conservation"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4b461add-35ce-408e-bf74-ee1776e89f59/Bombus%20of%20the%20genus%20Hymenoptera%20of%20the%20Apidae%20family.%20Pollinator%20bee%20on%20flower%20iStock.jpeg?auto=compress%2Cformat",
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
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/88cfb686-ab4a-46fc-8720-545741d3faff/Great%20Barrier%20Reef.%20Heart%20Reef.%20Whitsundays.%20Queensland%20Australia%20shutterstock_1597510444.jpg?auto=compress%2Cformat",
              relatedThemes: ["Ocean Health"],
              relatedLevers: ["Policy & Governance", "Community Action"],
              tags: ["Nature Conservation", "Ocean Conservation"],
            },
            {
              id: "coral-reef-restoration",
              name: "Coral Reef Restoration & Resilience",
              summary:
                "Active restoration and reducing local stressors for reef recovery.",
              description:
                "Marine habitats are currently unprotected areas with groupings of plants and animals that are vital to maintaining healthy ocean ecosystems.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e490e41e-2bee-49b2-a330-2993fc568368/kelp%20forest%20views%20from%20below%20shutterstock_1331702939%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Biodiversity", "Public Health"],
              relatedLevers: ["Science & Technology"],
              tags: ["Nature Conservation", "Ocean Conservation"],
            },
            {
              id: "sustainable-fisheries",
              name: "Sustainable Fisheries & Marine Management",
              summary:
                "Sustainable quotas, monitoring and community-based fisheries management.",
              description:
                "Sustainable fisheries are fishing operations managed in a manner that ensures the long-term health and productivity of fish stocks and the marine ecosystems in which they live. This involves harvesting at a rate where the fish population can replenish itself naturally, thereby avoiding overfishing.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/75b07a8c-e94e-4f53-8f8d-0193ffe62d3f/videoblocks-school-of-fish-sharks-swim-in-a-circle_sqhnhov3m_1080__D%20(0-00-02-03).png?auto=compress%2Cformat",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Policy & Governance", "Legal Empowerment"],
              tags: ["Nature Conservation", "Ocean Conservation"],
            },
            {
              id: "blue-carbon-habitats",
              name: "Blue Carbon Habitats (mangroves, seagrass)",
              summary:
                "Protect and restore mangroves, seagrass and saltmarsh for carbon and co-benefits.",
              description:
                "Marine carbon sinks are natural reservoirs in the ocean that absorb and store carbon dioxide from the atmosphere through various physical and biological processes.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/20321b45-afc5-4b86-822c-8f85aa5e6d1a/Underwater%20image%20of%20kelp%20off%20the%20shores%20of%20Catalina%20shutterstock_610509038.jpg?auto=compress%2Cformat",
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
              description:
                "Reforestation involves planting native trees in areas affected by man-made disturbances (e.g., logging, mining, agricultural clearing, and development) or by natural disturbances (e.g., wildfires, drought, and insect and disease infestations).",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3b27fd7-e463-4f93-875a-0174c4e6eb9e/hands%20holding%20aplingdreamstime_xxl_38295437%20(1).jpg?auto=compress%2Cformat",
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
              description:
                "Mangrove restoration consists of reviving or rehabilitating coastal mangrove ecosystems, which help sequester carbon, safeguard coastlines against storms and erosion, and foster biodiversity.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2bfee827-be0f-49ea-8f28-9d9d95a28b9a/Guinean%20Mangroves-WikiCommons2.webp?auto=compress%2Cformat",
              relatedThemes: ["Coastal Resilience"],
              relatedLevers: ["Community Action"],
              tags: ["Nature Conservation", "Ecosystem Restoration"],
            },
            {
              id: "river-restoration",
              name: "River & Wetland Restoration",
              summary:
                "Restore river flows, wetlands and floodplains for biodiversity and flood control.",
              description:
                "Wetland restoration refers to a combination of management practices and planting native species to restore and enhance the health of all types of wetlands, including marshes, swamps, bogs, fens, seagrass, and kelp forests.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b06382da-3a5e-4956-812a-f6880b55a40e/Landscape%20of%20Kakerdaja%20Bog%2C%20sunrise%20dreamstime_xxl_21747723%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Water Stewardship"],
              relatedLevers: ["Policy & Governance"],
              tags: ["Nature Conservation", "Ecosystem Restoration"],
            },
            {
              id: "forest-recovery",
              name: "Forest Recovery",
              summary:
                "Restoring previously logged or degraded forests through natural regeneration.",
              description:
                "Forest recovery refers to restoring previously logged or degraded forests through natural regeneration. This restoration can be unassisted or assisted, with the latter involving periodic clearing of invasive species, if present.",
              tags: ["Nature Conservation", "Ecosystem Restoration"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/bb5e797d-f8b0-41aa-8574-0608f4d29d65/Forest-aerial-view.jpeg?auto=compress%2Cformat",
            },
            {
              id: "sustainable-forestry",
              name: "Sustainable Forestry",
              summary:
                "Forest management with selective logging instead of clear-cutting.",
              description:
                "Sustainable forestry is a forest management technique that includes selective logging instead of clear-cutting. It is more expensive but results in high-quality timber products over the longer term, reducing carbon emissions from logging and benefiting wildlife.",
              tags: ["Nature Conservation", "Ecosystem Restoration"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f7615eb9-3476-49a0-b6ea-8c516e807763/Reforestation%20after%20clearing%20in%20the%20forest%20shutterstock_1546410944%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "grassland-restoration",
              name: "Grassland Restoration",
              summary:
                "Practices that restore or enhance the health of grassland ecosystems.",
              description:
                "Grassland restoration includes a suite of practices that restore or enhance the health of grassland ecosystems, including managing and planting native species.",
              tags: ["Nature Conservation", "Ecosystem Restoration"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/bd6a3d51-ce9f-48ed-9b87-6a7eb15b08b7/Camel%20safari%20with%20Masai%20warriors%20leading%20camels%20through%20green%20grasslands%20of%20Lewa%20Wildlife%20Conservancy%2C%20North%20Kenya%2C%20Africa.%20Photo%2052322453%20%C2%A9%20Joe%20Sohm%20_%20Dreamstime.com.jpg?auto=compress%2Cformat",
            },
            {
              id: "coastal-restoration",
              name: "Coastal Restoration",
              summary:
                "Rehabilitating degraded coastal ecosystems to restore natural functions.",
              description:
                "Coastal restoration is the process of rehabilitating degraded coastal ecosystems to restore their natural functions and ecological integrity. This hybridizing or reestablishing corals in areas that have experienced bleaching or other disturbances.",
              tags: ["Nature Conservation", "Ecosystem Restoration"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/14d8a974-e63c-42ca-988a-ba3925e42edc/growing%20coral%20garden%20branching%20out%20and%20overlapping%20eachother.%20Coral%20bay%2C%20western%20austrailia%20dreamstime_19163814%20(1).jpg?auto=compress%2Cformat",
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
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5c311b44-a853-4fc7-85e8-04da91a52b99/elephants%20in%20background%20walking%20shutterstock_60854854%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Policy & Governance", "Community Action"],
              tags: [
                "Nature Conservation",
                "Wildlife Connectivity & Protected Area Expansion",
              ],
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
              tags: [
                "Nature Conservation",
                "Wildlife Connectivity & Protected Area Expansion",
              ],
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
              tags: [
                "Nature Conservation",
                "Wildlife Connectivity & Protected Area Expansion",
              ],
            },
            {
              id: "species-recovery",
              name: "Species Recovery & Conservation Programs",
              summary: "Targeted conservation for endangered species.",
              description:
                "Species recovery involves targeted conservation efforts for endangered species and their habitats.",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Science & Technology", "Community Action"],
              tags: [
                "Nature Conservation",
                "Wildlife Connectivity & Protected Area Expansion",
              ],
            },
            {
              id: "land-corridors",
              name: "Land Corridors",
              summary:
                "Landscapes connecting wildlife areas for animal movement.",
              description:
                "Land corridors are landscapes that connect two or more wildlife areas, allowing animals to move freely between larger areas of intact habitat.",
              tags: [
                "Nature Conservation",
                "Wildlife Connectivity & Protected Area Expansion",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7144273e-10d0-4e4f-914e-4664ad183497/Road%20traversed%20by%20wildlife%20crossing%20forming%20a%20safe%20natural%20corridor%20bridge%20for%20animals%20to%20migrate%20between%20conservancy%20areas%20shutterstock_2027125235.jpg?auto=compress%2Cformat",
            },
            {
              id: "buffers-greenways",
              name: "Buffers & Greenways",
              summary:
                "Areas separating cultivated land from protected areas and habitats.",
              description:
                "Buffers and greenways are areas of land used to separate cultivated or developed land from protected areas, Indigenous conservation areas, and wildlife habitats. Buffer areas can help meet a number of natural resource, economic, and social objectives, including providing wildlife habitat, protecting cropland and downstream communities from flood damage, and filtering nutrients, pesticides, and animal waste from agricultural land runoff.",
              tags: [
                "Nature Conservation",
                "Wildlife Connectivity & Protected Area Expansion",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/1aa4d9d6-861f-4e51-9976-16d827b6e27b/Riparian_buffer_on_Bear_Creek_in_Story_County%2C_Iowa%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "rivers-streams",
              name: "Rivers & Streams",
              summary:
                "River areas enabling river-dependent species to feed, mate, and migrate.",
              description:
                "Areas of land running alongside a river or a portion of a river bed that enable river-dependent species to feed, mate, and migrate. Conserving these can stabilize river banks and reduce the velocity of water to support wildlife.",
              tags: [
                "Nature Conservation",
                "Wildlife Connectivity & Protected Area Expansion",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/92039c1a-210b-4890-8153-14dc007f997a/Flowing%20river%20iStock-486755202.jpg?auto=compress%2Cformat",
            },
            {
              id: "marine-corridors",
              name: "Marine Corridors",
              summary:
                "Migration routes for sea birds, fish, and marine mammals.",
              description:
                "Marine corridors serve as migration routes for sea birds, fish, and marine mammals free of interference from human activity.",
              tags: [
                "Nature Conservation",
                "Wildlife Connectivity & Protected Area Expansion",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2264e0b0-cb6f-4859-80fb-68dc36f6e72b/school%20of%20yellow%20fin%20fish%20vshutterstock_1917649865%20(1).jpg?auto=compress%2Cformat",
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
                "Agroforestry is the practice of cultivating trees, crops, and sometimes livestock in a complementary manner, allowing for multi-story production of diverse products that promote biodiversity, improve soil health, and enhance ecosystem resilience.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/69656b16-dc30-447e-8393-058f51102d04/shared%20forest%20system%20agroforestry%20dreamstime_xxl_270798972%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Sustainable Livelihoods"],
              relatedLevers: ["Community Action", "Finance"],
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
            },
            {
              id: "cover-crops",
              name: "Cover Crops & Green Manures",
              summary:
                "Use cover crops to protect soil, fix nitrogen and improve fertility.",
              description:
                "Cover crops and green manures involve planting specific crops to protect and enrich soil between main crop seasons, improving soil health and reducing the need for synthetic fertilizers.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7866553c-de80-4f31-9ef1-577d83f53fc9/Growing%20vegetables%20in%20a%20editable%20garden.%20The%20vegetables%20are%20grown%20based%20on%20permaculture%20in%20polycultures%20in%20raised%20beds.%20shutterstock_1321094690%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Soil Health"],
              relatedLevers: ["Science & Technology"],
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
            },
            {
              id: "farm-afforestation",
              name: "Farm Afforestation",
              summary:
                "Strategic integration of tree-based systems within croplands.",
              description:
                "Farm afforestation involves the strategic integration of diverse tree-based systems, such as windbreaks, pocket forests, orchards, or alley cropping, within croplands, contributing to enhanced carbon sequestration, biodiversity conservation, and improved land management practices that promote sustainable agriculture.",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0c372b2d-1ec1-4cb7-9164-0769bd52aec1/Pathway%20at%20an%20orange%20orchard%20with%20large%20orange%20trees%20next%20to%20it%20full%20of%20fruit%20shutterstock_1756052696%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "cropland-restoration",
              name: "Cropland Restoration",
              summary:
                "Converting degraded agricultural land into sustainable use.",
              description:
                "Cropland restoration is converting degraded or abandoned agricultural land into sustainable use by applying regenerative agriculture practices that help regenerate ecosystems, promote biodiversity, and enhance soil quality for long-term food production.",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7866553c-de80-4f31-9ef1-577d83f53fc9/Growing%20vegetables%20in%20a%20editable%20garden.%20The%20vegetables%20are%20grown%20based%20on%20permaculture%20in%20polycultures%20in%20raised%20beds.%20shutterstock_1321094690%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "no-till",
              name: "No-Till & Reduced Tillage",
              summary:
                "Minimize soil disturbance to increase carbon retention.",
              description:
                "No-till and reduced tillage farming minimizes soil disturbance to preserve soil structure, reduce erosion, and increase carbon retention in agricultural soils.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5c670f6c-da37-42fd-bc10-5e5ac50f13f5/Closeup%20hand%20of%20person%20holding%20abundance%20soil%20%20dreamstime_xxl_118015269%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Soil Health"],
              relatedLevers: ["Policy & Governance"],
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
            },
            {
              id: "composting",
              name: "Composting & Organic Amendments",
              summary:
                "Return organic matter to soils for fertility and carbon.",
              description:
                "Composting involves the natural decomposition of organic matter, such as plant debris and food scraps, into a valuable fertilizer and soil amendment, contributing to soil health, improved water retention, and carbon sequestration.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/637e415f-0deb-4450-9904-9c9d626e74f5/Compost%20dreamstime.jpg?auto=compress%2Cformat",
              relatedThemes: ["Circularity"],
              relatedLevers: ["Community Action"],
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
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
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/da3af5bb-ee1e-482b-a57b-ff6c60a29ca8/Hand%20holding%20compost%20with%20redworms.%20A%20farmer%20showing%20the%20worms%20in%20his%20hands%20at%20Chuadanga%2C%20Bangladesh.%20shutterstock_1706531374%20(1)%20(1).jpg?auto=compress%2Cformat",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
            },
            {
              id: "soil-management",
              name: "Soil Management",
              summary:
                "Holistic farming practices to foster soil health and carbon content.",
              description:
                "Soil management encompasses a range of holistic farming practices, including cover crops, erosion control, microbial inoculants, and non-fertilizer soil improvers, designed to foster soil health, resilience, and carbon content, ensuring sustainable and productive agricultural systems while minimizing negative environmental impacts.",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5c670f6c-da37-42fd-bc10-5e5ac50f13f5/Closeup%20hand%20of%20person%20holding%20abundance%20soil%20%20dreamstime_xxl_118015269%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "sustainable-biochar",
              name: "Sustainable Biochar",
              summary:
                "Turning sustainably sourced biomass into charcoal to enrich soil.",
              description:
                "Sustainable biochar refers to turning sustainably sourced biomass into charcoal, which can enrich and fortify agricultural soil, enhancing its fertility, water retention, and structure while sequestering carbon.",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2cd44ee7-9443-4517-8715-a9bf9ba2db74/Rice%20husk%20charcoal%20(biochar)%20for%20fertilizer%20shutterstock_591577631%20(1)%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "sustainable-fertilizers",
              name: "Sustainable Fertilizers",
              summary:
                "Organic-based fertilizers fostering nutrient-rich soil.",
              description:
                "Sustainable fertilizers are organic-based fertilizers, including compost, herbivore manures, vermiculture, microbial soil amendments, and domestic sewage, fostering nutrient-rich soil, promoting healthy crop growth, and minimizing detrimental environmental impacts.",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/da3af5bb-ee1e-482b-a57b-ff6c60a29ca8/Hand%20holding%20compost%20with%20redworms.%20A%20farmer%20showing%20the%20worms%20in%20his%20hands%20at%20Chuadanga%2C%20Bangladesh.%20shutterstock_1706531374%20(1)%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "natural-pest-control",
              name: "Natural Pest Control",
              summary:
                "Environmentally friendly methods of managing pests using ecological processes.",
              description:
                "Natural pest control refers to environmentally friendly methods of managing pests—such as harmful insects, weeds, or plant diseases—by leveraging ecological processes instead of synthetic chemicals. By integrating natural pest control into agriculture and land management, we can foster ecosystems that are both productive and resilient, helping to mitigate climate change while preserving biodiversity.",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5f579148-bdc6-4ffa-9225-c089c77cc24f/Ladybug%20on%20a%20green%20leaf.%20Image%20credit%20Roman%20Gorielov%20_%20Dreamstime.jpg?auto=compress%2Cformat",
            },
            {
              id: "sustainable-rice-farming",
              name: "Sustainable Rice Farming",
              summary:
                "Eco-friendly practices that minimize resource usage and mitigate methane emissions.",
              description:
                "Sustainable rice farming employs a variety of eco-friendly practices that minimize resource usage, enhance productivity through improved seed selection and reduced crop loss, and mitigate methane emissions by implementing water management techniques that limit the duration of flooding in rice paddies.",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/02cfdd64-4c90-4821-8064-0ed71fda6a52/An%20aerial%20view%20of%20a%20rice%20field%20terrace%20in%20Bandung%2C%20West%20Java%20Indonesia.%20shutterstock_1135310153.jpeg?auto=compress%2Cformat",
            },
            {
              id: "agritecture",
              name: "Agritecture",
              summary:
                "Integration of agricultural practices into built environments.",
              description:
                "Agritecture refers to the innovative integration of agricultural practices into built environments. It encompasses methods such as vertical farming, advanced greenhouses, and green roofs, offering sustainable and efficient urban farming solutions that optimize land use and promote local food production in urban settings.",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7edf03f2-3c95-4ccf-a7a4-53ba2169a0a4/Rooftop%20Medicine%20Farm%20operated%20by%20the%20Deep%20Medicine%20Circle%2C%20link%20our%20website%20and%20credit%20Tom%20Tompkins.jpg?auto=compress%2Cformat",
            },
            {
              id: "crop-optimization",
              name: "Crop Optimization",
              summary:
                "Using AI and data modeling to determine optimal crop locations.",
              description:
                "Using AI and data modeling to determine the optimal location for various crops, increasing overall yields and crop resilience while reducing water consumption.",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/36d7efda-b0ff-458e-b920-d758e69ef893/Young%20plant%20with%20cyber%20display%20of%20technological%20smart%20farming%204.0-Smart%20Farming%20and%20Agriculture%20Innovation%20Concept.%20shutterstock_2172873109%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "dryland-irrigation",
              name: "Dryland Irrigation",
              summary:
                "Identifying rainfed cropland that could be irrigated sustainably.",
              description:
                "Dryland irrigation refers to identifying presently rainfed cropland that could be irrigated to increase yields and reduce food insecurity without increasing land needed for agriculture or depleting sustainable water resources.",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/c4538258-3c5d-478d-bcd1-3f05766d7885/drip%20irrigation%20shutterstock_593060315%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "polyculture",
              name: "Polyculture",
              summary:
                "Cultivating multiple crops with symbiotic properties in the same area.",
              description:
                "Polyculture is the practice of cultivating multiple crops, often with symbiotic properties, in the same area, which helps sequester carbon, enhance biodiversity, and improve yield resilience.",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/896b9833-bc08-475c-abda-512d10fd0999/Vegetable%20cultivation%20as%20Polyculture%20Garden%2C%20organic%20farming%20shutterstock_1641716668%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "perennial-superfoods",
              name: "Perennial/Superfoods",
              summary:
                "Nutrient-rich crops that don't require replanting each year.",
              description:
                "Perennial superfoods, including acai, goji, and moringa, are exceptionally high in nutrients and beneficial for human health but do not require replanting each year, reducing soil erosion and increasing carbon sequestration relative to annual crops.",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/01ffc0b5-a56f-43b4-a7e8-786fe02907df/Fresh%20acai%20berries%20fruit%20in%20straw%20baskets%20in%20red%20boat%20and%20forest%20trees%20in%20the%20Amazon%20rainforest%2C%20Brazil.%20shutterstock_1913293120%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "seed-diversity",
              name: "Seed Diversity",
              summary:
                "Practices that increase genetic diversity of plants available to farmers.",
              description:
                "Seed diversity refers to practices that increase the genetic diversity of plants available to farmers by restoring heirloom crops or creating new strains through hybridization, which bolster food security and enhance crop resilience to pest and climate impacts.",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/41a0803e-d78a-4092-b17e-a40b0ce76cee/seeds%20Women&#39;s%20Earth%20Alliance.webp?auto=compress%2Cformat&w=600",
            },
            {
              id: "smallholder-farming",
              name: "Smallholder Farming",
              summary: "Family or community farms on less than five acres.",
              description:
                "Smallholder farming refers to family or community farms on less than five acres, which aid food security and climate change by allowing for micro-management of a diversity of crops adapted to a specific region with much lower carbon footprints than industrial agriculture.",
              tags: ["Regenerative Agriculture", "Regenerative Croplands"],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/1cfbcc22-31e3-41bf-b6a8-867dc1bfb4d1/Regenerating%20Guatemala%E2%80%99s%20Cloud%20Forest%20Through%20Indigenous-led%C2%A0Action%20to%20Improve%20the%20Livelihoods%20of%20Smallholder%20Farmers2.png?auto=compress%2Cformat",
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
              tags: [
                "Regenerative Agriculture",
                "Sustainable Rangelands & Pastures",
              ],
            },
            {
              id: "silvopasture",
              name: "Silvopasture",
              summary:
                "Integrate trees into pasture systems for shade, fodder and carbon.",
              description:
                "Silvopasture integrates trees into pasture systems for shade, fodder, and carbon sequestration while maintaining livestock production.",
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a3402eb7-1f40-4fe2-aa44-258d808926bc/Concept%20of%20agroforestry%20and%20silvopasture%2C%20exemplified%20by%20grazing%20cattle%20in%20a%20grove%20outside%20La%CC%88cko%CC%88%20Castle%20at%20Lake%20Va%CC%88nern%2C%20West%20Gothland%2C%20Sweden%20shutterstock_1830249536%20(1).jpg?auto=compress%2Cformat",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Finance", "Community Action"],
              tags: [
                "Regenerative Agriculture",
                "Sustainable Rangelands & Pastures",
              ],
            },
            {
              id: "rangeland-restoration",
              name: "Rangeland Restoration & Invasive Species Control",
              summary: "Restore degraded rangelands and remove invasives.",
              description:
                "Rangeland restoration involves restoring degraded rangelands and removing invasive species to improve ecosystem health and productivity.",
              relatedThemes: ["Biodiversity"],
              relatedLevers: ["Science & Technology", "Policy & Governance"],
              tags: [
                "Regenerative Agriculture",
                "Sustainable Rangelands & Pastures",
              ],
            },
            {
              id: "sustainable-grazing",
              name: "Sustainable Grazing",
              summary:
                "Strategic control of livestock grazing that promotes pasture regrowth.",
              description:
                "Sustainable Grazing is the strategic control of livestock grazing (such as cattle, bison, goats, and sheep) on pasturelands that promotes pasture regrowth, supports biodiversity, and enhances soil health by mimicking the natural grazing behaviors of wild herbivores.",
              tags: [
                "Regenerative Agriculture",
                "Sustainable Rangelands & Pastures",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/531da5ce-6dbe-4dd0-b9f2-4f2c620ec3e2/Grazing%20Aerial%20view%20at%20the%20cows.%20Farmland%20landscape%20from%20air.%20Composition%20with%20domestic%20animals.%20Photo%20from%20drone.%20iStock.jpeg?auto=compress%2Cformat",
            },
            {
              id: "healthy-feed",
              name: "Healthy Feed",
              summary:
                "Nutritionally balanced diet for livestock that reduces methane emissions.",
              description:
                "Healthy feed refers to a nutritionally balanced diet provided to livestock that contains essential macronutrients, vitamins, minerals, and adequate fiber, fostering animal well-being, reducing reliance on antibiotics, and mitigating methane emissions.",
              tags: [
                "Regenerative Agriculture",
                "Sustainable Rangelands & Pastures",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b7f92bc4-9aac-444b-8cce-9fdaae7381c3/Close%20up%20image%20of%20hands%20holding%20animal%20feed%20at%20a%20stock%20yard%20iStock.jpg?auto=compress%2Cformat",
            },
            {
              id: "meat-free-proteins",
              name: "Meat-free Proteins",
              summary:
                "Plant-based protein alternatives from pulses, seaweed, and other sources.",
              description:
                "Meat-free proteins represent an emerging sector in the food industry focused on plant-based protein alternatives sourced from pulses, seaweed, moringa, and other high-protein sources that can be produced and processed sustainably.",
              tags: [
                "Regenerative Agriculture",
                "Sustainable Rangelands & Pastures",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f9b17242-22ff-4738-9a34-70c3868df0ed/A%20selection%20of%20brightly%20coloured%20beans%20and%20pulses%20on%20sale%20in%20a%20market%20in%20Lamu%20Town%2C%20Kenya.%20dreamstime_xxl_18270049%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "planetarian-diet",
              name: "Planetarian Diet",
              summary:
                "Nutritional approach promoting sustainable and healthy dietary habits.",
              description:
                "The planetarian diet emphasizes a nutritional approach outlined by the EAT-Lancet Commission, promoting sustainable and healthy dietary habits, including reduced red meat consumption, increased vegetable intake, and decreased food waste, aiming to support global food security and environmental sustainability for a growing population.",
              tags: [
                "Regenerative Agriculture",
                "Sustainable Rangelands & Pastures",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/cf287022-7219-4d0e-b0d9-389beb5ce452/Planetarian%20Diet%20Large.jpeg?auto=compress%2Cformat",
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
              tags: [
                "Regenerative Agriculture",
                "Food Waste Reduction & Circularity",
              ],
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
              tags: [
                "Regenerative Agriculture",
                "Food Waste Reduction & Circularity",
              ],
            },
            {
              id: "food-recovery",
              name: "Food Recovery & Redistribution",
              summary: "Systems to redirect surplus food to people in need.",
              description:
                "Food recovery involves redirecting surplus food to people in need, reducing waste while addressing food insecurity.",
              relatedThemes: ["Equity"],
              relatedLevers: ["Community Action"],
              tags: [
                "Regenerative Agriculture",
                "Food Waste Reduction & Circularity",
              ],
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
              tags: [
                "Regenerative Agriculture",
                "Food Waste Reduction & Circularity",
              ],
            },
            {
              id: "storage-logistics",
              name: "Storage & Logistics",
              summary:
                "Technologies like solar-powered refrigerators to reduce crop losses.",
              description:
                "Storage and logistics solutions, including technologies like solar-powered refrigerators, contribute to significant reductions in crop losses due to inadequate or inaccessible cold storage, ensuring the freshness and quality of produce before it is sold or taken to market.",
              tags: [
                "Regenerative Agriculture",
                "Food Waste Reduction & Circularity",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/22ef8c31-590c-4d41-88ae-a9c8062a145e/Old_Potato_Cellars_near_Shelley%2C_Idaho-cc.jpg?auto=compress%2Cformat",
            },
            {
              id: "bioregional-sourcing",
              name: "Bioregional Sourcing",
              summary:
                "Procurement of food from local farms and regional ecosystems.",
              description:
                "Bioregional sourcing emphasizes the procurement of food from local farms and regional ecosystems, promoting sustainable and resilient food systems that support local economies and reduce the environmental impact of long-distance shipping.",
              tags: [
                "Regenerative Agriculture",
                "Food Waste Reduction & Circularity",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/95aa16fd-7036-438a-9ee3-8a669f46c8bb/Market-2-Bhutan-CC-Yannick%20Beaudoin-2014_resized.jpg?auto=compress%2Cformat",
            },
            {
              id: "food-upcycling",
              name: "Food Upcycling",
              summary:
                "Creative repurposing of food byproducts and surplus food.",
              description:
                "Food upcycling involves the creative repurposing of food byproducts, surplus food, and cosmetically imperfect food into new edible products in an effort to reduce food waste.",
              tags: [
                "Regenerative Agriculture",
                "Food Waste Reduction & Circularity",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/c50e1520-f8ba-47ea-ace7-e874a4258fcf/ugly%20organic%20carrot%2C%20beetroot%20and%20cucumber%20from%20home%20garden%20dreamstime_xxl_67412034%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "urban-gardening",
              name: "Urban Gardening",
              summary: "Converting turf grass into gardens in urban spaces.",
              description:
                "Urban gardening encompasses the conversion of turf grass into gardens and cultivating herbs and vegetables in urban spaces such as rooftops, balconies, or community gardens to promote local food production, boost public health, and lower carbon emissions.",
              tags: [
                "Regenerative Agriculture",
                "Food Waste Reduction & Circularity",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/3fc7cb73-36e8-4787-8c97-079f36ddefb6/vegetables%20growing%20in%20the%20yard%20shutterstock_104261645%20(1).jpg?auto=compress%2Cformat",
            },
            {
              id: "meal-planning",
              name: "Meal Planning",
              summary:
                "Strategic preparation and organization of meals to reduce waste.",
              description:
                "Meal planning involves the strategic preparation and organization of meals to save money, improve health, and reduce food waste.",
              tags: [
                "Regenerative Agriculture",
                "Food Waste Reduction & Circularity",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/22a631cd-1f00-4159-ac62-25ff591a7cd8/A%20colorful%20vegetable%20farmshare%20package%20in%20a%20woven%20bamboo%20box.%20Photo%20from%20Good%20Food%20Community.jpg?auto=compress%2Cformat",
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
              tags: [
                "Regenerative Agriculture",
                "Circular Fibers & Sustainable Materials",
              ],
            },
            {
              id: "bio-based-materials",
              name: "Bio-based & Regenerative Materials",
              summary:
                "Use renewable materials to replace fossil-derived inputs.",
              description:
                "Bio-based and regenerative materials use renewable materials to replace fossil-derived inputs in manufacturing and production.",
              relatedThemes: ["Circularity"],
              relatedLevers: ["Science & Technology"],
              tags: [
                "Regenerative Agriculture",
                "Circular Fibers & Sustainable Materials",
              ],
            },
            {
              id: "sustainable-fiber-pulp",
              name: "Sustainable Fiber & Pulp",
              summary:
                "Responsible procurement of natural fibers from sustainable sources.",
              description:
                "Sustainable fiber and pulp is the responsible procurement of natural fibers, like linen, wool, hemp, and jute, from environmentally sustainable and ethically managed sources that support soil health, waterways, and biodiversity and enhance carbon sequestration.",
              tags: [
                "Regenerative Agriculture",
                "Circular Fibers & Sustainable Materials",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/bb87b436-b040-4c97-923c-90f848246162/Closeup_Cotton_Bolls_Field.jpg?auto=compress%2Cformat",
            },
            {
              id: "green-textiles",
              name: "Green Textiles",
              summary:
                "Textiles produced through eco-friendly fiber processing and dyeing methods.",
              description:
                "Green textiles refer to textiles produced through eco-friendly fiber processing and dyeing methods, emphasizing reduced energy consumption and the avoidance of chemicals harmful to human and ecological health.",
              tags: [
                "Regenerative Agriculture",
                "Circular Fibers & Sustainable Materials",
              ],
              image:
                "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4fa85c8e-a93f-4d17-8695-3b1821c36205/Green%20textles%20(1).jpg?auto=compress%2Cformat",
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
              tags: [
                "Regenerative Agriculture",
                "Circular Fibers & Sustainable Materials",
              ],
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
              tags: [
                "Regenerative Agriculture",
                "Diet, Sustainable Consumption & Land-Use Choices",
              ],
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
              tags: [
                "Regenerative Agriculture",
                "Diet, Sustainable Consumption & Land-Use Choices",
              ],
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
              tags: [
                "Regenerative Agriculture",
                "Diet, Sustainable Consumption & Land-Use Choices",
              ],
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
