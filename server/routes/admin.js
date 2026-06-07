// server/routes/admin.js
/*
import { pool } from '../database.js';
import { logAudit } from '../middleware/audit.js';  // 🔴 ADD THIS LINE
import sendEmail from '../config/email.js';
import { withdrawalStatusEmail } from '../templates/emails.js';

const router = express.Router();

// GET all users (clients)
router.get('/users', async (req, res) => {
  try {
    console.log('📥 GET /api/admin/users');
    
    const [users] = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.email,
        c.phone,
        c.created_at,
        c.status,                -- 🔴 ADD THIS
        c.suspension_reason,      -- 🔴 ADD THIS
        c.suspended_at,           -- 🔴 ADD THIS
        COALESCE(w.balance, 0) as wallet_balance,
        (SELECT COUNT(*) FROM bookings WHERE client_id = c.id AND deleted_at IS NULL) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE client_id = c.id AND status = 'completed' AND deleted_at IS NULL) as completed_bookings
      FROM clients c
      LEFT JOIN wallets w ON c.id = w.user_id
      WHERE c.deleted_at IS NULL
      ORDER BY c.created_at DESC
    `);
    
    console.log(`✅ Found ${users.length} users`);
    console.log('📊 Sample user status:', users[0]?.status); // Debug log
    
    res.json({
      success: true,
      users: users || []
    });
    
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET all workers
router.get('/workers', async (req, res) => {
  try {
    console.log('📥 GET /api/admin/workers');
    
    const [workers] = await pool.query(`
      SELECT 
        wp.id,
        wp.name,
        wp.category,
        wp.is_verified,
        wp.stripe_connected,
        wp.created_at,
        wp.status,                -- 🔴 ADD THIS
        wp.suspension_reason,      -- 🔴 ADD THIS
        wp.suspended_at,           -- 🔴 ADD THIS
        COALESCE(w.balance, 0) as wallet_balance,
        (SELECT COUNT(*) FROM bookings WHERE worker_id = wp.id) as total_jobs,
        (SELECT COUNT(*) FROM bookings WHERE worker_id = wp.id AND status = 'completed') as completed_jobs,
        (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE worker_id = wp.id AND status = 'completed') as total_earnings
      FROM worker_profiles wp
      LEFT JOIN wallets w ON wp.id = w.user_id
      ORDER BY wp.created_at DESC
    `);
    
    console.log(`✅ Found ${workers.length} workers`);
    console.log('📊 Sample worker status:', workers[0]?.status); // Debug log
    
    res.json({
      success: true,
      workers: workers || []
    });
    
  } catch (error) {
    console.error('❌ Error fetching workers:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET platform statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('📥 GET /api/admin/stats');
    
    // Total users
    const [userCount] = await pool.query('SELECT COUNT(*) as count FROM clients');
    
    // Total workers
    const [workerCount] = await pool.query('SELECT COUNT(*) as count FROM worker_profiles');
    
    // Total bookings
    const [bookingStats] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'pending' OR status = 'offer_pending' THEN 1 ELSE 0 END) as pending
      FROM bookings
    `);
    
    // Total revenue (platform commission)
    const [revenue] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total_commission
      FROM wallet_transactions
      WHERE type = 'commission'
    `);
    
    // Pending withdrawals count
    const [pendingWithdrawals] = await pool.query(`
      SELECT COUNT(*) as count
      FROM withdrawals
      WHERE status = 'pending'
    `);
    
    const stats = {
      total_users: userCount[0].count || 0,
      total_workers: workerCount[0].count || 0,
      total_bookings: bookingStats[0]?.total || 0,
      completed_bookings: bookingStats[0]?.completed || 0,
      in_progress_bookings: bookingStats[0]?.in_progress || 0,
      pending_bookings: bookingStats[0]?.pending || 0,
      total_commission: parseFloat(revenue[0]?.total_commission || 0),
      pending_withdrawals: pendingWithdrawals[0]?.count || 0
    };
    
    console.log('✅ Stats calculated:', stats);
    
    res.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// SUSPEND USER (client)
router.post('/users/:userId/suspend', async (req, res) => {
  const { userId } = req.params;
  const { reason, adminId, duration } = req.body; // duration in days, optional
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Check if user exists
    const [users] = await connection.query(
      'SELECT name, email FROM clients WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    const user = users[0];
    
    // Update user status
    await connection.query(
      `UPDATE clients 
       SET status = 'suspended', 
           suspension_reason = ?,
           suspended_at = NOW(),
           suspended_by = ?
       WHERE id = ?`,
      [reason || 'No reason provided', adminId, userId]
    );
    
    // Log to audit
    await logAudit({
      userId: adminId,
      action: 'SUSPEND_USER',
      entityType: 'client',
      entityId: userId,
      newValues: { status: 'suspended', reason, suspended_by: adminId },
      req
    });
    
    console.log(`✅ User ${user.email} suspended by admin ${adminId}`);
    
    res.json({
      success: true,
      message: `User ${user.name} has been suspended.`,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        status: 'suspended'
      }
    });
    
  } catch (error) {
    console.error('❌ Suspend user error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) connection.release();
  }
});

// UNSUSPEND USER (reactivate)
router.post('/users/:userId/unsuspend', async (req, res) => {
  const { userId } = req.params;
  const { adminId } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [users] = await connection.query(
      'SELECT name, email FROM clients WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    const user = users[0];
    
    await connection.query(
      `UPDATE clients 
       SET status = 'active', 
           suspension_reason = NULL,
           suspended_at = NULL,
           suspended_by = NULL
       WHERE id = ?`,
      [userId]
    );
    
    await logAudit({
      userId: adminId,
      action: 'UNSUSPEND_USER',
      entityType: 'client',
      entityId: userId,
      newValues: { status: 'active' },
      req
    });
    
    console.log(`✅ User ${user.email} unsuspended by admin ${adminId}`);
    
    res.json({
      success: true,
      message: `User ${user.name} has been reactivated.`
    });
    
  } catch (error) {
    console.error('❌ Unsuspend user error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) connection.release();
  }
});

// SUSPEND WORKER - UPDATED with connection handling and audit log
router.post('/workers/:workerId/suspend', async (req, res) => {
  const { workerId } = req.params;
  const { reason, adminId } = req.body;
  
  let connection;  // 🔴 ADD THIS
  try {
    connection = await pool.getConnection();  // 🔴 ADD THIS
    
    const [workers] = await connection.query(
      'SELECT name FROM worker_profiles WHERE id = ?',
      [workerId]
    );
    
    if (workers.length === 0) {
      connection.release();  // 🔴 ADD THIS
      return res.status(404).json({ 
        success: false, 
        error: 'Worker not found' 
      });
    }
    
    const worker = workers[0];
    
    await connection.query(
      `UPDATE worker_profiles 
       SET status = 'suspended', 
           suspension_reason = ?,
           suspended_at = NOW(),
           suspended_by = ?
       WHERE id = ?`,
      [reason || 'No reason provided', adminId, workerId]
    );
    
    // 🔴 ADD AUDIT LOG
    await logAudit({
      userId: adminId,
      action: 'SUSPEND_WORKER',
      entityType: 'worker',
      entityId: workerId,
      newValues: { status: 'suspended', reason, suspended_by: adminId },
      req
    });
    
    connection.release();  // 🔴 ADD THIS
    
    console.log(`✅ Worker ${worker.name} suspended by admin ${adminId}`);
    
    res.json({
      success: true,
      message: `Worker ${worker.name} has been suspended.`
    });
    
  } catch (error) {
    if (connection) connection.release();  // 🔴 ADD THIS
    console.error('❌ Suspend worker error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// UNSUSPEND WORKER - UPDATED with connection handling and audit log
router.post('/workers/:workerId/unsuspend', async (req, res) => {
  const { workerId } = req.params;
  const { adminId } = req.body;
  
  let connection;  // 🔴 ADD THIS
  try {
    connection = await pool.getConnection();  // 🔴 ADD THIS
    
    const [workers] = await connection.query(
      'SELECT name FROM worker_profiles WHERE id = ?',
      [workerId]
    );
    
    const worker = workers[0];
    
    await connection.query(
      `UPDATE worker_profiles 
       SET status = 'active', 
           suspension_reason = NULL,
           suspended_at = NULL,
           suspended_by = NULL
       WHERE id = ?`,
      [workerId]
    );
    
    // 🔴 ADD AUDIT LOG
    await logAudit({
      userId: adminId,
      action: 'UNSUSPEND_WORKER',
      entityType: 'worker',
      entityId: workerId,
      newValues: { status: 'active' },
      req
    });
    
    connection.release();  // 🔴 ADD THIS
    
    res.json({
      success: true,
      message: `Worker ${worker.name} has been reactivated.`
    });
    
  } catch (error) {
    if (connection) connection.release();  // 🔴 ADD THIS
    console.error('❌ Unsuspend worker error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
export default router;*/

