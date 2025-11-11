# @workspace/solutions

One Earth Solutions Framework data package.

This package contains the complete One Earth Solutions Framework dataset, including:

- **Pillars**: Top-level solution categories (Energy Transition, Nature Conservation, Regenerative Agriculture)
- **SubPillars**: Sub-categories within each pillar
- **Pathways**: Individual solution pathways
- **Intersectional Themes**: Cross-cutting themes (Gender Equity, Indigenous Rights, Biodiversity, etc.)
- **Levers of Change**: Mechanisms for accelerating solutions (Policy & Governance, Finance, Science & Technology, etc.)

## Installation

This is a workspace package. Install dependencies at the root:

```bash
pnpm install
```

## Usage

```typescript
import { oneEarthFramework } from "@workspace/oneearth";

// Access pillars
oneEarthFramework.pillars.forEach((pillar) => {
  console.log(pillar.name);

  // Access subPillars
  pillar.subPillars.forEach((subPillar) => {
    console.log(subPillar.name);

    // Access pathways
    subPillar.pathways.forEach((pathway) => {
      console.log(pathway.name);
    });
  });
});

// Access intersectional themes
oneEarthFramework.intersectionalThemes.forEach((theme) => {
  console.log(theme.name);
});

// Access levers of change
oneEarthFramework.leversOfChange.forEach((lever) => {
  console.log(lever.name);
});
```

## Building

```bash
bun run build
```

This will compile the TypeScript source and generate ESM and CJS builds in the `dist` directory.
