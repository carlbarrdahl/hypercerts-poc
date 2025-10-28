import { db } from "ponder:api";
import schema from "ponder:schema";
import { schema as combinedSchema } from "../schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";

import crypto from "crypto";
import * as offchainSchema from "../offchain";
import * as ponderSchema from "../../ponder.schema";

import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";

// export const offchainDb = drizzle("http://localhost:5432", {
export const offchainDb = drizzle(process.env.DATABASE_URL!, {
  schema: combinedSchema,
});

const app = new Hono();

app.use("/sql/*", client({ db, schema }));

app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

app.get("/attestations", async (c) => {
  console.log(process.env.DATABASE_URL!);
  const attestations = await offchainDb
    .select()
    .from(offchainSchema.attestation)
    .catch((e: Error) => {
      console.error(e, process.env.DATABASE_URL);
      return [];
    });
  return c.json({ attestations });
});

app.post("/attestation", async (c) => {
  try {
    const json = await c.req.json();
    console.log("Received offchain attestation:", json);

    const { attestation: attestationMsg, decodedDataJson } = json;

    // Extract attestation data from EAS offchain format
    const attestationData = {
      id: attestationMsg.uid as `0x${string}`,
      attester: attestationMsg.attester as `0x${string}`,
      recipient: attestationMsg.recipient as `0x${string}`,
      refUID: attestationMsg.refUID as `0x${string}`,
      schema: attestationMsg.schema as `0x${string}`,
      time: BigInt(attestationMsg.time),
      expirationTime: BigInt(attestationMsg.expirationTime),
      revocable: attestationMsg.revocable,
      revocationTime: attestationMsg.revocationTime
        ? BigInt(attestationMsg.revocationTime)
        : null,
      data: attestationMsg.data as `0x${string}`,
      decodedDataJson: decodedDataJson || "[]",
      isOffchain: true,
    };

    await offchainDb.insert(offchainSchema.attestation).values(attestationData);

    console.log("Stored offchain attestation:", attestationData.id);
    return c.json({ success: true, uid: attestationData.id });
  } catch (error) {
    console.error("Error storing offchain attestation:", error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

// Unified query endpoint for both onchain and offchain attestations
app.get("/query", async (c) => {
  try {
    const { where, take, skip, orderBy } = c.req.query();

    // Parse query parameters
    const limit = take ? parseInt(take as string) : 100;
    const offset = skip ? parseInt(skip as string) : 0;

    // Query onchain attestations from ponder schema using raw SQL
    let onchainAttestations: any[] = [];
    try {
      const result = await offchainDb.execute(
        sql`SELECT * FROM public.attestation LIMIT ${limit} OFFSET ${offset}`
      );
      onchainAttestations = result.rows || [];
    } catch (e) {
      console.error("Error querying onchain attestations:", e);
    }

    // Query offchain attestations
    let offchainAttestations: any[] = [];
    try {
      offchainAttestations = await offchainDb
        .select()
        .from(offchainSchema.attestation)
        .limit(limit)
        .offset(offset);
    } catch (e) {
      console.error("Error querying offchain attestations:", e);
    }

    // Merge and format results to match EAS GraphQL structure
    const formatAttestation = (a: any) => ({
      id: a.id,
      attester: a.attester,
      recipient: a.recipient,
      time: Number(a.time || 0),
      timeCreated: a.createdAt
        ? Math.floor(new Date(a.createdAt).getTime() / 1000)
        : Number(a.time || 0),
      refUID: a.refUID,
      data: a.data,
      decodedDataJson: a.decodedDataJson,
      isOffchain: a.isOffchain,
      schema: a.schema,
      expirationTime: Number(a.expirationTime || 0),
      revocable: a.revocable,
      revocationTime: a.revocationTime ? Number(a.revocationTime) : null,
    });

    const allAttestations = [
      ...onchainAttestations.map(formatAttestation),
      ...offchainAttestations.map(formatAttestation),
    ];

    // Sort by time (most recent first)
    allAttestations.sort((a, b) => b.time - a.time);

    return c.json({
      data: {
        attestations: allAttestations.slice(0, limit),
      },
    });
  } catch (error) {
    console.error("Error querying attestations:", error);
    return c.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

// Migration endpoint - creates the offchain schema and tables
app.post("/migrate", async (c) => {
  try {
    console.log("Creating offchain schema...");
    await offchainDb.execute(sql`CREATE SCHEMA IF NOT EXISTS offchain`);

    console.log("Creating attestation table...");
    await offchainDb.execute(sql`
      CREATE TABLE IF NOT EXISTS offchain.attestation (
        id TEXT PRIMARY KEY,
        attester TEXT NOT NULL,
        recipient TEXT NOT NULL,
        "refUID" TEXT,
        schema TEXT,
        time BIGINT,
        "expirationTime" BIGINT,
        revocable BOOLEAN,
        "revocationTime" BIGINT,
        data TEXT,
        "decodedDataJson" TEXT,
        "isOffchain" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP
      )
    `);

    return c.json({
      success: true,
      message: "Migration completed successfully",
    });
  } catch (error) {
    console.error("Migration failed:", error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

export default app;
