import * as SQLite from 'expo-sqlite';

let databasePromise;

export const getDatabase = () => {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('mantenimiento.db');
  }

  return databasePromise;
};

export const initializeDatabase = async () => {
  const db = await getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      sync_status TEXT NOT NULL DEFAULT 'pending',
      remote_id INTEGER,
      sync_operation TEXT NOT NULL DEFAULT 'create'
    );
  `);

  const columns = await db.getAllAsync('PRAGMA table_info(equipment)');
  const columnNames = columns.map((column) => column.name);

  if (!columnNames.includes('sync_status')) {
    await db.execAsync(
      "ALTER TABLE equipment ADD COLUMN sync_status TEXT NOT NULL DEFAULT 'pending'"
    );
  }

  if (!columnNames.includes('remote_id')) {
    await db.execAsync('ALTER TABLE equipment ADD COLUMN remote_id INTEGER');
  }

  if (!columnNames.includes('sync_operation')) {
    await db.execAsync(
      "ALTER TABLE equipment ADD COLUMN sync_operation TEXT NOT NULL DEFAULT 'create'"
    );
  }

  return db;
};