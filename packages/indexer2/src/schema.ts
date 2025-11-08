import { setDatabaseSchema } from "@ponder/client";
import * as ponderSchema from "../ponder.schema";
import * as offchainSchema from "./offchain";

setDatabaseSchema(ponderSchema, "dev");

// export const attestationRelations = relations(
//   offchainSchema.attestation,
//   ({ one }) => ({
//     parent: one(offchainSchema.attestation, {
//       fields: [offchainSchema.attestation.id],
//       references: [offchainSchema.attestation.refUID],
//     }),
//   })
// );

// export const attestationManyRelations = relations(
//   offchainSchema.attestation,
//   ({ many }) => ({
//     children: many(offchainSchema.attestation),
//   })
// );

export const schema = {
  ...offchainSchema,
  ...ponderSchema,
};
