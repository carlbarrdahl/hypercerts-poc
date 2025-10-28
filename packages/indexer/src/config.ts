/**
 * Indexer configuration
 */

/**
 * Schema UIDs to index from EAS
 * Only attestations with these schema UIDs will be stored in the database
 */
export const INDEXED_SCHEMA_UIDS = [
  "0x7876d5406011830fa45bdfb6c7751d94a3c1477538f6a98f2668c2ab2bf898cd", // Default hypercerts schema
  // Add more schema UIDs here as needed
] as const;

/**
 * Check if a schema UID should be indexed
 */
export function shouldIndexSchema(schemaUID: string): boolean {
  return INDEXED_SCHEMA_UIDS.includes(schemaUID as any);
}
