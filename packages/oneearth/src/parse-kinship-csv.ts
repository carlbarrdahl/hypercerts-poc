#!/usr/bin/env npx tsx
/**
 * Script to parse the Kinship Earth Flow Fund CSV and generate kinship.ts
 * Run with: npx tsx parse-kinship-csv.ts
 */

import * as fs from "fs";
import * as path from "path";

// CSV file path
const CSV_PATH =
  "/home/carl/Desktop/Kinship Earth Flow Fund _ Basic Flow Fund Report (Responses) - Form Responses 1.csv";

interface KinshipProject {
  id: string;
  timestamp: string;
  funderName: string;
  recipientName: string;
  location: string;
  disbursementDate: string;
  amount: string;
  amountNumeric: number;
  description: string;
  recipientNotified: string;
  learnings: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Simple CSV parser that handles quoted fields with newlines
function parseCSV(content: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
    } else if (char === "\n" && !inQuotes) {
      currentRow.push(currentField);
      if (currentRow.some((f) => f.trim())) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = "";
    } else if (char === "\r" && !inQuotes) {
      // Skip carriage returns
    } else {
      currentField += char;
    }
  }

  // Handle last field/row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((f) => f.trim())) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// Parse amount string to number
function parseAmount(amountStr: string): number {
  if (!amountStr) return 0;

  // First, try to extract just the first dollar amount
  // Handles formats like "$500.00", "3000", "$1,250", "3,000.00"
  const dollarMatch = amountStr.match(/\$?([\d,]+(?:\.\d{1,2})?)/);
  if (dollarMatch) {
    const cleaned = dollarMatch[1].replace(/,/g, "");
    const num = parseFloat(cleaned);
    if (!isNaN(num) && num < 1000000) {
      // Sanity check - no single grant over 1M
      return num;
    }
  }

  // Fallback: try to get any reasonable number
  const cleaned = amountStr.replace(/[^0-9.]/g, "");
  // Only take first reasonable number (before any date-like patterns)
  const firstNum = cleaned.match(/^\d+(?:\.\d{1,2})?/);
  if (firstNum) {
    const num = parseFloat(firstNum[0]);
    if (!isNaN(num) && num < 1000000) {
      return num;
    }
  }

  return 0;
}

// Fetch coordinates from OpenStreetMap Nominatim
async function fetchCoordinates(
  location: string
): Promise<{ lat: number; lng: number } | null> {
  if (!location || location.trim() === "") return null;

  try {
    const encoded = encodeURIComponent(location);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "KinshipEarthParser/1.0",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch coordinates for "${location}"`);
      return null;
    }

    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching coordinates for "${location}":`, error);
    return null;
  }
}

// Generate slug ID from name
function generateId(name: string, index: number): string {
  if (!name) return `project-${index}`;
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

async function main() {
  console.log("Reading CSV file...");
  const csvContent = fs.readFileSync(CSV_PATH, "utf-8");

  console.log("Parsing CSV...");
  const rows = parseCSV(csvContent);

  // Skip header row
  const dataRows = rows.slice(1);

  console.log(`Found ${dataRows.length} data rows`);

  const projects: KinshipProject[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];

    // Columns A-I (0-8)
    const timestamp = row[0]?.trim() || "";
    const funderName = row[1]?.trim() || "";
    const recipientName = row[2]?.trim() || "";
    const location = row[3]?.trim() || "";
    const disbursementDate = row[4]?.trim() || "";
    const amount = row[5]?.trim() || "";
    const description = row[6]?.trim() || "";
    const recipientNotified = row[7]?.trim() || "";
    const learnings = row[8]?.trim() || "";

    // Skip rows without essential data
    if (!recipientName && !funderName) {
      console.log(`Skipping row ${i + 2}: No funder or recipient name`);
      continue;
    }

    const project: KinshipProject = {
      id: generateId(recipientName || funderName, i),
      timestamp,
      funderName,
      recipientName,
      location,
      disbursementDate,
      amount,
      amountNumeric: parseAmount(amount),
      description,
      recipientNotified,
      learnings,
    };

    projects.push(project);
  }

  console.log(`\nParsed ${projects.length} valid projects`);

  // Fetch coordinates for each unique location
  console.log("\nFetching coordinates for locations...");
  const locationCache: Map<string, { lat: number; lng: number } | null> =
    new Map();

  for (const project of projects) {
    if (project.location && !locationCache.has(project.location)) {
      console.log(`  Fetching: ${project.location}`);
      const coords = await fetchCoordinates(project.location);
      locationCache.set(project.location, coords);
      if (coords) {
        console.log(`    -> ${coords.lat}, ${coords.lng}`);
      } else {
        console.log(`    -> Not found`);
      }
      // Rate limiting - be nice to the API
      await new Promise((resolve) => setTimeout(resolve, 1100));
    }
  }

  // Assign coordinates to projects
  for (const project of projects) {
    const coords = locationCache.get(project.location);
    if (coords) {
      project.coordinates = coords;
    }
  }

  // Generate TypeScript file
  console.log("\nGenerating kinship.ts...");

  const tsContent = `// kinship.ts
// Kinship Earth Flow Fund projects data
// Auto-generated from CSV on ${new Date().toISOString()}

export interface KinshipProject {
  id: string;
  timestamp: string;
  funderName: string;
  recipientName: string;
  location: string;
  disbursementDate: string;
  amount: string;
  amountNumeric: number;
  description: string;
  recipientNotified: string;
  learnings: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export const kinshipProjects: KinshipProject[] = ${JSON.stringify(projects, null, 2)};

// Helper function to get projects by location
export function getProjectsByLocation(location: string): KinshipProject[] {
  return kinshipProjects.filter((p) =>
    p.location.toLowerCase().includes(location.toLowerCase())
  );
}

// Helper function to get projects by funder
export function getProjectsByFunder(funderName: string): KinshipProject[] {
  return kinshipProjects.filter((p) =>
    p.funderName.toLowerCase().includes(funderName.toLowerCase())
  );
}

// Helper function to get total amount funded
export function getTotalFunded(): number {
  return kinshipProjects.reduce((sum, p) => sum + p.amountNumeric, 0);
}

// Get projects with coordinates (for mapping)
export function getProjectsWithCoordinates(): KinshipProject[] {
  return kinshipProjects.filter((p) => p.coordinates);
}
`;

  const outputPath = path.join(__dirname, "kinship.ts");
  fs.writeFileSync(outputPath, tsContent);

  console.log(`\n✅ Generated ${outputPath}`);
  console.log(`   Total projects: ${projects.length}`);
  console.log(
    `   Projects with coordinates: ${projects.filter((p) => p.coordinates).length}`
  );
  console.log(
    `   Total amount funded: $${projects.reduce((sum, p) => sum + p.amountNumeric, 0).toLocaleString()}`
  );
}

main().catch(console.error);


