// server/routes/withdrawals.js
import express from 'express';
import { pool } from '../database.js';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// GET worker's withdrawal history
router.get('/worker/:workerId', async (req, res) => {
  const { workerId } = req.params;
  
  try {
    console.log(`📥 GET /api/withdrawals/worker/${workerId}`);
    
    const [withdrawals] = await pool.query(
      `SELECT * FROM withdrawals 
       WHERE worker_id = ? 
       ORDER BY requested_at DESC`,
      [workerId]
    );
    
    res.json({
      success: true,
      withdrawals: withdrawals || []
    });
    
  } catch (error) {
    console.error('❌ Error fetching withdrawals:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST request withdrawal
router.post('/request', async (req, res) => {
  const { worker_id, amount } = req.body;
  
  let connection;
  try {
    console.log(`💰 Withdrawal request: worker ${worker_id} - $${amount}`);
    
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    // Check worker has stripe account connected
    const [workers] = await connection.query(
      'SELECT stripe_account_id, stripe_connected FROM worker_profiles WHERE id = ?',
      [worker_id]
    );
    
    if (workers.length === 0 || !workers[0].stripe_connected) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        error: 'Please connect your Stripe account first'
      });
    }
    
    const stripeAccountId = workers[0].stripe_account_id;
    
    // Check worker's wallet balance
    const [wallets] = await connection.query(
      'SELECT id, balance FROM wallets WHERE user_id = ?',
      [worker_id]
    );
    
    if (wallets.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        error: 'Wallet not found'
      });
    }
    
    const wallet = wallets[0];
    const currentBalance = parseFloat(wallet.balance);
    
    if (currentBalance < amount) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        error: `Insufficient balance. Available: $${currentBalance}`
      });
    }
    
    // Minimum withdrawal amount (e.g., $10)
    if (amount < 10) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        error: 'Minimum withdrawal amount is $10'
      });
    }
    
    // Create withdrawal record
    const [result] = await connection.query(
      `INSERT INTO withdrawals 
       (worker_id, amount, status, requested_at)
       VALUES (?, ?, 'pending', NOW())`,
      [worker_id, amount]
    );
    
    const withdrawalId = result.insertId;
    
    // Deduct from wallet immediately (or hold)
    const newBalance = currentBalance - amount;
    await connection.query(
      'UPDATE wallets SET balance = ? WHERE id = ?',
      [newBalance, wallet.id]
    );
    
    // Create transaction record
    await connection.query(
      `INSERT INTO wallet_transactions 
       (wallet_id, type, amount, description, created_at)
       VALUES (?, 'withdrawal_pending', ?, ?, NOW())`,
      [wallet.id, amount, `Withdrawal request #${withdrawalId}`]
    );
    
    await connection.commit();
    
    console.log(`✅ Withdrawal request #${withdrawalId} created for $${amount}`);
    
    res.json({
      success: true,
      withdrawal_id: withdrawalId,
      message: 'Withdrawal request submitted successfully',
      new_balance: newBalance
    });
    
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('❌ Withdrawal request error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

// Admin: Process withdrawal (approve and send via Stripe)
router.post('/process/:withdrawalId', async (req, res) => {
  const { withdrawalId } = req.params;
  const { admin_id, action } = req.body; // action: 'approve' or 'reject'
  
  let connection;
  try {
    console.log(`⚙️ Processing withdrawal #${withdrawalId} - ${action}`);
    
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    // Get withdrawal details
    const [withdrawals] = await connection.query(
      `SELECT w.*, wp.stripe_account_id 
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
        ['rejected', req.body.reason || 'Rejected by admin', withdrawalId]
      );
      
      await connection.commit();
      
      return res.json({
        success: true,
        message: 'Withdrawal rejected and funds returned'
      });
    }
    
    // APPROVE - process via Stripe
    if (!withdrawal.stripe_account_id) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        error: 'Worker has no Stripe account connected'
      });
    }
    
    // Create Stripe transfer
    const transfer = await stripe.transfers.create({
      amount: Math.round(withdrawal.amount * 100), // in cents
      currency: 'usd',
      destination: withdrawal.stripe_account_id,
      metadata: {
        withdrawal_id: withdrawalId,
        worker_id: withdrawal.worker_id
      }
    });
    
    console.log('✅ Stripe transfer created:', transfer.id);
    
    // Update withdrawal record
    await connection.query(
      `UPDATE withdrawals 
       SET status = 'completed', 
           stripe_transfer_id = ?,
           processed_at = NOW()
       WHERE id = ?`,
      [transfer.id, withdrawalId]
    );
    
    await connection.commit();
    
    res.json({
      success: true,
      message: 'Withdrawal processed successfully',
      transfer_id: transfer.id
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

// GET pending withdrawals (for admin)
router.get('/pending', async (req, res) => {
  try {
    console.log('📥 GET /api/withdrawals/pending');
    
    const [withdrawals] = await pool.query(
      `SELECT w.*, wp.name as worker_name 
       FROM withdrawals w
       JOIN worker_profiles wp ON w.worker_id = wp.id
       WHERE w.status = 'pending'
       ORDER BY w.requested_at ASC`,
      []
    );
    
    res.json({
      success: true,
      withdrawals: withdrawals || []
    });
    
  } catch (error) {
    console.error('❌ Error fetching pending withdrawals:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;