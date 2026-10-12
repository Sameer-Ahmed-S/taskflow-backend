import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

// SQLite, embedded (ADR-005). The db file and migrations live in taskflow-db.
const dbPath = process.env.DATABASE_PATH
  || path.resolve(process.cwd(), '..', 'taskflow-db', 'taskflow.db');
const migrationsDir = process.env.MIGRATIONS_DIR
  || path.resolve(process.cwd(), '..', 'taskflow-db', 'migrations');

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`CREATE TABLE IF NOT EXISTS _migrations (
  name TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
)`);

const applied = new Set(db.prepare('SELECT name FROM _migrations').all().map((r) => r.name));
for (const file of fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()) {
  if (applied.has(file)) continue;
  db.exec(fs.readFileSync(path.join(migrationsDir, file), 'utf8'));
  db.prepare('INSERT INTO _migrations (name) VALUES (?)').run(file);
  console.log(`applied migration ${file}`);
}
