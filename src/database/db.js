import * as SQLite from 'expo-sqlite';

let databasePromise;
let initializationPromise;

const sampleEquipment = [
  ['Balanza electrónica de plataforma', 'Báscula', 'Carril 1', 'Operativo'],
  ['Semáforo de control vehicular', 'Señalización', 'Carril 2', 'Operativo'],
  ['Cámara de reconocimiento de placas', 'Seguridad', 'Acceso principal', 'Operativo'],
  ['Barrera automática de peaje', 'Peaje', 'Caseta 1', 'En mantenimiento'],
  ['Sensor de peso vehicular', 'Báscula', 'Carril 3', 'Operativo'],
  ['Terminal de registro de turno', 'Informática', 'Oficina de control', 'Fuera de servicio'],
];

export const getDatabase = () => {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('mantenimiento.db');
  }

  return databasePromise;
};

export const initializeDatabase = () => {
  if (!initializationPromise) {
    initializationPromise = (async () => {
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

      const [{ count }] = await db.getAllAsync('SELECT COUNT(*) AS count FROM equipment');

      if (count === 0) {
        const createdAt = new Date().toISOString();

        for (const [name, category, location, status] of sampleEquipment) {
          await db.runAsync(
            `INSERT INTO equipment
              (name, category, location, status, created_at, sync_status, sync_operation)
             VALUES (?, ?, ?, ?, ?, 'synced', 'create')`,
            name,
            category,
            location,
            status,
            createdAt
          );
        }
      }

      return db;
    })().catch((error) => {
      initializationPromise = undefined;
      throw error;
    });
  }

  return initializationPromise;
};