// server/routes/admin.js
import express from 'express';
import { pool } from '../database.js';
import { logAudit } from '../middleware/audit.js';
import sendEmail from '../config/email.js';
import { withdrawalStatusEmail } from '../templates/emails.js';

const router = express.Router();

// GET all users (clients)
router.get('/users', async (req, res) => {
  try {
    console.log('📥 GET /api/admin/users');
    
    const [users] = await pool.query(`
      SELECT 
        c.id,
        c.name,
        c.email,
        c.phone,
        c.created_at,
        c.status,
        c.suspension_reason,
        c.suspended_at,
        COALESCE(w.balance, 0) as wallet_balance,
        (SELECT COUNT(*) FROM bookings WHERE client_id = c.id AND deleted_at IS NULL) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE client_id = c.id AND status = 'completed' AND deleted_at IS NULL) as completed_bookings
      FROM clients c
      LEFT JOIN wallets w ON c.id = w.user_id
      WHERE c.deleted_at IS NULL
      ORDER BY c.created_at DESC
    `);
    
    console.log(`✅ Found ${users.length} users`);
    console.log('📊 Sample user status:', users[0]?.status);
    
    res.json({
      success: true,
      users: users || []
    });
    
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET all workers
router.get('/workers', async (req, res) => {
  try {
    console.log('📥 GET /api/admin/workers');
    
    const [workers] = await pool.query(`
      SELECT 
        wp.id,
        wp.name,
        wp.category,
        wp.is_verified,
        wp.stripe_connected,
        wp.created_at,
        wp.status,
        wp.suspension_reason,
        wp.suspended_at,
        COALESCE(w.balance, 0) as wallet_balance,
        (SELECT COUNT(*) FROM bookings WHERE worker_id = wp.id) as total_jobs,
        (SELECT COUNT(*) FROM bookings WHERE worker_id = wp.id AND status = 'completed') as completed_jobs,
        (SELECT COALESCE(SUM(total_amount), 0) FROM bookings WHERE worker_id = wp.id AND status = 'completed') as total_earnings
      FROM worker_profiles wp
      LEFT JOIN wallets w ON wp.id = w.user_id
      ORDER BY wp.created_at DESC
    `);
    
    console.log(`✅ Found ${workers.length} workers`);
    console.log('📊 Sample worker status:', workers[0]?.status);
    
    res.json({
      success: true,
      workers: workers || []
    });
    
  } catch (error) {
    console.error('❌ Error fetching workers:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET platform statistics
router.get('/stats', async (req, res) => {
  try {
    console.log('📥 GET /api/admin/stats');
    
    const [userCount] = await pool.query('SELECT COUNT(*) as count FROM clients');
    const [workerCount] = await pool.query('SELECT COUNT(*) as count FROM worker_profiles');
    
    const [bookingStats] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'pending' OR status = 'offer_pending' THEN 1 ELSE 0 END) as pending
      FROM bookings
    `);
    
    const [revenue] = await pool.query(`
      SELECT COALESCE(SUM(amount), 0) as total_commission
      FROM wallet_transactions
      WHERE type = 'commission'
    `);
    
    const [pendingWithdrawals] = await pool.query(`
      SELECT COUNT(*) as count
      FROM withdrawals
      WHERE status = 'pending'
    `);
    
    const stats = {
      total_users: userCount[0].count || 0,
      total_workers: workerCount[0].count || 0,
      total_bookings: bookingStats[0]?.total || 0,
      completed_bookings: bookingStats[0]?.completed || 0,
      in_progress_bookings: bookingStats[0]?.in_progress || 0,
      pending_bookings: bookingStats[0]?.pending || 0,
      total_commission: parseFloat(revenue[0]?.total_commission || 0),
      pending_withdrawals: pendingWithdrawals[0]?.count || 0
    };
    
    console.log('✅ Stats calculated:', stats);
    
    res.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// SUSPEND USER (client)
router.post('/users/:userId/suspend', async (req, res) => {
  const { userId } = req.params;
  const { reason, adminId } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [users] = await connection.query(
      'SELECT name, email FROM clients WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    const user = users[0];
    
    await connection.query(
      `UPDATE clients 
       SET status = 'suspended', 
           suspension_reason = ?,
           suspended_at = NOW(),
           suspended_by = ?
       WHERE id = ?`,
      [reason || 'No reason provided', adminId, userId]
    );
    
    await logAudit({
      userId: adminId,
      action: 'SUSPEND_USER',
      entityType: 'client',
      entityId: userId,
      newValues: { status: 'suspended', reason, suspended_by: adminId },
      req
    });
    
    console.log(`✅ User ${user.email} suspended by admin ${adminId}`);
    
    res.json({
      success: true,
      message: `User ${user.name} has been suspended.`,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        status: 'suspended'
      }
    });
    
  } catch (error) {
    console.error('❌ Suspend user error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) connection.release();
  }
});

// UNSUSPEND USER (reactivate)
router.post('/users/:userId/unsuspend', async (req, res) => {
  const { userId } = req.params;
  const { adminId } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [users] = await connection.query(
      'SELECT name, email FROM clients WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    const user = users[0];
    
    await connection.query(
      `UPDATE clients 
       SET status = 'active', 
           suspension_reason = NULL,
           suspended_at = NULL,
           suspended_by = NULL
       WHERE id = ?`,
      [userId]
    );
    
    await logAudit({
      userId: adminId,
      action: 'UNSUSPEND_USER',
      entityType: 'client',
      entityId: userId,
      newValues: { status: 'active' },
      req
    });
    
    console.log(`✅ User ${user.email} unsuspended by admin ${adminId}`);
    
    res.json({
      success: true,
      message: `User ${user.name} has been reactivated.`
    });
    
  } catch (error) {
    console.error('❌ Unsuspend user error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) connection.release();
  }
});

// SUSPEND WORKER
router.post('/workers/:workerId/suspend', async (req, res) => {
  const { workerId } = req.params;
  const { reason, adminId } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [workers] = await connection.query(
      'SELECT name FROM worker_profiles WHERE id = ?',
      [workerId]
    );
    
    if (workers.length === 0) {
      connection.release();
      return res.status(404).json({ 
        success: false, 
        error: 'Worker not found' 
      });
    }
    
    const worker = workers[0];
    
    await connection.query(
      `UPDATE worker_profiles 
       SET status = 'suspended', 
           suspension_reason = ?,
           suspended_at = NOW(),
           suspended_by = ?
       WHERE id = ?`,
      [reason || 'No reason provided', adminId, workerId]
    );
    
    await logAudit({
      userId: adminId,
      action: 'SUSPEND_WORKER',
      entityType: 'worker',
      entityId: workerId,
      newValues: { status: 'suspended', reason, suspended_by: adminId },
      req
    });
    
    connection.release();
    
    console.log(`✅ Worker ${worker.name} suspended by admin ${adminId}`);
    
    res.json({
      success: true,
      message: `Worker ${worker.name} has been suspended.`
    });
    
  } catch (error) {
    if (connection) connection.release();
    console.error('❌ Suspend worker error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// UNSUSPEND WORKER
router.post('/workers/:workerId/unsuspend', async (req, res) => {
  const { workerId } = req.params;
  const { adminId } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [workers] = await connection.query(
      'SELECT name FROM worker_profiles WHERE id = ?',
      [workerId]
    );
    
    const worker = workers[0];
    
    await connection.query(
      `UPDATE worker_profiles 
       SET status = 'active', 
           suspension_reason = NULL,
           suspended_at = NULL,
           suspended_by = NULL
       WHERE id = ?`,
      [workerId]
    );
    
    await logAudit({
      userId: adminId,
      action: 'UNSUSPEND_WORKER',
      entityType: 'worker',
      entityId: workerId,
      newValues: { status: 'active' },
      req
    });
    
    connection.release();
    
    res.json({
      success: true,
      message: `Worker ${worker.name} has been reactivated.`
    });
    
  } catch (error) {
    if (connection) connection.release();
    console.error('❌ Unsuspend worker error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// 🔴 NEW: Process withdrawal endpoint (add this before export default)
router.post('/withdrawals/:withdrawalId/process', async (req, res) => {
  const { withdrawalId } = req.params;
  const { action, adminId, reason } = req.body; // action: 'approve' or 'reject'
  
  let connection;
  try {
    console.log(`💰 Processing withdrawal #${withdrawalId} - ${action}`);
    
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    // Get withdrawal details with worker info
    const [withdrawals] = await connection.query(
      `SELECT w.*, wp.name as worker_name, wp.contact_email 
       FROM withdrawals w
       JOIN worker_profiles wp ON w.worker_id = wp.id
       WHERE w.id = ? AND w.status = 'pending'`,
      [withdrawalId]
    );
    
    if (withdrawals.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        error: 'Withdrawal not found or already processed'
      });
    }
    
    const withdrawal = withdrawals[0];
    
    if (action === 'reject') {
      // Refund to worker's wallet
      const [wallets] = await connection.query(
        'SELECT id, balance FROM wallets WHERE user_id = ?',
        [withdrawal.worker_id]
      );
      
      if (wallets.length > 0) {
        const wallet = wallets[0];
        const newBalance = parseFloat(wallet.balance) + parseFloat(withdrawal.amount);
        
        await connection.query(
          'UPDATE wallets SET balance = ? WHERE id = ?',
          [newBalance, wallet.id]
        );
        
        await connection.query(
          `INSERT INTO wallet_transactions 
           (wallet_id, type, amount, description, created_at)
           VALUES (?, 'withdrawal_refund', ?, ?, NOW())`,
          [wallet.id, withdrawal.amount, `Withdrawal #${withdrawalId} rejected - funds returned`]
        );
      }
      
      await connection.query(
        'UPDATE withdrawals SET status = ?, processed_at = NOW(), notes = ? WHERE id = ?',
        ['rejected', reason || 'Rejected by admin', withdrawalId]
      );
      
      console.log(`❌ Withdrawal #${withdrawalId} rejected`);
      
    } else {
      // APPROVE - process via Stripe (if Stripe Connect is set up)
      // For now, we'll just mark as completed
      
      await connection.query(
        `UPDATE withdrawals 
         SET status = 'completed', 
             processed_at = NOW()
         WHERE id = ?`,
        [withdrawalId]
      );
      
      console.log(`✅ Withdrawal #${withdrawalId} approved`);
    }
    
    await connection.commit();
    
    // 🔴 SEND EMAIL NOTIFICATION
    try {
      if (withdrawal.contact_email) {
        const emailResult = await sendEmail({
          to: withdrawal.contact_email,
          ...withdrawalStatusEmail(
            withdrawal.worker_name,
            withdrawal.amount,
            action,
            action === 'reject' ? reason : ''
          )
        });
        console.log(`📧 Withdrawal ${action} email sent:`, emailResult.success);
      }
    } catch (emailError) {
      console.error('❌ Withdrawal email failed:', emailError);
    }
    
    // 🔴 CREATE IN-APP NOTIFICATION
    try {
      await connection.query(
        `INSERT INTO notifications 
         (id, user_id, type, title, message, created_at)
         VALUES (UUID(), ?, 'withdrawal_${action}', 
                 'Withdrawal ${action.charAt(0).toUpperCase() + action.slice(1)}', 
                 CONCAT('Your withdrawal request for $', ?, ' has been ', ?), 
                 NOW())`,
        [withdrawal.worker_id, withdrawal.amount, action]
      );
      console.log(`🔔 In-app notification created for worker`);
    } catch (notifyError) {
      console.error('❌ In-app notification failed:', notifyError);
    }
    
    // Log to audit
    await logAudit({
      userId: adminId,
      action: `WITHDRAWAL_${action.toUpperCase()}`,
      entityType: 'withdrawal',
      entityId: withdrawalId,
      newValues: { status: action === 'approve' ? 'completed' : 'rejected' },
      req
    });
    
    res.json({
      success: true,
      message: `Withdrawal ${action === 'approve' ? 'approved' : 'rejected'} successfully`
    });
    
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('❌ Process withdrawal error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) connection.release();
  }
});

export default router;