# Hypercerts Rebuild Blueprint

Distilled reference for recreating the Hypercerts prototype with a single reusable ERC4626 vault primitive, geo-aware metadata, and an attestation graph that proves intent, work, and verification.

---

## 1. Core Vault Primitive (Regions & Projects)

- **Single contract:** `HyperVault.sol` is an upgradeable ERC4626 that points at one ERC20 asset. Every Region or Project is a vault deployed via `HyperVaultFactory.create`.
- **Config payload:** `{ asset, owner, percent, shares, metadataURI }`. Metadata lives off-chain (Next.js IPFS shim) and can include GeoJSON or any JSON fields (`type` differentiates `region` vs `project`).
- **Initialization:** On create, the factory clones, initializes the vault, and optionally mints starter shares to the owner (seed ownership, no deposit required).
- **Funding surfaces:**
  - `deposit(assets)` / `withdraw` come from ERC4626. Funders approve tokens, call `deposit`, and receive freshly minted shares (proof of funding).
  - `fund(assets, receiver)` is a raw transfer helper that moves ERC20 into the vault and emits `Funded` without minting shares (think grants or treasury inflows). Upstream routing exists but is optional and ignored for this simplified rebuild.
- **Contributor rewards:** `mintShares(recipient, shares)` lets the vault owner issue shares directly to contributors after work is verified. These shares behave exactly like deposit-minted ones.
- **Events to track:** `Created` (factory), `Deposit`, `Withdraw`, `Funded`, `SharesMinted` (custom `Transfer` from zero address), plus the inherited ERC20 `Transfer`.

**Takeaway:** Regions and Projects are the same ERC4626 contract instance; only their metadata/GeoJSON change. Shares—no matter how they were minted—represent provable impact credits.

---

## 2. Metadata & GeoJSON Handling

- The Next.js route at `apps/hypercerts/app/api/ipfs/[[...cid]]/route.ts` acts as an IPFS-compatible blob store. `POST` uploads JSON metadata (title, description, geoJSON coordinates, imagery, budgets, etc.) and returns a deterministic `cid` used as `metadataURI`.
- `HypercertsSDK.vault.create` serializes the metadata, pushes it through that route, and submits the resulting `cid` to the factory. When rebuilding, keep the upload API compatible (form-data `file`) so CID references stay stable.
- Downstream consumers fetch the metadata via `GET /api/ipfs/:cid`, which returns the JSON payload directly—no IPFS gateway required.
- Because metadata is free-form JSON, store a `type` field (`region` | `project`) and any GeoJSON geometry needed to render maps or boundary overlays.

---

## 3. SDK & Client Surfaces

- **Provider:** `HypercertsProvider` instantiates `HypercertsSDK` with the connected viem `WalletClient`. React hooks (`useHypercerts`, `useCreateHypercerts`, `useMintShares`, etc.) wrap SDK calls with React Query.
- **Vault API (`packages/sdk/src/index.ts`):**
  - `create`, `deposit`, `withdraw`, `fund`, `mintShares`, `payout`, plus read helpers (`balance`, `getParent`, `getChildVaults`, etc.). For the simplified build, focus on `create`, `deposit`, `mintShares`, and `fund`.
  - `create` auto-uploads metadata to the local IPFS route, then calls the factory’s `create` to deploy a vault.
  - `mintShares` and `fund` simply forward to the vault contract and rely on events for indexing.
- **Indexer client (`createIndexer`):** Provides URQL GraphQL queries for `vaults`, `contributors`, `funders`, and `attestations`. Hooks like `useListHypercerts` or `useHypercertsAttestations` call into it.
- **EAS helper (`lib/eas.ts`):** Wraps the Ethereum Attestation Service SDK. `cert.create` registers (or reuses) the schema `string type, string metadata, string visibility`, encodes milestone/work data, and submits on-chain attestations when `visibility === "published"`.

**Simplified rebuild needs:** one provider to expose the SDK, vault CRUD ops, query hooks wired to the indexer, and the attestation helper for milestone/work flows.

---

## 4. Indexer & Data Model

