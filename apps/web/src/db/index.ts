import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { config } from "@/config/env";
import * as schema from "./schema.ts";

declare global {
  var postgresClientCache: ReturnType<typeof postgres> | undefined;
}

const isPgBouncer =
  config.db.postgresUrl.includes("pgbouncer=true") || config.db.postgresUrl.includes(":6543");

const client =
  globalThis.postgresClientCache ??
  postgres(config.db.postgresUrl, {
    max: config.app.isProduction ? 5 : 1,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    prepare: !isPgBouncer,
  });

if (!config.app.isProduction) {
  globalThis.postgresClientCache = client;
}

export const db = drizzle(client, { schema });
export type Database = typeof db;

export default db;
