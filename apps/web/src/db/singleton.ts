import postgres from "postgres";
import { dbConfig } from "@/config/env-db";

let dbClient: postgres.Sql | null = null;

export function initializeDb(): postgres.Sql {
  if (dbClient) return dbClient;

  const isPgBouncer =
    dbConfig.postgresUrl.includes("pgbouncer=true") || dbConfig.postgresUrl.includes(":6543");

  dbClient = postgres(dbConfig.postgresUrl, {
    max: dbConfig.isProduction ? 5 : 1,
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    prepare: !isPgBouncer,
  });

  return dbClient;
}

export function getDbClient(): postgres.Sql {
  if (!dbClient) {
    throw new Error("Database not initialized. Call initializeDb() in app startup.");
  }
  return dbClient;
}
