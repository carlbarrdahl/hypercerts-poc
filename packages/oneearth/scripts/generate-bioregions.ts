#!/usr/bin/env bun
// Script to generate bioregions.ts from bioregions.json
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the bioregions JSON file
const bioregionsPath = join(
  __dirname,
  "../../../apps/bio-vaults/data/bioregions.json"
);
const bioregionsData = JSON.parse(readFileSync(bioregionsPath, "utf-8"));

// Generate the TypeScript file content
const header = `// bioregions.ts
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
  return \`https://images.takeshape.io/\${flagshipSpeciesImage.path}?auto=compress%2Cformat&w=800\`;
}

// Helper function to get geoJSON URL for a bioregion
function getBioregionGeoJSON(regionId: string): string {
  return \`https://www.oneearth.org/geoData/bioregions/\${regionId}.kml\`;
}

// Transform the data
const transformedBioregions: Bioregion[] = `;

const footer = `;

// Export the dataset
export const oneEarthBioregions: OneEarthBioregions = {
  bioregions: transformedBioregions,
  lastUpdated: "${new Date().toISOString().split("T")[0]}",
};
`;

// Transform the data
const transformedData = bioregionsData.map((bioregion: any) => {
  const flagshipImage = bioregion.iconicSpeciesEcoregion?.flagshipSpecies?.image;
  // Handle null values - convert to undefined
  const imagePath = flagshipImage?.path && flagshipImage.path !== null
    ? `https://images.takeshape.io/${flagshipImage.path}?auto=compress%2Cformat&w=800`
    : undefined;
  
  // Handle null image objects
  const iconicSpeciesEcoregion = {
    ...bioregion.iconicSpeciesEcoregion,
    flagshipSpecies: {
      ...bioregion.iconicSpeciesEcoregion.flagshipSpecies,
      image: flagshipImage && flagshipImage.path !== null ? flagshipImage : undefined,
    },
  };

  // Generate description from title and iconic species info
  const description = bioregion.iconicSpeciesEcoregion?.flagshipSpecies?.title
    ? `The ${bioregion.title} bioregion, home to the iconic ${bioregion.iconicSpeciesEcoregion.flagshipSpecies.title}.`
    : `The ${bioregion.title} bioregion.`;

  return {
    id: bioregion._id,
    _id: bioregion._id,
    _enabled: bioregion._enabled,
    regionId: bioregion.regionId,
    slug: bioregion.slug,
    name: bioregion.title,
    description,
    showGeometry: bioregion.showGeometry,
    iconicSpeciesEcoregion,
    image: imagePath,
    geoJSON: `https://www.oneearth.org/geoData/bioregions/${bioregion.regionId}.kml`,
  };
});

// Generate the TypeScript content
const dataString = JSON.stringify(transformedData, null, 2);
const content = header + dataString + footer;

// Write the file
const outputPath = join(__dirname, "../src/bioregions.ts");
writeFileSync(outputPath, content, "utf-8");

console.log(`✅ Generated ${outputPath}`);
console.log(`   Processed ${bioregionsData.length} bioregions`);

