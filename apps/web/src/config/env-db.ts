import { type } from "arktype";

// Configuration boundary: DB runtime env parsing.
const dbEnvSchema = type({
  POSTGRES_URL: "string > 0",
  "NODE_ENV?": "string",
});

type DbConfig = {
  postgresUrl: string;
  isProduction: boolean;
};

export function loadDbConfig(env: Record<string, string | undefined> = process.env): DbConfig {
  const parsed = dbEnvSchema(env);
  if (parsed instanceof type.errors) {
    throw new Error(`Invalid DB environment configuration:\n- ${parsed.summary}`);
  }

  return {
    postgresUrl: parsed.POSTGRES_URL.trim(),
    isProduction: parsed.NODE_ENV === "production",
  };
}

export const dbConfig = Object.freeze(loadDbConfig());
