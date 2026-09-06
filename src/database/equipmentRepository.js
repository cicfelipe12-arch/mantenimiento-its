import { initializeDatabase } from './db';

export const equipmentRepository = {
  async getAll() {
    const db = await initializeDatabase();

    return await db.getAllAsync(
      'SELECT * FROM equipment ORDER BY id DESC'
    );
  },

  async getPending() {
    const db = await initializeDatabase();

    return await db.getAllAsync(
      "SELECT * FROM equipment WHERE sync_status = 'pending' ORDER BY id ASC"
    );
  },

  async getById(id) {
    const db = await initializeDatabase();

    return await db.getFirstAsync(
      'SELECT * FROM equipment WHERE id = ?',
      id
    );
  },

  async create({
    name,
    category,
    location,
    status,
    syncStatus = 'pending',
  }) {
    const db = await initializeDatabase();
    const createdAt = new Date().toISOString();

    const result = await db.runAsync(
      `INSERT INTO equipment
        (name, category, location, status, created_at, sync_status, sync_operation)
       VALUES (?, ?, ?, ?, ?, ?, 'create')`,
      name,
      category,
      location,
      status,
      createdAt,
      syncStatus
    );

    return await this.getById(result.lastInsertRowId);
  },

  async markSynced(id, remoteId) {
    const db = await initializeDatabase();

    await db.runAsync(
      "UPDATE equipment SET sync_status = 'synced', remote_id = ? WHERE id = ?",
      remoteId,
      id
    );
  },

  async updateSyncStatus(id, syncStatus) {
    const db = await initializeDatabase();

    await db.runAsync(
      'UPDATE equipment SET sync_status = ? WHERE id = ?',
      syncStatus,
      id
    );
  },

  async update(id, { name, category, location, status }) {
    const db = await initializeDatabase();

    await db.runAsync(
      `UPDATE equipment
       SET name = ?, category = ?, location = ?, status = ?,
           sync_status = 'pending', sync_operation = 'update'
       WHERE id = ?`,
      name,
      category,
      location,
      status,
      id
    );

    return await this.getById(id);
  },

  async remove(id) {
    const db = await initializeDatabase();

    await db.runAsync('DELETE FROM equipment WHERE id = ?', id);
  },
};