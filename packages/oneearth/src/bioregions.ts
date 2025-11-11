// bioregions.ts
// Type definitions
export interface FlagshipSpecies {
  latitude: number;
  longitude: number;
  title: string;
  image?: {
    path: string;
    _id: string;
  };
}

export interface IconicSpeciesEcoregion {
  title: string;
  _id: string;
  flagshipSpecies: FlagshipSpecies;
}

export interface Bioregion {
  id: string;
  _id: string;
  _enabled: boolean;
  regionId: string;
  slug: string;
  name: string;
  description?: string;
  showGeometry: boolean;
  iconicSpeciesEcoregion: IconicSpeciesEcoregion;
  image?: string; // Image URL for the bioregion
  geoJSON: string; // KML/GeoJSON URL
}

export interface OneEarthBioregions {
  bioregions: Bioregion[];
  lastUpdated?: string;
}

// Helper function to get image URL for a bioregion
function getBioregionImage(
  flagshipSpeciesImage?: { path: string; _id: string }
): string | undefined {
  if (!flagshipSpeciesImage?.path) return undefined;
  return `https://images.takeshape.io/${flagshipSpeciesImage.path}?auto=compress%2Cformat&w=800`;
}

// Helper function to get geoJSON URL for a bioregion
function getBioregionGeoJSON(regionId: string): string {
  return `https://www.oneearth.org/geoData/bioregions/${regionId}.kml`;
}