- **Event ingestion:** `packages/indexer/src/index.ts` (Ponder) subscribes to factory and vault events, enriches them with token metadata, and stores rows defined in `ponder.schema.ts`.
- **Key tables:**
  - `vault`: id, owner, parent (nullable), percent, metadata JSON (includes `type` & GeoJSON), ERC20 token info, timestamps.
  - `deposit` & `withdraw`: log asset/share movements for analytics.
  - `funding`: logs `Funded` events (assets sent, receiver, upstream portion).
  - `contributor`: aggregate table keyed by `{vault, address}` that increments on ERC20 `Transfer` mints (`mintShares`) and decrements on withdrawals.
  - `funder`: aggregate of all `Funded` senders or `Deposit` senders—captures who supplied assets.
  - `attestation`: on-chain EAS attestations (plus optional off-chain ones via `/attestation` API).
- **Attestation ingestion:** `EAS:Attested` handler fetches the attestation payload, decodes schema values into JSON, and stores them. Off-chain attestations can be posted to `/attestation` (Hono API) for future support.
- **GraphQL access:** The indexer exposes URQL GraphQL endpoints for vaults/funders/contributors/attestations, which the SDK queries directly.

---

## 5. Attestation-Driven Impact Graph

- **Schema:** Attestations encode `type`, `metadata` (JSON string), and `visibility`. `metadata` fields include milestone/work details, resources, status, dates, and optional GeoJSON (the UI allows linking evidence resources).
- **Types & relationships:**
  - `milestone`: describes planned or completed work for a vault (recipient = vault address). Serves as intent.
  - `work-claim`: references `refUID = milestoneUID`, showing completed chunks with supporting resources.
  - `verification`: references `refUID = workClaimUID` (or milestone UID if no work claim) and sets `metadata.verified` plus evaluator notes.
- **UI flow (`components/vault/attestations.tsx`):** Users create attestations through a form; work claims can choose a milestone from existing attestations; verifications allow evaluators to batch-select work claims and issue attestations.
- **Seeder script (`scripts/seed-projects.ts`):** Demonstrates how milestones, work claims, and verifications chain together for sample projects (great reference for expected metadata fields and linking logic).

Result: every vault ends up with an attestation graph (milestones → work claims → verifications) that funders can inspect to see stated intent, reported progress, and verified outcomes.

---

## 6. Roles & Flows

- **Funders (individuals/orgs):**
  1. Review a vault’s metadata + GeoJSON to understand the Region/Project scope.
  2. Call `deposit` (ERC4626) to supply assets and automatically receive shares (Proof of Funding). Shares can later be redeemed.
  3. Monitor milestones/work/verifications via the indexer & UI to gauge impact.
- **Contributors (project members):**
  1. Submit milestones (intent) and work claims (completed work) via attestations pointing to the vault.
  2. Receive shares directly from the vault owner through `mintShares` once work is recognized—these shares represent Proof of Impact for labor rather than capital.
- **Evaluators:**
  1. Review evidence on work claims.
  2. Issue verification attestations with `metadata.verified = true/false`, `comment`, and supporting resources.
  3. Their attestations link via `refUID`, closing the loop between plans, execution, and validation.

Shares from deposits and shares from minted rewards coexist, so both funders and contributors hold tokens proving their part in the project.

---

## 7. Rebuild Checklist

1. **Smart contracts:** Deploy `HyperVaultFactory` and use it to clone new vaults. Keep ERC4626 deposit/withdraw + `mintShares` + `fund`.
2. **Metadata service:** Provide a simple API to store JSON + GeoJSON blobs and return a content-addressed URI; plug it into `vault.create`.
3. **SDK layer:** Wrap contract calls, metadata upload, and attestation creation. Surface hooks or lightweight clients for React (create vault, deposit, mint shares, list vaults, list attestations).
4. **Indexer:** Listen to `Created`, `Deposit`, `Withdraw`, `Funded`, `Transfer (mint)`, and `EAS:Attested`. Populate tables for vaults, funders, contributors, funding events, and attestations. Expose GraphQL queries.
5. **Attestation UI/logic:** Forms for milestones, work claims, verifications with `refUID` linkage, plus tables/graphs to visualize relationships (optionally seed sample data).
6. **Role flows:** Ensure funders can deposit and see shares, contributors can request/mint shares after work, and evaluators can verify claims—all referencing the same vault primitive.

With these pieces, you can recreate the Hypercerts MVP: reusable ERC4626 vaults for any geo-tagged initiative, an attestation-based evidence graph, and share-based proofs for both capital and labor contributions.
