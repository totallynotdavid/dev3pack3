import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/db/schema.ts",
	out: "./migrations",
	dbCredentials: {
		url: process.env.POSTGRES_URL!,
	},
});
