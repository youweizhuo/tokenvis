import path from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import { spans, traces } from "./schema";

const databasePath = path.resolve(process.cwd(), "sqlite.db");

const sqlite = new Database(databasePath);
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema: { traces, spans } });
export { sqlite };