// Transform the data
const transformedBioregions: Bioregion[] = [
  {
    "id": "933fb0b4-f074-4d73-a940-e3162e8814f1",
    "_id": "933fb0b4-f074-4d73-a940-e3162e8814f1",
    "_enabled": true,
    "regionId": "PA53",
    "slug": "hengduan-mountain-conifer-forests-pa53",
    "name": "Hengduan Mountain Conifer Forests (PA53)",
    "description": "The Hengduan Mountain Conifer Forests (PA53) bioregion, home to the iconic Giant panda.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Qionglai-Minshan Conifer Forests",
      "_id": "e899da2e-53d9-4428-bbb6-f9c46dad6bbb",
      "flagshipSpecies": {
        "latitude": 28.7551,
        "longitude": 103.2315,
        "title": "Giant panda",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4a6a4350-f536-41f9-aba7-1cbe49060a5b/706--Qionglai-Minshan-Conifer-Forests--Giant-panda-.jpeg",
          "_id": "4a6a4350-f536-41f9-aba7-1cbe49060a5b"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4a6a4350-f536-41f9-aba7-1cbe49060a5b/706--Qionglai-Minshan-Conifer-Forests--Giant-panda-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA53.kml"
  },
  {
    "id": "d7b29e9d-4f70-4c3f-af12-8216663f0936",
    "_id": "d7b29e9d-4f70-4c3f-af12-8216663f0936",
    "_enabled": true,
    "regionId": "PA48",
    "slug": "korean-peninsula-mixed-forests-pa48",
    "name": "Korean Peninsula Mixed Forests (PA48)",
    "description": "The Korean Peninsula Mixed Forests (PA48) bioregion, home to the iconic Tristam's woodpecker.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Central Korean Deciduous Forests",
      "_id": "a7b04f09-51fe-4ffe-bf7a-09886b934998",
      "flagshipSpecies": {
        "latitude": 36.3609,
        "longitude": 127.9409,
        "title": "Tristam's woodpecker",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/3a45caca-94d8-4733-a226-18db564c5ead/655-Central-Korean-Deciduous-Forests-Tristam's-woodpecker-.jpeg",
          "_id": "3a45caca-94d8-4733-a226-18db564c5ead"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/3a45caca-94d8-4733-a226-18db564c5ead/655-Central-Korean-Deciduous-Forests-Tristam's-woodpecker-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA48.kml"
  },
  {
    "id": "c2049f0d-f6f3-4884-901f-0d8ce17fe192",
    "_id": "c2049f0d-f6f3-4884-901f-0d8ce17fe192",
    "_enabled": true,
    "regionId": "PA46",
    "slug": "manchuria-ussuri-mixed-forests-meadow-steppes-pa46",
    "name": "Manchuria-Ussuri Mixed Forests & Meadow Steppes (PA46)",
    "description": "The Manchuria-Ussuri Mixed Forests & Meadow Steppes (PA46) bioregion, home to the iconic Amur tiger.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Ussuri Broadleaf and Mixed Forests",
      "_id": "f5129efa-d968-4871-8a01-2a0257ea87e2",
      "flagshipSpecies": {
        "latitude": 44.6065,
        "longitude": 134.4834,
        "title": "Amur tiger",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/39604da5-63bd-426a-8958-e442d678ba57/Amur tiger running in the snow. dreamstime84783074.jpg",
          "_id": "39604da5-63bd-426a-8958-e442d678ba57"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/39604da5-63bd-426a-8958-e442d678ba57/Amur tiger running in the snow. dreamstime84783074.jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA46.kml"
  },
  {
    "id": "87830719-d781-456b-9893-c66f7503df3a",
    "_id": "87830719-d781-456b-9893-c66f7503df3a",
    "_enabled": true,
    "regionId": "PA45",
    "slug": "dzhagdy-mountain-conifer-forests-pa45",
    "name": "Dzhagdy Mountain Conifer Forests (PA45)",
    "description": "The Dzhagdy Mountain Conifer Forests (PA45) bioregion, home to the iconic Siberian Salamander.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Da Hinggan-Dzhagdy Mountains Conifer Forests",
      "_id": "93e28e9d-6494-43ef-9b74-2477650fe9c0",
      "flagshipSpecies": {
        "latitude": 52.1923,
        "longitude": 122.812,
        "title": "Siberian Salamander",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/de114a7c-a4b6-4496-bcc9-8a7b5b3d7a8e/Siberian salamander (Salamandrella keyserlingii). Image credit © Miroslav Hlavko | Dreamstime.jpg",
          "_id": "de114a7c-a4b6-4496-bcc9-8a7b5b3d7a8e"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/de114a7c-a4b6-4496-bcc9-8a7b5b3d7a8e/Siberian salamander (Salamandrella keyserlingii). Image credit © Miroslav Hlavko | Dreamstime.jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA45.kml"
  },
  {
    "id": "ba76e19b-0d02-4098-b21c-0c1ada2f8ae3",
    "_id": "ba76e19b-0d02-4098-b21c-0c1ada2f8ae3",
    "_enabled": true,
    "regionId": "PA44",
    "slug": "mongolian-grasslands-alpine-meadows-forest-steppe-pa44",
    "name": "Mongolian Grasslands, Alpine Meadows & Forest Steppe (PA44)",
    "description": "The Mongolian Grasslands, Alpine Meadows & Forest Steppe (PA44) bioregion, home to the iconic Mongolian marmot.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Selenge-Orkhon Forest Steppe",
      "_id": "bea93d6f-d33e-4dbb-89fa-6cddc3ed8309",
      "flagshipSpecies": {
        "latitude": 48.4898,
        "longitude": 100.5148,
        "title": "Mongolian marmot",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a837217a-bb86-434a-9fde-d0e6cf6bc581/737--Selenge-Orkhon-Forest-Steppe-Mongolian-marmot.jpeg",
          "_id": "a837217a-bb86-434a-9fde-d0e6cf6bc581"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a837217a-bb86-434a-9fde-d0e6cf6bc581/737--Selenge-Orkhon-Forest-Steppe-Mongolian-marmot.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA44.kml"
  },
  {
    "id": "35c046d3-95bd-4e88-8afc-6bdab804e02f",
    "_id": "35c046d3-95bd-4e88-8afc-6bdab804e02f",
    "_enabled": true,
    "regionId": "PA43",
    "slug": "greater-gobi-desert-pa43",
    "name": "Greater Gobi Desert (PA43)",
    "description": "The Greater Gobi Desert (PA43) bioregion, home to the iconic Black stork.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Alashan Plateau Semi-Desert",
      "_id": "2213646f-c0e7-43b6-aa30-9ffd6eb3f0a1",
      "flagshipSpecies": {
        "latitude": 41.5461,
        "longitude": 100.2918,
        "title": "Black stork",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/53ed9e04-67ab-48ac-815b-ccc2b0b13b32/This ia a Black Stork Ciconia nigra in outer suburbs of Beijing China. dreamstime_xxl_18518551.jpg",
          "_id": "53ed9e04-67ab-48ac-815b-ccc2b0b13b32"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/53ed9e04-67ab-48ac-815b-ccc2b0b13b32/This ia a Black Stork Ciconia nigra in outer suburbs of Beijing China. dreamstime_xxl_18518551.jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA43.kml"
  },
  {
    "id": "10048236-762c-489d-bbb1-29e9fe620af6",
    "_id": "10048236-762c-489d-bbb1-29e9fe620af6",
    "_enabled": true,
    "regionId": "PA41",
    "slug": "himalayan-pamir-alpine-shrub-meadows-pa41",
    "name": "Himalayan-Pamir Alpine Shrub & Meadows (PA41)",
    "description": "The Himalayan-Pamir Alpine Shrub & Meadows (PA41) bioregion, home to the iconic Snow leopard.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Western Himalayan Alpine Shrub and Meadows",
      "_id": "1e6315ac-5e1b-479c-8401-31829a694c63",
      "flagshipSpecies": {
        "latitude": 30.6567,
        "longitude": 80.7223,
        "title": "Snow leopard",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/bf37192c-9217-43e9-a66c-b6627fefed36/769--Western-Himalayan-Alpine-Shrub-and-Meadows-Snow-leopard.jpeg",
          "_id": "bf37192c-9217-43e9-a66c-b6627fefed36"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/bf37192c-9217-43e9-a66c-b6627fefed36/769--Western-Himalayan-Alpine-Shrub-and-Meadows-Snow-leopard.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA41.kml"
  },
  {
    "id": "fb4b4424-6f0b-4049-a7fe-857331fba1d8",
    "_id": "fb4b4424-6f0b-4049-a7fe-857331fba1d8",
    "_enabled": true,
    "regionId": "PA40",
    "slug": "greater-tibetan-plateau-alpine-meadows-shrublands-pa40",
    "name": "Greater Tibetan Plateau Alpine Meadows & Shrublands (PA40)",
    "description": "The Greater Tibetan Plateau Alpine Meadows & Shrublands (PA40) bioregion, home to the iconic Tibetan gazelle (procapra pictacaudata).",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Tibetan Plateau Alpine Shrublands and Meadows",
      "_id": "43c9d307-9d26-4079-a4d0-cf025bfe75d4",
      "flagshipSpecies": {
        "latitude": 31.8318,
        "longitude": 91.9606,
        "title": "Tibetan gazelle (procapra pictacaudata)",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/1a311435-f998-4147-a1b2-f6ba885f3d06/768--Tibetan-Plateau-Alpine-Shrublands-and-Meadows-Tibetan-gazelle-.jpeg",
          "_id": "1a311435-f998-4147-a1b2-f6ba885f3d06"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/1a311435-f998-4147-a1b2-f6ba885f3d06/768--Tibetan-Plateau-Alpine-Shrublands-and-Meadows-Tibetan-gazelle-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA40.kml"
  },
  {
    "id": "cb87aab5-8f06-4898-9d1a-2f8a7c79b8dd",
    "_id": "cb87aab5-8f06-4898-9d1a-2f8a7c79b8dd",
    "_enabled": true,
    "regionId": "PA39",
    "slug": "taklimakan-desert-lowland-deciduous-forests-pa39",
    "name": "Taklimakan Desert & Lowland Deciduous Forests (PA39)",
    "description": "The Taklimakan Desert & Lowland Deciduous Forests (PA39) bioregion, home to the iconic Xinjiang ground jay.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Tarim Basin Deciduous Forests and Steppe",
      "_id": "28f6edbc-33de-465b-a9c4-45623fae82b3",
      "flagshipSpecies": {
        "latitude": 40.7724,
        "longitude": 84.4929,
        "title": "Xinjiang ground jay",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ff411a4a-6d1f-4555-a392-9c76bc35b03b/684-Tarim-Basin-Deciduous-Forests-and-Steppe-Xinjiang-ground-jay.jpeg",
          "_id": "ff411a4a-6d1f-4555-a392-9c76bc35b03b"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ff411a4a-6d1f-4555-a392-9c76bc35b03b/684-Tarim-Basin-Deciduous-Forests-and-Steppe-Xinjiang-ground-jay.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA39.kml"
  },
  {
    "id": "1574cc8f-290c-4380-8aed-fc9cfd469a7b",
    "_id": "1574cc8f-290c-4380-8aed-fc9cfd469a7b",
    "_enabled": true,
    "regionId": "PA38",
    "slug": "junggar-semi-desert-ermin-valley-steppe-pa38",
    "name": "Junggar Semi-Desert & Ermin Valley Steppe (PA38)",
    "description": "The Junggar Semi-Desert & Ermin Valley Steppe (PA38) bioregion, home to the iconic Przewalki's horse.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Junggar Basin Semi-Desert",
      "_id": "2b2c30d7-bf9c-44c6-8883-8b464d6052b8",
      "flagshipSpecies": {
        "latitude": 45.9657,
        "longitude": 88.4351,
        "title": "Przewalki's horse",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/51e7ad85-b6d5-43b6-8262-a41963d77d5c/827--Junggar-Basin-Semi-Desert-Przewalki's-horse.jpeg",
          "_id": "51e7ad85-b6d5-43b6-8262-a41963d77d5c"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/51e7ad85-b6d5-43b6-8262-a41963d77d5c/827--Junggar-Basin-Semi-Desert-Przewalki's-horse.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA38.kml"
  },
  {
    "id": "8a070b49-47cd-49e2-8453-fa70ba4d58ac",
    "_id": "8a070b49-47cd-49e2-8453-fa70ba4d58ac",
    "_enabled": true,
    "regionId": "PA37",
    "slug": "altai-mountain-forests-grasslands-desert-steppe-pa37",
    "name": "Altai Mountains & Ermin Valley (PA37)",
    "description": "The Altai Mountains & Ermin Valley (PA37) bioregion, home to the iconic Altai argali (Ovis ammon ammon).",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Altai Alpine Meadow and Tundra",
      "_id": "d10762c2-16c5-4f4b-8af0-c28e4fa28760",
      "flagshipSpecies": {
        "latitude": 49.712,
        "longitude": 87.8035,
        "title": "Altai argali (Ovis ammon ammon)",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/42f989de-e022-47a5-92a5-6b10bc8dab6a/749--Altai-Alpine-Meadow-and-Tundra--Altai-argali.jpeg",
          "_id": "42f989de-e022-47a5-92a5-6b10bc8dab6a"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/42f989de-e022-47a5-92a5-6b10bc8dab6a/749--Altai-Alpine-Meadow-and-Tundra--Altai-argali.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA37.kml"
  },
  {
    "id": "1bffb0d0-4fb4-4e19-9a89-97b5ec29401b",
    "_id": "1bffb0d0-4fb4-4e19-9a89-97b5ec29401b",
    "_enabled": true,
    "regionId": "PA36",
    "slug": "sayan-mountain-conifer-forests-alpine-meadows-steppe-pa36",
    "name": "Sayan Mountain Conifer Forests, Alpine Meadows & Steppe (PA36)",
    "description": "The Sayan Mountain Conifer Forests, Alpine Meadows & Steppe (PA36) bioregion, home to the iconic Great grey owl.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Sayan Montane Conifer Forests",
      "_id": "0c57b41a-385e-4dfd-bc67-bc32427f775f",
      "flagshipSpecies": {
        "latitude": 51.6871,
        "longitude": 96.626,
        "title": "Great grey owl",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/33816a98-a2ae-413a-ae01-2d39cab9175f/707-Sayan-Montane-Conifer-Forests-Great-grey-owl.jpeg",
          "_id": "33816a98-a2ae-413a-ae01-2d39cab9175f"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/33816a98-a2ae-413a-ae01-2d39cab9175f/707-Sayan-Montane-Conifer-Forests-Great-grey-owl.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA36.kml"
  },
  {
    "id": "ae32c14c-e41f-49c8-8a1e-4e5131ff5fc2",
    "_id": "ae32c14c-e41f-49c8-8a1e-4e5131ff5fc2",
    "_enabled": true,
    "regionId": "PA35",
    "slug": "siberian-hemiboreal-forests-steppe-pa35",
    "name": "Siberian Hemiboreal Forests & Steppe (PA35)",
    "description": "The Siberian Hemiboreal Forests & Steppe (PA35) bioregion, home to the iconic Yellow-breasted bunting.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Western Siberian Hemiboreal Forests",
      "_id": "d6e1f2d0-8f31-4631-99dc-061a50449f34",
      "flagshipSpecies": {
        "latitude": 56.5381,
        "longitude": 83.5343,
        "title": "Yellow-breasted bunting",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0bb3aca1-edf7-46b7-9dce-a5b98b966ccc/738-South-Siberian-Forest-Steppe--Yellow-breasted-bunting-.jpeg",
          "_id": "0bb3aca1-edf7-46b7-9dce-a5b98b966ccc"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0bb3aca1-edf7-46b7-9dce-a5b98b966ccc/738-South-Siberian-Forest-Steppe--Yellow-breasted-bunting-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA35.kml"
  },
  {
    "id": "e6782a01-0519-4966-aa37-01942c78b1e2",
    "_id": "e6782a01-0519-4966-aa37-01942c78b1e2",
    "_enabled": true,
    "regionId": "PA34",
    "slug": "kazakh-forest-steppe-grasslands-pa34",
    "name": "Kazakh Forest Steppe & Grasslands (PA34)",
    "description": "The Kazakh Forest Steppe & Grasslands (PA34) bioregion, home to the iconic Sociable lapwing.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Kazakh Steppe",
      "_id": "a57012ff-78a3-483a-85d7-0a3d839708a8",
      "flagshipSpecies": {
        "latitude": 51.8103,
        "longitude": 72.7624,
        "title": "Sociable lapwing",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0c214881-82c4-4e4a-ba8a-fbb28dc5c5a4/732-Kazakh-Steppe-Sociable-lapwing.jpeg",
          "_id": "0c214881-82c4-4e4a-ba8a-fbb28dc5c5a4"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0c214881-82c4-4e4a-ba8a-fbb28dc5c5a4/732-Kazakh-Steppe-Sociable-lapwing.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA34.kml"
  },
  {
    "id": "ffa5ac86-3349-4c0c-a9a2-8805c49a36bd",
    "_id": "ffa5ac86-3349-4c0c-a9a2-8805c49a36bd",
    "_enabled": true,
    "regionId": "PA33",
    "slug": "caspian-sea-coastal-deserts-kopet-dagh-mountain-woodlands-pa33",
    "name": "Caspian Sea, Coastal Deserts & Kopet Dagh Mountain Woodlands (PA33)",
    "description": "The Caspian Sea, Coastal Deserts & Kopet Dagh Mountain Woodlands (PA33) bioregion, home to the iconic Caspian seal.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Caspian Lowland Desert",
      "_id": "7b07641b-0161-4800-b26c-9d1a9f389b21",
      "flagshipSpecies": {
        "latitude": 47.6771,
        "longitude": 48.474,
        "title": "Caspian seal"
      }
    },
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA33.kml"
  },
  {
    "id": "e680f5cf-5c6b-4c8d-b522-a19fac1a972a",
    "_id": "e680f5cf-5c6b-4c8d-b522-a19fac1a972a",
    "_enabled": true,
    "regionId": "PA32",
    "slug": "central-asian-deserts-riparian-woodlands-pa32",
    "name": "Central Asian Deserts & Riparian Woodlands (PA32)",
    "description": "The Central Asian Deserts & Riparian Woodlands (PA32) bioregion, home to the iconic Toadhead agama.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Central Asian Riparian Woodlands",
      "_id": "247fd360-50af-406e-b0e9-62cd32d64477",
      "flagshipSpecies": {
        "latitude": 43.1892,
        "longitude": 59.4065,
        "title": "Toadhead agama",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5aa3d316-107d-4cd9-b328-dad036235800/818--Central-Asian-Riparian-Woodlands-Toadhead-agama.jpeg",
          "_id": "5aa3d316-107d-4cd9-b328-dad036235800"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5aa3d316-107d-4cd9-b328-dad036235800/818--Central-Asian-Riparian-Woodlands-Toadhead-agama.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA32.kml"
  },
  {
    "id": "cf0186a9-53ff-4ad4-b50a-08171a24f1d7",
    "_id": "cf0186a9-53ff-4ad4-b50a-08171a24f1d7",
    "_enabled": true,
    "regionId": "PA31",
    "slug": "tian-shan-pamir-grasslands-mountain-steppe-conifer-forests-pa31",
    "name": "Tian Shan-Pamir Grasslands, Mountain Steppe & Conifer Forests (PA31)",
    "description": "The Tian Shan-Pamir Grasslands, Mountain Steppe & Conifer Forests (PA31) bioregion, home to the iconic Saiga antelope.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Alai-Western Tian Shan Steppe",
      "_id": "bdf80406-9aae-447a-810e-4a635ae5e0b3",
      "flagshipSpecies": {
        "latitude": 40.4524,
        "longitude": 66.964,
        "title": "Saiga antelope",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e98ba036-7c01-410b-a862-4fac8ef1536b/721--Alai-Western-Tian-Shan-Steppe-Saiga-antelope.jpeg",
          "_id": "e98ba036-7c01-410b-a862-4fac8ef1536b"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e98ba036-7c01-410b-a862-4fac8ef1536b/721--Alai-Western-Tian-Shan-Steppe-Saiga-antelope.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA31.kml"
  },
  {
    "id": "2fd8739f-ae96-4caf-8185-863f8d31f74a",
    "_id": "2fd8739f-ae96-4caf-8185-863f8d31f74a",
    "_enabled": true,
    "regionId": "PA30",
    "slug": "afghan-balochistan-drylands-mountain-meadows-conifer-forests-pa30",
    "name": "Afghan-Balochistan Drylands, Mountain Meadows & Conifer Forests (PA30)",
    "description": "The Afghan-Balochistan Drylands, Mountain Meadows & Conifer Forests (PA30) bioregion, home to the iconic Marbled polecat.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Paropamisus Xeric Woodlands",
      "_id": "d4d59d85-59cf-4774-96eb-491284a8d235",
      "flagshipSpecies": {
        "latitude": 36.1913,
        "longitude": 68.8211,
        "title": "Marbled polecat",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/be1f066f-73ed-4852-856c-fb2b922c2abe/834--Paropamisus-Xeric-Woodlands-Marbled-polecat.jpeg",
          "_id": "be1f066f-73ed-4852-856c-fb2b922c2abe"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/be1f066f-73ed-4852-856c-fb2b922c2abe/834--Paropamisus-Xeric-Woodlands-Marbled-polecat.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA30.kml"
  },
  {
    "id": "09e3d004-8f50-4dfb-923a-73d6af2f9818",
    "_id": "09e3d004-8f50-4dfb-923a-73d6af2f9818",
    "_enabled": true,
    "regionId": "PA29",
    "slug": "persian-deserts-mountain-woodlands-pa29",
    "name": "Persian Deserts & Mountain Woodlands (PA29)",
    "description": "The Persian Deserts & Mountain Woodlands (PA29) bioregion, home to the iconic Asiatic cheetah.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Central Persian Desert Basins",
      "_id": "fde620cb-5385-4dd6-a960-4ea4660435b2",
      "flagshipSpecies": {
        "latitude": 34.3295,
        "longitude": 55.7811,
        "title": "Asiatic cheetah",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/933b2764-8153-4d8f-8ee9-1b13197159c0/820--Central-Persian-Desert-Basins--Asiatic-cheetah.jpeg",
          "_id": "933b2764-8153-4d8f-8ee9-1b13197159c0"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/933b2764-8153-4d8f-8ee9-1b13197159c0/820--Central-Persian-Desert-Basins--Asiatic-cheetah.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA29.kml"
  },
  {
    "id": "e9d00ea4-7c38-4914-b558-61242ac77420",
    "_id": "e9d00ea4-7c38-4914-b558-61242ac77420",
    "_enabled": true,
    "regionId": "PA28",
    "slug": "south-caspian-coastal-mountain-mixed-forests-pa28",
    "name": "South Caspian Coastal & Mountain Mixed Forests (PA28)",
    "description": "The South Caspian Coastal & Mountain Mixed Forests (PA28) bioregion, home to the iconic Syrian brown bear.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Elburz Range Forest Steppe",
      "_id": "6f6e060b-0db7-4c3a-bd8c-4193c2df0e4c",
      "flagshipSpecies": {
        "latitude": 35.7567,
        "longitude": 52.2724,
        "title": "Syrian brown bear",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/dd49d956-6916-4745-b820-826f0aaa6f6a/695--Elburz-Range-Forest-Steppe-Syrian-brown-bear.jpeg",
          "_id": "dd49d956-6916-4745-b820-826f0aaa6f6a"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/dd49d956-6916-4745-b820-826f0aaa6f6a/695--Elburz-Range-Forest-Steppe-Syrian-brown-bear.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA28.kml"
  },
  {
    "id": "3eecaaae-b3db-424b-bc28-fbc3682ca9ff",
    "_id": "3eecaaae-b3db-424b-bc28-fbc3682ca9ff",
    "_enabled": true,
    "regionId": "PA27",
    "slug": "zagros-mountain-forests-east-anatolian-steppe-pa27",
    "name": "Zagros Mountain Forests & East Anatolian Steppe (PA27)",
    "description": "The Zagros Mountain Forests & East Anatolian Steppe (PA27) bioregion, home to the iconic Gmelins mouflon.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Eastern Anatolian Montane Steppe",
      "_id": "b24b00fa-b6c9-4038-94f4-0de87efbdf48",
      "flagshipSpecies": {
        "latitude": 39.1274,
        "longitude": 43.4777,
        "title": "Gmelins mouflon",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7b91259a-efda-4096-b36f-72fac81b2423/727--Eastern-Anatolian-Montane-Steppe-Gmelins-mouflon.jpeg",
          "_id": "7b91259a-efda-4096-b36f-72fac81b2423"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7b91259a-efda-4096-b36f-72fac81b2423/727--Eastern-Anatolian-Montane-Steppe-Gmelins-mouflon.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA27.kml"
  },
  {
    "id": "cb7a108f-f2c2-4fe8-b2b4-5c93b6e94b9f",
    "_id": "cb7a108f-f2c2-4fe8-b2b4-5c93b6e94b9f",
    "_enabled": true,
    "regionId": "PA24",
    "slug": "northern-sahara-deserts-savannas-marshes-pa24",
    "name": "Northern Sahara Deserts, Savannas & Marshes (PA24)",
    "description": "The Northern Sahara Deserts, Savannas & Marshes (PA24) bioregion, home to the iconic Egyptian tortoise.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Nile Delta Flooded Savanna",
      "_id": "31068f52-1abc-449f-b39b-cbd04433ce28",
      "flagshipSpecies": {
        "latitude": 30.9234,
        "longitude": 31.2794,
        "title": "Egyptian tortoise",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/caadeab5-c60d-42fa-a05d-f6366833474f/744--Nile-Delta-Flooded-Savanna-Egyptian-tortoise.jpeg",
          "_id": "caadeab5-c60d-42fa-a05d-f6366833474f"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/caadeab5-c60d-42fa-a05d-f6366833474f/744--Nile-Delta-Flooded-Savanna-Egyptian-tortoise.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA24.kml"
  },
  {
    "id": "94f95bf6-32f0-458d-a179-385b3b677e63",
    "_id": "94f95bf6-32f0-458d-a179-385b3b677e63",
    "_enabled": true,
    "regionId": "PA19",
    "slug": "adriatic-sea-central-mediterranean-mixed-forests-pa19",
    "name": "Adriatic Sea & Central Mediterranean Mixed Forests (PA19)",
    "description": "The Adriatic Sea & Central Mediterranean Mixed Forests (PA19) bioregion, home to the iconic Corsican red deer.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Corsican Montane Broadleaf and Mixed Forests",
      "_id": "257ba2ac-e8ea-40a4-82d0-ba1537e92267",
      "flagshipSpecies": {
        "latitude": 42.0518,
        "longitude": 9.0488,
        "title": "Corsican red deer",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b22dace4-d94a-4c9c-ab96-487e0c315f68/788--Corsican-Montane-Broadleaf-and-Mixed-Forests-Corsican-Red-Deer.jpeg",
          "_id": "b22dace4-d94a-4c9c-ab96-487e0c315f68"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b22dace4-d94a-4c9c-ab96-487e0c315f68/788--Corsican-Montane-Broadleaf-and-Mixed-Forests-Corsican-Red-Deer.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA19.kml"
  },
  {
    "id": "868d66ac-2838-45ec-93f8-866165445ea6",
    "_id": "868d66ac-2838-45ec-93f8-866165445ea6",
    "_enabled": true,
    "regionId": "PA18",
    "slug": "aegean-sea-east-mediterranean-mixed-forests-pa18",
    "name": "Aegean Sea & East Mediterranean Mixed Forests (PA18)",
    "description": "The Aegean Sea & East Mediterranean Mixed Forests (PA18) bioregion, home to the iconic Striped hyena.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": " Eastern Mediterranean Conifer-Broadleaf Forests",
      "_id": "b7aa595a-3775-419c-b111-73e0f2bb8712",
      "flagshipSpecies": {
        "latitude": 35.3438,
        "longitude": 36.6268,
        "title": "Striped hyena",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/cc458ed9-7039-45f9-b069-1397ad161198/791--Eastern-Mediterranean-Conifer-Broadleaf-Forests-Striped-Hyena.jpeg",
          "_id": "cc458ed9-7039-45f9-b069-1397ad161198"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/cc458ed9-7039-45f9-b069-1397ad161198/791--Eastern-Mediterranean-Conifer-Broadleaf-Forests-Striped-Hyena.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA18.kml"
  },
  {
    "id": "fd9b52a2-40a1-4aee-bec3-9f4d79154001",
    "_id": "fd9b52a2-40a1-4aee-bec3-9f4d79154001",
    "_enabled": true,
    "regionId": "PA17",
    "slug": "black-sea-caucasus-anatolian-mixed-forests-steppe-pa17",
    "name": "Black Sea, Caucasus-Anatolian Mixed Forests & Steppe (PA17)",
    "description": "The Black Sea, Caucasus-Anatolian Mixed Forests & Steppe (PA17) bioregion, home to the iconic Southern crested newt.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": " Crimean Submediterranean Forest Complex",
      "_id": "9dc6136e-6176-4dbe-af75-49e4e77e07fe",
      "flagshipSpecies": {
        "latitude": 44.565,
        "longitude": 39.5642,
        "title": "Southern crested newt",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/3712d1df-bcc2-48d7-b94c-514d066f294d/658--Crimean-Submediterranean-Forest-Complex--Southern-crested-newt.jpeg",
          "_id": "3712d1df-bcc2-48d7-b94c-514d066f294d"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/3712d1df-bcc2-48d7-b94c-514d066f294d/658--Crimean-Submediterranean-Forest-Complex--Southern-crested-newt.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA17.kml"
  },
  {
    "id": "60de8325-ce74-4d0b-a816-433fd4884837",
    "_id": "60de8325-ce74-4d0b-a816-433fd4884837",
    "_enabled": true,
    "regionId": "PA16",
    "slug": "pontic-steppe-grasslands-pa16",
    "name": "Pontic Steppe Grasslands (PA16)",
    "description": "The Pontic Steppe Grasslands (PA16) bioregion, home to the iconic European mink.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": " Pontic Steppe",
      "_id": "257b5873-dba8-40e7-a618-fe66877a30f0",
      "flagshipSpecies": {
        "latitude": 47.3427,
        "longitude": 42.0232,
        "title": "European mink",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e35a7446-b68d-4e32-91ad-3ad5c5bbc9c1/735--Pontic-Steppe--European-mink.jpeg",
          "_id": "e35a7446-b68d-4e32-91ad-3ad5c5bbc9c1"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e35a7446-b68d-4e32-91ad-3ad5c5bbc9c1/735--Pontic-Steppe--European-mink.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA16.kml"
  },
  {
    "id": "0feb05d7-b44e-4d39-9481-43c4dd9d37b0",
    "_id": "0feb05d7-b44e-4d39-9481-43c4dd9d37b0",
    "_enabled": true,
    "regionId": "PA15",
    "slug": "dinaric-mountains-balkan-mixed-forests-pa15",
    "name": "Dinaric Mountains & Balkan Mixed Forests (PA15)",
    "description": "The Dinaric Mountains & Balkan Mixed Forests (PA15) bioregion, home to the iconic Eurasian lynx.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": " Dinaric Mountains Mixed Forests",
      "_id": "fbb6ff86-47fd-4582-a9c9-281ebcf10ae4",
      "flagshipSpecies": {
        "latitude": 43.8939,
        "longitude": 18.2276,
        "title": "Eurasian lynx",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/08c17a6b-0dbb-46a9-86f5-30a2e534bc37/660--Dinaric-Mountains-Mixed-Forests-Eurasian-lynx.jpeg",
          "_id": "08c17a6b-0dbb-46a9-86f5-30a2e534bc37"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/08c17a6b-0dbb-46a9-86f5-30a2e534bc37/660--Dinaric-Mountains-Mixed-Forests-Eurasian-lynx.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA15.kml"
  },
  {
    "id": "196ace7f-199e-453b-b4f1-dc9d02bdd633",
    "_id": "196ace7f-199e-453b-b4f1-dc9d02bdd633",
    "_enabled": true,
    "regionId": "PA13",
    "slug": "alps-po-basin-mixed-forests-pa13",
    "name": "Alps & Po Basin Mixed Forests (PA13)",
    "description": "The Alps & Po Basin Mixed Forests (PA13) bioregion, home to the iconic Alpine ibex.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": " Alps Conifer and Mixed Forests",
      "_id": "49e58a4b-9427-49d8-86e7-7c8a5d39bf9e",
      "flagshipSpecies": {
        "latitude": 46.5583,
        "longitude": 10.4695,
        "title": "Alpine ibex",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0a0267ce-e469-49d2-8fe5-2325e93670e7/689--Alps-Conifer-and-Mixed-Forests-Alpine-ibex.jpeg",
          "_id": "0a0267ce-e469-49d2-8fe5-2325e93670e7"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0a0267ce-e469-49d2-8fe5-2325e93670e7/689--Alps-Conifer-and-Mixed-Forests-Alpine-ibex.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA13.kml"
  },
  {
    "id": "91dafdaa-3238-4723-af0b-488a50f56146",
    "_id": "91dafdaa-3238-4723-af0b-488a50f56146",
    "_enabled": true,
    "regionId": "PA12",
    "slug": "european-interior-mixed-forests-pa12",
    "name": "European Interior Mixed Forests (PA12)",
    "description": "The European Interior Mixed Forests (PA12) bioregion, home to the iconic Eurasian beaver.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": " Sarmatic Mixed Forests",
      "_id": "15e02d79-de52-4606-b6e2-b7146ecbae12",
      "flagshipSpecies": {
        "latitude": 55.9339,
        "longitude": 31.6138,
        "title": "Eurasian beaver",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/799fc043-3fba-4a24-80b7-c00c6c9e45ac/679--Sarmatic-Mixed-Forests-Eurasian-beaver.jpeg",
          "_id": "799fc043-3fba-4a24-80b7-c00c6c9e45ac"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/799fc043-3fba-4a24-80b7-c00c6c9e45ac/679--Sarmatic-Mixed-Forests-Eurasian-beaver.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA12.kml"
  },
  {
    "id": "47fa8936-600c-46bc-9f6e-c929db57e1eb",
    "_id": "47fa8936-600c-46bc-9f6e-c929db57e1eb",
    "_enabled": true,
    "regionId": "PA11",
    "slug": "baltic-sea-sarmatic-mixed-forests-pa11",
    "name": "Baltic Sea & Sarmatic Mixed Forests (PA11)",
    "description": "The Baltic Sea & Sarmatic Mixed Forests (PA11) bioregion, home to the iconic Eurasian beaver.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": " Sarmatic Mixed Forests",
      "_id": "15e02d79-de52-4606-b6e2-b7146ecbae12",
      "flagshipSpecies": {
        "latitude": 55.9339,
        "longitude": 31.6138,
        "title": "Eurasian beaver",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/799fc043-3fba-4a24-80b7-c00c6c9e45ac/679--Sarmatic-Mixed-Forests-Eurasian-beaver.jpeg",
          "_id": "799fc043-3fba-4a24-80b7-c00c6c9e45ac"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/799fc043-3fba-4a24-80b7-c00c6c9e45ac/679--Sarmatic-Mixed-Forests-Eurasian-beaver.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA11.kml"
  },
  {
    "id": "c636d937-4b91-4d75-bc80-0e6b9320e5e9",
    "_id": "c636d937-4b91-4d75-bc80-0e6b9320e5e9",
    "_enabled": true,
    "regionId": "PA10",
    "slug": "west-european-coastal-mixed-forests-pa10",
    "name": "West European Coastal Mixed Forests (PA10)",
    "description": "The West European Coastal Mixed Forests (PA10) bioregion, home to the iconic Pyrenean frog.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": " Pyrenees Conifer and Mixed Forests",
      "_id": "3c67353c-a676-4121-9db2-c9d5665ce0b2",
      "flagshipSpecies": {
        "latitude": 42.5686,
        "longitude": 1.4409,
        "title": "Pyrenean frog",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/066e3059-011b-447d-becd-1dfe49358213/676-Pyrenees-Conifer-and-Mixed-Forests-Pyrenean-frog.jpeg",
          "_id": "066e3059-011b-447d-becd-1dfe49358213"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/066e3059-011b-447d-becd-1dfe49358213/676-Pyrenees-Conifer-and-Mixed-Forests-Pyrenean-frog.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA10.kml"
  },
  {
    "id": "8f3a050a-38e1-4050-8440-fa7ad1f291cb",
    "_id": "8f3a050a-38e1-4050-8440-fa7ad1f291cb",
    "_enabled": true,
    "regionId": "PA8",
    "slug": "ural-mountains-west-eurasian-taiga-forests-pa8",
    "name": "Ural Mountains & West Eurasian Taiga Forests (PA8)",
    "description": "The Ural Mountains & West Eurasian Taiga Forests (PA8) bioregion, home to the iconic Sable (Martes zibellina).",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Urals Montane Forest and Taiga",
      "_id": "758a60d1-2e49-4100-8954-01008139d940",
      "flagshipSpecies": {
        "latitude": 61.0178,
        "longitude": 58.3117,
        "title": "Sable (Martes zibellina)",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/cae44050-9eee-489f-a101-cec399df7268/Sable Martes zibellina.jpg",
          "_id": "cae44050-9eee-489f-a101-cec399df7268"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/cae44050-9eee-489f-a101-cec399df7268/Sable Martes zibellina.jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA8.kml"
  },
  {
    "id": "56a9b6cf-a88b-499d-bb7e-c30de6eb512c",
    "_id": "56a9b6cf-a88b-499d-bb7e-c30de6eb512c",
    "_enabled": true,
    "regionId": "PA7",
    "slug": "siberian-boreal-forests-mountain-tundra-pa7",
    "name": "Siberian Boreal Forests & Mountain Tundra (PA7)",
    "description": "The Siberian Boreal Forests & Mountain Tundra (PA7) bioregion, home to the iconic Wolverine.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Trans-Baikal Bald Mountain Tundra",
      "_id": "8c6e830b-0204-49a2-bfe0-a95a1218b4ce",
      "flagshipSpecies": {
        "latitude": 55.701,
        "longitude": 131.7443,
        "title": "Wolverine",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b659f0a9-8068-41f8-a8b5-71f0bd540cae/A wolverine (Gulo gulo). Wolverine standing on a rock. Image credit Dennis Jacobson Dreamstime.jpg",
          "_id": "b659f0a9-8068-41f8-a8b5-71f0bd540cae"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b659f0a9-8068-41f8-a8b5-71f0bd540cae/A wolverine (Gulo gulo). Wolverine standing on a rock. Image credit Dennis Jacobson Dreamstime.jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA7.kml"
  },
  {
    "id": "df5587df-e49c-4bd1-ad69-579d43b7cfc7",
    "_id": "df5587df-e49c-4bd1-ad69-579d43b7cfc7",
    "_enabled": true,
    "regionId": "PA6",
    "slug": "sea-of-okhotsk-coastal-taiga-meadows-tundra-pa6",
    "name": "Sea of Okhotsk Coastal Taiga, Meadows & Tundra (PA6)",
    "description": "The Sea of Okhotsk Coastal Taiga, Meadows & Tundra (PA6) bioregion, home to the iconic Tundra wolf.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": " Kamchatka Tundra",
      "_id": "886eaf9f-4927-4f94-8bf4-36574bbfe3fa",
      "flagshipSpecies": {
        "latitude": 55.573,
        "longitude": 158.1249,
        "title": "Tundra wolf",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7b6a0b92-3495-42dc-8926-125b32cfdb81/773--Kamchatka-Tundra--Tundra-wolf.jpeg",
          "_id": "7b6a0b92-3495-42dc-8926-125b32cfdb81"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7b6a0b92-3495-42dc-8926-125b32cfdb81/773--Kamchatka-Tundra--Tundra-wolf.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA6.kml"
  },
  {
    "id": "8e0da6df-8bcc-4db1-88f3-1139861ee02b",
    "_id": "8e0da6df-8bcc-4db1-88f3-1139861ee02b",
    "_enabled": true,
    "regionId": "PA4",
    "slug": "greater-eurasian-tundra-pa4",
    "name": "Greater Eurasian Tundra (PA4)",
    "description": "The Greater Eurasian Tundra (PA4) bioregion, home to the iconic Reindeer.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Northeast Siberian Coastal Tundra",
      "_id": "0f9d705e-37fe-4fc8-a293-02bd6d7f0513",
      "flagshipSpecies": {
        "latitude": 70.9662,
        "longitude": 147.6039,
        "title": "Reindeer",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/d1405927-1036-4a30-a6c9-81cce863336c/717_Finnish forest reindeer_1_Mathew Schwartz via Wikimedia.jpeg",
          "_id": "d1405927-1036-4a30-a6c9-81cce863336c"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/d1405927-1036-4a30-a6c9-81cce863336c/717_Finnish forest reindeer_1_Mathew Schwartz via Wikimedia.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA4.kml"
  },
  {
    "id": "df4785b2-c677-48dd-941e-22a68fd363b5",
    "_id": "df4785b2-c677-48dd-941e-22a68fd363b5",
    "_enabled": true,
    "regionId": "PA1",
    "slug": "russian-arctic-desert-islands-pa1",
    "name": "Russian Arctic Desert Islands (PA1)",
    "description": "The Russian Arctic Desert Islands (PA1) bioregion, home to the iconic Svalbard rock ptarmigan.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Russian Arctic Desert",
      "_id": "35398fc7-24df-45dc-8564-ff493307b6b8",
      "flagshipSpecies": {
        "latitude": 78.687,
        "longitude": 18.154,
        "title": "Svalbard rock ptarmigan",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/d3580e9c-442e-4244-8499-f41287deb2d8/778-Russian-Arctic-Desert--Svalbard-rock-ptarmigan-.jpeg",
          "_id": "d3580e9c-442e-4244-8499-f41287deb2d8"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/d3580e9c-442e-4244-8499-f41287deb2d8/778-Russian-Arctic-Desert--Svalbard-rock-ptarmigan-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA1.kml"
  },
  {
    "id": "6f232572-96e7-4fa0-83cb-9eed4fe81b40",
    "_id": "6f232572-96e7-4fa0-83cb-9eed4fe81b40",
    "_enabled": true,
    "regionId": "OC11",
    "slug": "hawaii-tropical-islands-oc11",
    "name": "Hawai’i Tropical Islands (OC11)",
    "description": "The Hawai’i Tropical Islands (OC11) bioregion, home to the iconic I'iwi.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Hawai'I Tropical Moist Forests",
      "_id": "0d3a0295-33d1-46b0-abc0-aad6bfeeb6ba",
      "flagshipSpecies": {
        "latitude": 19.5328,
        "longitude": -155.1298,
        "title": "I'iwi",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7382a872-edfa-4351-9ee6-5fdaf8a636b5/623-Hawai'I-Tropical-Moist-Forests-I’iwi.jpeg",
          "_id": "7382a872-edfa-4351-9ee6-5fdaf8a636b5"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7382a872-edfa-4351-9ee6-5fdaf8a636b5/623-Hawai'I-Tropical-Moist-Forests-I’iwi.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/OC11.kml"
  },
  {
    "id": "969c55e9-329a-45b7-a322-8ebd27becf5d",
    "_id": "969c55e9-329a-45b7-a322-8ebd27becf5d",
    "_enabled": true,
    "regionId": "OC9",
    "slug": "guam-marianas-dry-tropical-islands-oc9",
    "name": "Guam & Marianas Dry Tropical Islands (OC9)",
    "description": "The Guam & Marianas Dry Tropical Islands (OC9) bioregion, home to the iconic Marianas fruit pigeon.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Marianas Tropical Dry Forests",
      "_id": "1ac0f38b-eb63-4623-83f7-83c7ac698fce",
      "flagshipSpecies": {
        "latitude": 13.3532,
        "longitude": 144.7114,
        "title": "Marianas fruit pigeon",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/96be9e6d-c528-4474-b779-ca6fbf650eb0/637-Marianas-Tropical-Dry-Forests-Marianas-fruit-pigeon.jpeg",
          "_id": "96be9e6d-c528-4474-b779-ca6fbf650eb0"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/96be9e6d-c528-4474-b779-ca6fbf650eb0/637-Marianas-Tropical-Dry-Forests-Marianas-fruit-pigeon.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/OC9.kml"
  },
  {
    "id": "61008762-3189-4bc3-aa82-0ac236ff243b",
    "_id": "61008762-3189-4bc3-aa82-0ac236ff243b",
    "_enabled": true,
    "regionId": "OC8",
    "slug": "palau-caroline-tropical-islands-oc8",
    "name": "Palau & Caroline Tropical Islands (OC8)",
    "description": "The Palau & Caroline Tropical Islands (OC8) bioregion, home to the iconic Pohnpei lorikeet.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Carolines Tropical Moist Forests",
      "_id": "695ad14d-f74c-432c-a530-64e7ee666b15",
      "flagshipSpecies": {
        "latitude": 6.875,
        "longitude": 158.2232,
        "title": "Pohnpei lorikeet",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/06eb36f0-aad8-4222-8be1-8b717ccfc754/618-Carolines-Tropical-Moist-Forests-Pohnpei-lorikeet.jpeg",
          "_id": "06eb36f0-aad8-4222-8be1-8b717ccfc754"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/06eb36f0-aad8-4222-8be1-8b717ccfc754/618-Carolines-Tropical-Moist-Forests-Pohnpei-lorikeet.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/OC8.kml"
  },
  {
    "id": "c7a65d33-2546-46b1-b02a-4d23ebaf7e12",
    "_id": "c7a65d33-2546-46b1-b02a-4d23ebaf7e12",
    "_enabled": true,
    "regionId": "OC6",
    "slug": "fiji-tongan-tropical-islands-oc6",
    "name": "Fiji & Tongan Tropical Islands (OC6)",
    "description": "The Fiji & Tongan Tropical Islands (OC6) bioregion, home to the iconic Fiji crested iguana.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Fiji Tropical Dry Forests",
      "_id": "0e8026d5-f30b-49ce-915e-f193c072ff83",
      "flagshipSpecies": {
        "latitude": -17.7313,
        "longitude": 177.6744,
        "title": "Fiji crested iguana",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5e41ecf5-1da5-4070-a09a-8664fec1e027/635--Fiji-Tropical-Dry-Forests--Fiji-crested-iguana.jpeg",
          "_id": "5e41ecf5-1da5-4070-a09a-8664fec1e027"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5e41ecf5-1da5-4070-a09a-8664fec1e027/635--Fiji-Tropical-Dry-Forests--Fiji-crested-iguana.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/OC6.kml"
  },
  {
    "id": "14278f32-15db-41ae-aaf0-0adbfb5885ad",
    "_id": "14278f32-15db-41ae-aaf0-0adbfb5885ad",
    "_enabled": true,
    "regionId": "OC5",
    "slug": "samoa-west-polynesian-tropical-islands-oc5",
    "name": "Samoa & West Polynesian Tropical Islands (OC5)",
    "description": "The Samoa & West Polynesian Tropical Islands (OC5) bioregion, home to the iconic Many-colored fruit-dove.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Samoan Tropical Moist Forests",
      "_id": "847233b7-cee9-489f-8fa9-7c4456da6f94",
      "flagshipSpecies": {
        "latitude": -13.6143,
        "longitude": -172.3946,
        "title": "Many-colored fruit-dove",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4a75a3d6-1ace-497d-a8ce-41dbc53e76ed/Many colored fruit dove Photo 41355466 © Tinamou _ Dreamstime.jpg",
          "_id": "4a75a3d6-1ace-497d-a8ce-41dbc53e76ed"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4a75a3d6-1ace-497d-a8ce-41dbc53e76ed/Many colored fruit dove Photo 41355466 © Tinamou _ Dreamstime.jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/OC5.kml"
  },
  {
    "id": "f46c3dd3-21e5-4e25-b251-150631305ddb",
    "_id": "f46c3dd3-21e5-4e25-b251-150631305ddb",
    "_enabled": true,
    "regionId": "OC4",
    "slug": "central-polynesian-islands-oc4",
    "name": "Central Polynesian Islands (OC4)",
    "description": "The Central Polynesian Islands (OC4) bioregion, home to the iconic Bokikokiko reed warbler.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Central Polynesian Tropical Moist Forests",
      "_id": "56224e76-c788-4b7e-b0f0-28e9cba52cda",
      "flagshipSpecies": {
        "latitude": 1.8336,
        "longitude": -157.6784,
        "title": "Bokikokiko reed warbler",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/157e3806-78c7-429a-8ddd-bf92e8227c3f/619-Central-Polynesian-Tropical-Moist-Forests-Bokikokiko-reed-warbler.jpeg",
          "_id": "157e3806-78c7-429a-8ddd-bf92e8227c3f"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/157e3806-78c7-429a-8ddd-bf92e8227c3f/619-Central-Polynesian-Tropical-Moist-Forests-Bokikokiko-reed-warbler.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/OC4.kml"
  },
  {
    "id": "cb0861df-b51a-4c3d-97f5-8fc1fc8845a8",
    "_id": "cb0861df-b51a-4c3d-97f5-8fc1fc8845a8",
    "_enabled": true,
    "regionId": "OC3",
    "slug": "southeast-polynesian-islands-oc3",
    "name": "Southeast Polynesian Islands (OC3)",
    "description": "The Southeast Polynesian Islands (OC3) bioregion, home to the iconic Mangareva kingfisher.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Tuamotu Tropical Moist Forests",
      "_id": "d49a1235-f458-4f87-b22f-fe01281bb476",
      "flagshipSpecies": {
        "latitude": -16.1686,
        "longitude": -146.3613,
        "title": "Mangareva kingfisher",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a89e1252-4244-4203-a782-64c2dff4cb7d/632-Tuamotu-Tropical-Moist-Forests-Mangareva-kingfisher.jpeg",
          "_id": "a89e1252-4244-4203-a782-64c2dff4cb7d"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a89e1252-4244-4203-a782-64c2dff4cb7d/632-Tuamotu-Tropical-Moist-Forests-Mangareva-kingfisher.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/OC3.kml"
  },
  {
    "id": "258dc6fa-ad9a-4b7d-abff-ea283b99249b",
    "_id": "258dc6fa-ad9a-4b7d-abff-ea283b99249b",
    "_enabled": true,
    "regionId": "OC2",
    "slug": "marquesas-tropical-islands-oc2",
    "name": "Marquesas Tropical Islands (OC2)",
    "description": "The Marquesas Tropical Islands (OC2) bioregion, home to the iconic Marquesan kingfisher.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Marquesas Tropical Moist Forests",
      "_id": "9eb22675-1bb4-4e58-bb5e-a20b922f97e0",
      "flagshipSpecies": {
        "latitude": -8.8936,
        "longitude": -140.1399,
        "title": "Marquesan kingfisher",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/d71fde16-3398-44a6-a494-bfcd3302c797/625 Marquesan kingfisher-Alamy Michael Greenfelder PK93G3 2.jpeg",
          "_id": "d71fde16-3398-44a6-a494-bfcd3302c797"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/d71fde16-3398-44a6-a494-bfcd3302c797/625 Marquesan kingfisher-Alamy Michael Greenfelder PK93G3 2.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/OC2.kml"
  },
  {
    "id": "fb479e61-a12e-467a-8a5e-b68abd7b1996",
    "_id": "fb479e61-a12e-467a-8a5e-b68abd7b1996",
    "_enabled": true,
    "regionId": "OC1",
    "slug": "salas-y-gomez-easter-islands-oc1",
    "name": "Salas y Gómez & Easter Islands (OC1)",
    "description": "The Salas y Gómez & Easter Islands (OC1) bioregion, home to the iconic Kemp's ridley sea turtle.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Rapa Nui and Sala Y Gómez Subtropical Broadleaf Forests",
      "_id": "a13759f6-8081-46bb-bce9-9baa95f61fda",
      "flagshipSpecies": {
        "latitude": -27.1108,
        "longitude": -109.3642,
        "title": "Kemp's ridley sea turtle",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e2ef5ab0-60af-4561-8e03-d20bd7fe5cd3/628 kemp's ridley sea turtle.jpg",
          "_id": "e2ef5ab0-60af-4561-8e03-d20bd7fe5cd3"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e2ef5ab0-60af-4561-8e03-d20bd7fe5cd3/628 kemp's ridley sea turtle.jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/OC1.kml"
  },
  {
    "id": "f1a60e1a-543e-4a09-92aa-90ac01b2f6ec",
    "_id": "f1a60e1a-543e-4a09-92aa-90ac01b2f6ec",
    "_enabled": true,
    "regionId": "NT24",
    "slug": "central-american-isthmian-colombian-coastal-forests-nt24",
    "name": "Central American Isthmian & Colombian Coastal Forests (NT24)",
    "description": "The Central American Isthmian & Colombian Coastal Forests (NT24) bioregion, home to the iconic Clown frog.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Isthmian-Pacific Moist Forests",
      "_id": "107d71de-92dc-4691-b39b-b2785c41f9e4",
      "flagshipSpecies": {
        "latitude": 8.1754,
        "longitude": -81.3864,
        "title": "Clown frog",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8da2b04b-c5cc-41b0-9f87-671874c5e2c5/471-Isthmian-Pacific-Moist-Forests-Clown-frog.jpeg",
          "_id": "8da2b04b-c5cc-41b0-9f87-671874c5e2c5"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8da2b04b-c5cc-41b0-9f87-671874c5e2c5/471-Isthmian-Pacific-Moist-Forests-Clown-frog.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT24.kml"
  },
  {
    "id": "3e7768ec-5522-48a0-8fe7-3904838fda64",
    "_id": "3e7768ec-5522-48a0-8fe7-3904838fda64",
    "_enabled": true,
    "regionId": "NT23",
    "slug": "venezuelan-coast-nt23",
    "name": "Venezuelan Coast (NT23)",
    "description": "The Venezuelan Coast (NT23) bioregion, home to the iconic Baird's tapir.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Sinú Valley Dry Forests",
      "_id": "16bb8de4-24a0-4e5c-84bd-a8306ce20c7b",
      "flagshipSpecies": {
        "latitude": 9.8124,
        "longitude": -74.0595,
        "title": "Baird's tapir",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ad9b012f-9ec8-4896-8aff-72911e0ff62c/546--Sinu-Valley-Dry-Forests--Baird's-tapir.jpeg",
          "_id": "ad9b012f-9ec8-4896-8aff-72911e0ff62c"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ad9b012f-9ec8-4896-8aff-72911e0ff62c/546--Sinu-Valley-Dry-Forests--Baird's-tapir.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT23.kml"
  },
  {
    "id": "00946f20-cbca-48c1-ad34-bba50e09ddca",
    "_id": "00946f20-cbca-48c1-ad34-bba50e09ddca",
    "_enabled": true,
    "regionId": "NT22",
    "slug": "llanos-dry-forests-nt22",
    "name": "Llanos & Dry Forests (NT22)",
    "description": "The Llanos & Dry Forests (NT22) bioregion, home to the iconic Arrau turtle.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Llanos",
      "_id": "20ce7734-80c9-4b07-9315-c95344762e43",
      "flagshipSpecies": {
        "latitude": 6.3209,
        "longitude": -68.9971,
        "title": "Arrau turtle",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ee2fc857-34a7-4a2d-8a74-15ac72618734/572--Llanos-Arrau-turtle.jpeg",
          "_id": "ee2fc857-34a7-4a2d-8a74-15ac72618734"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ee2fc857-34a7-4a2d-8a74-15ac72618734/572--Llanos-Arrau-turtle.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT22.kml"
  },
  {
    "id": "a4a890b5-d832-4b4a-8e69-b12038f6ec03",
    "_id": "a4a890b5-d832-4b4a-8e69-b12038f6ec03",
    "_enabled": true,
    "regionId": "NT20",
    "slug": "northern-amazonian-forests-nt20",
    "name": "Northern Amazonian Forests (NT20)",
    "description": "The Northern Amazonian Forests (NT20) bioregion, home to the iconic Capybara.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Japurá-Solimões-Negro Moist Forests",
      "_id": "ff2171b6-3ba9-42cc-906f-e3cff938c8b8",
      "flagshipSpecies": {
        "latitude": -2.1625,
        "longitude": -63.1374,
        "title": "Capybara",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8f6d4192-e749-4db0-bb23-7825544d4c51/473--Japurá-Solimões-Negro-Moist-Forests-Capybara.jpeg",
          "_id": "8f6d4192-e749-4db0-bb23-7825544d4c51"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8f6d4192-e749-4db0-bb23-7825544d4c51/473--Japurá-Solimões-Negro-Moist-Forests-Capybara.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT20.kml"
  },
  {
    "id": "6e241669-cf4c-46bc-bd37-c1e365aa22c4",
    "_id": "6e241669-cf4c-46bc-bd37-c1e365aa22c4",
    "_enabled": true,
    "regionId": "NT18",
    "slug": "western-amazonian-forests-plains-nt18",
    "name": "Western Amazonian Forests & Plains (NT18)",
    "description": "The Western Amazonian Forests & Plains (NT18) bioregion, home to the iconic Amazon river dolphin.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Iquitos Várzea",
      "_id": "f8e97acb-1fac-4db1-b534-22988d76afe8",
      "flagshipSpecies": {
        "latitude": -5.3327,
        "longitude": -74.6549,
        "title": "Amazon river dolphin",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b14f002e-522a-48d6-af61-1b1348baecbb/469-Iquitos-Varzea-Amazon-river-dolphin.jpeg",
          "_id": "b14f002e-522a-48d6-af61-1b1348baecbb"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b14f002e-522a-48d6-af61-1b1348baecbb/469-Iquitos-Varzea-Amazon-river-dolphin.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT18.kml"
  },
  {
    "id": "940d0d19-17a1-4a1d-8844-ec098d953cea",
    "_id": "940d0d19-17a1-4a1d-8844-ec098d953cea",
    "_enabled": true,
    "regionId": "NT17",
    "slug": "southern-amazonian-forests-nt17",
    "name": "Southern Amazonian Forests (NT17)",
    "description": "The Southern Amazonian Forests (NT17) bioregion, home to the iconic Amazonian manatee.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Xingu-Tocantins-Araguaia Moist Forests",
      "_id": "de92bf2b-3043-4525-bcbc-d3a64a1c43e8",
      "flagshipSpecies": {
        "latitude": -5.0392,
        "longitude": -51.2626,
        "title": "Amazonian manatee",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/34a2b09f-bb7a-4a57-9cc2-ddfdd7fa000a/518-Xingu-Tocantins-Araguaia-Moist-Forests-Amazonian-manatee.jpeg",
          "_id": "34a2b09f-bb7a-4a57-9cc2-ddfdd7fa000a"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/34a2b09f-bb7a-4a57-9cc2-ddfdd7fa000a/518-Xingu-Tocantins-Araguaia-Moist-Forests-Amazonian-manatee.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT17.kml"
  },
  {
    "id": "b7cf26a8-84fc-4177-8889-e1420052001b",
    "_id": "b7cf26a8-84fc-4177-8889-e1420052001b",
    "_enabled": true,
    "regionId": "NT16",
    "slug": "amazon-river-estuary-nt16",
    "name": "Amazon River Estuary (NT16)",
    "description": "The Amazon River Estuary (NT16) bioregion, home to the iconic Scarlet ibis.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Northeast Brazil Restingas",
      "_id": "09a1fabd-b640-4f50-868d-ea126637b5f8",
      "flagshipSpecies": {
        "latitude": -2.9302,
        "longitude": -43.7329,
        "title": "Scarlet ibis",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2517fed0-ba3c-4d86-9d5e-5f85cf057701/485-Northeast-Brazil-Restingas-Scarlet-ibis.jpeg",
          "_id": "2517fed0-ba3c-4d86-9d5e-5f85cf057701"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2517fed0-ba3c-4d86-9d5e-5f85cf057701/485-Northeast-Brazil-Restingas-Scarlet-ibis.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT16.kml"
  },
  {
    "id": "83d3e7b5-17f4-42f0-827f-2519550dfa82",
    "_id": "83d3e7b5-17f4-42f0-827f-2519550dfa82",
    "_enabled": true,
    "regionId": "NT15",
    "slug": "brazilian-atlantic-dry-forests-nt15",
    "name": "Brazilian Atlantic Dry Forests (NT15)",
    "description": "The Brazilian Atlantic Dry Forests (NT15) bioregion, home to the iconic Black bearded saki.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Maranhão Babaçu Forests",
      "_id": "c5a6d23f-2f78-4d0f-9a3b-491d1f3ff0e5",
      "flagshipSpecies": {
        "latitude": -4.3957,
        "longitude": -43.7694,
        "title": "Black bearded saki",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8d601905-a45b-4feb-b6c2-aa1760b5ba62/540--Maranhão-Babaçu-forests--Black-bearded-saki.jpeg",
          "_id": "8d601905-a45b-4feb-b6c2-aa1760b5ba62"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8d601905-a45b-4feb-b6c2-aa1760b5ba62/540--Maranhão-Babaçu-forests--Black-bearded-saki.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT15.kml"
  },
  {
    "id": "66514f7b-97de-4f98-a8f1-f01bbce83b9e",
    "_id": "66514f7b-97de-4f98-a8f1-f01bbce83b9e",
    "_enabled": true,
    "regionId": "NT13",
    "slug": "cerrado-savannas-nt13",
    "name": "Cerrado Savannas (NT13)",
    "description": "The Cerrado Savannas (NT13) bioregion, home to the iconic Maned wolf.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Cerrado",
      "_id": "cf7d5bac-d439-4e74-97b1-2db7d8b99d4b",
      "flagshipSpecies": {
        "latitude": -14.7389,
        "longitude": -48.7027,
        "title": "Maned wolf",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/88c2ef50-970c-426d-aacb-3d1d2a499174/Maned wolf.jpeg",
          "_id": "88c2ef50-970c-426d-aacb-3d1d2a499174"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/88c2ef50-970c-426d-aacb-3d1d2a499174/Maned wolf.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT13.kml"
  },
  {
    "id": "280901a4-d287-4e2a-ac31-6ccad1c54b04",
    "_id": "280901a4-d287-4e2a-ac31-6ccad1c54b04",
    "_enabled": true,
    "regionId": "NT12",
    "slug": "pantanal-flooded-grasslands-dry-forests-nt12",
    "name": "Pantanal Flooded Grasslands & Dry Forests (NT12)",
    "description": "The Pantanal Flooded Grasslands & Dry Forests (NT12) bioregion, home to the iconic Jaguar.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Pantanal",
      "_id": "fdc36966-46d2-48f4-bf1d-54e072cd9efb",
      "flagshipSpecies": {
        "latitude": -18.6644,
        "longitude": -56.3711,
        "title": "Jaguar",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/cdc7703d-0d83-4053-9216-4e126428ae5c/584--Pantanal-Jaguar.jpeg",
          "_id": "cdc7703d-0d83-4053-9216-4e126428ae5c"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/cdc7703d-0d83-4053-9216-4e126428ae5c/584--Pantanal-Jaguar.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT12.kml"
  },
  {
    "id": "b4458504-35cd-4a0b-88fa-9d534c0ff7db",
    "_id": "b4458504-35cd-4a0b-88fa-9d534c0ff7db",
    "_enabled": true,
    "regionId": "NT11",
    "slug": "andean-mountain-forests-valleys-nt11",
    "name": "Andean Mountain Forests & Valleys (NT11)",
    "description": "The Andean Mountain Forests & Valleys (NT11) bioregion, home to the iconic Mountain tapir.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Cordillera Central Páramo",
      "_id": "74bbd5f0-0581-49a0-b50f-78a0405430d5",
      "flagshipSpecies": {
        "latitude": -6.9553,
        "longitude": -78.5737,
        "title": "Mountain tapir",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/209c96c8-d559-4579-9916-3cb82fa71980/590--Cordillera-Central-Paramo--Mountain-tapir.jpeg",
          "_id": "209c96c8-d559-4579-9916-3cb82fa71980"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/209c96c8-d559-4579-9916-3cb82fa71980/590--Cordillera-Central-Paramo--Mountain-tapir.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT11.kml"
  },
  {
    "id": "5aaf42c9-0600-421e-9448-8f8f47eb6d30",
    "_id": "5aaf42c9-0600-421e-9448-8f8f47eb6d30",
    "_enabled": true,
    "regionId": "NT10",
    "slug": "ecuadorean-dry-coastal-forests-flooded-grasslands-nt10",
    "name": "Ecuadorean Dry Coastal Forests & Flooded Grasslands (NT10)",
    "description": "The Ecuadorean Dry Coastal Forests & Flooded Grasslands (NT10) bioregion, home to the iconic Grey-cheeked parakeet.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Tumbes-Piura Dry Forests",
      "_id": "a39509b1-76e9-4565-bb70-c096151a1a0d",
      "flagshipSpecies": {
        "latitude": -5.6074,
        "longitude": -80.162,
        "title": "Grey-cheeked parakeet",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/20868d46-6ddc-4530-be11-e1f708230c7c/549-Tumbes-Piura-Dry-Forests-Grey-cheeked-parakeet.jpeg",
          "_id": "20868d46-6ddc-4530-be11-e1f708230c7c"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/20868d46-6ddc-4530-be11-e1f708230c7c/549-Tumbes-Piura-Dry-Forests-Grey-cheeked-parakeet.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT10.kml"
  },
  {
    "id": "aeee2e19-890c-401f-94fe-da9c3c201d45",
    "_id": "aeee2e19-890c-401f-94fe-da9c3c201d45",
    "_enabled": true,
    "regionId": "NT8",
    "slug": "south-american-coastal-deserts-nt8",
    "name": "South American Coastal Deserts (NT8)",
    "description": "The South American Coastal Deserts (NT8) bioregion, home to the iconic Sechuran fox.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Sechura Desert",
      "_id": "399f1c76-765a-4eb7-b2b8-742301520b14",
      "flagshipSpecies": {
        "latitude": -15.5768,
        "longitude": -73.5749,
        "title": "Sechuran fox",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6dc29780-dcf2-415c-8a59-3098e676ea13/608-Sechura-Desert-Sechuran-fox.jpeg",
          "_id": "6dc29780-dcf2-415c-8a59-3098e676ea13"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6dc29780-dcf2-415c-8a59-3098e676ea13/608-Sechura-Desert-Sechuran-fox.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT8.kml"
  },
  {
    "id": "79add296-0e16-4da5-98be-db8172b4d0c6",
    "_id": "79add296-0e16-4da5-98be-db8172b4d0c6",
    "_enabled": true,
    "regionId": "NT7",
    "slug": "juan-fernandez-desventuradas-islands-nt7",
    "name": "Juan Fernández & Desventuradas Islands (NT7)",
    "description": "The Juan Fernández & Desventuradas Islands (NT7) bioregion, home to the iconic Juan Fernández firecrown.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Juan Fernández Islands Temperate Forests",
      "_id": "a606e27e-baf7-48ff-af70-5da36932a626",
      "flagshipSpecies": {
        "latitude": -33.7586,
        "longitude": -80.7502,
        "title": "Juan Fernández firecrown",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e01febb2-1fad-42df-9e78-21d87a9b247f/560-Juan-Fernández-Islands-Temperate-Forests-Juan-Fernández-firecrown.jpeg",
          "_id": "e01febb2-1fad-42df-9e78-21d87a9b247f"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e01febb2-1fad-42df-9e78-21d87a9b247f/560-Juan-Fernández-Islands-Temperate-Forests-Juan-Fernández-firecrown.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT7.kml"
  },
  {
    "id": "0649be0d-8781-4068-9629-a096d349bc1d",
    "_id": "0649be0d-8781-4068-9629-a096d349bc1d",
    "_enabled": true,
    "regionId": "NT6",
    "slug": "chilean-matorral-shrublands-savanna-nt6",
    "name": "Chilean Matorral Shrublands & Savanna (NT6)",
    "description": "The Chilean Matorral Shrublands & Savanna (NT6) bioregion, home to the iconic Giant hummingbird.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Chilean Matorral",
      "_id": "30cda09e-7795-419a-97db-60fd6f13ef5c",
      "flagshipSpecies": {
        "latitude": -27.154,
        "longitude": -70.1802,
        "title": "Giant hummingbird",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ed703cc2-c0d9-43fa-b4e9-2c7a14509c8d/596-Chilean-Matorral-Giant-hummingbird.jpeg",
          "_id": "ed703cc2-c0d9-43fa-b4e9-2c7a14509c8d"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ed703cc2-c0d9-43fa-b4e9-2c7a14509c8d/596-Chilean-Matorral-Giant-hummingbird.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT6.kml"
  },
  {
    "id": "d9b836b5-87bf-49fe-bffe-2827953c581d",
    "_id": "d9b836b5-87bf-49fe-bffe-2827953c581d",
    "_enabled": true,
    "regionId": "NT5",
    "slug": "andean-mountain-grasslands-nt5",
    "name": "Andean Mountain Grasslands (NT5)",
    "description": "The Andean Mountain Grasslands (NT5) bioregion, home to the iconic Andean cat.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Central Andean Dry Puna",
      "_id": "7e4a504e-6ec5-466b-804e-c666eff05313",
      "flagshipSpecies": {
        "latitude": -18.8396,
        "longitude": -68.0036,
        "title": "Andean cat",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/1fe0237f-5425-456d-8964-8d2d7bfc8b16/587-Central-Andean-Dry-Puna-Andean-cat.jpeg",
          "_id": "1fe0237f-5425-456d-8964-8d2d7bfc8b16"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/1fe0237f-5425-456d-8964-8d2d7bfc8b16/587-Central-Andean-Dry-Puna-Andean-cat.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT5.kml"
  },
  {
    "id": "723450bf-f05a-4604-bbb9-c1b7130187b3",
    "_id": "723450bf-f05a-4604-bbb9-c1b7130187b3",
    "_enabled": true,
    "regionId": "NA31",
    "slug": "greater-california-na31",
    "name": "Greater California (NA31)",
    "description": "The Greater California (NA31) bioregion, home to the iconic California gnatcatcher.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "California Coastal Sage and Chaparral",
      "_id": "e83d058a-5ce9-40ba-ba13-2244f89e41af",
      "flagshipSpecies": {
        "latitude": 33.7793,
        "longitude": -117.4312,
        "title": "California gnatcatcher"
      }
    },
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA31.kml"
  },
  {
    "id": "ce6a2e78-8753-41f0-9bc5-6c32f5184c2a",
    "_id": "ce6a2e78-8753-41f0-9bc5-6c32f5184c2a",
    "_enabled": true,
    "regionId": "NA28",
    "slug": "southern-mixed-forests-blackland-prairies-na28",
    "name": "Southern Mixed Forests & Blackland Prairies (NA28)",
    "description": "The Southern Mixed Forests & Blackland Prairies (NA28) bioregion, home to the iconic American bison.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "East Central Texas Savanna-Woodland",
      "_id": "da9b36d1-a746-466d-87e9-df07fa7897be",
      "flagshipSpecies": {
        "latitude": 31.1745,
        "longitude": -96.1361,
        "title": "American bison",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/94f5dfa2-7f01-4a39-97a7-8509efcdd7c7/332-American_bison_Eco332-CC-Jack Dykinga-2011.jpeg",
          "_id": "94f5dfa2-7f01-4a39-97a7-8509efcdd7c7"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/94f5dfa2-7f01-4a39-97a7-8509efcdd7c7/332-American_bison_Eco332-CC-Jack Dykinga-2011.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA28.kml"
  },
  {
    "id": "0b77640c-3dfc-485e-b256-822877e900e4",
    "_id": "0b77640c-3dfc-485e-b256-822877e900e4",
    "_enabled": true,
    "regionId": "NA27",
    "slug": "western-gulf-coastal-grasslands-na27",
    "name": "Western Gulf Coastal Grasslands (NA27)",
    "description": "The Western Gulf Coastal Grasslands (NA27) bioregion, home to the iconic Attwater's prairie chicken.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Western Gulf Coastal Grasslands",
      "_id": "b8553183-d3cc-4db0-85d8-ac872a611738",
      "flagshipSpecies": {
        "latitude": 29.3618,
        "longitude": -95.7913,
        "title": "Attwater's prairie chicken",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/92044316-65b8-420d-9c19-28041830dc18/384-Western-Gulf-Coastal-Grasslands-Attwater's-prairie-chicken.jpeg",
          "_id": "92044316-65b8-420d-9c19-28041830dc18"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/92044316-65b8-420d-9c19-28041830dc18/384-Western-Gulf-Coastal-Grasslands-Attwater's-prairie-chicken.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA27.kml"
  },
  {
    "id": "9c0c927e-c08a-4f09-8f75-01efe564ff7a",
    "_id": "9c0c927e-c08a-4f09-8f75-01efe564ff7a",
    "_enabled": true,
    "regionId": "NA26",
    "slug": "bermuda-na26",
    "name": "Bermuda (NA26) ",
    "description": "The Bermuda (NA26)  bioregion, home to the iconic Bermuda petrel (cahow).",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Bermuda Subtropical Conifer Forests",
      "_id": "51fc000d-9d42-418a-95e1-1687293bf0d0",
      "flagshipSpecies": {
        "latitude": 32.2912,
        "longitude": -64.7688,
        "title": "Bermuda petrel (cahow)",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0ae0a8e7-2cb3-4357-9498-d5966e9d646a/325-Bermuda-Subtropical-Conifer-Forests-Bermuda-petrel.jpeg",
          "_id": "0ae0a8e7-2cb3-4357-9498-d5966e9d646a"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0ae0a8e7-2cb3-4357-9498-d5966e9d646a/325-Bermuda-Subtropical-Conifer-Forests-Bermuda-petrel.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA26.kml"
  },
  {
    "id": "80fad2aa-0644-4403-83fe-4a1e7e345734",
    "_id": "80fad2aa-0644-4403-83fe-4a1e7e345734",
    "_enabled": true,
    "regionId": "NA25",
    "slug": "southeast-savannas-riparian-forests-na25",
    "name": "Southeast Savannas & Riparian Forests (NA25)",
    "description": "The Southeast Savannas & Riparian Forests (NA25) bioregion, home to the iconic Ivory-billed woodpecker.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Mississippi Lowland Forests",
      "_id": "b0782ef8-c63b-4602-8c5e-fec61fe6d819",
      "flagshipSpecies": {
        "latitude": 34.5714,
        "longitude": -91.2223,
        "title": "Ivory-billed woodpecker",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/cc3899f6-2dfc-4f7a-82c0-bc04a5534a27/337-Mississippi-Lowland-Forests-Ivory-billed-woodpecker.jpeg",
          "_id": "cc3899f6-2dfc-4f7a-82c0-bc04a5534a27"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/cc3899f6-2dfc-4f7a-82c0-bc04a5534a27/337-Mississippi-Lowland-Forests-Ivory-billed-woodpecker.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA25.kml"
  },
  {
    "id": "c1fe24d8-7c6b-49ae-91b5-50c304b5f3d5",
    "_id": "c1fe24d8-7c6b-49ae-91b5-50c304b5f3d5",
    "_enabled": true,
    "regionId": "NA23",
    "slug": "interior-plateau-southern-great-lakes-forests-na23",
    "name": "Interior Plateau & Southern Great Lakes Forests (NA23)",
    "description": "The Interior Plateau & Southern Great Lakes Forests (NA23) bioregion, home to the iconic Gray bat.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Interior Plateau US Hardwood Forests",
      "_id": "7e3a6598-b84d-49e6-86e7-70b460d91122",
      "flagshipSpecies": {
        "latitude": 35.8793,
        "longitude": -86.8877,
        "title": "Gray bat",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0632a706-5171-4041-92e3-d91679a7226b/336--Interior-Plateau-US-Hardwood-Forests---Gray-bat.jpeg",
          "_id": "0632a706-5171-4041-92e3-d91679a7226b"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0632a706-5171-4041-92e3-d91679a7226b/336--Interior-Plateau-US-Hardwood-Forests---Gray-bat.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA23.kml"
  },
  {
    "id": "e92cead2-326e-43b6-998a-7a6bfae4f0ca",
    "_id": "e92cead2-326e-43b6-998a-7a6bfae4f0ca",
    "_enabled": true,
    "regionId": "NA21",
    "slug": "midwestern-tallgrass-prairie-forest-transition-na21",
    "name": "Midwestern Tallgrass Prairie & Forest Transition (NA21)",
    "description": "The Midwestern Tallgrass Prairie & Forest Transition (NA21) bioregion, home to the iconic Blanding's turtle.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Central US Forest-Grasslands Transition",
      "_id": "b31dc4a1-97cf-4c8b-b69e-0582b0132732",
      "flagshipSpecies": {
        "latitude": 39.9912,
        "longitude": -89.3089,
        "title": "Blanding's turtle",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/dd1b6781-1f54-44bc-a576-f0719fecc320/387--Central-US-Forest-Grasslands-Transition--Blanding's-turtle.jpeg",
          "_id": "dd1b6781-1f54-44bc-a576-f0719fecc320"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/dd1b6781-1f54-44bc-a576-f0719fecc320/387--Central-US-Forest-Grasslands-Transition--Blanding's-turtle.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA21.kml"
  },
  {
    "id": "0d101cf8-0f6e-46d1-ad48-18865baf2355",
    "_id": "0d101cf8-0f6e-46d1-ad48-18865baf2355",
    "_enabled": true,
    "regionId": "NA16",
    "slug": "cascades-mountain-forests-valleys-na16",
    "name": "Cascades Mountain Forests & Valleys (NA16)",
    "description": "The Cascades Mountain Forests & Valleys (NA16) bioregion, home to the iconic Mountain beaver.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "North Cascades Conifer Forests",
      "_id": "a25c81e0-37b7-4ab9-88dd-8a259bf2eb7c",
      "flagshipSpecies": {
        "latitude": 48.5143,
        "longitude": -121.1701,
        "title": "Mountain beaver",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/da882ead-51f7-485a-affa-1056ec3153b1/358-North-Cascades-Conifer-Forests-Mountain-beaver.jpeg",
          "_id": "da882ead-51f7-485a-affa-1056ec3153b1"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/da882ead-51f7-485a-affa-1056ec3153b1/358-North-Cascades-Conifer-Forests-Mountain-beaver.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA16.kml"
  },
  {
    "id": "e218ab55-a4a1-485e-a21d-60249280323e",
    "_id": "e218ab55-a4a1-485e-a21d-60249280323e",
    "_enabled": true,
    "regionId": "NA15",
    "slug": "pacific-northwest-coastal-forests-na15",
    "name": "Pacific Northwest Coastal Forests (NA15)",
    "description": "The Pacific Northwest Coastal Forests (NA15) bioregion, home to the iconic Haida ermine.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Haida Gwaii Conifer Forests",
      "_id": "86ccf8b3-3e36-469c-9dc5-44845b923e54",
      "flagshipSpecies": {
        "latitude": 53.4597,
        "longitude": -132.1825,
        "title": "Haida ermine",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6af8953f-faea-4bab-8b25-4272ebfc2ca1/365-Haida-Gwaii-Conifer-Forests--Haida-ermine.jpeg",
          "_id": "6af8953f-faea-4bab-8b25-4272ebfc2ca1"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6af8953f-faea-4bab-8b25-4272ebfc2ca1/365-Haida-Gwaii-Conifer-Forests--Haida-ermine.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA15.kml"
  },
  {
    "id": "2f9056b0-dfcb-4269-8406-56db21f496e5",
    "_id": "2f9056b0-dfcb-4269-8406-56db21f496e5",
    "_enabled": true,
    "regionId": "NA14",
    "slug": "northwest-intermountain-conifer-forests-na14",
    "name": "Northwest Intermountain Conifer Forests (NA14)",
    "description": "The Northwest Intermountain Conifer Forests (NA14) bioregion, home to the iconic American badger.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Okanogan Dry Forests",
      "_id": "490d2d48-c5be-43b5-9e54-540259be0baa",
      "flagshipSpecies": {
        "latitude": 50.3391,
        "longitude": -120.3327,
        "title": "American badger",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/08887d33-a04d-417c-9628-1fd6653c09df/362--Okanogan-Dry-Forests-American-badger.jpeg",
          "_id": "08887d33-a04d-417c-9628-1fd6653c09df"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/08887d33-a04d-417c-9628-1fd6653c09df/362--Okanogan-Dry-Forests-American-badger.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA14.kml"
  },
  {
    "id": "bcace7fa-be48-441d-b039-8b70ff644572",
    "_id": "bcace7fa-be48-441d-b039-8b70ff644572",
    "_enabled": true,
    "regionId": "NA13",
    "slug": "greater-rockies-mountain-forests-na13",
    "name": "Greater Rockies & Mountain Forests (NA13)",
    "description": "The Greater Rockies & Mountain Forests (NA13) bioregion, home to the iconic Grizzly bear.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Central British Columbia Mountain Forests",
      "_id": "4ca918fb-73d8-44e0-8246-848e86badc5e",
      "flagshipSpecies": {
        "latitude": 55.4279,
        "longitude": -123.6638,
        "title": "Grizzly bear",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6c98905a-bb31-48f3-8e3c-545b31baccf9/350-Central-British-Columbia-Mountain-Forests-Grizzly-bear.jpeg",
          "_id": "6c98905a-bb31-48f3-8e3c-545b31baccf9"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6c98905a-bb31-48f3-8e3c-545b31baccf9/350-Central-British-Columbia-Mountain-Forests-Grizzly-bear.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA13.kml"
  },
  {
    "id": "ea455a8f-fe29-4c4a-9835-ed183056aae8",
    "_id": "ea455a8f-fe29-4c4a-9835-ed183056aae8",
    "_enabled": true,
    "regionId": "NA12",
    "slug": "northern-prairie-aspen-forests-na12",
    "name": "Northern Prairie & Aspen Forests (NA12)",
    "description": "The Northern Prairie & Aspen Forests (NA12) bioregion, home to the iconic Black-tailed prairie dog.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Northern Shortgrass Prairie",
      "_id": "6016127e-bccb-4343-a3a9-45fc56af628c",
      "flagshipSpecies": {
        "latitude": 49.1025,
        "longitude": -107.4839,
        "title": "Black-tailed prairie dog",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ea65e717-447c-4f44-8ec2-633eb2a9fadf/396--Northern-Shortgrass-Prairie-Black-tailed-prairie-dog.jpeg",
          "_id": "ea65e717-447c-4f44-8ec2-633eb2a9fadf"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ea65e717-447c-4f44-8ec2-633eb2a9fadf/396--Northern-Shortgrass-Prairie-Black-tailed-prairie-dog.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA12.kml"
  },
  {
    "id": "9014ef51-5a10-489e-b2b1-61c2ab69246f",
    "_id": "9014ef51-5a10-489e-b2b1-61c2ab69246f",
    "_enabled": true,
    "regionId": "NA9",
    "slug": "canadian-shield-coastal-taiga-forests-na9",
    "name": "Canadian Shield & Coastal Taiga-Forests (NA9)",
    "description": "The Canadian Shield & Coastal Taiga-Forests (NA9) bioregion, home to the iconic Polar bear.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Southern Hudson Bay Taiga",
      "_id": "745cba21-a8b1-464e-9fc4-86a4c55a113f",
      "flagshipSpecies": {
        "latitude": 53.0542,
        "longitude": -84.486,
        "title": "Polar bear",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f6ac5d4c-120e-4326-9eff-59792d228135/382--Southern-Hudson-Bay-Taiga-Polar-bear.jpeg",
          "_id": "f6ac5d4c-120e-4326-9eff-59792d228135"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f6ac5d4c-120e-4326-9eff-59792d228135/382--Southern-Hudson-Bay-Taiga-Polar-bear.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA9.kml"
  },
  {
    "id": "4a9f3809-6350-4db7-a777-927277a0f8c2",
    "_id": "4a9f3809-6350-4db7-a777-927277a0f8c2",
    "_enabled": true,
    "regionId": "NA8",
    "slug": "mid-canada-boreal-plains-foothill-forests-na8",
    "name": "Mid-Canada Boreal Plains & Foothill Forests (NA8)",
    "description": "The Mid-Canada Boreal Plains & Foothill Forests (NA8) bioregion, home to the iconic American beaver.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Alberta-British Columbia Foothills Forests",
      "_id": "f9968fa5-3384-4c93-8d44-91cf6cb8baec",
      "flagshipSpecies": {
        "latitude": 57.348,
        "longitude": -119.9398,
        "title": "American beaver",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/087b0165-dcfb-4d67-912d-ccb0deec04d8/345-Alberta-British-Columbia-Foothills-Forests--American-beaver.jpeg",
          "_id": "087b0165-dcfb-4d67-912d-ccb0deec04d8"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/087b0165-dcfb-4d67-912d-ccb0deec04d8/345-Alberta-British-Columbia-Foothills-Forests--American-beaver.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA8.kml"
  },
  {
    "id": "4e485461-d7d0-4faa-b3ae-e731afd61f5b",
    "_id": "4e485461-d7d0-4faa-b3ae-e731afd61f5b",
    "_enabled": true,
    "regionId": "NA7",
    "slug": "northwest-canadian-taiga-lakes-wetlands-na7",
    "name": "Northwest Canadian Taiga, Lakes, & Wetlands (NA7)",
    "description": "The Northwest Canadian Taiga, Lakes, & Wetlands (NA7) bioregion, home to the iconic Northern shrike.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Northwest Territories Taiga",
      "_id": "d8eab7e3-7fe6-4528-b877-19bb552fc343",
      "flagshipSpecies": {
        "latitude": 64.3488,
        "longitude": -121.0941,
        "title": "Northern shrike",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/809f6d54-85a1-40bd-8bba-10bbea11df50/381-Northwest-Territories-Taiga-Northern-shrike.jpeg",
          "_id": "809f6d54-85a1-40bd-8bba-10bbea11df50"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/809f6d54-85a1-40bd-8bba-10bbea11df50/381-Northwest-Territories-Taiga-Northern-shrike.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA7.kml"
  },
  {
    "id": "a28b7c1b-9f74-4aab-b310-5e10919df825",
    "_id": "a28b7c1b-9f74-4aab-b310-5e10919df825",
    "_enabled": true,
    "regionId": "NA6",
    "slug": "greater-yukon-na6",
    "name": "Greater Yukon (NA6)",
    "description": "The Greater Yukon (NA6) bioregion, home to the iconic Common raven.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Watson Highlands Taiga",
      "_id": "92345f33-b713-4ac1-9e30-87faa6e7a78a",
      "flagshipSpecies": {
        "latitude": 62.1954,
        "longitude": -134.7211,
        "title": "Common raven",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/9fae8167-c354-4bb3-a0e3-4ce8b52f710e/383-Watson-Highlands-Taiga-Common-raven.jpeg",
          "_id": "9fae8167-c354-4bb3-a0e3-4ce8b52f710e"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/9fae8167-c354-4bb3-a0e3-4ce8b52f710e/383-Watson-Highlands-Taiga-Common-raven.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA6.kml"
  },
  {
    "id": "7c9d0553-5261-4c98-ba80-26bb1a16ca0c",
    "_id": "7c9d0553-5261-4c98-ba80-26bb1a16ca0c",
    "_enabled": true,
    "regionId": "NA5",
    "slug": "far-northern-pacific-coast-na5",
    "name": "Far Northern Pacific Coast (NA5)",
    "description": "The Far Northern Pacific Coast (NA5) bioregion, home to the iconic Black-tailed deer.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Pacific Coastal Mountain Icefields and Tundra",
      "_id": "129ce8fc-a475-4961-8c45-3fd93cdbcd70",
      "flagshipSpecies": {
        "latitude": 60.2373,
        "longitude": -140.5105,
        "title": "Black-tailed deer",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/3bd12556-0c9f-4476-8cc1-305bfade39b5/420--Pacific-Coastal-Mountain-Icefields-and-Tundra-Black-tailed-deer.jpeg",
          "_id": "3bd12556-0c9f-4476-8cc1-305bfade39b5"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/3bd12556-0c9f-4476-8cc1-305bfade39b5/420--Pacific-Coastal-Mountain-Icefields-and-Tundra-Black-tailed-deer.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA5.kml"
  },
  {
    "id": "7213ad17-1fd7-4c41-a5cd-c55e43089562",
    "_id": "7213ad17-1fd7-4c41-a5cd-c55e43089562",
    "_enabled": true,
    "regionId": "NA4",
    "slug": "greater-alaska-taiga-tundra-na4",
    "name": "Greater Alaska Taiga & Tundra (NA4)",
    "description": "The Greater Alaska Taiga & Tundra (NA4) bioregion, home to the iconic Arctic fox.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Beringia Upland Tundra",
      "_id": "32e27acd-3ba3-44c8-8079-73491041aae4",
      "flagshipSpecies": {
        "latitude": 65.2092,
        "longitude": -165.172,
        "title": "Arctic fox",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/98605df6-abcd-4d8d-9b71-0d555a6a07c2/410-Beringia-Upland-Tundra--Arctic-fox.jpeg",
          "_id": "98605df6-abcd-4d8d-9b71-0d555a6a07c2"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/98605df6-abcd-4d8d-9b71-0d555a6a07c2/410-Beringia-Upland-Tundra--Arctic-fox.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA4.kml"
  },
  {
    "id": "976097e4-b4b2-493e-9ef4-79d0fd2dfdf0",
    "_id": "976097e4-b4b2-493e-9ef4-79d0fd2dfdf0",
    "_enabled": true,
    "regionId": "NA3",
    "slug": "north-alaskan-tundra-na3",
    "name": "North Alaskan Tundra (NA3)",
    "description": "The North Alaskan Tundra (NA3) bioregion, home to the iconic Beluga whale.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Arctic Coastal Tundra",
      "_id": "7502bcbb-ff74-45d1-aca9-37af84e3dd60",
      "flagshipSpecies": {
        "latitude": 70.6423,
        "longitude": -156.7995,
        "title": "Beluga whale",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f4bb6e0a-bcfa-46fc-a13a-8a929359da70/The beluga whale swim and facing the camera in the pool. The beluga whale is an Arctic and sub-Arctic cetacean. It is also known as the white whale, as it is the only marine mammal of this colour shutterstock_1400250143 (1).jpg",
          "_id": "f4bb6e0a-bcfa-46fc-a13a-8a929359da70"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f4bb6e0a-bcfa-46fc-a13a-8a929359da70/The beluga whale swim and facing the camera in the pool. The beluga whale is an Arctic and sub-Arctic cetacean. It is also known as the white whale, as it is the only marine mammal of this colour shutterstock_1400250143 (1).jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA3.kml"
  },
  {
    "id": "9a996e95-b631-44d9-8e30-06b7a21f5ef2",
    "_id": "9a996e95-b631-44d9-8e30-06b7a21f5ef2",
    "_enabled": true,
    "regionId": "IM16",
    "slug": "borneo-tropical-forests-sundaland-heath-forests-im16",
    "name": "Borneo Tropical Forests & Sundaland Heath Forests (IM16)",
    "description": "The Borneo Tropical Forests & Sundaland Heath Forests (IM16) bioregion, home to the iconic proboscis monkey.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Borneo Peat Swamp Forests",
      "_id": "af13ff3b-fb3b-4502-b333-b57543297c10",
      "flagshipSpecies": {
        "latitude": 2.6093,
        "longitude": 111.7826,
        "title": "proboscis monkey",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a67c3d04-08a8-4bad-80ab-058640bec092/221-Borneo-Peat-Swamp-Forests--probocis-monkey-.jpeg",
          "_id": "a67c3d04-08a8-4bad-80ab-058640bec092"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a67c3d04-08a8-4bad-80ab-058640bec092/221-Borneo-Peat-Swamp-Forests--probocis-monkey-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM16.kml"
  },
  {
    "id": "872eba95-86b9-44ca-a3e5-3d4ea5d4239e",
    "_id": "872eba95-86b9-44ca-a3e5-3d4ea5d4239e",
    "_enabled": true,
    "regionId": "IM15",
    "slug": "philippines-sulu-sea-tropical-forests-im15",
    "name": "Philippines & Sulu Sea Tropical Forests (IM15)",
    "description": "The Philippines & Sulu Sea Tropical Forests (IM15) bioregion, home to the iconic Giant Philippine eagle.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Mindanao Montane Rainforests",
      "_id": "d303381d-dad8-4afd-8e60-1e8b6f657204",
      "flagshipSpecies": {
        "latitude": 7.303,
        "longitude": 126.173,
        "title": "Giant Philippine eagle",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/89dbc584-5d80-4199-a48b-db5c7d30b7ef/Giant philippine eagle.jpeg",
          "_id": "89dbc584-5d80-4199-a48b-db5c7d30b7ef"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/89dbc584-5d80-4199-a48b-db5c7d30b7ef/Giant philippine eagle.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM15.kml"
  },
  {
    "id": "df2acfda-985e-4f8c-bfe6-924dc7434dfc",
    "_id": "df2acfda-985e-4f8c-bfe6-924dc7434dfc",
    "_enabled": true,
    "regionId": "IM13",
    "slug": "south-china-subtropical-evergreen-monsoon-forests-im13",
    "name": "South China Subtropical Evergreen & Monsoon Forests (IM13)",
    "description": "The South China Subtropical Evergreen & Monsoon Forests (IM13) bioregion, home to the iconic Chinese pangolin.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "South China-Vietnam Subtropical Evergreen Forests",
      "_id": "9218f5a1-54ce-46a5-a6f7-c38b2eba635a",
      "flagshipSpecies": {
        "latitude": 22.4264,
        "longitude": 106.9081,
        "title": "Chinese pangolin",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a4af7954-39fa-4e83-8739-3ad8d82b150f/268--South-China-Vietnam-Subtropical-Evergreen-Forests--Chinese-pangolin-.jpeg",
          "_id": "a4af7954-39fa-4e83-8739-3ad8d82b150f"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a4af7954-39fa-4e83-8739-3ad8d82b150f/268--South-China-Vietnam-Subtropical-Evergreen-Forests--Chinese-pangolin-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM13.kml"
  },
  {
    "id": "0b485023-f5e5-43ca-8596-25041efe21e4",
    "_id": "0b485023-f5e5-43ca-8596-25041efe21e4",
    "_enabled": true,
    "regionId": "IM12",
    "slug": "indochina-mixed-forests-peatlands-im12",
    "name": "Indochina Mixed Forests & Peatlands (IM12)",
    "description": "The Indochina Mixed Forests & Peatlands (IM12) bioregion, home to the iconic Smooth-coated otter.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Tonle Sap Freshwater Swamp Forests",
      "_id": "5cc5b8df-b76c-4ce3-8460-c9c5d9cce2c9",
      "flagshipSpecies": {
        "latitude": 13.0276,
        "longitude": 103.8007,
        "title": "Smooth-coated otter",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/77a32b61-715a-48f9-bbd2-b74c6199ecd6/285--Tonle-Sap-Freshwater-Swamp-Forests-Smooth-coated-otter-.jpeg",
          "_id": "77a32b61-715a-48f9-bbd2-b74c6199ecd6"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/77a32b61-715a-48f9-bbd2-b74c6199ecd6/285--Tonle-Sap-Freshwater-Swamp-Forests-Smooth-coated-otter-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM12.kml"
  },
  {
    "id": "376add45-cf3d-4bc0-b469-6492ef23f69d",
    "_id": "376add45-cf3d-4bc0-b469-6492ef23f69d",
    "_enabled": true,
    "regionId": "IM11",
    "slug": "irrawaddy-north-indochina-mixed-forests-im11",
    "name": "Irrawaddy & North Indochina Mixed Forests (IM11)",
    "description": "The Irrawaddy & North Indochina Mixed Forests (IM11) bioregion, home to the iconic Burmese starred tortoise.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Irrawaddy Dry Forests",
      "_id": "a511d54d-e3fd-4c94-aa75-793774171f9f",
      "flagshipSpecies": {
        "latitude": 20.6428,
        "longitude": 95.1072,
        "title": "Burmese starred tortoise",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ea16ba66-4185-4819-bb38-a3993bfb6edb/Burmese starred tortoise_1.jpg",
          "_id": "ea16ba66-4185-4819-bb38-a3993bfb6edb"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ea16ba66-4185-4819-bb38-a3993bfb6edb/Burmese starred tortoise_1.jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM11.kml"
  },
  {
    "id": "5c755703-bfe6-45c3-b8d9-813d7cc428aa",
    "_id": "5c755703-bfe6-45c3-b8d9-813d7cc428aa",
    "_enabled": true,
    "regionId": "IM10",
    "slug": "arakan-mountains-northern-triangle-forests-im10",
    "name": "Arakan Mountains & Northern Triangle Forests (IM10)",
    "description": "The Arakan Mountains & Northern Triangle Forests (IM10) bioregion, home to the iconic Takin.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Northern Triangle Temperate Forests",
      "_id": "fbc43a7c-07fe-4b3d-a452-00cdf9913d7f",
      "flagshipSpecies": {
        "latitude": 27.5219,
        "longitude": 97.8796,
        "title": "Takin",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/be4ad6dc-cb09-4d05-8a4f-1bba91e53748/307--Northern-Triangle-Temperate-Forests---Takin-.jpeg",
          "_id": "be4ad6dc-cb09-4d05-8a4f-1bba91e53748"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/be4ad6dc-cb09-4d05-8a4f-1bba91e53748/307--Northern-Triangle-Temperate-Forests---Takin-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM10.kml"
  },
  {
    "id": "3d205c96-303e-4629-8e13-3b0e1c8b4c98",
    "_id": "3d205c96-303e-4629-8e13-3b0e1c8b4c98",
    "_enabled": true,
    "regionId": "IM9",
    "slug": "myanmar-coastal-rainforests-andaman-sea-islands-im9",
    "name": "Myanmar Coastal Rainforests & Andaman Sea Islands (IM9)",
    "description": "The Myanmar Coastal Rainforests & Andaman Sea Islands (IM9) bioregion, home to the iconic Cinnamon bittern.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Irrawaddy Freshwater Swamp Forests",
      "_id": "93141baa-f22e-4111-bfc0-f607f5150419",
      "flagshipSpecies": {
        "latitude": 16.8482,
        "longitude": 95.5537,
        "title": "Cinnamon bittern",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6e99acad-b510-4262-843e-4156e235cbdb/234-Irrawaddy-Freshwater-Swamp-Forests-Cinnamon-bittern.jpeg",
          "_id": "6e99acad-b510-4262-843e-4156e235cbdb"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6e99acad-b510-4262-843e-4156e235cbdb/234-Irrawaddy-Freshwater-Swamp-Forests-Cinnamon-bittern.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM9.kml"
  },
  {
    "id": "011f3d73-cde6-4cbc-8cdf-5b0eb9fcb522",
    "_id": "011f3d73-cde6-4cbc-8cdf-5b0eb9fcb522",
    "_enabled": true,
    "regionId": "IM8",
    "slug": "greater-deccan-sri-lankan-forests-drylands-im8",
    "name": "Greater Deccan-Sri Lankan Forests & Drylands (IM8)",
    "description": "The Greater Deccan-Sri Lankan Forests & Drylands (IM8) bioregion, home to the iconic Bengal tiger.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Central Deccan Plateau Dry Deciduous Forests",
      "_id": "e036b334-cc7f-4b1a-8e10-5a794597aa50",
      "flagshipSpecies": {
        "latitude": 17.4255,
        "longitude": 78.5278,
        "title": "Bengal tiger",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/181679d6-788a-4edb-b0d3-55b10177a3ba/290-Central-Deccan-Plateau-Dry-Deciduous-Forests-Bengal-tiger-.jpeg",
          "_id": "181679d6-788a-4edb-b0d3-55b10177a3ba"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/181679d6-788a-4edb-b0d3-55b10177a3ba/290-Central-Deccan-Plateau-Dry-Deciduous-Forests-Bengal-tiger-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM8.kml"
  },
  {
    "id": "6a4ec863-f7a2-40e6-8d94-6d81882dc897",
    "_id": "6a4ec863-f7a2-40e6-8d94-6d81882dc897",
    "_enabled": true,
    "regionId": "IM7",
    "slug": "northern-deccan-odisha-tropical-forests-im7",
    "name": "Northern Deccan & Odisha Tropical Forests (IM7)",
    "description": "The Northern Deccan & Odisha Tropical Forests (IM7) bioregion, home to the iconic Four-horned antelope.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "North Deccan Dry Deciduous Forests",
      "_id": "e3ababb9-47e3-46b3-b735-10fc06ef4470",
      "flagshipSpecies": {
        "latitude": 21.0617,
        "longitude": 83.5634,
        "title": "Four-horned antelope",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ff096f98-1c45-469c-b966-b93ed692dfce/297-North-Deccan-Dry-Deciduous-Forests-Four-horned-antelope-.jpeg",
          "_id": "ff096f98-1c45-469c-b966-b93ed692dfce"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ff096f98-1c45-469c-b966-b93ed692dfce/297-North-Deccan-Dry-Deciduous-Forests-Four-horned-antelope-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM7.kml"
  },
  {
    "id": "93ebda6f-9a2d-4bfc-a730-e7a58a6b54b4",
    "_id": "93ebda6f-9a2d-4bfc-a730-e7a58a6b54b4",
    "_enabled": true,
    "regionId": "IM6",
    "slug": "north-indian-tropical-forests-sundarbans-im6",
    "name": "North Indian Tropical Forests & Sundarbans (IM6)",
    "description": "The North Indian Tropical Forests & Sundarbans (IM6) bioregion, home to the iconic Gharial crocodile.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Upper Gangetic Plains Moist Deciduous Forests",
      "_id": "9ea6d147-bc7e-43dd-9974-349ebbf5253c",
      "flagshipSpecies": {
        "latitude": 26.7538,
        "longitude": 79.8896,
        "title": "Gharial crocodile",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/27c305ad-1956-4cab-9114-1e9eb7fb3411/287--Upper-Gangetic-Plains-Moist-Deciduous-Forests-Gharial-crocodile.jpeg",
          "_id": "27c305ad-1956-4cab-9114-1e9eb7fb3411"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/27c305ad-1956-4cab-9114-1e9eb7fb3411/287--Upper-Gangetic-Plains-Moist-Deciduous-Forests-Gharial-crocodile.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM6.kml"
  },
  {
    "id": "5f051f59-e3f9-4174-a8f9-9419a20a6dc2",
    "_id": "5f051f59-e3f9-4174-a8f9-9419a20a6dc2",
    "_enabled": true,
    "regionId": "IM5",
    "slug": "himalayan-mixed-forests-grasslands-im5",
    "name": "Himalayan Mixed Forests & Grasslands (IM5)",
    "description": "The Himalayan Mixed Forests & Grasslands (IM5) bioregion, home to the iconic Red panda.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Eastern Himalayan Subalpine Conifer Forests",
      "_id": "cc452e65-1f68-480c-ab2d-8dea26389a7c",
      "flagshipSpecies": {
        "latitude": 27.495,
        "longitude": 92.1422,
        "title": "Red panda",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2a7cc7ba-dc6b-4ca0-9487-421b7a2be847/309-Eastern-Himalayan-Subalpine-Conifer-Forests-Red-panda-.jpeg",
          "_id": "2a7cc7ba-dc6b-4ca0-9487-421b7a2be847"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2a7cc7ba-dc6b-4ca0-9487-421b7a2be847/309-Eastern-Himalayan-Subalpine-Conifer-Forests-Red-panda-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM5.kml"
  },
  {
    "id": "a40a5dfd-dde8-462e-9d2c-53a15929b77c",
    "_id": "a40a5dfd-dde8-462e-9d2c-53a15929b77c",
    "_enabled": true,
    "regionId": "IM3",
    "slug": "indian-dry-deciduous-forests-im3",
    "name": "Indian Dry Deciduous Forests (IM3)",
    "description": "The Indian Dry Deciduous Forests (IM3) bioregion, home to the iconic Asiatic lion.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Khathiar-Gir Dry Deciduous Forests",
      "_id": "6bf4a2f2-3204-47ed-b4ec-a92ac7bd7e50",
      "flagshipSpecies": {
        "latitude": 24.8244,
        "longitude": 75.9191,
        "title": "Asiatic lion",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5d829d57-6b3c-4d7f-ae83-c856ca3d8891/295-Khathiar-Gir-Dry-Deciduous-Forests-Asiatic-lion-.jpeg",
          "_id": "5d829d57-6b3c-4d7f-ae83-c856ca3d8891"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5d829d57-6b3c-4d7f-ae83-c856ca3d8891/295-Khathiar-Gir-Dry-Deciduous-Forests-Asiatic-lion-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM3.kml"
  },
  {
    "id": "cce064e2-e4ca-4239-9234-f381765eda83",
    "_id": "cce064e2-e4ca-4239-9234-f381765eda83",
    "_enabled": true,
    "regionId": "IM2",
    "slug": "indian-tropical-coastal-forests-im2",
    "name": "Indian Tropical Coastal Forests (IM2)",
    "description": "The Indian Tropical Coastal Forests (IM2) bioregion, home to the iconic Rusty spotted cat.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Sri Lanka Lowland Rainforests",
      "_id": "60b87c21-05c1-44b1-8590-2e54ad92eb4a",
      "flagshipSpecies": {
        "latitude": 6.428,
        "longitude": 80.3616,
        "title": "Rusty spotted cat",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/86ec6d69-76b7-4f09-964c-7d1937496efc/274-Sri-Lanka-Lowland-Rainforests-Rusty-spotted-cat-.jpeg",
          "_id": "86ec6d69-76b7-4f09-964c-7d1937496efc"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/86ec6d69-76b7-4f09-964c-7d1937496efc/274-Sri-Lanka-Lowland-Rainforests-Rusty-spotted-cat-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM2.kml"
  },
  {
    "id": "d34612ac-02a8-4ffb-ae87-9baeee98efe0",
    "_id": "d34612ac-02a8-4ffb-ae87-9baeee98efe0",
    "_enabled": true,
    "regionId": "AU15",
    "slug": "southeast-indonesian-dry-forest-islands-au15",
    "name": "Southeast Indonesian Dry Forest Islands (AU15)",
    "description": "The Southeast Indonesian Dry Forest Islands (AU15) bioregion, home to the iconic Komodo dragon.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Lesser Sundas Deciduous Forests",
      "_id": "8b45fee6-6351-4475-b152-62d7a6e04d76",
      "flagshipSpecies": {
        "latitude": -8.7257,
        "longitude": 117.2432,
        "title": "Komodo dragon",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8133e133-40e5-4b3b-92fc-ed501294ac91/163--Lesser-Sundas-Deciduous-Forests-Komodo-dragon.jpeg",
          "_id": "8133e133-40e5-4b3b-92fc-ed501294ac91"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8133e133-40e5-4b3b-92fc-ed501294ac91/163--Lesser-Sundas-Deciduous-Forests-Komodo-dragon.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU15.kml"
  },
  {
    "id": "2df67e45-4aa7-4706-b6be-ebb98ec6d77a",
    "_id": "2df67e45-4aa7-4706-b6be-ebb98ec6d77a",
    "_enabled": true,
    "regionId": "AU14",
    "slug": "sulawesi-maluku-islands-au14",
    "name": "Sulawesi & Maluku Islands (AU14)",
    "description": "The Sulawesi & Maluku Islands (AU14) bioregion, home to the iconic Babirusa.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Sulawesi Lowland Rainforests",
      "_id": "206bf796-6965-4a13-ac7e-707669d42002",
      "flagshipSpecies": {
        "latitude": -3.288,
        "longitude": 121.6785,
        "title": "Babirusa",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/57d24312-f835-4c0c-a5dc-23dc16a3b03b/156--Sulawesi-Lowland-Rainforests-Babirusa-.jpeg",
          "_id": "57d24312-f835-4c0c-a5dc-23dc16a3b03b"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/57d24312-f835-4c0c-a5dc-23dc16a3b03b/156--Sulawesi-Lowland-Rainforests-Babirusa-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU14.kml"
  },
  {
    "id": "ad429ade-3b70-405b-b65f-82299179b810",
    "_id": "ad429ade-3b70-405b-b65f-82299179b810",
    "_enabled": true,
    "regionId": "AU13",
    "slug": "new-guinea-surrounding-islands-au13",
    "name": "New Guinea & Surrounding Islands (AU13)",
    "description": "The New Guinea & Surrounding Islands (AU13) bioregion, home to the iconic Biak emerald monitor lizard.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Biak-Numfoor Rainforests",
      "_id": "01d48dd7-5368-4c5a-81e1-26538367f8ca",
      "flagshipSpecies": {
        "latitude": -0.9849,
        "longitude": 135.9591,
        "title": "Biak emerald monitor lizard"
      }
    },
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU13.kml"
  },
  {
    "id": "529a56a8-79e5-4ca5-8904-68a48abf850a",
    "_id": "529a56a8-79e5-4ca5-8904-68a48abf850a",
    "_enabled": true,
    "regionId": "AU11",
    "slug": "vanuatu-islands-au11",
    "name": "Vanuatu Islands (AU11)",
    "description": "The Vanuatu Islands (AU11) bioregion, home to the iconic Redwing starling.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Vanuatu Rainforests",
      "_id": "3f0ac6d9-3763-4823-99a7-9d039cdf5b05",
      "flagshipSpecies": {
        "latitude": -15.3734,
        "longitude": 166.8726,
        "title": "Redwing starling"
      }
    },
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU11.kml"
  },
  {
    "id": "7fb46ba0-ce86-4c48-b7af-829feec77288",
    "_id": "7fb46ba0-ce86-4c48-b7af-829feec77288",
    "_enabled": true,
    "regionId": "AU10",
    "slug": "coral-sea-new-caledonia-islands-au10",
    "name": "Coral Sea & New Caledonia Islands (AU10)",
    "description": "The Coral Sea & New Caledonia Islands (AU10) bioregion, home to the iconic Kagu.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "New Caledonia Rainforests",
      "_id": "e118e739-5b44-435a-8fd2-2648759c6ef5",
      "flagshipSpecies": {
        "latitude": -21.0779,
        "longitude": 165.2176,
        "title": "Kagu"
      }
    },
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU10.kml"
  },
  {
    "id": "d74331dc-a208-4463-a224-0ae259de79b4",
    "_id": "d74331dc-a208-4463-a224-0ae259de79b4",
    "_enabled": true,
    "regionId": "AU9",
    "slug": "queensland-tropical-rainforests-savannas-au9",
    "name": "Queensland Tropical Rainforests & Savannas (AU9)",
    "description": "The Queensland Tropical Rainforests & Savannas (AU9) bioregion, home to the iconic bridled nailtail wallaby.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Brigalow Tropical Savanna",
      "_id": "34f9fd03-3f6f-49c4-a3dc-3d2ce54a0a04",
      "flagshipSpecies": {
        "latitude": -24.6501,
        "longitude": 148.8655,
        "title": "bridled nailtail wallaby",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/20084cf2-80aa-4ec6-a019-60ce77a90d62/182-Brigalow-Tropical-Savanna--bridled-nailtail-wallaby-.jpeg",
          "_id": "20084cf2-80aa-4ec6-a019-60ce77a90d62"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/20084cf2-80aa-4ec6-a019-60ce77a90d62/182-Brigalow-Tropical-Savanna--bridled-nailtail-wallaby-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU9.kml"
  },
  {
    "id": "9280dd8e-46eb-48b8-9e37-ac81d077c101",
    "_id": "9280dd8e-46eb-48b8-9e37-ac81d077c101",
    "_enabled": true,
    "regionId": "AU8",
    "slug": "north-australian-tropical-savannas-au8",
    "name": "North Australian Tropical Savannas (AU8)",
    "description": "The North Australian Tropical Savannas (AU8) bioregion, home to the iconic Golden bandicoot.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Kimberly Tropical Savanna",
      "_id": "e683765e-f2ab-4797-8aff-023c2546742d",
      "flagshipSpecies": {
        "latitude": -16.7495,
        "longitude": 126.5088,
        "title": "Golden bandicoot",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a9ce61b5-1395-4ab7-94ab-93b24d3d50f9/186-Kimberly-Tropical-Savanna-Golden-bandicoot-.jpeg",
          "_id": "a9ce61b5-1395-4ab7-94ab-93b24d3d50f9"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a9ce61b5-1395-4ab7-94ab-93b24d3d50f9/186-Kimberly-Tropical-Savanna-Golden-bandicoot-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU8.kml"
  },
  {
    "id": "475f74b6-0172-4f5d-b09f-6eefaef5a6c3",
    "_id": "475f74b6-0172-4f5d-b09f-6eefaef5a6c3",
    "_enabled": true,
    "regionId": "AU7",
    "slug": "greater-australian-interior-desert-shrublands-au7",
    "name": "Greater Australian Interior Desert & Shrublands (AU7)",
    "description": "The Greater Australian Interior Desert & Shrublands (AU7) bioregion, home to the iconic Black-flanked rock-wallaby.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Central Ranges Xeric Scrub",
      "_id": "5114ef88-4c70-4ad9-b8cb-3607a6977b26",
      "flagshipSpecies": {
        "latitude": -25.5458,
        "longitude": 132.7558,
        "title": "Black-flanked rock-wallaby",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/9b44342d-d67c-4adb-b61f-7102460932c4/208-Central-Ranges-Xeric-Scrub-Black-flanked-rock-wallaby-.jpeg",
          "_id": "9b44342d-d67c-4adb-b61f-7102460932c4"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/9b44342d-d67c-4adb-b61f-7102460932c4/208-Central-Ranges-Xeric-Scrub-Black-flanked-rock-wallaby-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU7.kml"
  },
  {
    "id": "8d6de58c-d3be-435f-82c3-e9636410e907",
    "_id": "8d6de58c-d3be-435f-82c3-e9636410e907",
    "_enabled": true,
    "regionId": "AU6",
    "slug": "west-australian-dry-coastal-shrublands-au6",
    "name": "West Australian Dry Coastal Shrublands (AU6)",
    "description": "The West Australian Dry Coastal Shrublands (AU6) bioregion, home to the iconic Pilbara olive python.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Pilbara Shrublands",
      "_id": "442b8dda-7eca-4575-b9bb-095750e720ef",
      "flagshipSpecies": {
        "latitude": -21.8692,
        "longitude": 118.8612,
        "title": "Pilbara olive python",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b7cd9e3b-fded-4a3e-92e8-0bfe0fbf5f1b/213--Pilbara-Shrublands-Pilbara-olive-python.jpeg",
          "_id": "b7cd9e3b-fded-4a3e-92e8-0bfe0fbf5f1b"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b7cd9e3b-fded-4a3e-92e8-0bfe0fbf5f1b/213--Pilbara-Shrublands-Pilbara-olive-python.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU6.kml"
  },
  {
    "id": "23d3bcf7-bee1-424c-9367-c2e700022ebf",
    "_id": "23d3bcf7-bee1-424c-9367-c2e700022ebf",
    "_enabled": true,
    "regionId": "AU5",
    "slug": "south-australian-mediterranean-forests-woodlands-scrub-au5",
    "name": "South Australian Mediterranean Forests, Woodlands & Scrub (AU5)",
    "description": "The South Australian Mediterranean Forests, Woodlands & Scrub (AU5) bioregion, home to the iconic Sandhill dunnart.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Eyre and Yorke Mallee",
      "_id": "e12cc36e-fe4a-47f8-b281-6d90c076c051",
      "flagshipSpecies": {
        "latitude": -33.5552,
        "longitude": 135.8429,
        "title": "Sandhill dunnart",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a97b25b4-9bfc-4fbf-a095-4935afd6a4c6/199--Eyre-and-Yorke-Mallee-Sandhill-dunnart-.jpeg",
          "_id": "a97b25b4-9bfc-4fbf-a095-4935afd6a4c6"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a97b25b4-9bfc-4fbf-a095-4935afd6a4c6/199--Eyre-and-Yorke-Mallee-Sandhill-dunnart-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU5.kml"
  },
  {
    "id": "3a464500-b752-417b-8f77-817678c56e31",
    "_id": "3a464500-b752-417b-8f77-817678c56e31",
    "_enabled": true,
    "regionId": "AU4",
    "slug": "east-australian-mediterranean-woodlands-temperate-savannas-au4",
    "name": "East Australian Mediterranean Woodlands & Temperate Savannas (AU4)",
    "description": "The East Australian Mediterranean Woodlands & Temperate Savannas (AU4) bioregion, home to the iconic Yellow-footed rock wallaby.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Eastern Australia Mulga Shrublands",
      "_id": "bab61a19-d1e7-4a15-b3c5-894d6f7abd2c",
      "flagshipSpecies": {
        "latitude": -27.9795,
        "longitude": 145.494,
        "title": "Yellow-footed rock wallaby",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/151125f9-7f1c-413c-97e6-21353c3ca97d/191--Eastern-Australia-Mulga-Shrublands-Yellow-footed-rock-wallaby-.jpeg",
          "_id": "151125f9-7f1c-413c-97e6-21353c3ca97d"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/151125f9-7f1c-413c-97e6-21353c3ca97d/191--Eastern-Australia-Mulga-Shrublands-Yellow-footed-rock-wallaby-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU4.kml"
  },
  {
    "id": "2ed51c1f-bb8b-4c07-9293-cd0594257323",
    "_id": "2ed51c1f-bb8b-4c07-9293-cd0594257323",
    "_enabled": true,
    "regionId": "AU3",
    "slug": "east-australian-temperate-forests-mountain-shrublands-au3",
    "name": "East Australian Temperate Forests & Mountain Shrublands (AU3)",
    "description": "The East Australian Temperate Forests & Mountain Shrublands (AU3) bioregion, home to the iconic Corroboree frog.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Australian Alps Montane Grasslands",
      "_id": "48c4c703-8e62-4f2c-a3ed-391005ea7747",
      "flagshipSpecies": {
        "latitude": -36.1293,
        "longitude": 148.4106,
        "title": "Corroboree frog",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/70d7ddaa-34ca-4f6a-a4b9-d966a02acea5/193-Corroboree-frog-Australian-Alps-Montane-Grasslands.jpeg",
          "_id": "70d7ddaa-34ca-4f6a-a4b9-d966a02acea5"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/70d7ddaa-34ca-4f6a-a4b9-d966a02acea5/193-Corroboree-frog-Australian-Alps-Montane-Grasslands.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU3.kml"
  },
  {
    "id": "eee451d0-25a4-4480-810f-dca9a7f51e66",
    "_id": "eee451d0-25a4-4480-810f-dca9a7f51e66",
    "_enabled": true,
    "regionId": "AU2",
    "slug": "lord-howe-norfolk-islands-au2",
    "name": "Lord Howe & Norfolk Islands (AU2)",
    "description": "The Lord Howe & Norfolk Islands (AU2) bioregion, home to the iconic Lord Howe Island marbled gecko.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Lord Howe Island Subtropical Forests",
      "_id": "5b59c467-c84a-46f1-b6b6-a2e51b91188b",
      "flagshipSpecies": {
        "latitude": -31.5711,
        "longitude": 159.0924,
        "title": "Lord Howe Island marbled gecko",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7551b7de-201d-45c9-8127-9c873e81abb8/142--Lord-Howe-Island-Subtropical-Forests-Lord-Howe-Island-marbled-gecko.jpeg",
          "_id": "7551b7de-201d-45c9-8127-9c873e81abb8"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7551b7de-201d-45c9-8127-9c873e81abb8/142--Lord-Howe-Island-Subtropical-Forests-Lord-Howe-Island-marbled-gecko.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU2.kml"
  },
  {
    "id": "1ed1af63-e856-46ac-ad86-88a0fb282552",
    "_id": "1ed1af63-e856-46ac-ad86-88a0fb282552",
    "_enabled": true,
    "regionId": "AU1",
    "slug": "new-zealand-au1",
    "name": "New Zealand (AU1)",
    "description": "The New Zealand (AU1) bioregion, home to the iconic Kea parrot.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "New Zealand South Island Montane Grasslands",
      "_id": "7a836e35-e7ab-4764-a012-f7916905f0df",
      "flagshipSpecies": {
        "latitude": -44.9092,
        "longitude": 168.5293,
        "title": "Kea parrot"
      }
    },
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU1.kml"
  },
  {
    "id": "060b6223-9d18-456b-aa98-921f7508185c",
    "_id": "060b6223-9d18-456b-aa98-921f7508185c",
    "_enabled": true,
    "regionId": "AT23",
    "slug": "sahel-acacia-savannas-at23",
    "name": "Sahel Acacia Savannas (AT23)",
    "description": "The Sahel Acacia Savannas (AT23) bioregion, home to the iconic Nile monitor.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Inner Niger Delta Flooded Savanna",
      "_id": "7f606505-51c8-4b1b-acef-faf1cbb28e52",
      "flagshipSpecies": {
        "latitude": 15.0918,
        "longitude": -4.2984,
        "title": "Nile monitor",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/73123bf3-5d8e-451f-9893-873a759befc7/71--Inner-Niger-Delta-Flooded-Savanna-Nile-monitor.jpeg",
          "_id": "73123bf3-5d8e-451f-9893-873a759befc7"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/73123bf3-5d8e-451f-9893-873a759befc7/71--Inner-Niger-Delta-Flooded-Savanna-Nile-monitor.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT23.kml"
  },
  {
    "id": "4eddab09-3964-40d3-98ad-42714f8df59e",
    "_id": "4eddab09-3964-40d3-98ad-42714f8df59e",
    "_enabled": true,
    "regionId": "AT22",
    "slug": "south-red-sea-gulf-of-aden-coastal-drylands-at22",
    "name": "South Red Sea & Gulf of Aden Coastal Drylands (AT22)",
    "description": "The South Red Sea & Gulf of Aden Coastal Drylands (AT22) bioregion, home to the iconic Farasan gazelle.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Southwest Arabian Coastal Xeric Shrublands",
      "_id": "d271d642-5985-4756-8d99-e58ff195fe8b",
      "flagshipSpecies": {
        "latitude": 14.3417,
        "longitude": 43.2745,
        "title": "Farasan gazelle",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f4913215-32fc-4ce9-8b56-7acbb03b0bd9/107--Southwest-Arabian-Coastal-Xeric-Shrublands-Farasan-gazelle-.jpeg",
          "_id": "f4913215-32fc-4ce9-8b56-7acbb03b0bd9"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f4913215-32fc-4ce9-8b56-7acbb03b0bd9/107--Southwest-Arabian-Coastal-Xeric-Shrublands-Farasan-gazelle-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT22.kml"
  },
  {
    "id": "90b1a824-cee2-4207-8492-218c7aa05d88",
    "_id": "90b1a824-cee2-4207-8492-218c7aa05d88",
    "_enabled": true,
    "regionId": "AT21",
    "slug": "lake-turkana-sudd-grasslands-bushlands-forests-at21",
    "name": "Lake Turkana-Sudd Grasslands, Bushlands & Forests (AT21)",
    "description": "The Lake Turkana-Sudd Grasslands, Bushlands & Forests (AT21) bioregion, home to the iconic African wild dog.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Ethiopian Montane Forests",
      "_id": "2a1f40ed-bca2-43f4-8d9d-b7d1ed0ed68c",
      "flagshipSpecies": {
        "latitude": 8.1513,
        "longitude": 35.541,
        "title": "African wild dog",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f707303d-bfbc-4b59-9817-04e1fe882e9b/12-Ethiopian-Montane-Forests--African-wild-dog-.jpeg",
          "_id": "f707303d-bfbc-4b59-9817-04e1fe882e9b"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f707303d-bfbc-4b59-9817-04e1fe882e9b/12-Ethiopian-Montane-Forests--African-wild-dog-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT21.kml"
  },
  {
    "id": "decc43ec-8195-41b1-8853-f691ee058518",
    "_id": "decc43ec-8195-41b1-8853-f691ee058518",
    "_enabled": true,
    "regionId": "AT20",
    "slug": "west-sudanian-savanna-at20",
    "name": "West Sudanian Savanna (AT20)",
    "description": "The West Sudanian Savanna (AT20) bioregion, home to the iconic Giant eland.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "West Sudanian Savanna",
      "_id": "427f23ff-40e9-431a-b0fd-67b4977f7187",
      "flagshipSpecies": {
        "latitude": 11.0984,
        "longitude": 2.2296,
        "title": "Giant eland",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/9d333636-fff8-468d-8045-8f6da069359b/Close up photo of Giant eland, also known as the Lord Derby eland—the largest species of antelope— in the Bandia Reserve, Senegal. Image credit Jana Telenska Dreamstime.jpg",
          "_id": "9d333636-fff8-468d-8045-8f6da069359b"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/9d333636-fff8-468d-8045-8f6da069359b/Close up photo of Giant eland, also known as the Lord Derby eland—the largest species of antelope— in the Bandia Reserve, Senegal. Image credit Jana Telenska Dreamstime.jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT20.kml"
  },
  {
    "id": "604466ba-a207-455c-b8bb-6ce793fc7154",
    "_id": "604466ba-a207-455c-b8bb-6ce793fc7154",
    "_enabled": true,
    "regionId": "AT19",
    "slug": "west-african-coastal-forests-savanna-at19",
    "name": "West African Coastal Forests & Savanna (AT19)",
    "description": "The West African Coastal Forests & Savanna (AT19) bioregion, home to the iconic Western chimpanzee.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Guinean Montane Forests",
      "_id": "487bab44-2204-4457-a69f-b1dc415a089d",
      "flagshipSpecies": {
        "latitude": 11.2867,
        "longitude": -12.485,
        "title": "Western chimpanzee",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b4e4f44a-3ce7-41ee-bdfd-9677d9bc91e1/14-Guinean-Montane-Forest--Western-chimpanzee-.jpeg",
          "_id": "b4e4f44a-3ce7-41ee-bdfd-9677d9bc91e1"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b4e4f44a-3ce7-41ee-bdfd-9677d9bc91e1/14-Guinean-Montane-Forest--Western-chimpanzee-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT19.kml"
  },
  {
    "id": "cce4b233-c2bd-48ba-820d-0c8c7e40c182",
    "_id": "cce4b233-c2bd-48ba-820d-0c8c7e40c182",
    "_enabled": true,
    "regionId": "AT18",
    "slug": "st-helena-ascension-islands-at18",
    "name": "St. Helena & Ascension Islands (AT18)",
    "description": "The St. Helena & Ascension Islands (AT18) bioregion, home to the iconic Ascension frigate.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Ascension Scrub and Grasslands",
      "_id": "a026e191-9cbd-4ece-8c4a-f230e025b595",
      "flagshipSpecies": {
        "latitude": -7.9403,
        "longitude": -14.3702,
        "title": "Ascension frigate",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2c7d72aa-7e70-47f0-8377-10dccb3deba3/37-Ascension-Scrub-and-Grasslands-Ascension-frigate.jpeg",
          "_id": "2c7d72aa-7e70-47f0-8377-10dccb3deba3"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2c7d72aa-7e70-47f0-8377-10dccb3deba3/37-Ascension-Scrub-and-Grasslands-Ascension-frigate.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT18.kml"
  },
  {
    "id": "a11ee780-598c-4763-bb00-02a0542a3663",
    "_id": "a11ee780-598c-4763-bb00-02a0542a3663",
    "_enabled": true,
    "regionId": "AT17",
    "slug": "gulf-of-guinea-coastal-forests-mangroves-at17",
    "name": "Gulf of Guinea Coastal Forests & Mangroves (AT17)",
    "description": "The Gulf of Guinea Coastal Forests & Mangroves (AT17) bioregion, home to the iconic African forest elephant.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Congolian Coastal Forests",
      "_id": "8b89f8c9-7d1b-401c-addb-7473a2981887",
      "flagshipSpecies": {
        "latitude": -0.9762,
        "longitude": 9.9881,
        "title": "African forest elephant",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/c6a02b58-2b78-4e52-91f8-8dee96a2eaa9/5--Congolian-Coastal-Forests--African-forest-elephant-.jpeg",
          "_id": "c6a02b58-2b78-4e52-91f8-8dee96a2eaa9"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/c6a02b58-2b78-4e52-91f8-8dee96a2eaa9/5--Congolian-Coastal-Forests--African-forest-elephant-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT17.kml"
  },
  {
    "id": "1a3d9a52-7ec1-4b00-a6e1-78816d3b66d0",
    "_id": "1a3d9a52-7ec1-4b00-a6e1-78816d3b66d0",
    "_enabled": true,
    "regionId": "AT16",
    "slug": "mandara-mountain-north-congolian-forest-savannas-at16",
    "name": "Mandara Mountain & North Congolian Forest-Savannas (AT16)",
    "description": "The Mandara Mountain & North Congolian Forest-Savannas (AT16) bioregion, home to the iconic Bamenda apalis.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Cameroon Highlands Forests",
      "_id": "a2cecb3d-45a5-4955-b121-9108042ed09a",
      "flagshipSpecies": {
        "latitude": 5.0499,
        "longitude": 9.905,
        "title": "Bamenda apalis",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/676c5d25-d259-4620-bac4-e24ca6ff99e3/2-Cameroon-Highlands-Forests-Bamenda-apalis.jpeg",
          "_id": "676c5d25-d259-4620-bac4-e24ca6ff99e3"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/676c5d25-d259-4620-bac4-e24ca6ff99e3/2-Cameroon-Highlands-Forests-Bamenda-apalis.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT16.kml"
  },
  {
    "id": "cacbadd2-04a8-425d-a35c-127dcb7859a2",
    "_id": "cacbadd2-04a8-425d-a35c-127dcb7859a2",
    "_enabled": true,
    "regionId": "AT10",
    "slug": "southwest-african-coastal-drylands-at10",
    "name": "Southwest African Coastal Drylands (AT10)",
    "description": "The Southwest African Coastal Drylands (AT10) bioregion, home to the iconic Hartmann's zebra.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Namibian Savanna Woodlands",
      "_id": "fab3649f-46ee-4b20-92c9-984ffa7b720e",
      "flagshipSpecies": {
        "latitude": -13.5863,
        "longitude": 12.9334,
        "title": "Hartmann's zebra",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0b661d50-ed13-46b6-a8a5-faf3d0e5b498/104--Namibian-Savanna-Woodlands--Hartmann's-zebra-.jpeg",
          "_id": "0b661d50-ed13-46b6-a8a5-faf3d0e5b498"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0b661d50-ed13-46b6-a8a5-faf3d0e5b498/104--Namibian-Savanna-Woodlands--Hartmann's-zebra-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT10.kml"
  },
  {
    "id": "5689b4d8-47b8-479c-9e77-7cb7c859a9b0",
    "_id": "5689b4d8-47b8-479c-9e77-7cb7c859a9b0",
    "_enabled": true,
    "regionId": "AT9",
    "slug": "greater-karoo-kalahari-drylands-at9",
    "name": "Greater Karoo & Kalahari Drylands (AT9)",
    "description": "The Greater Karoo & Kalahari Drylands (AT9) bioregion, home to the iconic Gemsbok.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Kalahari Xeric Savanna",
      "_id": "540098c0-ba64-4c9a-aa50-87a9d816e88a",
      "flagshipSpecies": {
        "latitude": -24.3266,
        "longitude": 21.6146,
        "title": "Gemsbok",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/097d9c10-87ba-4669-88fd-4994dff9fc57/97-Kalahari-Xeric-Savanna--Gemsbok-.jpeg",
          "_id": "097d9c10-87ba-4669-88fd-4994dff9fc57"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/097d9c10-87ba-4669-88fd-4994dff9fc57/97-Kalahari-Xeric-Savanna--Gemsbok-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT9.kml"
  },
  {
    "id": "8249ec5c-e0c1-4271-97bb-55279d6c94c0",
    "_id": "8249ec5c-e0c1-4271-97bb-55279d6c94c0",
    "_enabled": true,
    "regionId": "AT8",
    "slug": "southeast-african-subtropical-grasslands-at8",
    "name": "Southeast African Subtropical Grasslands (AT8)",
    "description": "The Southeast African Subtropical Grasslands (AT8) bioregion, home to the iconic Southern white rhinoceros.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Limpopo Lowveld",
      "_id": "a7bb2bf0-6c68-483f-874c-aabd46d9a472",
      "flagshipSpecies": {
        "latitude": -24.9207,
        "longitude": 31.8492,
        "title": "Southern white rhinoceros",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7cdf75fc-9dde-4db9-acd2-174e98b720bf/48-Limpopo-Lowveld--Southern-white-rhinoceros.jpeg",
          "_id": "7cdf75fc-9dde-4db9-acd2-174e98b720bf"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7cdf75fc-9dde-4db9-acd2-174e98b720bf/48-Limpopo-Lowveld--Southern-white-rhinoceros.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT8.kml"
  },
  {
    "id": "b858a6dd-9628-482e-bcfb-f56ddd29b41c",
    "_id": "b858a6dd-9628-482e-bcfb-f56ddd29b41c",
    "_enabled": true,
    "regionId": "AT4",
    "slug": "mascarene-tropical-forest-islands-at4",
    "name": "Mascarene Tropical Forest Islands (AT4)",
    "description": "The Mascarene Tropical Forest Islands (AT4) bioregion, home to the iconic Reunion cuckoo-shrike.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Mascarene Forests",
      "_id": "dbfd23ea-afe9-4cfa-9515-3887da78a118",
      "flagshipSpecies": {
        "latitude": -21.1032,
        "longitude": 55.5504,
        "title": "Reunion cuckoo-shrike",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/44fdb689-d7de-46eb-b879-63af7d0f8023/20-Mascarene-Forests-Reunion-cuckoo-shrike.jpeg",
          "_id": "44fdb689-d7de-46eb-b879-63af7d0f8023"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/44fdb689-d7de-46eb-b879-63af7d0f8023/20-Mascarene-Forests-Reunion-cuckoo-shrike.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT4.kml"
  },
  {
    "id": "4b7eabee-ee71-48e7-b3a9-c62e3ee9a272",
    "_id": "4b7eabee-ee71-48e7-b3a9-c62e3ee9a272",
    "_enabled": true,
    "regionId": "AT3",
    "slug": "amsterdam-saint-paul-islands-at3",
    "name": "Amsterdam-Saint Paul Islands (AT3)",
    "description": "The Amsterdam-Saint Paul Islands (AT3) bioregion, home to the iconic Amsterdam albatross.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Amsterdam-Saint Paul Islands Temperate Grasslands",
      "_id": "3cb3403c-099f-426a-8f71-71adb08d4faa",
      "flagshipSpecies": {
        "latitude": -37.8558,
        "longitude": 77.5332,
        "title": "Amsterdam albatross",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/c44a6c24-0d46-491d-871a-7f9cff241feb/67-Amsterdam-Saint-Paul-Islands-Temperate-Grasslands-Amsterdam-albatross.jpeg",
          "_id": "c44a6c24-0d46-491d-871a-7f9cff241feb"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/c44a6c24-0d46-491d-871a-7f9cff241feb/67-Amsterdam-Saint-Paul-Islands-Temperate-Grasslands-Amsterdam-albatross.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT3.kml"
  },
  {
    "id": "5a0cd87a-b9a9-4223-84ac-61c0896f92f2",
    "_id": "5a0cd87a-b9a9-4223-84ac-61c0896f92f2",
    "_enabled": true,
    "regionId": "AT2",
    "slug": "south-african-cape-shrublands-mountain-forests-at2",
    "name": "South African Cape Shrublands & Mountain Forests (AT2)",
    "description": "The South African Cape Shrublands & Mountain Forests (AT2) bioregion, home to the iconic Knysna banana frog.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Knysna-Amatole Montane Forests",
      "_id": "4edcee12-527b-4fd1-a087-c01da56c7e88",
      "flagshipSpecies": {
        "latitude": -33.9966,
        "longitude": 23.1175,
        "title": "Knysna banana frog",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a2fec12e-a540-429d-8daa-ece875580c19/15-KnysnaBananaFrog-Knysna-Amatole-Montane-Forests.jpeg",
          "_id": "a2fec12e-a540-429d-8daa-ece875580c19"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a2fec12e-a540-429d-8daa-ece875580c19/15-KnysnaBananaFrog-Knysna-Amatole-Montane-Forests.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT2.kml"
  },
  {
    "id": "3e35b0da-fd3c-43ee-959a-5b89274e405e",
    "_id": "3e35b0da-fd3c-43ee-959a-5b89274e405e",
    "_enabled": true,
    "regionId": "AT1",
    "slug": "tristan-volcanic-islands-at1",
    "name": "Tristan Volcanic Islands (AT1)",
    "description": "The Tristan Volcanic Islands (AT1) bioregion, home to the iconic Tristan albatross.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Tristan Da Cunha-Gough Islands Shrub and Grasslands",
      "_id": "f1952c4e-d6eb-499e-b429-f57b06d5e42a",
      "flagshipSpecies": {
        "latitude": -37.0973,
        "longitude": -12.2704,
        "title": "Tristan albatross",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b5274982-81ba-4f53-8235-eef5a4f78a0d/68-Tristan-Da-Cunha-Gough-Islands-Shrub-and-Grasslands-Tristan-albatross.jpeg",
          "_id": "b5274982-81ba-4f53-8235-eef5a4f78a0d"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b5274982-81ba-4f53-8235-eef5a4f78a0d/68-Tristan-Da-Cunha-Gough-Islands-Shrub-and-Grasslands-Tristan-albatross.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT1.kml"
  },
  {
    "id": "f25e4b2e-6217-4b52-b73e-709234b15a16",
    "_id": "f25e4b2e-6217-4b52-b73e-709234b15a16",
    "_enabled": true,
    "regionId": "AU16",
    "slug": "subantarctic-antipodes-islands-au16",
    "name": "Subantarctic Antipodes Islands (AU16)",
    "description": "The Subantarctic Antipodes Islands (AU16) bioregion, home to the iconic Antipodes Island parakeet.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Antipodes Subantarctic Islands Tundra",
      "_id": "cfad33b3-9338-471c-8120-8c542a92a203",
      "flagshipSpecies": {
        "latitude": -50.7573,
        "longitude": 166.1221,
        "title": "Antipodes Island parakeet",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a39497a0-2830-42ab-ae83-9eec40c3eff7/196-Antipodes-Subantarctic-Islands-Tundra-Antipodes-Island-parakeet.jpeg",
          "_id": "a39497a0-2830-42ab-ae83-9eec40c3eff7"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a39497a0-2830-42ab-ae83-9eec40c3eff7/196-Antipodes-Subantarctic-Islands-Tundra-Antipodes-Island-parakeet.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU16.kml"
  },
  {
    "id": "0e6b5e9f-c862-450a-8e11-05ae66e3dd0d",
    "_id": "0e6b5e9f-c862-450a-8e11-05ae66e3dd0d",
    "_enabled": true,
    "regionId": "AN3",
    "slug": "subantarctic-indian-ocean-islands-an3",
    "name": "Subantarctic Indian Ocean Islands (AN3)",
    "description": "The Subantarctic Indian Ocean Islands (AN3) bioregion, home to the iconic Snowy albatross.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Southern Indian Ocean Islands Tundra",
      "_id": "fbfaf90a-805c-45d0-80e7-043ddc067ddb",
      "flagshipSpecies": {
        "latitude": -49.3072,
        "longitude": 69.1233,
        "title": "Snowy albatross",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/464a794e-8f88-4282-ae61-e34393d93d25/133-Southern-Indian-Ocean-Islands-Tundra-Wandering-albatross.jpeg",
          "_id": "464a794e-8f88-4282-ae61-e34393d93d25"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/464a794e-8f88-4282-ae61-e34393d93d25/133-Southern-Indian-Ocean-Islands-Tundra-Wandering-albatross.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AN3.kml"
  },
  {
    "id": "58be31bb-f423-475f-b5c6-83fb6ec9f1a1",
    "_id": "58be31bb-f423-475f-b5c6-83fb6ec9f1a1",
    "_enabled": true,
    "regionId": "AN2",
    "slug": "antarctic-peninsula-scotia-sea-an2",
    "name": "Antarctic Peninsula & Scotia Sea (AN2)",
    "description": "The Antarctic Peninsula & Scotia Sea (AN2) bioregion, home to the iconic Antarctic fur seal.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Scotia Sea Islands Tundra",
      "_id": "c156d44e-a609-4421-a97a-12334039aae1",
      "flagshipSpecies": {
        "latitude": -54.4972,
        "longitude": -36.3254,
        "title": "Antarctic fur seal",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/d5309a0c-1cf8-472d-9fe8-67ffe9dd6140/Antarctic fur seal that rests on the rocks dreamstime_xxl_42789354.jpeg",
          "_id": "d5309a0c-1cf8-472d-9fe8-67ffe9dd6140"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/d5309a0c-1cf8-472d-9fe8-67ffe9dd6140/Antarctic fur seal that rests on the rocks dreamstime_xxl_42789354.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AN2.kml"
  },
  {
    "id": "463863d5-d9ff-4f48-b582-4f443c0f28e3",
    "_id": "463863d5-d9ff-4f48-b582-4f443c0f28e3",
    "_enabled": true,
    "regionId": "AN1",
    "slug": "continental-antarctica-an1",
    "name": "Continental Antarctica (AN1)",
    "description": "The Continental Antarctica (AN1) bioregion, home to the iconic Snow petrel.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Enderby Land Tundra",
      "_id": "e82bd083-7066-469b-a0d3-40d9ffc1b5db",
      "flagshipSpecies": {
        "latitude": 52.7109,
        "longitude": -667665,
        "title": "Snow petrel",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e8d420a3-dea2-46fe-b404-270891c7a5fe/123-EnderbyLandTundra-SnowPetrel-Credit-NatalieTapson-Flickr.jpeg",
          "_id": "e8d420a3-dea2-46fe-b404-270891c7a5fe"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e8d420a3-dea2-46fe-b404-270891c7a5fe/123-EnderbyLandTundra-SnowPetrel-Credit-NatalieTapson-Flickr.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AN1.kml"
  },
  {
    "id": "6b091607-18d6-4ed1-b325-eed9bddef170",
    "_id": "6b091607-18d6-4ed1-b325-eed9bddef170",
    "_enabled": true,
    "regionId": "NT27",
    "slug": "yucatan-veracruz-mixed-forests-nt27",
    "name": "Yucatan & Veracruz Mixed Forests (NT27)",
    "description": "The Yucatan & Veracruz Mixed Forests (NT27) bioregion, home to the iconic Mexican agouti.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Veracruz Dry Forests",
      "_id": "65a4b750-d461-48d3-b223-b1029ef9569c",
      "flagshipSpecies": {
        "latitude": 19.0092,
        "longitude": -96.4279,
        "title": "Mexican agouti",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/1c0bc440-15db-4db4-8300-b73be36e82ea/550--Veracruz-Dry-Forests-Mexican-agouti.jpeg",
          "_id": "1c0bc440-15db-4db4-8300-b73be36e82ea"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/1c0bc440-15db-4db4-8300-b73be36e82ea/550--Veracruz-Dry-Forests-Mexican-agouti.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT27.kml"
  },
  {
    "id": "1759ae5a-7245-47df-be51-62d224faa4fa",
    "_id": "1759ae5a-7245-47df-be51-62d224faa4fa",
    "_enabled": true,
    "regionId": "NA22",
    "slug": "ozarks-mixed-forests-na22",
    "name": "Ozarks Mixed Forests (NA22)",
    "description": "The Ozarks Mixed Forests (NA22) bioregion, home to the iconic Eastern collared lizard.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Ozark Mountain Forests ",
      "_id": "39773bf1-fdf0-460d-aa48-dffc92695491",
      "flagshipSpecies": {
        "latitude": 35.0742,
        "longitude": -93.7524,
        "title": "Eastern collared lizard",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/bfa5cb78-abc2-4010-8935-4f2aab066afe/341--Ozark-Mountain-Forests-Eastern-collared-lizard.jpeg",
          "_id": "bfa5cb78-abc2-4010-8935-4f2aab066afe"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/bfa5cb78-abc2-4010-8935-4f2aab066afe/341--Ozark-Mountain-Forests-Eastern-collared-lizard.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA22.kml"
  },
  {
    "id": "553a0a12-b6c4-4400-88f4-0195e12f1c61",
    "_id": "553a0a12-b6c4-4400-88f4-0195e12f1c61",
    "_enabled": true,
    "regionId": "PA52",
    "slug": "guizhou-yunnan-subtropical-forest-plateaus-pa52",
    "name": "Guizhou & Yunnan Subtropical Forest Plateaus (PA52)",
    "description": "The Guizhou & Yunnan Subtropical Forest Plateaus (PA52) bioregion, home to the iconic Black-crested gibbon.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Yunnan Plateau Subtropical Evergreen Forests",
      "_id": "21c03fe7-ae04-4efc-8ba3-d52301ea9a71",
      "flagshipSpecies": {
        "latitude": 25.3489,
        "longitude": 102.9191,
        "title": "Black-crested gibbon",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/be1dece0-675c-4b9c-b0e6-56201f8d8eee/643--Yunnan-Plateau-Subtropical-Evergreen-Forests--Black-crested-gibbon.jpeg",
          "_id": "be1dece0-675c-4b9c-b0e6-56201f8d8eee"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/be1dece0-675c-4b9c-b0e6-56201f8d8eee/643--Yunnan-Plateau-Subtropical-Evergreen-Forests--Black-crested-gibbon.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA52.kml"
  },
  {
    "id": "05ea2c55-ee23-4908-9b1a-7ab498e93866",
    "_id": "05ea2c55-ee23-4908-9b1a-7ab498e93866",
    "_enabled": true,
    "regionId": "PA51",
    "slug": "sichuan-basin-central-mountain-forests-pa51",
    "name": "Sichuan Basin & Central Mountain Forests (PA51)",
    "description": "The Sichuan Basin & Central Mountain Forests (PA51) bioregion, home to the iconic Hubei golden snub-nosed monkey.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Daba Mountains Evergreen Forests",
      "_id": "6d1f3a76-4bfb-42cb-a259-0789f7434961",
      "flagshipSpecies": {
        "latitude": 31.8157,
        "longitude": 108.5849,
        "title": "Hubei golden snub-nosed monkey",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/94cbccd2-71d2-4970-b59f-e077dcaeaf4c/Henuei Golden snub nose monkey (1).jpeg",
          "_id": "94cbccd2-71d2-4970-b59f-e077dcaeaf4c"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/94cbccd2-71d2-4970-b59f-e077dcaeaf4c/Henuei Golden snub nose monkey (1).jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA51.kml"
  },
  {
    "id": "a314aeb2-3336-4e70-8859-6cadacf942a1",
    "_id": "a314aeb2-3336-4e70-8859-6cadacf942a1",
    "_enabled": true,
    "regionId": "PA50",
    "slug": "chang-jiang-plain-evergreen-forests-pa50",
    "name": "Chang Jiang Plain Evergreen Forests (PA50)",
    "description": "The Chang Jiang Plain Evergreen Forests (PA50) bioregion, home to the iconic Yangtze alligator.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Changjiang Plain Evergreen Forests",
      "_id": "91159c26-3f29-4d1b-b3aa-c4b20537e7e9",
      "flagshipSpecies": {
        "latitude": 30.4987,
        "longitude": 117.1169,
        "title": "Yangtze alligator",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/884c4541-a628-4410-9414-9dc0f124c8c6/657--Changjiang-Plain-Evergreen-Forests--Yangtze-alligator.jpeg",
          "_id": "884c4541-a628-4410-9414-9dc0f124c8c6"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/884c4541-a628-4410-9414-9dc0f124c8c6/657--Changjiang-Plain-Evergreen-Forests--Yangtze-alligator.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA50.kml"
  },
  {
    "id": "f1273a02-caf1-4e96-a56c-c3fb8d5b8988",
    "_id": "f1273a02-caf1-4e96-a56c-c3fb8d5b8988",
    "_enabled": true,
    "regionId": "PA49",
    "slug": "loess-plateau-huang-he-plain-mixed-forests-pa49",
    "name": "Loess Plateau & Huang He Plain Mixed Forests (PA49)",
    "description": "The Loess Plateau & Huang He Plain Mixed Forests (PA49) bioregion, home to the iconic North China leopard.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Huang He Plain Mixed Forests",
      "_id": "186f039f-f110-428d-ba63-9c20816e44e5",
      "flagshipSpecies": {
        "latitude": 35.4362,
        "longitude": 116.84,
        "title": "North China leopard",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/d8002c43-a6be-4fd3-abc1-f392bb63c30b/667-Huang-He-Plain-Mixed-Forests-North-china- North China(amur)-leopard.jpeg",
          "_id": "d8002c43-a6be-4fd3-abc1-f392bb63c30b"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/d8002c43-a6be-4fd3-abc1-f392bb63c30b/667-Huang-He-Plain-Mixed-Forests-North-china- North China(amur)-leopard.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA49.kml"
  },
  {
    "id": "c0200c6f-5cf2-43bd-bf3a-223256ae4111",
    "_id": "c0200c6f-5cf2-43bd-bf3a-223256ae4111",
    "_enabled": true,
    "regionId": "PA47",
    "slug": "japan-forest-islands-pa47",
    "name": "Japan Forest Islands (PA47)",
    "description": "The Japan Forest Islands (PA47) bioregion, home to the iconic Japanese serow.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Nihonkai Montane Deciduous Forests",
      "_id": "74e7fa85-34a3-4881-b472-9fa902545f3e",
      "flagshipSpecies": {
        "latitude": 39.7448,
        "longitude": 140.9343,
        "title": "Japanese serow",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e8df7d06-aab6-43ea-b7ab-8ffbc3b1c966/671--Nihonkai-Montane-Deciduous-Forests---Japanese-serow.jpeg",
          "_id": "e8df7d06-aab6-43ea-b7ab-8ffbc3b1c966"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e8df7d06-aab6-43ea-b7ab-8ffbc3b1c966/671--Nihonkai-Montane-Deciduous-Forests---Japanese-serow.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA47.kml"
  },
  {
    "id": "62c278b8-2ea1-43ed-b18a-0e117500a009",
    "_id": "62c278b8-2ea1-43ed-b18a-0e117500a009",
    "_enabled": true,
    "regionId": "PA42",
    "slug": "ordos-plateau-steppe-mountain-conifer-forests-pa42",
    "name": "Ordos Plateau Steppe & Mountain Conifer Forests (PA42)",
    "description": "The Ordos Plateau Steppe & Mountain Conifer Forests (PA42) bioregion, home to the iconic Silver pika (ochotona argentata).",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Helanshan Montane Conifer Forests",
      "_id": "b19bd9ea-3ff1-42d0-a826-95f2d8129ac1",
      "flagshipSpecies": {
        "latitude": 38.8383,
        "longitude": 105.9162,
        "title": "Silver pika (ochotona argentata)",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b77e1f9c-fd27-43d2-b4b1-0476e1f11f65/696--Helanshan-Montane-Conifer-Forests--Silver-pika-.jpeg",
          "_id": "b77e1f9c-fd27-43d2-b4b1-0476e1f11f65"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b77e1f9c-fd27-43d2-b4b1-0476e1f11f65/696--Helanshan-Montane-Conifer-Forests--Silver-pika-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA42.kml"
  },
  {
    "id": "abb11dae-fe7d-4dae-9a53-164573da9a27",
    "_id": "abb11dae-fe7d-4dae-9a53-164573da9a27",
    "_enabled": true,
    "regionId": "PA26",
    "slug": "red-sea-arabian-deserts-salt-marshes-pa26",
    "name": "Red Sea, Arabian Deserts & Salt Marshes (PA26)",
    "description": "The Red Sea, Arabian Deserts & Salt Marshes (PA26) bioregion, home to the iconic Arabian tahr.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Al-Hajar Foothill Xeric Woodlands and Shrublands",
      "_id": "d433eb7d-e9b6-4e3a-ab78-0713eaccc132",
      "flagshipSpecies": {
        "latitude": 23.0621,
        "longitude": 57.3905,
        "title": "Arabian tahr",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7cf4257d-a226-4765-b43b-79bb0e20351f/722--Al-Hajar-Foothill-Xeric-Woodlands-and-Shrublands-Arabian-tahr.jpeg",
          "_id": "7cf4257d-a226-4765-b43b-79bb0e20351f"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7cf4257d-a226-4765-b43b-79bb0e20351f/722--Al-Hajar-Foothill-Xeric-Woodlands-and-Shrublands-Arabian-tahr.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA26.kml"
  },
  {
    "id": "1f9107eb-5d02-40be-808d-29f70d663dcd",
    "_id": "1f9107eb-5d02-40be-808d-29f70d663dcd",
    "_enabled": true,
    "regionId": "PA25",
    "slug": "southern-sahara-deserts-mountain-woodlands-pa25",
    "name": "Southern Sahara Deserts & Mountain Woodlands (PA25)",
    "description": "The Southern Sahara Deserts & Mountain Woodlands (PA25) bioregion, home to the iconic Addax.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "South Sahara Desert",
      "_id": "e1ea7519-f43b-4f7e-99c1-0fe2acdf5fc8",
      "flagshipSpecies": {
        "latitude": 21.6295,
        "longitude": -4.3456,
        "title": "Addax",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ea7910f6-339f-4847-927d-1eb7b112bf8d/842--South-Sahara-Desert--Addax.jpeg",
          "_id": "ea7910f6-339f-4847-927d-1eb7b112bf8d"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ea7910f6-339f-4847-927d-1eb7b112bf8d/842--South-Sahara-Desert--Addax.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA25.kml"
  },
  {
    "id": "2762c964-78ec-4e99-b0df-93c9ad4e3362",
    "_id": "2762c964-78ec-4e99-b0df-93c9ad4e3362",
    "_enabled": true,
    "regionId": "PA23",
    "slug": "south-mediterranean-mixed-woodlands-forests-pa23",
    "name": "South Mediterranean Mixed Woodlands & Forests (PA23)",
    "description": "The South Mediterranean Mixed Woodlands & Forests (PA23) bioregion, home to the iconic Cuvier's gazelle.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Mediterranean Dry Woodlands and Steppe",
      "_id": "a34a4a7e-3138-482a-8e55-0a0c7dc94259",
      "flagshipSpecies": {
        "latitude": 33.4219,
        "longitude": -0.9237,
        "title": "Cuvier's gazelle",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e3c564f3-dfcd-491e-a9e8-badf1d138884/797--Mediterranean-Dry-Woodlands-and-Steppe-Cuvier's-Gazelle.jpeg",
          "_id": "e3c564f3-dfcd-491e-a9e8-badf1d138884"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e3c564f3-dfcd-491e-a9e8-badf1d138884/797--Mediterranean-Dry-Woodlands-and-Steppe-Cuvier's-Gazelle.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA23.kml"
  },
  {
    "id": "02d66ae2-5341-4226-b717-f46515a45624",
    "_id": "02d66ae2-5341-4226-b717-f46515a45624",
    "_enabled": true,
    "regionId": "PA22",
    "slug": "madeira-evergreen-island-pa22",
    "name": "Madeira Evergreen Island (PA22)",
    "description": "The Madeira Evergreen Island (PA22) bioregion, home to the iconic Madeiran long-toed pigeon.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Madeira Evergreen Forests",
      "_id": "f4c6dc08-a964-4443-bc9f-e57e755dc0c4",
      "flagshipSpecies": {
        "latitude": 32.7364,
        "longitude": -16.9328,
        "title": "Madeiran long-toed pigeon",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4717179b-f739-4314-a50e-580e944d0564/668-Madeira-Evergreen-Forests-Madeiran-long-toed-pigeon-.jpeg",
          "_id": "4717179b-f739-4314-a50e-580e944d0564"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4717179b-f739-4314-a50e-580e944d0564/668-Madeira-Evergreen-Forests-Madeiran-long-toed-pigeon-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA22.kml"
  },
  {
    "id": "b89144f1-fff9-47f1-a206-10f6eeed89ae",
    "_id": "b89144f1-fff9-47f1-a206-10f6eeed89ae",
    "_enabled": true,
    "regionId": "PA21",
    "slug": "azores-forest-islands-pa21",
    "name": "Azores Forest Islands (PA21)",
    "description": "The Azores Forest Islands (PA21) bioregion, home to the iconic Azores noctule bat.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Azores Temperate Mixed Forests",
      "_id": "8e43c2e9-593d-49cd-a424-e1b171ac69e6",
      "flagshipSpecies": {
        "latitude": 38.7207,
        "longitude": -27.2249,
        "title": "Azores noctule bat",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e9678f1d-08f3-4328-89a0-974977262e55/645--Azores-Temperate-Mixed-Forests--Azores-noctule.jpeg",
          "_id": "e9678f1d-08f3-4328-89a0-974977262e55"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e9678f1d-08f3-4328-89a0-974977262e55/645--Azores-Temperate-Mixed-Forests--Azores-noctule.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA21.kml"
  },
  {
    "id": "8e583f57-f965-4e42-ade1-51b89cf08f22",
    "_id": "8e583f57-f965-4e42-ade1-51b89cf08f22",
    "_enabled": true,
    "regionId": "PA20",
    "slug": "balearic-sea-west-mediterranean-mixed-forests-pa20",
    "name": "Balearic Sea & West Mediterranean Mixed Forests (PA20)",
    "description": "The Balearic Sea & West Mediterranean Mixed Forests (PA20) bioregion, home to the iconic Iberian lynx.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Southwest Iberian Mediterranean Sclerophyllous and Mixed Forests",
      "_id": "4d245421-9777-44f2-b8e6-53d519be9f83",
      "flagshipSpecies": {
        "latitude": 39.481,
        "longitude": -8.4217,
        "title": "Iberian lynx",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/9b6f0810-2475-45bb-bd07-b20d331e8476/805--Southwest-Iberian-Mediterranean-Sclerophyllous-and-Mixed-Forests---Iberian-lynx.jpeg",
          "_id": "9b6f0810-2475-45bb-bd07-b20d331e8476"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/9b6f0810-2475-45bb-bd07-b20d331e8476/805--Southwest-Iberian-Mediterranean-Sclerophyllous-and-Mixed-Forests---Iberian-lynx.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA20.kml"
  },
  {
    "id": "030cb112-a795-4fee-8431-5a05001597eb",
    "_id": "030cb112-a795-4fee-8431-5a05001597eb",
    "_enabled": true,
    "regionId": "PA14",
    "slug": "carpathian-mountain-plains-mixed-forests-pa14",
    "name": "Carpathian Mountain & Plains Mixed Forests (PA14)",
    "description": "The Carpathian Mountain & Plains Mixed Forests (PA14) bioregion, home to the iconic Gray wolf.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": " Carpathian Montane Forests",
      "_id": "727cc03e-9e25-44a1-b097-7d2d48d3c9e8",
      "flagshipSpecies": {
        "latitude": 48.241,
        "longitude": 24.5078,
        "title": "Gray wolf",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4813b17a-cb2d-4c0d-86d2-1b033729a5b9/692--Carpathian-Montane-Forests--Gray-wolf.jpeg",
          "_id": "4813b17a-cb2d-4c0d-86d2-1b033729a5b9"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4813b17a-cb2d-4c0d-86d2-1b033729a5b9/692--Carpathian-Montane-Forests--Gray-wolf.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA14.kml"
  },
  {
    "id": "241154b8-ae89-4cc6-b2bc-28634f4e294a",
    "_id": "241154b8-ae89-4cc6-b2bc-28634f4e294a",
    "_enabled": true,
    "regionId": "PA9",
    "slug": "great-britain-ireland-faroe-islands-pa9",
    "name": "Great Britain, Ireland & Faroe Islands (PA9)",
    "description": "The Great Britain, Ireland & Faroe Islands (PA9) bioregion, home to the iconic Golden eagle.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": " North Atlantic Moist Mixed Forests",
      "_id": "16c299f0-c0ab-47d1-b5a0-02ebfd533322",
      "flagshipSpecies": {
        "latitude": 54.7283,
        "longitude": -7.8662,
        "title": "Golden eagle",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e990c7bd-b5ed-4cbe-bda3-2490fbd68240/672-North-Atlantic-Moist-Mixed-Forests-Golden-eagle.jpeg",
          "_id": "e990c7bd-b5ed-4cbe-bda3-2490fbd68240"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e990c7bd-b5ed-4cbe-bda3-2490fbd68240/672-North-Atlantic-Moist-Mixed-Forests-Golden-eagle.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA9.kml"
  },
  {
    "id": "e21a3b25-64b0-450b-8a40-b2115faf2465",
    "_id": "e21a3b25-64b0-450b-8a40-b2115faf2465",
    "_enabled": true,
    "regionId": "PA5",
    "slug": "east-eurasian-coastal-tundra-pa5",
    "name": "East Eurasian Coastal Tundra (PA5)",
    "description": "The East Eurasian Coastal Tundra (PA5) bioregion, home to the iconic Siberian bighorn sheep.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": " Chukchi Peninsula Tundra",
      "_id": "5954a747-e8dc-4527-b0a2-91799d595889",
      "flagshipSpecies": {
        "latitude": 67.9607,
        "longitude": 172.1562,
        "title": "Siberian bighorn sheep",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e73cc5ba-1d0c-4cb8-9d86-5ec4b28fec84/772--Chukchi-Peninsula-Tundra-Siberian-bighorn-sheep.jpeg",
          "_id": "e73cc5ba-1d0c-4cb8-9d86-5ec4b28fec84"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/e73cc5ba-1d0c-4cb8-9d86-5ec4b28fec84/772--Chukchi-Peninsula-Tundra-Siberian-bighorn-sheep.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA5.kml"
  },
  {
    "id": "932ec2be-c238-4d62-ae5b-5a9a117c252a",
    "_id": "932ec2be-c238-4d62-ae5b-5a9a117c252a",
    "_enabled": true,
    "regionId": "PA3",
    "slug": "scandinavian-birch-coastal-conifer-forests-pa3",
    "name": "Scandinavian Birch & Coastal Conifer Forests (PA3)",
    "description": "The Scandinavian Birch & Coastal Conifer Forests (PA3) bioregion, home to the iconic Norway lemming.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Scandinavian Montane Birch Forest and Grasslands",
      "_id": "58f941e0-b782-4d5c-ad5c-2c9af780a58f",
      "flagshipSpecies": {
        "latitude": 68.2606,
        "longitude": 18.6756,
        "title": "Norway lemming",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0777a34d-7cdc-4654-bbca-2307d80f3eb9/780--Scandinavian-Montane-Birch-Forest-and-Grasslands--Norway-lemming.jpeg",
          "_id": "0777a34d-7cdc-4654-bbca-2307d80f3eb9"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/0777a34d-7cdc-4654-bbca-2307d80f3eb9/780--Scandinavian-Montane-Birch-Forest-and-Grasslands--Norway-lemming.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA3.kml"
  },
  {
    "id": "c576e375-de57-4c07-9eec-307b5dbea855",
    "_id": "c576e375-de57-4c07-9eec-307b5dbea855",
    "_enabled": true,
    "regionId": "PA2",
    "slug": "iceland-pa2",
    "name": "Iceland (PA2)",
    "description": "The Iceland (PA2) bioregion, home to the iconic Pink-footed goose.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Iceland Boreal Birch Forests and Alpine Tundra",
      "_id": "d3a4ff49-8ff7-4572-b6bb-48c947aceda8",
      "flagshipSpecies": {
        "latitude": 64.6237,
        "longitude": -19.0391,
        "title": "Pink-footed goose",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7acda156-067b-45f0-8aa2-9606304116a4/711-Iceland-Boreal-Birch-Forests-and-Alpine-Tundra-Pink-footed-goose.jpeg",
          "_id": "7acda156-067b-45f0-8aa2-9606304116a4"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7acda156-067b-45f0-8aa2-9606304116a4/711-Iceland-Boreal-Birch-Forests-and-Alpine-Tundra-Pink-footed-goose.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/PA2.kml"
  },
  {
    "id": "daf51578-544f-44bc-b71b-a8f157d23e3e",
    "_id": "daf51578-544f-44bc-b71b-a8f157d23e3e",
    "_enabled": true,
    "regionId": "OC10",
    "slug": "ogasawara-subtropical-islands-oc10",
    "name": "Ogasawara Subtropical Islands (OC10)",
    "description": "The Ogasawara Subtropical Islands (OC10) bioregion, home to the iconic Bonin white-eye.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Ogasawara Subtropical Moist Forests",
      "_id": "beccd078-19b1-40b6-a23d-d79bbcced590",
      "flagshipSpecies": {
        "latitude": 24.7925,
        "longitude": 141.332,
        "title": "Bonin white-eye",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2f5eb265-c689-46e4-8b1f-92a187968a34/626-Ogasawara-Subtropical-Moist-Forests-Bonin-white-eye.jpeg",
          "_id": "2f5eb265-c689-46e4-8b1f-92a187968a34"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/2f5eb265-c689-46e4-8b1f-92a187968a34/626-Ogasawara-Subtropical-Moist-Forests-Bonin-white-eye.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/OC10.kml"
  },
  {
    "id": "ae1b0121-75a1-4f01-a0af-34e32d7a90b7",
    "_id": "ae1b0121-75a1-4f01-a0af-34e32d7a90b7",
    "_enabled": true,
    "regionId": "OC7",
    "slug": "east-micronesian-islands-oc7",
    "name": "East Micronesian Islands (OC7)",
    "description": "The East Micronesian Islands (OC7) bioregion, home to the iconic Coconut crab.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Eastern Micronesia Tropical Moist Forests",
      "_id": "17762dd3-9e63-4a8a-abf6-49ca26d8224e",
      "flagshipSpecies": {
        "latitude": 0.2035,
        "longitude": 173.4001,
        "title": "Coconut crab",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8b7ff4ec-cec6-4ffb-b34a-7cd696efbac8/621-Eastern-Micronesia-Tropical-Moist-Forests-Coconut-crab.jpeg",
          "_id": "8b7ff4ec-cec6-4ffb-b34a-7cd696efbac8"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8b7ff4ec-cec6-4ffb-b34a-7cd696efbac8/621-Eastern-Micronesia-Tropical-Moist-Forests-Coconut-crab.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/OC7.kml"
  },
  {
    "id": "f68b32b0-3ca4-4ca7-8187-6b09adffcc1d",
    "_id": "f68b32b0-3ca4-4ca7-8187-6b09adffcc1d",
    "_enabled": true,
    "regionId": "NT29",
    "slug": "mexican-subtropical-islands-nt29",
    "name": "Mexican Subtropical Islands (NT29)",
    "description": "The Mexican Subtropical Islands (NT29) bioregion, home to the iconic Socorro mockingbird.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Islas Revillagigedo Dry Forests",
      "_id": "c635c565-0f1e-4f34-bd44-923d72209b07",
      "flagshipSpecies": {
        "latitude": 18.7911,
        "longitude": -110.9902,
        "title": "Socorro mockingbird",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/11ff7bd0-8613-4494-984a-272ddb8949ff/533-Islas-Revillagigedo-Dry-Forests-Socorro-mockingbird.jpeg",
          "_id": "11ff7bd0-8613-4494-984a-272ddb8949ff"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/11ff7bd0-8613-4494-984a-272ddb8949ff/533-Islas-Revillagigedo-Dry-Forests-Socorro-mockingbird.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT29.kml"
  },
  {
    "id": "649a89fd-2899-4ae0-8619-bd5491c05c94",
    "_id": "649a89fd-2899-4ae0-8619-bd5491c05c94",
    "_enabled": true,
    "regionId": "NT28",
    "slug": "mexican-dry-coniferous-forests-nt28",
    "name": "Mexican Dry & Coniferous Forests (NT28)",
    "description": "The Mexican Dry & Coniferous Forests (NT28) bioregion, home to the iconic Omiltemi cottontail rabbit.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Sierra Madre Del Sur Pine-Oak Forests",
      "_id": "af4248dd-1045-4d5d-9dc2-fa6958207ffc",
      "flagshipSpecies": {
        "latitude": 17.2216,
        "longitude": -97.7059,
        "title": "Omiltemi cottontail rabbit",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a887491a-fc70-4203-8871-f35f19d1e5ad/558--Sierra-Madre-Del-Sur-Pine-Oak-Forests--Omiltemi-cottontail-rabbit.jpeg",
          "_id": "a887491a-fc70-4203-8871-f35f19d1e5ad"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a887491a-fc70-4203-8871-f35f19d1e5ad/558--Sierra-Madre-Del-Sur-Pine-Oak-Forests--Omiltemi-cottontail-rabbit.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT28.kml"
  },
  {
    "id": "e3dbd75d-cc02-4da4-8df6-a4c484b84e65",
    "_id": "e3dbd75d-cc02-4da4-8df6-a4c484b84e65",
    "_enabled": true,
    "regionId": "NT26",
    "slug": "caribbean-islands-nt26",
    "name": "Caribbean Islands (NT26)",
    "description": "The Caribbean Islands (NT26) bioregion, home to the iconic Florida Panther.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Everglades Flooded Grasslands",
      "_id": "4007d643-a5bd-4f81-8bd2-61f793796c63",
      "flagshipSpecies": {
        "latitude": 25.9358,
        "longitude": -80.6649,
        "title": "Florida Panther",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/67adee6a-1ddf-4e99-a40f-7939925727a5/581--Everglades-Flooded-Grasslands-Florida-Panther.jpeg",
          "_id": "67adee6a-1ddf-4e99-a40f-7939925727a5"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/67adee6a-1ddf-4e99-a40f-7939925727a5/581--Everglades-Flooded-Grasslands-Florida-Panther.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT26.kml"
  },
  {
    "id": "fee53c96-0c64-462d-be68-2864a804873c",
    "_id": "fee53c96-0c64-462d-be68-2864a804873c",
    "_enabled": true,
    "regionId": "NT25",
    "slug": "central-american-mixed-forests-nt25",
    "name": "Central American Mixed Forests (NT25)",
    "description": "The Central American Mixed Forests (NT25) bioregion, home to the iconic Puma.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Miskito Pine Forests",
      "_id": "08daa832-9e52-43c5-983a-83a24df9a888",
      "flagshipSpecies": {
        "latitude": 14.5694,
        "longitude": -83.6529,
        "title": "Puma",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/c4d28ba4-1978-4098-b6fb-808e68376fcb/573--Miskito-Pine-Forests--Puma.jpeg",
          "_id": "c4d28ba4-1978-4098-b6fb-808e68376fcb"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/c4d28ba4-1978-4098-b6fb-808e68376fcb/573--Miskito-Pine-Forests--Puma.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT25.kml"
  },
  {
    "id": "3dba05d3-6673-4102-b6e9-6895415c10cc",
    "_id": "3dba05d3-6673-4102-b6e9-6895415c10cc",
    "_enabled": true,
    "regionId": "NT21",
    "slug": "guianan-forests-savanna-nt21",
    "name": "Guianan Forests & Savanna (NT21)",
    "description": "The Guianan Forests & Savanna (NT21) bioregion, home to the iconic Brilliant-thighed poison frog.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Guianan Freshwater Swamp Forests",
      "_id": "a4b3cb9f-ea62-441a-aea3-be003fb9583f",
      "flagshipSpecies": {
        "latitude": -3.8538,
        "longitude": -32.4246,
        "title": "Brilliant-thighed poison frog",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8ce722f9-4d37-46e4-9018-8297d53d0420/463-Guianan-Freshwater-Swamp-Forests-Brilliant-thighed-poison-frog.jpeg",
          "_id": "8ce722f9-4d37-46e4-9018-8297d53d0420"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8ce722f9-4d37-46e4-9018-8297d53d0420/463-Guianan-Freshwater-Swamp-Forests-Brilliant-thighed-poison-frog.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT21.kml"
  },
  {
    "id": "9f0bf0b0-cfcd-4527-ab4d-bf9c2768e346",
    "_id": "9f0bf0b0-cfcd-4527-ab4d-bf9c2768e346",
    "_enabled": true,
    "regionId": "NT19",
    "slug": "central-amazonian-forests-nt19",
    "name": "Central Amazonian Forests (NT19)",
    "description": "The Central Amazonian Forests (NT19) bioregion, home to the iconic Ocellate river stingray.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Solimões-Japurá Moist Forests",
      "_id": "70bcf6d1-412e-44a3-97f1-041e5050a413",
      "flagshipSpecies": {
        "latitude": -2.7177,
        "longitude": -72.5106,
        "title": "Ocellate river stingray",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a6f973e9-d2da-4450-aa58-96048413646e/503-Solimoes-Japura-Moist-Forests-Ocellate-river-stingray.jpeg",
          "_id": "a6f973e9-d2da-4450-aa58-96048413646e"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a6f973e9-d2da-4450-aa58-96048413646e/503-Solimoes-Japura-Moist-Forests-Ocellate-river-stingray.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT19.kml"
  },
  {
    "id": "ad0c1fd3-5173-4918-9640-1ccf04cf7a53",
    "_id": "ad0c1fd3-5173-4918-9640-1ccf04cf7a53",
    "_enabled": true,
    "regionId": "NT14",
    "slug": "brazilian-atlantic-moist-forests-nt14",
    "name": "Brazilian Atlantic Moist Forests (NT14)",
    "description": "The Brazilian Atlantic Moist Forests (NT14) bioregion, home to the iconic Maned three-toed sloth.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Bahia Coastal Forests",
      "_id": "002f070b-98ce-4398-90bc-abd561ea0341",
      "flagshipSpecies": {
        "latitude": -18.1178,
        "longitude": -40.1982,
        "title": "Maned three-toed sloth",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/824c5984-f802-413c-9c84-e69764770d29/442--Bahia-Coastal-Forests--Maned-three-toed-sloth.jpeg",
          "_id": "824c5984-f802-413c-9c84-e69764770d29"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/824c5984-f802-413c-9c84-e69764770d29/442--Bahia-Coastal-Forests--Maned-three-toed-sloth.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT14.kml"
  },
  {
    "id": "5ffb4e48-057c-48aa-8ed2-5177c015ba49",
    "_id": "5ffb4e48-057c-48aa-8ed2-5177c015ba49",
    "_enabled": true,
    "regionId": "NT9",
    "slug": "galapagos-islands-nt9",
    "name": "Galápagos Islands (NT9)",
    "description": "The Galápagos Islands (NT9) bioregion, home to the iconic Galápagos tortoise.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Galápagos Islands Xeric Scrub",
      "_id": "01822738-f2c3-4b66-afd0-87424f06b87f",
      "flagshipSpecies": {
        "latitude": -0.8558,
        "longitude": -91.209,
        "title": "Galápagos tortoise",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/21d4c210-29bb-4104-87c5-8019dc493722/601--Galápagos-Islands-Xeric-Scrub-Galâpagos-tortoise.jpeg",
          "_id": "21d4c210-29bb-4104-87c5-8019dc493722"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/21d4c210-29bb-4104-87c5-8019dc493722/601--Galápagos-Islands-Xeric-Scrub-Galâpagos-tortoise.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT9.kml"
  },
  {
    "id": "af46ec10-5c4e-4474-be0f-695385095bb1",
    "_id": "af46ec10-5c4e-4474-be0f-695385095bb1",
    "_enabled": true,
    "regionId": "NT4",
    "slug": "chaco-grasslands-nt4",
    "name": "Chaco Grasslands (NT4)",
    "description": "The Chaco Grasslands (NT4) bioregion, home to the iconic Chacoan peccary.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Dry Chaco",
      "_id": "4766971c-aafa-4cdf-adc9-b797ce2fb14e",
      "flagshipSpecies": {
        "latitude": -20.6492,
        "longitude": -61.1847,
        "title": "Chacoan peccary",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6c852cff-00b9-458f-a651-d58ab290dcac/Chacoan peccary Catagonus wagneri, also known as the tagua. dreamstime_xl_229388557 (1).jpg",
          "_id": "6c852cff-00b9-458f-a651-d58ab290dcac"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6c852cff-00b9-458f-a651-d58ab290dcac/Chacoan peccary Catagonus wagneri, also known as the tagua. dreamstime_xl_229388557 (1).jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT4.kml"
  },
  {
    "id": "30cfdd41-3640-46b4-9e8c-c332bab3b561",
    "_id": "30cfdd41-3640-46b4-9e8c-c332bab3b561",
    "_enabled": true,
    "regionId": "NT3",
    "slug": "rio-de-la-plata-grasslands-nt3",
    "name": "Rio de la Plata Grasslands (NT3)",
    "description": "The Rio de la Plata Grasslands (NT3) bioregion, home to the iconic Marsh deer.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Paraná Flooded Savanna",
      "_id": "16956612-6e44-4d23-bd50-f464b93dd546",
      "flagshipSpecies": {
        "latitude": -33.8464,
        "longitude": -58.8722,
        "title": "Marsh deer",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a1c67e33-55d0-4b13-89ca-fd912de5bc5f/585-Parana-flooded-savanna-Marsh-deer.jpeg",
          "_id": "a1c67e33-55d0-4b13-89ca-fd912de5bc5f"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a1c67e33-55d0-4b13-89ca-fd912de5bc5f/585-Parana-flooded-savanna-Marsh-deer.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT3.kml"
  },
  {
    "id": "c06a1e89-d20d-42fb-a695-5b7f29b0f5b4",
    "_id": "c06a1e89-d20d-42fb-a695-5b7f29b0f5b4",
    "_enabled": true,
    "regionId": "NT2",
    "slug": "patagonia-steppe-low-mountains-nt2",
    "name": "Patagonia Steppe & Low Mountains (NT2)",
    "description": "The Patagonia Steppe & Low Mountains (NT2) bioregion, home to the iconic Southern river otter.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Low Monte",
      "_id": "0ad807b9-a9e3-49d1-9031-6d21db562e58",
      "flagshipSpecies": {
        "latitude": -67.6551,
        "longitude": -38.5856,
        "title": "Southern river otter",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/749c803d-8c38-4fe7-b168-7f8d7bb3f69c/577-Low-Monte-Southern-river-otter.jpeg",
          "_id": "749c803d-8c38-4fe7-b168-7f8d7bb3f69c"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/749c803d-8c38-4fe7-b168-7f8d7bb3f69c/577-Low-Monte-Southern-river-otter.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT2.kml"
  },
  {
    "id": "578ed31c-1c3c-40e3-b1f1-b0211ea9e2dd",
    "_id": "578ed31c-1c3c-40e3-b1f1-b0211ea9e2dd",
    "_enabled": true,
    "regionId": "NT1",
    "slug": "chilean-mixed-forests-nt1",
    "name": "Chilean Mixed Forests (NT1)",
    "description": "The Chilean Mixed Forests (NT1) bioregion, home to the iconic Chilean huemul (South Andean deer).",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Magellanic Subpolar Forests",
      "_id": "5f2df912-c6e9-4073-9306-1e91fff4a082",
      "flagshipSpecies": {
        "latitude": -47.943,
        "longitude": -72.738,
        "title": "Chilean huemul (South Andean deer)",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/9bdd16bb-4830-428f-b1d6-eb2016e9b87b/561--Magellanic-Subpolar-Forests--Chilean-huemul-.jpeg",
          "_id": "9bdd16bb-4830-428f-b1d6-eb2016e9b87b"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/9bdd16bb-4830-428f-b1d6-eb2016e9b87b/561--Magellanic-Subpolar-Forests--Chilean-huemul-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NT1.kml"
  },
  {
    "id": "3faa44c0-a74b-4718-bb4c-f88518822ba5",
    "_id": "3faa44c0-a74b-4718-bb4c-f88518822ba5",
    "_enabled": true,
    "regionId": "NA30",
    "slug": "baja-california-southern-deserts-na30",
    "name": "Baja California & Southern Deserts (NA30)",
    "description": "The Baja California & Southern Deserts (NA30) bioregion, home to the iconic Baja California rock squirrel.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Baja California Desert ",
      "_id": "89a6569c-4b6f-4b7a-8d4f-7ae41f88f6c6",
      "flagshipSpecies": {
        "latitude": 27.4725,
        "longitude": -113.4045,
        "title": "Baja California rock squirrel",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a70e762a-2451-448a-88a3-d77edcee40c8/426--Baja-California-Desert--Baja-California-rock-squirrel.jpeg",
          "_id": "a70e762a-2451-448a-88a3-d77edcee40c8"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a70e762a-2451-448a-88a3-d77edcee40c8/426--Baja-California-Desert--Baja-California-rock-squirrel.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA30.kml"
  },
  {
    "id": "29d658ac-aa33-4944-8363-7f88be8bf3aa",
    "_id": "29d658ac-aa33-4944-8363-7f88be8bf3aa",
    "_enabled": true,
    "regionId": "NA29",
    "slug": "sierra-madre-forests-mexican-drylands-na29",
    "name": "Sierra Madre Forests & Mexican Drylands (NA29)",
    "description": "The Sierra Madre Forests & Mexican Drylands (NA29) bioregion, home to the iconic Mexican wolf.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Chihuahuan Desert",
      "_id": "cf441a89-474d-4b10-a96f-072bb19e7600",
      "flagshipSpecies": {
        "latitude": 30.0286,
        "longitude": -104.7538,
        "title": "Mexican wolf",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b4a63e34-3dd4-4681-bd6e-12fe9a518e00/428--Chihuahuan-Desert---desert-Mexican-wolf.jpeg",
          "_id": "b4a63e34-3dd4-4681-bd6e-12fe9a518e00"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/b4a63e34-3dd4-4681-bd6e-12fe9a518e00/428--Chihuahuan-Desert---desert-Mexican-wolf.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA29.kml"
  },
  {
    "id": "36220a47-3de3-422b-ac84-67d1ec80bbce",
    "_id": "36220a47-3de3-422b-ac84-67d1ec80bbce",
    "_enabled": true,
    "regionId": "NA24",
    "slug": "appalachia-allegheny-interior-forests-na24",
    "name": "Appalachia & Allegheny Interior Forests (NA24)",
    "description": "The Appalachia & Allegheny Interior Forests (NA24) bioregion, home to the iconic Hellbender.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Appalachian-Blue Ridge forests",
      "_id": "660d3c3d-87b3-4beb-adf5-08503050ce3d",
      "flagshipSpecies": {
        "latitude": 35.8645,
        "longitude": -82.9409,
        "title": "Hellbender",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/c611d071-b82d-4062-a325-b77edc03e93c/331-Hellbender-Appalachian-Blue-Ridge-Forests.jpeg",
          "_id": "c611d071-b82d-4062-a325-b77edc03e93c"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/c611d071-b82d-4062-a325-b77edc03e93c/331-Hellbender-Appalachian-Blue-Ridge-Forests.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA24.kml"
  },
  {
    "id": "453c6a33-af4b-4079-b440-e58fc7cffbc9",
    "_id": "453c6a33-af4b-4079-b440-e58fc7cffbc9",
    "_enabled": true,
    "regionId": "NA20",
    "slug": "southern-prairie-mixed-grasslands-na20",
    "name": "Southern Prairie Mixed Grasslands (NA20)",
    "description": "The Southern Prairie Mixed Grasslands (NA20) bioregion, home to the iconic Sandhill crane.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Central-Southern US Mixed Grasslands",
      "_id": "2b737739-d778-457d-ae09-28df5910c4a3",
      "flagshipSpecies": {
        "latitude": 39.6336,
        "longitude": -98.6829,
        "title": "Sandhill crane",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6cca585d-f60d-487a-b0cd-fe8b30666913/389-Central-Southern-US-Mixed-Grasslands-Sandhill-crane.jpeg",
          "_id": "6cca585d-f60d-487a-b0cd-fe8b30666913"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6cca585d-f60d-487a-b0cd-fe8b30666913/389-Central-Southern-US-Mixed-Grasslands-Sandhill-crane.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA20.kml"
  },
  {
    "id": "3f49c23b-2ee0-4158-82c0-697435b8ff11",
    "_id": "3f49c23b-2ee0-4158-82c0-697435b8ff11",
    "_enabled": true,
    "regionId": "NA19",
    "slug": "colorado-plateau-mountain-forests-na19",
    "name": "Colorado Plateau & Mountain Forests (NA19)",
    "description": "The Colorado Plateau & Mountain Forests (NA19) bioregion, home to the iconic Elk.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Colorado Rockies Forests",
      "_id": "6a34a0b7-d495-43c0-a2ec-3ecb714fdf0e",
      "flagshipSpecies": {
        "latitude": 39.434,
        "longitude": -106.3293,
        "title": "Elk",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/d4059f45-5840-4bb9-a477-32b8bc8aac3e/Bull elk grazing in Yellowstone National Park. Image credit Jacob W. Frank, Public Domain.jpg",
          "_id": "d4059f45-5840-4bb9-a477-32b8bc8aac3e"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/d4059f45-5840-4bb9-a477-32b8bc8aac3e/Bull elk grazing in Yellowstone National Park. Image credit Jacob W. Frank, Public Domain.jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA19.kml"
  },
  {
    "id": "ee2ddc6e-1895-4719-bacc-37053466bcc4",
    "_id": "ee2ddc6e-1895-4719-bacc-37053466bcc4",
    "_enabled": true,
    "regionId": "NA18",
    "slug": "great-basin-columbia-steppe-na18",
    "name": "Great Basin & Columbia Steppe (NA18)",
    "description": "The Great Basin & Columbia Steppe (NA18) bioregion, home to the iconic Pronghorn.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Great Basin Shrub Steppe",
      "_id": "344be436-b1f0-4c81-b297-a6e0ea05ec9d",
      "flagshipSpecies": {
        "latitude": 39.1772,
        "longitude": -116.998,
        "title": "Pronghorn",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a5ab8964-3ceb-4cfb-b026-f4b2e186b112/Adult male pronghorn dreamstime_xxl_27287442 (1).jpg",
          "_id": "a5ab8964-3ceb-4cfb-b026-f4b2e186b112"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/a5ab8964-3ceb-4cfb-b026-f4b2e186b112/Adult male pronghorn dreamstime_xxl_27287442 (1).jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA18.kml"
  },
  {
    "id": "b0f23360-378b-486a-acec-ae382b3df4cc",
    "_id": "b0f23360-378b-486a-acec-ae382b3df4cc",
    "_enabled": true,
    "regionId": "NA17",
    "slug": "columbia-plateau-blue-mountains-na17",
    "name": "Columbia Plateau & Blue Mountains (NA17)",
    "description": "The Columbia Plateau & Blue Mountains (NA17) bioregion, home to the iconic American black bear.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Blue Mountains Forests",
      "_id": "17571554-d5bf-46c1-b898-cd7e5202d3a2",
      "flagshipSpecies": {
        "latitude": 45.2356,
        "longitude": -117.4823,
        "title": "American black bear",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7d75b6b3-4a2d-404a-a809-10c891e57893/American black bear. dreamstime_xxl_3056727 (1) (1).jpg",
          "_id": "7d75b6b3-4a2d-404a-a809-10c891e57893"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/7d75b6b3-4a2d-404a-a809-10c891e57893/American black bear. dreamstime_xxl_3056727 (1) (1).jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA17.kml"
  },
  {
    "id": "85b9ab42-5307-4bcf-81ef-dee1467c8300",
    "_id": "85b9ab42-5307-4bcf-81ef-dee1467c8300",
    "_enabled": true,
    "regionId": "NA11",
    "slug": "northern-great-lakes-forests-na11",
    "name": "Northern Great Lakes Forests (NA11)",
    "description": "The Northern Great Lakes Forests (NA11) bioregion, home to the iconic Eastern timber wolf.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Western Great Lakes Forests",
      "_id": "5aedf6dc-3d44-4709-9fec-70ea23c96b22",
      "flagshipSpecies": {
        "latitude": 48.168,
        "longitude": -93.15,
        "title": "Eastern timber wolf",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/cc6d4514-87bb-4565-8d11-824192d114ce/344-Western-Great-Lakes-Forests--Eastern-timber-wolf.jpeg",
          "_id": "cc6d4514-87bb-4565-8d11-824192d114ce"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/cc6d4514-87bb-4565-8d11-824192d114ce/344-Western-Great-Lakes-Forests--Eastern-timber-wolf.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA11.kml"
  },
  {
    "id": "fe8a443b-785a-4c72-85a1-de7a4a218474",
    "_id": "fe8a443b-785a-4c72-85a1-de7a4a218474",
    "_enabled": true,
    "regionId": "NA10",
    "slug": "northeastern-american-mixed-forests-na10",
    "name": "Northeastern American Mixed Forests (NA10)",
    "description": "The Northeastern American Mixed Forests (NA10) bioregion, home to the iconic Moose.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "New England-Acadian Forests",
      "_id": "ce26b697-8499-4684-94aa-6d8dd89a9a8d",
      "flagshipSpecies": {
        "latitude": 46.2091,
        "longitude": -68.6906,
        "title": "Moose",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/33febc31-88bf-4bc8-ba9a-a1e9652ffd39/338--New-England-Acadian-Forests-Moose.jpeg",
          "_id": "33febc31-88bf-4bc8-ba9a-a1e9652ffd39"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/33febc31-88bf-4bc8-ba9a-a1e9652ffd39/338--New-England-Acadian-Forests-Moose.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA10.kml"
  },
  {
    "id": "0cd2f4a1-b327-4633-958c-1f9f5225a875",
    "_id": "0cd2f4a1-b327-4633-958c-1f9f5225a875",
    "_enabled": true,
    "regionId": "NA2",
    "slug": "canadian-tundra-na2",
    "name": "Canadian Tundra (NA2)",
    "description": "The Canadian Tundra (NA2) bioregion, home to the iconic Narwhal.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Canadian Low Arctic Tundra",
      "_id": "2688729d-097f-4068-867a-29565cf900cd",
      "flagshipSpecies": {
        "latitude": 65.317,
        "longitude": -100.1373,
        "title": "Narwhal",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/37ec4cec-1873-49e7-9581-74d2e2b527e9/413-Canadian-Low-Arctic-Tundra-Narwhal.jpeg",
          "_id": "37ec4cec-1873-49e7-9581-74d2e2b527e9"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/37ec4cec-1873-49e7-9581-74d2e2b527e9/413-Canadian-Low-Arctic-Tundra-Narwhal.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA2.kml"
  },
  {
    "id": "1d017f85-6ea1-4f85-8391-2314f92051bd",
    "_id": "1d017f85-6ea1-4f85-8391-2314f92051bd",
    "_enabled": true,
    "regionId": "NA1",
    "slug": "greenland-na1",
    "name": "Greenland (NA1)",
    "description": "The Greenland (NA1) bioregion, home to the iconic White-tailed eagle.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Kalaallit Nunaat Arctic Steppe",
      "_id": "797ab6fb-bc51-42d8-8cb7-c5f9c702f8aa",
      "flagshipSpecies": {
        "latitude": 71.1921,
        "longitude": -23.6263,
        "title": "White-tailed eagle",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ee8d81cc-2e9b-4ad4-b9a0-941c3b359a3d/417-Kalaallit-Nunaat-Arctic-Steppe-White-tailed-eagle.jpeg",
          "_id": "ee8d81cc-2e9b-4ad4-b9a0-941c3b359a3d"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ee8d81cc-2e9b-4ad4-b9a0-941c3b359a3d/417-Kalaallit-Nunaat-Arctic-Steppe-White-tailed-eagle.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/NA1.kml"
  },
  {
    "id": "d6f99311-bfc6-4e1b-a95c-0c1ef5efd3a1",
    "_id": "d6f99311-bfc6-4e1b-a95c-0c1ef5efd3a1",
    "_enabled": true,
    "regionId": "IM18",
    "slug": "peninsular-malaysian-sumatran-tropical-rainforests-im18",
    "name": "Peninsular Malaysian & Sumatran Tropical Rainforests (IM18)",
    "description": "The Peninsular Malaysian & Sumatran Tropical Rainforests (IM18) bioregion, home to the iconic Sumatran orangutan.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Sumatran Montane Rainforests",
      "_id": "da2f44c1-9938-4dd9-93ed-f75d43d2b26d",
      "flagshipSpecies": {
        "latitude": 2.3764,
        "longitude": 98.9382,
        "title": "Sumatran orangutan",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6ea28761-18aa-4bbb-8d95-047f1026b34a/Mother Sumatran Orangutan with her baby in Bukit Lawang Rainforest of Indonesia dreamstime_xxl_73558011.jpeg",
          "_id": "6ea28761-18aa-4bbb-8d95-047f1026b34a"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6ea28761-18aa-4bbb-8d95-047f1026b34a/Mother Sumatran Orangutan with her baby in Bukit Lawang Rainforest of Indonesia dreamstime_xxl_73558011.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM18.kml"
  },
  {
    "id": "fe68c7a9-2c76-4800-8bd2-f395c35d7b1f",
    "_id": "fe68c7a9-2c76-4800-8bd2-f395c35d7b1f",
    "_enabled": true,
    "regionId": "IM17",
    "slug": "javan-bali-tropical-rainforests-im17",
    "name": "Javan-Bali Tropical Rainforests (IM17) ",
    "description": "The Javan-Bali Tropical Rainforests (IM17)  bioregion, home to the iconic Javan rhinoceros.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Western Java Rainforests",
      "_id": "0da637f6-8309-41f3-9df5-17693483c517",
      "flagshipSpecies": {
        "latitude": -6.8141,
        "longitude": 108.0744,
        "title": "Javan rhinoceros",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ddbdb3da-3d43-4cd1-8c2d-fc2a8fac53b9/289-Western-Java-Rainforests--Javan-rhinoceros-.jpeg",
          "_id": "ddbdb3da-3d43-4cd1-8c2d-fc2a8fac53b9"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/ddbdb3da-3d43-4cd1-8c2d-fc2a8fac53b9/289-Western-Java-Rainforests--Javan-rhinoceros-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM17.kml"
  },
  {
    "id": "ec8cd7c2-4679-4712-8e0e-5e10982f3ea6",
    "_id": "ec8cd7c2-4679-4712-8e0e-5e10982f3ea6",
    "_enabled": true,
    "regionId": "IM14",
    "slug": "nansei-islands-subtropical-evergreen-forests-im14",
    "name": "Nansei Islands Subtropical Evergreen Forests (IM14)",
    "description": "The Nansei Islands Subtropical Evergreen Forests (IM14) bioregion, home to the iconic Iriomote cat.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Nansei Islands Subtropical Evergreen Forests",
      "_id": "2e01fcf5-11ef-48c3-a381-303ac88bc828",
      "flagshipSpecies": {
        "latitude": 30.3378,
        "longitude": 130.5238,
        "title": "Iriomote cat",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/25496264-47d8-43da-9043-a2c9c3f75d2b/251--Nansei-Islands-Subtropical-Evergreen-Forests--Iriomote-cat-.jpeg",
          "_id": "25496264-47d8-43da-9043-a2c9c3f75d2b"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/25496264-47d8-43da-9043-a2c9c3f75d2b/251--Nansei-Islands-Subtropical-Evergreen-Forests--Iriomote-cat-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM14.kml"
  },
  {
    "id": "0d13a6ae-50d0-4df4-9d32-484284eedc03",
    "_id": "0d13a6ae-50d0-4df4-9d32-484284eedc03",
    "_enabled": true,
    "regionId": "IM4",
    "slug": "north-indomalayan-deserts-scrub-forest-im4",
    "name": "North Indomalayan Deserts & Scrub Forest (IM4)",
    "description": "The North Indomalayan Deserts & Scrub Forest (IM4) bioregion, home to the iconic Caracal.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Thar Desert",
      "_id": "3f5af0f0-78aa-4e82-a88a-5d81b957c22e",
      "flagshipSpecies": {
        "latitude": 26.6881,
        "longitude": 70.8668,
        "title": "Caracal",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/18b78c71-0015-49bc-9a42-26c56d171621/318--Thar-Desert--Caracal.jpeg",
          "_id": "18b78c71-0015-49bc-9a42-26c56d171621"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/18b78c71-0015-49bc-9a42-26c56d171621/318--Thar-Desert--Caracal.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM4.kml"
  },
  {
    "id": "fc2c9a8d-66c5-45f6-8ce5-a800d2e4a696",
    "_id": "fc2c9a8d-66c5-45f6-8ce5-a800d2e4a696",
    "_enabled": true,
    "regionId": "IM1",
    "slug": "central-indian-ocean-islands-im1",
    "name": "Central Indian Ocean Islands (IM1)",
    "description": "The Central Indian Ocean Islands (IM1) bioregion, home to the iconic Green turtle.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Maldives-Lakshadweep-Chagos Archipelago Tropical Moist Forests",
      "_id": "ea6a0d21-af40-47a2-8a97-d274fa0cabd7",
      "flagshipSpecies": {
        "latitude": 13.7756,
        "longitude": 120.1993,
        "title": "Green turtle",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8af8fa3b-d32a-4ec0-acf4-58b11a58c834/243--Maldives-Lakshadweep-Chagos-Archipelago-Tropical-Moist-Forests-Green-turtle.jpeg",
          "_id": "8af8fa3b-d32a-4ec0-acf4-58b11a58c834"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/8af8fa3b-d32a-4ec0-acf4-58b11a58c834/243--Maldives-Lakshadweep-Chagos-Archipelago-Tropical-Moist-Forests-Green-turtle.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/IM1.kml"
  },
  {
    "id": "087c80a0-ee01-4d5e-ba96-c084df6c089a",
    "_id": "087c80a0-ee01-4d5e-ba96-c084df6c089a",
    "_enabled": true,
    "regionId": "AU12",
    "slug": "solomon-islands-au12",
    "name": "Solomon Islands (AU12)",
    "description": "The Solomon Islands (AU12) bioregion, home to the iconic Solomon Islands eclectus parrot.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Solomon Islands Rainforests",
      "_id": "3422b72a-9d0f-4606-a8f7-a1830cdfaee6",
      "flagshipSpecies": {
        "latitude": -6.5128,
        "longitude": 155.5192,
        "title": "Solomon Islands eclectus parrot"
      }
    },
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AU12.kml"
  },
  {
    "id": "22fcd8ea-5f80-430d-b16b-fb7f34836c59",
    "_id": "22fcd8ea-5f80-430d-b16b-fb7f34836c59",
    "_enabled": true,
    "regionId": "AT24",
    "slug": "cape-verde-islands-at24",
    "name": "Cape Verde Islands (AT24)",
    "description": "The Cape Verde Islands (AT24) bioregion, home to the iconic Raso lark.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Cape Verde Islands Dry Forests",
      "_id": "c6a484d7-fe55-4766-831f-a987a5c93b90",
      "flagshipSpecies": {
        "latitude": 15.0303,
        "longitude": -23.6225,
        "title": "Raso lark",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f5dd685b-ab96-4f9f-a2db-dc2c4d71eb49/31-Cape-Verde-Islands-Dry-Forests-Raso-lark.jpeg",
          "_id": "f5dd685b-ab96-4f9f-a2db-dc2c4d71eb49"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/f5dd685b-ab96-4f9f-a2db-dc2c4d71eb49/31-Cape-Verde-Islands-Dry-Forests-Raso-lark.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT24.kml"
  },
  {
    "id": "f4fe2f56-4d80-4cef-ba98-f2ba5d101ae5",
    "_id": "f4fe2f56-4d80-4cef-ba98-f2ba5d101ae5",
    "_enabled": true,
    "regionId": "AT15",
    "slug": "north-congolian-lowland-forests-at15",
    "name": "North Congolian Lowland Forests (AT15)",
    "description": "The North Congolian Lowland Forests (AT15) bioregion, home to the iconic Western lowland gorilla.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Northwest Congolian Lowland Forests",
      "_id": "211d3685-9aff-4a17-897c-c0a08fa52e3c",
      "flagshipSpecies": {
        "latitude": 2.066,
        "longitude": 13.9267,
        "title": "Western lowland gorilla",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4cd2e530-c071-4fc1-aa58-8702cb127143/26-Northwest-Congolian-Lowland-Forests-Western-Lowland-gorilla-.jpeg",
          "_id": "4cd2e530-c071-4fc1-aa58-8702cb127143"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/4cd2e530-c071-4fc1-aa58-8702cb127143/26-Northwest-Congolian-Lowland-Forests-Western-Lowland-gorilla-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT15.kml"
  },
  {
    "id": "37e7831a-89f7-4f85-885b-68c18d55264c",
    "_id": "37e7831a-89f7-4f85-885b-68c18d55264c",
    "_enabled": true,
    "regionId": "AT14",
    "slug": "central-congolian-tropical-forests-at14",
    "name": "Central Congolian Tropical Forests (AT14)",
    "description": "The Central Congolian Tropical Forests (AT14) bioregion, home to the iconic Bonobo.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Central Congolian Lowland Forests",
      "_id": "de73f480-b197-471f-9313-382a48d752cb",
      "flagshipSpecies": {
        "latitude": -1.8733,
        "longitude": 23.4168,
        "title": "Bonobo",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/312a2968-3fe5-49e9-80d8-6fcfb2162983/Bonobo lying in the water. Democratic Republic of Congo. Lola Ya BONOBO National Park dreamstime_xl_80448467.jpg",
          "_id": "312a2968-3fe5-49e9-80d8-6fcfb2162983"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/312a2968-3fe5-49e9-80d8-6fcfb2162983/Bonobo lying in the water. Democratic Republic of Congo. Lola Ya BONOBO National Park dreamstime_xl_80448467.jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT14.kml"
  },
  {
    "id": "389597c4-b872-4aaa-8452-c2b5c29d31ce",
    "_id": "389597c4-b872-4aaa-8452-c2b5c29d31ce",
    "_enabled": true,
    "regionId": "AT13",
    "slug": "south-congolian-forest-savannas-coastal-scarp-at13",
    "name": "South Congolian Forest-Savannas & Coastal Scarp (AT13)",
    "description": "The South Congolian Forest-Savannas & Coastal Scarp (AT13) bioregion, home to the iconic Bongo.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Southern Congolian Forest-Savanna",
      "_id": "0146c65b-7335-42ef-9051-86b948f4b1f7",
      "flagshipSpecies": {
        "latitude": -6.4041,
        "longitude": 22.171,
        "title": "Bongo",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/bc5363ac-73d8-4e39-bc65-8549c4e8a9b0/58-Southern-Congolian-Forest-Savanna-Bongo-.jpeg",
          "_id": "bc5363ac-73d8-4e39-bc65-8549c4e8a9b0"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/bc5363ac-73d8-4e39-bc65-8549c4e8a9b0/58-Southern-Congolian-Forest-Savanna-Bongo-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT13.kml"
  },
  {
    "id": "d0e7c84d-9475-4600-8197-8a3d11ecddc5",
    "_id": "d0e7c84d-9475-4600-8197-8a3d11ecddc5",
    "_enabled": true,
    "regionId": "AT12",
    "slug": "victoria-basin-albertine-rift-forests-at12",
    "name": "Victoria Basin & Albertine Rift Forests (AT12)",
    "description": "The Victoria Basin & Albertine Rift Forests (AT12) bioregion, home to the iconic Mountain gorilla.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Albertine Rift Montane Forests",
      "_id": "f35758ff-9c97-42b5-b9b0-b805ad88d7f7",
      "flagshipSpecies": {
        "latitude": -2.7252,
        "longitude": 28.9497,
        "title": "Mountain gorilla",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5d333bcc-585d-48bc-8340-8f99382dd87c/1--Albertine-Rift-Montane-Forests--Mountain-gorilla-.jpeg",
          "_id": "5d333bcc-585d-48bc-8340-8f99382dd87c"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/5d333bcc-585d-48bc-8340-8f99382dd87c/1--Albertine-Rift-Montane-Forests--Mountain-gorilla-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT12.kml"
  },
  {
    "id": "2c974f37-ad68-46be-a5b9-4ddf4546636f",
    "_id": "2c974f37-ad68-46be-a5b9-4ddf4546636f",
    "_enabled": true,
    "regionId": "AT11",
    "slug": "greater-african-subequatorial-savannas-mixed-woodlands-at11",
    "name": "Greater African Subequatorial Savannas & Mixed Woodlands (AT11)",
    "description": "The Greater African Subequatorial Savannas & Mixed Woodlands (AT11) bioregion, home to the iconic Hippopotamus.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Zambezian Mopane Woodlands",
      "_id": "22712ad7-6a36-4d1e-9789-4c6f57f5fe9a",
      "flagshipSpecies": {
        "latitude": -22.2998,
        "longitude": 32.3789,
        "title": "Hippopotamus",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/441bcbd1-6030-4c03-9d44-3babe02e99c8/65-Zambezian-Mopane-Woodlands--hippopotamus.jpg",
          "_id": "441bcbd1-6030-4c03-9d44-3babe02e99c8"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/441bcbd1-6030-4c03-9d44-3babe02e99c8/65-Zambezian-Mopane-Woodlands--hippopotamus.jpg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT11.kml"
  },
  {
    "id": "48c61817-7581-46cf-af98-0c99bb18138f",
    "_id": "48c61817-7581-46cf-af98-0c99bb18138f",
    "_enabled": true,
    "regionId": "AT7",
    "slug": "east-african-coastal-forests-at7",
    "name": "East African Coastal Forests (AT7)",
    "description": "The East African Coastal Forests (AT7) bioregion, home to the iconic Pemba flying fox.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Northern Swahili Coastal Forests",
      "_id": "3cf45f70-b8bd-4d37-b9bd-af9675c252dc",
      "flagshipSpecies": {
        "latitude": -7.2781,
        "longitude": 38.6911,
        "title": "Pemba flying fox",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/37bf79b4-ae17-4a88-acf7-170ccf6914dc/PembaFlyingFox-CC-Pixels.jpeg",
          "_id": "37bf79b4-ae17-4a88-acf7-170ccf6914dc"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/37bf79b4-ae17-4a88-acf7-170ccf6914dc/PembaFlyingFox-CC-Pixels.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT7.kml"
  },
  {
    "id": "79347e9f-5492-4a10-96b2-1e63b4937ded",
    "_id": "79347e9f-5492-4a10-96b2-1e63b4937ded",
    "_enabled": true,
    "regionId": "AT6",
    "slug": "madagascar-island-at6",
    "name": "Madagascar Island (AT6)",
    "description": "The Madagascar Island (AT6) bioregion, home to the iconic Fossa.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Madagascar Dry Deciduous Forests",
      "_id": "85fe496b-ab79-4685-8af8-db8e47d6aa3b",
      "flagshipSpecies": {
        "latitude": -16.8066,
        "longitude": 46.1149,
        "title": "Fossa",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/1f0aada3-1687-4c14-a632-9d0c4d1325b4/32-Madagascar-Dry-Deciduous-Forests-Fossa-.jpeg",
          "_id": "1f0aada3-1687-4c14-a632-9d0c4d1325b4"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/1f0aada3-1687-4c14-a632-9d0c4d1325b4/32-Madagascar-Dry-Deciduous-Forests-Fossa-.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT6.kml"
  },
  {
    "id": "dc90219e-2657-4216-8b50-6bbe58b8dabb",
    "_id": "dc90219e-2657-4216-8b50-6bbe58b8dabb",
    "_enabled": true,
    "regionId": "AT5",
    "slug": "seychelles-comoros-tropical-islands-at5",
    "name": "Seychelles & Comoros Tropical Islands (AT5)",
    "description": "The Seychelles & Comoros Tropical Islands (AT5) bioregion, home to the iconic Giant tortoise.",
    "showGeometry": true,
    "iconicSpeciesEcoregion": {
      "title": "Aldabra Island Xeric Scrub",
      "_id": "8174b57c-e355-480b-8adc-6a8fdff9e61d",
      "flagshipSpecies": {
        "latitude": -9.382,
        "longitude": 46.4971,
        "title": "Giant tortoise",
        "image": {
          "path": "86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6360956b-735b-4486-a668-abfe065ecc8d/91--Aldabra-Island-Xeric-Scrub-Giant-tortoise.jpeg",
          "_id": "6360956b-735b-4486-a668-abfe065ecc8d"
        }
      }
    },
    "image": "https://images.takeshape.io/86ce9525-f5f2-4e97-81ba-54e8ce933da7/dev/6360956b-735b-4486-a668-abfe065ecc8d/91--Aldabra-Island-Xeric-Scrub-Giant-tortoise.jpeg?auto=compress%2Cformat&w=800",
    "geoJSON": "https://www.oneearth.org/geoData/bioregions/AT5.kml"
  }
];

// Export the dataset
export const oneEarthBioregions: OneEarthBioregions = {
  bioregions: transformedBioregions,
  lastUpdated: "2025-11-08",
};
