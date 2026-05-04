import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'finance.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');

  _db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      expenseType TEXT,
      category TEXT NOT NULL,
      note TEXT,
      isSubscription INTEGER NOT NULL DEFAULT 0,
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stocks (
      id TEXT PRIMARY KEY,
      ticker TEXT NOT NULL,
      shares REAL NOT NULL,
      avgPrice REAL NOT NULL,
      currentPrice REAL NOT NULL DEFAULT 0,
      updatedAt INTEGER NOT NULL
    );
  `);

  return _db;
}
