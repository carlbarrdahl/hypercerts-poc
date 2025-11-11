// Utility functions for pathways
export function generatePathwaySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findPathwayBySlug(
  framework: any,
  slug: string
): {
  pathway: any;
  pillar: any;
  subPillar: any;
} | null {
  for (const pillar of framework.pillars) {
    for (const subPillar of pillar.subPillars) {
      const pathway = subPillar.pathways.find(
        (p: any) => generatePathwaySlug(p.name) === slug
      );
      if (pathway) {
        return { pathway, pillar, subPillar };
      }
    }
  }
  return null;
}


