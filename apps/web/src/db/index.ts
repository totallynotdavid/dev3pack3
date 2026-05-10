import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.ts";

declare global {
  var __postgresClient: ReturnType<typeof postgres> | undefined;
}

const isPgBouncer =
  process.env.POSTGRES_URL?.includes("pgbouncer=true") ||
  process.env.POSTGRES_URL?.includes(":6543");

const client =
  globalThis.__postgresClient ??
  postgres(process.env.POSTGRES_URL!, {
    max: process.env.NODE_ENV === "production" ? 5 : 1,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    prepare: !isPgBouncer,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__postgresClient = client;
}

export const db = drizzle(client, { schema });
export type Database = typeof db;

export default db;
