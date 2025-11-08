# HyperVault Nested Hierarchy Implementation

This document describes the implementation of the three-level hierarchical structure for HyperVaults: **Pillar => Sub-Pillar => Pathway**.

## Overview

The HyperVault contract now supports a tree structure with automatic value distribution upstream based on configurable percentages. This enables funding at any level to benefit parent vaults recursively.

## Architecture

### Contract Structure

```
Pillar (Level 0, Root)
  └─ Sub-Pillar (Level 1)
      └─ Pathway (Level 2)
```

Each vault can have:

- **One parent** (or zero for root/pillar vaults)
- **Multiple children**
- **Configurable percent** for upstream value distribution (basis points, max 10000 = 100%)

## Key Features

### 1. Parent-Child Relationships

Each vault automatically registers with its parent during initialization:

```solidity
if (address(config_.parent) != address(0)) {
    config_.parent.registerChild();
}
```

### 2. Upstream Value Distribution

When funding a vault, a percentage automatically flows upstream based on the `percent` config:

```solidity
function fund(uint256 assets, address receiver) external nonReentrant returns (uint256) {
    // Transfer from caller
    IERC20(asset()).safeTransferFrom(msg.sender, address(this), assets);

    // Calculate and send upstream portion
    uint256 upstreamAmount = (assets * config.percent) / MAX_PERCENT;
    if (address(config.parent) != address(0) && upstreamAmount > 0) {
        _pushValueUpstream(upstreamAmount);
    }

    // Keep local portion
    uint256 localAssets = assets - upstreamAmount;
    emit Funded(msg.sender, receiver, localAssets, upstreamAmount);
    return assets;
}
```

### 3. Recursive Propagation

The `_pushValueUpstream` function recursively calls the parent's `fund()` function, causing value to flow all the way up the tree:

```solidity
function _pushValueUpstream(uint256 amount) internal {
    if (address(config.parent) == address(0) || amount == 0) return;

    IERC20(asset()).approve(address(config.parent), amount);
    config.parent.fund(amount, address(this)); // Recursive!

    totalUpstreamSent += amount;
    emit ValuePushedUpstream(address(config.parent), amount);
}
```

### 4. Tree Navigation

The contract provides methods to navigate the tree:

- `getParent()` - Get the parent vault address
- `getChildVaults()` - Get all child vault addresses
- `getTreeLevel()` - Get the vault's level in the tree (0 for pillar, 1 for sub-pillar, 2 for pathway)
- `isChildVault(address)` - Check if an address is a registered child

## SDK Integration

The SDK provides a complete TypeScript interface for working with the hierarchy:

### Types

```typescript
export enum VaultLevel {
  PILLAR = 0,
  SUB_PILLAR = 1,
  PATHWAY = 2,
}

export type VaultHierarchy = {
  address: Address;
  level: VaultLevel;
  parent?: Address;
  children: Address[];
  metadata: Record<string, any>;
};

export type VaultTreeNode = {
  vault: Address;
  level: VaultLevel;
  children: VaultTreeNode[];
};
```

### Methods

```typescript
// Create vault with parent relationship
await sdk.vault.create({
  owner: address,
  parent: parentVaultAddress,
  asset: tokenAddress,
  percent: 1000n, // 10%
  shares: 0n,
  metadata: {
    /* ... */
  },
});

// Query hierarchy information
await sdk.vault.getParent(vaultAddress);
await sdk.vault.getChildVaults(vaultAddress);
await sdk.vault.getTreeLevel(vaultAddress);
await sdk.vault.getHierarchy(vaultAddress);
await sdk.vault.getFullTree(rootVaultAddress);

// Fund with automatic upstream distribution
await sdk.vault.fund(vaultAddress, amount);
```

## Example: Value Distribution

When funding a pathway vault with 100 tokens and 10% upstream percentages:

```
Pathway (Level 2)  receives: 100 tokens
  -> keeps 90 tokens (90%)
  -> sends 10 tokens to Sub-Pillar (10%)

Sub-Pillar (Level 1) receives: 10 tokens
  -> keeps 9 tokens (90%)
  -> sends 1 token to Pillar (10%)

Pillar (Level 0) receives: 1 token
  -> keeps 1 token (no parent)

Total distribution:
- Pathway: 90 tokens
- Sub-Pillar: 9 tokens
- Pillar: 1 token
```

## Testing

All tests pass successfully:

```bash
npm test -- test/HyperVault.ts
```

Tests cover:

1. Single-level upstream distribution
2. Root vault behavior (no parent)
3. Multi-level hierarchy with proper value distribution
4. Parent-child relationship tracking
5. Tree level calculation

## Usage with One Earth Solutions Framework

The seed-vaults script demonstrates creating the full hierarchy:

```typescript
// Create pillar (root)
const pillarVault = await sdk.vault.create({
  parent: zeroAddress,
  percent: 0n, // Root has no parent
  // ...
});

// Create sub-pillar under pillar
const subPillarVault = await sdk.vault.create({
  parent: pillarVault,
  percent: 1000n, // 10% to parent
  // ...
});

// Create pathway under sub-pillar
const pathwayVault = await sdk.vault.create({
  parent: subPillarVault,
  percent: 1000n, // 10% to parent
  // ...
});
```

## Key Benefits

1. **Automatic value distribution** - No manual transfers needed
2. **Recursive propagation** - Value flows through multiple levels automatically
3. **Flexible percentages** - Each vault can configure its own upstream percentage
4. **Tree navigation** - Easy to query parent-child relationships
5. **Gas efficient** - Single transaction distributes value across multiple levels
6. **Transparent tracking** - Events and storage track all value flows

## Events

```solidity
event Funded(
    address indexed sender,
    address indexed receiver,
    uint256 assets,
    uint256 assetsToParent
);

event ValuePushedUpstream(
    address indexed parent,
    uint256 amount
);

event ChildVaultRegistered(
    address indexed child
);
```

## Configuration

Each vault's configuration includes:

```solidity
struct Config {
    IERC20 asset;           // The underlying asset (e.g., USDC)
    HyperVault parent;      // Parent vault (zero address for root)
    address owner;          // Vault owner
    uint256 percent;        // Upstream percentage (basis points, max 10000)
    uint256 shares;         // Initial shares to mint
    string metadataURI;     // IPFS URI for metadata
}
```
