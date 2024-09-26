import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { config } from "../config";

let db: Awaited<ReturnType<typeof open>> | null = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: config.database.url,
      driver: sqlite3.Database,
    });
    await db.exec(`
      CREATE TABLE IF NOT EXISTS members (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        github_account TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  return db;
}
