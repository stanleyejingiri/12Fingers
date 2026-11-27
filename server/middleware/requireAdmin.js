// server/middleware/requireAdmin.js
// Verifies the caller is a valid admin user.

import { pool } from '../database.js';

export const requireAdmin = async (req, res, next) => {
  try {
    const adminId =
      req.headers['x-admin-id'] ||
      req.headers['x-user-id'] ||
      req.body?.adminId ||
      req.body?.admin_id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        error: 'Admin authentication required'
      });
    }

    const [rows] = await pool.query(
      'SELECT id, name, email, status, is_admin FROM clients WHERE id = ?',
      [adminId]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Admin user not found'
      });
    }

    const admin = rows[0];

    if (admin.status && admin.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Admin account is inactive'
      });
    }

    if (!admin.is_admin) {
      console.warn(`⚠️ Non-admin tried to access admin endpoint: ${adminId} (${admin.email})`);
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }

    req.admin = admin;
    console.log(`✅ Admin auth OK: ${admin.name} (${adminId})`);
    next();
  } catch (error) {
    console.error('❌ requireAdmin error:', error);
    res.status(500).json({
      success: false,
      error: 'Admin authentication check failed'
    });
  }
};