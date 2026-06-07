// server/middleware/softDelete.js
// Helper functions for soft deletes

export const excludeDeleted = (tableAlias = '') => {
  const prefix = tableAlias ? `${tableAlias}.` : '';
  return `${prefix}deleted_at IS NULL`;
};

export const addSoftDeleteInterceptor = async (connection, table, id, deletedBy) => {
  await connection.query(
    `UPDATE ${table} SET deleted_at = NOW(), deleted_by = ? WHERE id = ?`,
    [deletedBy, id]
  );
};

// Usage example in your routes:
// const connection = await pool.getConnection();
// await addSoftDeleteInterceptor(connection, 'clients', userId, adminId);