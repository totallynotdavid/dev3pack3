import { drizzle } from "drizzle-orm/postgres-js";
import { initializeDb, getDbClient } from "./singleton";
import * as schema from "./schema.ts";

initializeDb();

export const db = drizzle(getDbClient(), { schema });
export type Database = typeof db;

export default db;
