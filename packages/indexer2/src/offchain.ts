import {
  json,
  pgSchema,
  text,
  timestamp,
  uuid,
  boolean,
  bigint,
} from "drizzle-orm/pg-core";
import { hex, relations } from "ponder";

export const offchainSchema = pgSchema("offchain");

// Offchain attestation table - matches EAS attestation structure
export const attestation = offchainSchema.table("attestation", {
  id: hex().primaryKey(),
  attester: hex().notNull(),
  recipient: hex().notNull(),
  refUID: hex(),
  schema: hex(),
  time: bigint({ mode: "bigint" }),
  expirationTime: bigint({ mode: "bigint" }),
  revocable: boolean(),
  revocationTime: bigint({ mode: "bigint" }),
  data: hex(),
  decodedDataJson: text(),
  isOffchain: boolean().notNull().default(true),
  createdAt: timestamp().$default(() => new Date()),
  updatedAt: timestamp().$onUpdate(() => new Date()),
});

// Relations for parent/child attestations (commented out due to drizzle version incompatibility)
// Can be re-enabled when using compatible drizzle versions
// export const attestationRelations = relations(attestation, ({ one }) => ({
//   parent: one(attestation, {
//     fields: [attestation.refUID],
//     references: [attestation.id],
//   }),
// }));

// export const attestationManyRelations = relations(attestation, ({ many }) => ({
//   children: many(attestation),
// }));
