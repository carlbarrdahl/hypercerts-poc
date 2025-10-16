# Hypercerts PoC

This Hypercerts concept implements Vaults as the foundation for Hypercerts and EAS Attestations for claims, evaluations, endorsements etc.

EAS attestations can be created offchain for private data. These can later be published onchain for immutability.

Why?

- building on EAS for transparent, verifiable, auditable claims and data
- consistent data structures for onchain and offchain attestations

- Frontend
  - [ ] auth
    - [x] burner wallet test
    - [ ] alchemy or privy
  - [x] create Vault
  - [x] query Vaults
  - [x] create Attestation
- SDK
  - [x] create Vault
  - [x] query Vaults
  - [ ] attestations / work claims / evaluations / endorsements
    - [ ] onchain
      - [ ] upload metadata to storacha
    - [ ] offchain

---

### Todo

- create onchain attestation
- list attestations for vault
  - type / schema
  - metadata
- attestation engine

---

Proof of Concept to explore how to handle user accounts and organizations across multiple platforms.

### Flows

Basic:

- [x] user logs in on Hypercerts
- [ ] user creates Organization
- [x] user logs in on Platform A
- [x] user press link account (sdk.account.link)
- [x] user creates attestation from Platform A
- [x] user logs in on Platform B
- [x] user links account (sdk.account.link)
- [x] user can see their hypercerts/attestations
- [x] user creates attestation that shows in all platforms and hypercerts app
- [ ] user can see their organizations hypercerts

Extra:

- [ ] user creates attestation on behalf of Organization
- [ ] user invites users to Organization via link
- [ ] create Hypercerts Account + Organization from sdk
