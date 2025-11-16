# Regions Implementation Summary

## Overview
Built a complete regions feature for the Hypercerts app, including:
- Regions list page with filtering
- Detailed region pages with interactive maps
- Seed script for 5 representative bioregions
- Map component with Mapbox integration

## Files Created/Modified

### 1. Seed Script
**File:** `packages/contracts/scripts/seed-regions.ts`
- Creates 5 bioregion vaults with realistic data
- Includes 5 representative regions:
  1. **Northern Amazonian Forests (NT20)** - Capybara
  2. **Scandinavian Birch & Coastal Conifer Forests (PA3)** - Norway lemming
  3. **Madagascar Island (AT6)** - Fossa
  4. **North Congolian Lowland Forests (AT15)** - Western lowland gorilla
  5. **Coral Sea & New Caledonia Islands (AU10)** - Kagu
- Each region includes:
  - 5 funders (20,000 - 100,000 tokens each)
  - 10-15 contributors (100 - 5,000 tokens each)
  - Full metadata: title, description, image, geoJSON URL, iconic species, region ID

### 2. Map Component
**File:** `apps/hypercerts/components/map.tsx`
- Integrated Mapbox GL with react-map-gl
- Auto-fits bounds to show full region
- Custom styling for bioregion visualization
- Green fill with border overlay
- Uses outdoor map style for natural areas

### 3. Region Details Component
**File:** `apps/hypercerts/components/region/details.tsx`
- Comprehensive region detail page with:
  - Hero section with banner image
  - Region metadata (iconic species, region ID)
  - Interactive map showing bioregion boundaries
  - Contributors treemap visualization
  - Contributors and funders lists
  - Stats card (assets, shares, price per share)
  - Action card (contribute, withdraw, fund)
- Loads KML data and converts to GeoJSON for map display
- Toast notifications for user actions
- Loading and error states

### 4. Regions List Page
**File:** `apps/hypercerts/app/regions/page.tsx`
- Filters vaults to show only regions (type="region")
- Card-based grid layout (responsive: 1/2/3 columns)
- Each card shows:
  - Region banner image
  - Region ID badge
  - Title and description
  - Iconic species
  - Active vault indicator
- Hover effects and smooth transitions
- Empty state with helpful messaging

### 5. Package Dependencies
**File:** `apps/hypercerts/package.json`
Added required dependencies:
- `mapbox-gl`: ^3.15.0
- `react-map-gl`: ^8.0.4
- `@turf/bbox`: ^7.2.0
- `@types/mapbox-gl`: ^3.4.1

## Data Structure

### Region Metadata Schema
```typescript
{
  type: "region",
  title: string,
  description: string,
  image: string,              // Banner image URL
  geoJSON: string,            // KML/GeoJSON URL
  regionId: string,           // e.g., "NT20", "PA3"
  slug: string,               // URL-friendly slug
  iconicSpecies: string,      // Featured species name
}
```

### Vault Structure
Each region vault includes:
- Parent: `zeroAddress` (top-level vaults)
- Asset: Test token address
- Owner: Region creator address
- Metadata: Full region information
- Contributors: Multiple deposit transactions with shares
- Funders: Multiple fund transactions without shares

## Usage

### Running the Seed Script
```bash
cd packages/contracts
bun run scripts/seed-regions.ts
# or
npx tsx scripts/seed-regions.ts
```

### Installing Dependencies
```bash
cd apps/hypercerts
pnpm install
```

### Viewing Regions
1. Navigate to `/regions` to see all bioregion vaults
2. Click on any region card to view full details
3. Interactive map shows the geographic boundaries
4. Contribute or fund directly from the detail page

## Key Features

### Map Integration
- Uses Mapbox GL for professional map rendering
- Fetches KML data from OneEarth.org
- Converts KML to GeoJSON on the fly
- Auto-centers and zooms to region bounds
- Green color scheme for natural areas

### Data Visualization
- Contributors treemap shows proportional contributions
- Separate visualizations for contributors vs funders
- Lists with address truncation and amounts
- Real-time data updates (1 second refresh)

### User Actions
- **Contribute**: Deposit tokens and receive shares
- **Withdraw**: Redeem shares for tokens
- **Fund**: Donate tokens without receiving shares
- Allowance checks for token approvals
- Success/error toast notifications

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Stacked columns on mobile
- High-quality images with lazy loading
- Smooth hover animations

## Technical Details

### Map Configuration
- Provider: Mapbox (requires `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`)
- Style: `outdoors-v12` (optimized for natural areas)
- Initial view: Centered on region with padding
- Layers: Fill (30% opacity green) + Line (solid green border)

### Data Flow
1. Seed script creates vaults with metadata
2. Indexer picks up vault creation events
3. Frontend queries indexed data via SDK
4. Region page fetches KML from metadata URL
5. KML converted to GeoJSON via `use-fetch-kml` hook
6. Map renders GeoJSON boundaries

### Performance
- Refetch interval: 1 second for real-time updates
- KML caching via React Query
- Image optimization with Next.js
- Lazy loading for off-screen content

## Environment Variables Required

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

Get a free Mapbox token at: https://www.mapbox.com/

## Future Enhancements

Potential improvements:
- [ ] Add region comparison view
- [ ] Implement region search/filter
- [ ] Show child projects within regions
- [ ] Add region activity feed
- [ ] Integrate with attestations/milestones
- [ ] Export region data
- [ ] Share region on social media
- [ ] Multi-layer map visualization
- [ ] Region health metrics
- [ ] Impact tracking dashboard

## Testing

To test the implementation:
1. Deploy contracts to local hardhat node
2. Run seed-regions script to create test data
3. Start the indexer to index the vaults
4. Start the Next.js dev server
5. Navigate to `/regions`
6. Click on a region to see details
7. Test contribute/fund actions

## Related Files

- `/apps/hypercerts/app/regions/[id]/page.tsx` - Route handler for detail page
- `/apps/hypercerts/hooks/use-fetch-kml.ts` - KML fetching hook
- `/apps/hypercerts/app/api/kml/route.ts` - API route for KML proxy
- `/packages/oneearth/src/bioregions.ts` - Source bioregion data
- `/packages/sdk/src/lib/eas.ts` - Attestation schema (includes geoJSON field)

## Notes

- The seed script uses hardhat accounts for different roles
- All monetary amounts use 18 decimals (standard ERC20)
- GeoJSON URLs point to OneEarth.org KML files
- Images are hosted on TakeShape CDN
- Region IDs follow OneEarth Framework naming (e.g., NT20, PA3)

