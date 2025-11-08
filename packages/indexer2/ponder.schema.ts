import { onchainTable, primaryKey, relations } from "ponder";
import { Address } from "viem";

// TODO: move to types folder
type Metadata = {
  title: string;
  description?: string;
  image?: string;
};

type Token = {
  address: Address;
  symbol: string;
  decimals: number;
};

export const vault = onchainTable("vault", (t) => ({
  id: t.hex().primaryKey(),
  owner: t.hex(),
  parent: t.hex(),
  percent: t.bigint(),
  metadata: t.json().$type<Metadata>(),
  token: t.json().$type<Token>(),
  createdAt: t.timestamp(),
  updatedAt: t.timestamp(),
}));

export const deposit = onchainTable("deposit", (t) => ({
  id: t.hex().primaryKey(),
  sender: t.hex(),
  owner: t.hex(),
  assets: t.bigint(),
  shares: t.bigint(),
  token: t.json().$type<Token>(),
  createdAt: t.timestamp(),
}));

export const withdraw = onchainTable("withdraw", (t) => ({
  id: t.hex().primaryKey(),
  sender: t.hex(),
  owner: t.hex(),
  assets: t.bigint(),
  shares: t.bigint(),
  token: t.json().$type<Token>(),
  createdAt: t.timestamp(),
}));

export const funding = onchainTable("funding", (t) => ({
  id: t.hex().primaryKey(),
  sender: t.hex(),
  owner: t.hex(),
  assets: t.bigint(),
  shares: t.bigint(),
  token: t.json().$type<Token>(),
  createdAt: t.timestamp(),
}));

export const contributor = onchainTable(
  "contributor",
  (t) => ({
    address: t.hex(),
    vault: t.hex(),
    assets: t.bigint(),
    shares: t.bigint(),
    token: t.json().$type<Token>(),
    createdAt: t.timestamp(),
    updatedAt: t.timestamp(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.vault, table.address] }),
  })
);

export const funder = onchainTable(
  "funder",
  (t) => ({
    address: t.hex(),
    vault: t.hex(),
    assets: t.bigint(),
    token: t.json().$type<Token>(),
    createdAt: t.timestamp(),
    updatedAt: t.timestamp(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.vault, table.address] }),
  })
);

// EAS onchain attestation table
export const attestation = onchainTable("attestation", (t) => ({
  id: t.hex().primaryKey(),
  attester: t.hex().notNull(),
  recipient: t.hex().notNull(),
  refUID: t.hex(),
  schema: t.hex(),
  time: t.bigint(),
  expirationTime: t.bigint(),
  revocable: t.boolean(),
  revocationTime: t.bigint(),
  data: t.hex(),
  decodedDataJson: t.text(),
  decodedParsed: t.json(),
  isOffchain: t.boolean().notNull(),
  createdAt: t.timestamp(),
  updatedAt: t.timestamp(),
}));
