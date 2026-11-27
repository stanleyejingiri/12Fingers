// server/middleware/requireAuth.js
// Verifies that the caller is a valid, active user (client or worker).
// Does NOT verify admin role — see requireAdmin.js for that.

import { pool } from '../database.js';

export const requireAuth = async (req, res, next) => {
  try {
    // Trust hierarchy:
    // 1. x-user-id header (future JWT will go here)
    // 2. req.body.user_id / client_id / worker_id (current frontend pattern)
    const userId =
      req.headers['x-user-id'] ||
      req.body?.user_id ||
      req.body?.client_id ||
      req.body?.worker_id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Look up in clients first, then worker_profiles
    const [clients] = await pool.query(
      'SELECT id, name, email, status FROM clients WHERE id = ?',
      [userId]
    );

    let user = null;
    let userType = null;

    if (clients.length > 0) {
      user = clients[0];
      userType = 'client';
    } else {
      const [workers] = await pool.query(
        'SELECT id, name, contact_email AS email, status FROM worker_profiles WHERE id = ?',
        [userId]
      );
      if (workers.length > 0) {
        user = workers[0];
        userType = 'worker';
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.status && user.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Account is suspended or inactive'
      });
    }

    // Attach authenticated user to request
    req.auth = { user, userType };
    next();
  } catch (error) {
    console.error('❌ requireAuth error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication check failed'
    });
  }
};

/**
 * Stricter variant: only allows a user to act as themselves.
 * Prevents client A from calling an endpoint with client_id = client B.
 *
 * Usage:
 *   router.post('/:id/accept', requireAuth, requireSelf('worker_id'), ...)
 *   will assert that req.body.worker_id === req.auth.user.id
 */
export const requireSelf = (bodyField) => (req, res, next) => {
  const claimedId = req.body?.[bodyField];
  if (!claimedId) {
    return res.status(400).json({
      success: false,
      error: `${bodyField} is required in request body`
    });
  }
  if (claimedId !== req.auth.user.id) {
    return res.status(403).json({
      success: false,
      error: 'You can only perform this action as yourself'
    });
  }
  next();
};