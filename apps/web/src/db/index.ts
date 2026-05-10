import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { dbConfig } from "@/config/env-db";
import * as schema from "./schema.ts";

declare global {
  var postgresClientCache: ReturnType<typeof postgres> | undefined;
}

const isPgBouncer =
  dbConfig.postgresUrl.includes("pgbouncer=true") || dbConfig.postgresUrl.includes(":6543");

const client =
  globalThis.postgresClientCache ??
  postgres(dbConfig.postgresUrl, {
    max: dbConfig.isProduction ? 5 : 1,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    prepare: !isPgBouncer,
  });

if (!dbConfig.isProduction) {
  globalThis.postgresClientCache = client;
}

export const db = drizzle(client, { schema });
export type Database = typeof db;

export default db;
