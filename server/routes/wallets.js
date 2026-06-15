// server/routes/wallets.js
import express from 'express';
import { pool } from '../database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET wallet balance for a user
router.get('/balance/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    console.log('💰 Fetching wallet balance for user:', userId);
    
    const [wallets] = await pool.query(
      'SELECT * FROM wallets WHERE user_id = ?',
      [userId]
    );
    
    if (wallets.length === 0) {
      // Create wallet if it doesn't exist
	  const walletId = uuidv4();
		const [result] = await pool.query(
		  'INSERT INTO wallets (id, user_id, balance, currency) VALUES (?, ?, 0, 'USD')',
		  [walletId, userId]
		);

      
      return res.json({
        success: true,
        balance: 0,
        currency: 'USD',
        wallet_id: result.insertId,
        message: 'New wallet created'
      });
    }
    
    const wallet = wallets[0];
    
    res.json({
      success: true,
      balance: parseFloat(wallet.balance),
      currency: wallet.currency,
      wallet_id: wallet.id
    });
    
  } catch (error) {
    console.error('❌ Wallet balance error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET wallet transactions
router.get('/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;
    
    console.log('📊 Fetching transactions for user:', userId);
    
    // First get wallet id
    const [wallets] = await pool.query(
      'SELECT id FROM wallets WHERE user_id = ?',
      [userId]
    );
    
    if (wallets.length === 0) {
      return res.json({
        success: true,
        transactions: [],
        message: 'No wallet found'
      });
    }
    
    const walletId = wallets[0].id;
    
    // Get transactions
    const [transactions] = await pool.query(
      `SELECT 
        wt.*,
        b.id as booking_id,
        b.booking_date,
        wp.name as worker_name
      FROM wallet_transactions wt
      LEFT JOIN bookings b ON wt.booking_id = b.id
      LEFT JOIN worker_profiles wp ON b.worker_id = wp.id
      WHERE wt.wallet_id = ?
      ORDER BY wt.created_at DESC
      LIMIT ?`,
      [walletId, parseInt(limit)]
    );
    
    res.json({
      success: true,
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.type, // 'credit', 'debit', 'escrow_hold', 'escrow_release'
        amount: parseFloat(t.amount),
        description: t.description,
        booking_id: t.booking_id,
        booking_date: t.booking_date,
        worker_name: t.worker_name,
        created_at: t.created_at
      }))
    });
    
  } catch (error) {
    console.error('❌ Transactions error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST add funds to wallet (for testing/demo)
router.post('/add-funds', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        error: 'userId and amount are required'
      });
    }
    
    console.log('➕ Adding funds to wallet:', { userId, amount });
    
    // Get or create wallet
    const [wallets] = await pool.query(
      'SELECT * FROM wallets WHERE user_id = ?',
      [userId]
    );
    
    let walletId;
    
    if (wallets.length === 0) {
		const walletId = uuidv4();
		const [result] = await pool.query(
		  'INSERT INTO wallets (id, user_id, balance, currency) VALUES (?, ?, ?, 'USD')',
		  [walletId, userId, amount]
		);
      /*const [result] = await pool.query(
        'INSERT INTO wallets (user_id, balance, currency) VALUES (?, ?, \'USD\')',
        [userId, amount]
      );*/
      walletId = result.insertId;
    } else {
      walletId = wallets[0].id;
      const newBalance = parseFloat(wallets[0].balance) + parseFloat(amount);
      
      await pool.query(
        'UPDATE wallets SET balance = ? WHERE id = ?',
        [newBalance, walletId]
      );
    }
    
    // Create transaction record
    await pool.query(
      `INSERT INTO wallet_transactions 
        (wallet_id, type, amount, description, created_at)
      VALUES (?, 'credit', ?, 'Manual fund addition', NOW())`,
      [walletId, amount]
    );
    
    const [updatedWallet] = await pool.query(
      'SELECT balance FROM wallets WHERE id = ?',
      [walletId]
    );
    
    res.json({
      success: true,
      new_balance: parseFloat(updatedWallet[0].balance),
      message: `$${amount} added to wallet`
    });
    
  } catch (error) {
    console.error('❌ Add funds error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Make sure this endpoint properly handles the amount
router.post('/stripe-success', async (req, res) => {
  const { userId, amount, sessionId } = req.body;
  
  console.log('💰 Processing Stripe success:', { userId, amount, sessionId });
  
  // IMPORTANT: Convert amount to number and validate
  const depositAmount = parseFloat(amount);
  if (isNaN(depositAmount) || depositAmount <= 0) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid amount' 
    });
  }
  
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    // Check if already processed
    const [existing] = await connection.query(
      'SELECT id FROM wallet_transactions WHERE description LIKE ?',
      [`%${sessionId}%`]
    );
    
    if (existing.length > 0) {
      return res.json({ success: true, message: 'Already processed' });
    }
    
    // Get user's wallet
    const [wallets] = await connection.query(
      'SELECT id, balance FROM wallets WHERE user_id = ?',
      [userId]
    );
    
    let walletId;
    let newBalance;
    
    if (wallets.length === 0) {
      // Create wallet if doesn't exist
	  const walletId = uuidv4();
		const [result] = await pool.query(
		  'INSERT INTO wallets (id, user_id, balance, currency) VALUES (?, ?, ?, 'USD')',
		  [walletId, userId, depositAmount]
		);
      /*const [result] = await connection.query(
        'INSERT INTO wallets (user_id, balance, currency) VALUES (?, ?, \'USD\')',
        [userId, depositAmount]
      );*/
      walletId = result.insertId;
      newBalance = depositAmount;
    } else {
      walletId = wallets[0].id;
      newBalance = parseFloat(wallets[0].balance) + depositAmount;
      
      await connection.query(
        'UPDATE wallets SET balance = ? WHERE id = ?',
        [newBalance, walletId]
      );
    }
    
    // Create transaction record with CORRECT amount
    await connection.query(
      `INSERT INTO wallet_transactions 
       (wallet_id, type, amount, description, created_at)
       VALUES (?, 'deposit', ?, ?, NOW())`,
      [walletId, depositAmount, `Stripe deposit: ${sessionId}`]
    );
    
    await connection.commit();
    
    console.log(`✅ Wallet updated: +$${depositAmount} for user ${userId}`);
    
    res.json({ 
      success: true, 
      new_balance: newBalance 
    });
    
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Error updating wallet:', error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) connection.release();
  }
});
export default router;