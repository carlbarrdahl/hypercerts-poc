# HyperVault Contract & Indexer Audit Report

## Executive Summary

**STATUS: CRITICAL BUG FIXED** ✅

The main issue was an **event parameter mismatch** between the contract and indexer that prevented upstream token flows from being tracked. This has been fixed.

This audit identified **1 CRITICAL (FIXED)** and **3 INFORMATIONAL** issues with the HyperVault system.

---

## ✅ FIXED: Event Parameter Mismatch Between Contract and Indexer

**Severity:** CRITICAL (NOW FIXED)  
**Location:** `HyperVault.sol` line 58-63, `indexer/src/index.ts` line 127

**Issue:**
The contract emits:

```solidity
event Funded(
    address indexed sender,
    address indexed receiver,  // ← receiver
    uint256 assets,
    uint256 assetsToParent     // ← missing in indexer
);
```

But the indexer was expecting:

```typescript
args: {
  (sender, owner, assets);
} // ← "owner" instead of "receiver"
```

**Impact:**

- Indexer failed to parse Funded events correctly
- The `assetsToParent` field was completely ignored
- Upstream token flows were not tracked
- **This is why parent vaults appeared to have 0 tokens in the UI**

**Fix Applied:**
✅ Updated indexer to: `args: { sender, receiver, assets, assetsToParent }`  
✅ Updated schema to include `vault`, `receiver`, and `assetsToParent` fields  
✅ Removed incorrect `shares` field from funding table

**Note:** The contract logic is correct - tests confirm tokens flow upstream properly (90/9/1 split). The issue was purely in the indexer not capturing the events.

---

## ✅ FIXED: Division by Zero in SDK Balance Query

**Severity:** CRITICAL (NOW FIXED)  
**Location:** `packages/sdk/src/index.ts` line 281

**Issue:**
The SDK's `balance()` function was calculating price per share with:

```typescript
const shares = await vault.read.convertToShares([assets]);
const price = assets / shares; // Division by zero when shares = 0!
```

When a vault only received grants (via `fund()`) but had no deposits, `totalSupply()` would be 0, causing:

```
RangeError: Division by zero
```

**Impact:**

- UI crashed when viewing vaults that only received grant funding
- Unable to view vault details for grant-only vaults
- Error: "RangeError: Division by zero"

**Fix Applied:**
✅ Changed to use `totalSupply()` instead of `convertToShares()`  
✅ Added zero-check: `const price = shares > 0n ? assets / shares : 0n;`

Now vaults with 0 shares show a price of 0, which is correct.

---

## 📋 INFORMATIONAL ISSUES

### 1. fund() Doesn't Mint Shares - By Design

**Severity:** INFORMATIONAL  
**Location:** `HyperVault.sol` lines 108-129

**Clarification:**
This is BY DESIGN. The `fund()` function is intended for **grants** that increase the value of existing shares without diluting ownership.

The `fund()` function:

1. Transfers assets INTO the vault
2. Does NOT mint any shares (intentional)
3. Increases assets WITHOUT increasing share supply
4. Increases the value per share for existing holders

**Example:**

```
Initial: 100 assets, 100 shares, 1:1 ratio
After fund(100): 200 assets, 100 shares, 2:1 ratio
Existing shareholders' shares are now worth 2x!
```

This is appropriate for:

- Grant funding
- Donations
- Retroactive funding
- Community rewards

**Recommendation:**
Document this clearly in UI as "Grant Funding" vs "Investment (Deposit)" to avoid confusion.

---

### 2. Multiple Funded Events in Single Transaction

**Severity:** INFORMATIONAL  
**Location:** `HyperVault.sol` lines 118-122, 135-146

**Behavior:**
When a user funds a Pathway vault with 100 tokens:

1. Pathway emits: `Funded(user, user, 90, 10)`
2. SubPillar emits: `Funded(pathway, pathway, 9, 1)`
3. Pillar emits: `Funded(parent, parent, 1, 0)`

Three separate Funded events are emitted in a single transaction.

**Why This is OK:**

- Each vault correctly reports what IT received and kept locally
- The `assetsToParent` field shows what was sent upstream
- This provides full traceability of the token flow
- The sender field distinguishes user funding from upstream transfers

**Indexer Handling:**
The indexer should:

- Track all three events separately ✅
- Only count the original user as a "funder" (sender != vault address)
- Use `assetsToParent` to trace upstream flows
- Display the full funding chain in analytics

---

### 3. Funder Table Design

**Severity:** INFORMATIONAL  
**Location:** `ponder.schema.ts` lines 74-87

**Current Design:**

```typescript
export const funder = onchainTable("funder", (t) => ({
  address: t.hex(),
  vault: t.hex(),
  assets: t.bigint(),
  // No shares field - this is intentional
}));
```

Funders are tracked with assets but NO shares, which is correct since `fund()` doesn't mint shares.

**Recommendation:**
Update UI to clearly differentiate:

- **"Share Holders"** - have ownership shares (from `deposit()`)
- **"Grant Funders"** - provided grants (from `fund()`, no shares)

---

## 📊 ANALYTICS ENHANCEMENT

### Upstream Flow Tracking

**Current State:**  
The indexer now captures `assetsToParent` from each Funded event.

**Enhancement Opportunity:**
With the current data, you can trace:

- Direct funding: `funding` table where sender is not a vault address
- Upstream transfers: `funding` table where sender is a vault address
- Flow amounts: `assetsToParent` field shows what went upstream

**Possible Future Enhancement:**
Add analytics queries to show:

- "Your funding impacted X vaults in the tree"
- Total impact across hierarchy
- Funding source attribution through multiple levels

---

## Summary

### ✅ Fixes Applied:

1. ✅ Fixed event parameter mismatch (receiver vs owner)
2. ✅ Added `vault` field to funding schema
3. ✅ Added `assetsToParent` field to capture upstream flow
4. ✅ Changed `owner` to `receiver` in funding schema
5. ✅ Removed incorrect `shares` field from funding table
6. ✅ Fixed division by zero error in SDK balance calculation
7. ✅ Changed from `convertToShares` to `totalSupply` for accurate share count

### Next Steps:

1. **Restart the indexer** to apply schema changes
2. Test funding a pathway vault and verify parent vaults receive tokens
3. Update UI to clearly label "Grant Funding" vs "Investment (Deposit)"
4. Consider adding analytics to show full funding impact chain

### Expected Behavior After Fix:

When a user funds a Pathway vault with 100 tokens:

- **Pathway** will show 90 tokens (100 - 10 upstream)
- **Sub-Pillar** will show 9 tokens (10 received - 1 upstream)
- **Pillar** will show 1 token (1 received, no parent)
- All three vaults will have Funded events in the database
- The `assetsToParent` field will track the flow (10, 1, 0)
