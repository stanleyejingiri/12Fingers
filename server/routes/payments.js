// server/routes/payments.js
/*
import express from 'express';
import { pool } from '../database.js';
import sendEmail from '../config/email.js';
import { 
  paymentConfirmationClientEmail, 
  paymentConfirmationWorkerEmail 
} from '../templates/emails.js';

const router = express.Router();

// POST create escrow payment
router.post('/escrow', async (req, res) => {
  let connection;
  try {
    const {
      booking_id,
      amount,
      client_id,
      worker_id,
      payment_method = 'wallet'
    } = req.body;
    
    console.log('🔒 Creating escrow payment for booking:', booking_id);
    console.log('📦 Request body:', { booking_id, amount, client_id, worker_id, payment_method });
    
    // Validate required fields
    if (!booking_id || !amount || !client_id || !worker_id) {
      return res.status(400).json({
        success: false,
        error: 'booking_id, amount, client_id, and worker_id are required'
      });
    }
    
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    // Check if client has sufficient wallet balance
    const [wallets] = await connection.query(
      'SELECT id, balance FROM wallets WHERE user_id = ?',
      [client_id]
    );
    
    if (wallets.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        success: false,
        error: 'Client wallet not found'
      });
    }
    
    const wallet = wallets[0];
    const currentBalance = parseFloat(wallet.balance);
    const paymentAmount = parseFloat(amount);
    
    if (currentBalance < paymentAmount) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        success: false,
        error: `Insufficient funds. Available: $${currentBalance}, Required: $${paymentAmount}`
      });
    }
    
    // 1. Deduct amount from client wallet
    const newBalance = currentBalance - paymentAmount;
    await connection.query(
      'UPDATE wallets SET balance = ? WHERE id = ?',
      [newBalance, wallet.id]
    );
    
    // 2. Create transaction record for deduction
    await connection.query(
      `INSERT INTO wallet_transactions 
        (wallet_id, booking_id, type, amount, description, created_at)
      VALUES (?, ?, 'held_in_escrow', ?, ?, NOW())`,
      [wallet.id, booking_id, paymentAmount, `Escrow hold for booking #${booking_id}`]
    );
    
    // 3. Create escrow payment record
    const [paymentResult] = await connection.query(
      `INSERT INTO payments 
        (booking_id, amount, status, payment_method, created_at)
      VALUES (?, ?, 'held_in_escrow', ?, NOW())`,
      [booking_id, paymentAmount, payment_method]
    );
    
	const paymentId = paymentResult.insertId;
    
    // 4. Update booking status
    await connection.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      ['confirmed', booking_id]
    );
    
    await connection.commit();
    
    console.log('✅ Escrow payment created successfully:', paymentId);
    console.log('💰 Client new balance:', newBalance);
    
    // 🔴 NEW: Send email notifications and create in-app notifications
    try {
      // Get client details
      const [client] = await connection.query(
        'SELECT name, email FROM clients WHERE id = ?',
        [client_id]
      );
      
      // Get worker details
      const [worker] = await connection.query(
        'SELECT name, contact_email FROM worker_profiles WHERE id = ?',
        [worker_id]
      );
      
      // Send email to client
      if (client.length > 0) {
        const clientEmailResult = await sendEmail({
          to: client[0].email,
          ...paymentConfirmationClientEmail(
            client[0].name,
            paymentAmount,
            booking_id,
            worker[0]?.name || 'Worker'
          )
        });
        console.log('📧 Client payment email sent:', clientEmailResult.success);
      }
      
      // Send email to worker
      if (worker.length > 0 && worker[0].contact_email) {
        const workerEmailResult = await sendEmail({
          to: worker[0].contact_email,
          ...paymentConfirmationWorkerEmail(
            worker[0].name,
            paymentAmount,
            booking_id,
            client[0]?.name || 'Client'
          )
        });
        console.log('📧 Worker payment email sent:', workerEmailResult.success);
      }
      
      // Create in-app notification for client
      await connection.query(
        `INSERT INTO notifications 
         (id, user_id, type, title, message, booking_id, created_at)
         VALUES (UUID(), ?, 'payment_confirmed', 'Payment Successful!', 
                 CONCAT('Your payment of $', ?, ' has been confirmed and is held in escrow.'), 
                 ?, NOW())`,
        [client_id, paymentAmount, booking_id]
      );
      
      // Create in-app notification for worker
      if (worker.length > 0) {
        await connection.query(
          `INSERT INTO notifications 
           (id, user_id, type, title, message, booking_id, created_at)
           VALUES (UUID(), ?, 'new_job', 'New Job Confirmed!', 
                   CONCAT('You have a new job. Payment of $', ?, ' has been received and is held in escrow.'), 
                   ?, NOW())`,
          [worker_id, paymentAmount, booking_id]
        );
      }
      
      console.log('🔔 Notifications created for both parties');
      
    } catch (notifyError) {
      console.error('❌ Notification/Email error:', notifyError);
      // Don't fail the payment if notifications fail
    }
    
    res.json({
      success: true,
      payment_id: paymentId,
      client_new_balance: newBalance,
      message: `$${paymentAmount} held in escrow for booking`
    });
    
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('❌ Escrow payment error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

// POST release escrow funds (after job completion)
router.post('/release/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { approved_by_client = false } = req.body;
    
    console.log('💰 Releasing escrow funds for payment:', paymentId);
    
    // Get payment details
    const [payments] = await pool.query(
      `SELECT 
        p.*,
        b.client_id,
        b.worker_id,
        b.total_amount
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE p.id = ? AND p.status = 'held_in_escrow'`,
      [paymentId]
    );
    
    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found or already released'
      });
    }
    
    const payment = payments[0];
    const totalAmount = parseFloat(payment.amount);
    
    // Calculate 12Fingers commission (1%)
    const commission = totalAmount * 0.01;
    const workerAmount = totalAmount - commission;
    
    console.log('💸 Amount breakdown:', {
      total: totalAmount,
      commission,
      workerAmount
    });
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // 1. Get worker's wallet
      const [workerWallets] = await connection.query(
        'SELECT id, balance FROM wallets WHERE user_id = ?',
        [payment.worker_id]
      );
      
      let workerWalletId;
      let workerNewBalance;
      
      if (workerWallets.length === 0) {
        // Create wallet for worker if doesn't exist
        const [result] = await connection.query(
          'INSERT INTO wallets (user_id, balance, currency) VALUES (?, ?, "USD")',
          [payment.worker_id, workerAmount]
        );
        workerWalletId = result.insertId;
        workerNewBalance = workerAmount;
      } else {
        workerWalletId = workerWallets[0].id;
        workerNewBalance = parseFloat(workerWallets[0].balance) + workerAmount;
        
        await connection.query(
          'UPDATE wallets SET balance = ? WHERE id = ?',
          [workerNewBalance, workerWalletId]
        );
      }
      
      // 2. Create transaction for worker payment
      await connection.query(
        `INSERT INTO wallet_transactions 
          (wallet_id, booking_id, type, amount, description, created_at)
        VALUES (?, ?, 'escrow_release', ?, 'Payment for completed work', NOW())`,
        [workerWalletId, payment.booking_id, workerAmount]
      );
      
      // 3. Update payment status
      await connection.query(
        `UPDATE payments 
        SET status = 'released', 
            released_at = NOW(),
            escrow_release_date = NOW()
        WHERE id = ?`,
        [paymentId]
      );
      
      // 4. Update booking status
      await connection.query(
        'UPDATE bookings SET status = ?, completed_at = NOW() WHERE id = ?',
        ['completed', payment.booking_id]
      );
      
      // 5. Create commission record
      console.log('🏦 12Fingers commission:', commission);
      // TODO: Add commission to 12Fingers admin wallet
      
      await connection.commit();
      
      console.log('✅ Escrow funds released successfully');
      
      // 🔴 NEW: Create notification for worker
      try {
        await connection.query(
          `INSERT INTO notifications 
           (id, user_id, type, title, message, booking_id, created_at)
           VALUES (UUID(), ?, 'payment_released', 'Payment Released!', 
                   CONCAT('$', ?, ' has been released to your wallet for completed work.'), 
                   ?, NOW())`,
          [payment.worker_id, workerAmount, payment.booking_id]
        );
        console.log('🔔 Release notification created for worker');
      } catch (notifyError) {
        console.error('❌ Release notification error:', notifyError);
      }
      
      res.json({
        success: true,
        released: true,
        amounts: {
          total: totalAmount,
          worker_received: workerAmount,
          commission: commission
        },
        worker_new_balance: workerNewBalance
      });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('❌ Escrow release error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET payment status
router.get('/status/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const [payments] = await pool.query(
      `SELECT 
        p.*,
        b.status as booking_status,
        b.completed_at
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE p.booking_id = ?`,
      [bookingId]
    );
    
    if (payments.length === 0) {
      return res.json({
        success: true,
        payment: null,
        message: 'No payment found for this booking'
      });
    }
    
    const payment = payments[0];
    
    res.json({
      success: true,
      payment: {
        id: payment.id,
        amount: parseFloat(payment.amount),
        status: payment.status,
        payment_method: payment.payment_method,
        created_at: payment.created_at,
        released_at: payment.released_at,
        booking_status: payment.booking_status,
        completed_at: payment.completed_at
      }
    });
    
  } catch (error) {
    console.error('❌ Payment status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test wallet endpoint
router.get('/test-wallet/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [wallets] = await pool.query(
      'SELECT * FROM wallets WHERE user_id = ?',
      [userId]
    );
    
    const [transactions] = await pool.query(
      'SELECT * FROM wallet_transactions WHERE wallet_id = ? ORDER BY created_at DESC LIMIT 10',
      [wallets[0]?.id]
    );
    
    const [bookings] = await pool.query(
      'SELECT id, total_amount, status, payment_method FROM bookings WHERE client_id = ? ORDER BY created_at DESC LIMIT 10',
      [userId]
    );
    
    res.json({
      success: true,
      wallet: wallets[0] || null,
      transactions: transactions,
      recentBookings: bookings,
      summary: {
        totalBookings: bookings.length,
        walletBookings: bookings.filter(b => b.payment_method === 'wallet').length,
        totalSpent: bookings.reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0)
      }
    });
    
  } catch (error) {
    console.error('Test wallet error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router*/
// server/routes/payments.js
import express from 'express';
import { pool } from '../database.js';
import sendEmail from '../config/email.js';
import { 
  paymentConfirmationClientEmail, 
  paymentConfirmationWorkerEmail 
} from '../templates/emails.js';

const router = express.Router();

// POST create escrow payment
router.post('/escrow', async (req, res) => {
  let connection;
  try {
    const {
      booking_id,
      amount,
      client_id,
      worker_id,
      payment_method = 'wallet'
    } = req.body;
    
    console.log('🔒 Creating escrow payment for booking:', booking_id);
    console.log('📦 Request body:', { booking_id, amount, client_id, worker_id, payment_method });
    
    // Validate required fields
    if (!booking_id || !amount || !client_id || !worker_id) {
      return res.status(400).json({
        success: false,
        error: 'booking_id, amount, client_id, and worker_id are required'
      });
    }
    
    // 🔴 NEW: Prevent zero or negative amount payments
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Payment amount must be greater than zero'
      });
    }
    
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    // Check if client has sufficient wallet balance
    const [wallets] = await connection.query(
      'SELECT id, balance FROM wallets WHERE user_id = ?',
      [client_id]
    );
    
    if (wallets.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        success: false,
        error: 'Client wallet not found'
      });
    }
    
    const wallet = wallets[0];
    const currentBalance = parseFloat(wallet.balance);
    
    if (currentBalance < paymentAmount) {
      await connection.rollback();
      connection.release();
      return res.status(400).json({
        success: false,
        error: `Insufficient funds. Available: $${currentBalance}, Required: $${paymentAmount}`
      });
    }
    
    // 1. Deduct amount from client wallet
    const newBalance = currentBalance - paymentAmount;
    await connection.query(
      'UPDATE wallets SET balance = ? WHERE id = ?',
      [newBalance, wallet.id]
    );
    
    // 2. Create transaction record for deduction
    await connection.query(
      `INSERT INTO wallet_transactions 
        (wallet_id, booking_id, type, amount, description, created_at)
      VALUES (?, ?, 'held_in_escrow', ?, ?, NOW())`,
      [wallet.id, booking_id, paymentAmount, `Escrow hold for booking #${booking_id}`]
    );
    
    // 3. Create escrow payment record
    const [paymentResult] = await connection.query(
      `INSERT INTO payments 
        (booking_id, amount, status, payment_method, created_at)
      VALUES (?, ?, 'held_in_escrow', ?, NOW())`,
      [booking_id, paymentAmount, payment_method]
    );
    
    const paymentId = paymentResult.insertId;
    
    // 4. Update booking status
    await connection.query(
      'UPDATE bookings SET status = ? WHERE id = ?',
      ['confirmed', booking_id]
    );
    
    await connection.commit();
    
    console.log('✅ Escrow payment created successfully:', paymentId);
    console.log('💰 Client new balance:', newBalance);
    
    // 🔴 NEW: Send email notifications and create in-app notifications
    try {
      // Get client details
      const [client] = await connection.query(
        'SELECT name, email FROM clients WHERE id = ?',
        [client_id]
      );
      
      // Get worker details
      const [worker] = await connection.query(
        'SELECT name, contact_email FROM worker_profiles WHERE id = ?',
        [worker_id]
      );
      
      // Send email to client
      if (client.length > 0) {
        const clientEmailResult = await sendEmail({
          to: client[0].email,
          ...paymentConfirmationClientEmail(
            client[0].name,
            paymentAmount,
            booking_id,
            worker[0]?.name || 'Worker'
          )
        });
        console.log('📧 Client payment email sent:', clientEmailResult.success);
      }
      
      // Send email to worker
      if (worker.length > 0 && worker[0].contact_email) {
        const workerEmailResult = await sendEmail({
          to: worker[0].contact_email,
          ...paymentConfirmationWorkerEmail(
            worker[0].name,
            paymentAmount,
            booking_id,
            client[0]?.name || 'Client'
          )
        });
        console.log('📧 Worker payment email sent:', workerEmailResult.success);
      }
      
      // Create in-app notification for client
      await connection.query(
        `INSERT INTO notifications 
         (id, user_id, type, title, message, booking_id, created_at)
         VALUES (UUID(), ?, 'payment_confirmed', 'Payment Successful!', 
                 CONCAT('Your payment of $', ?, ' has been confirmed and is held in escrow.'), 
                 ?, NOW())`,
        [client_id, paymentAmount, booking_id]
      );
      
      // Create in-app notification for worker
      if (worker.length > 0) {
        await connection.query(
          `INSERT INTO notifications 
           (id, user_id, type, title, message, booking_id, created_at)
           VALUES (UUID(), ?, 'new_job', 'New Job Confirmed!', 
                   CONCAT('You have a new job. Payment of $', ?, ' has been received and is held in escrow.'), 
                   ?, NOW())`,
          [worker_id, paymentAmount, booking_id]
        );
      }
      
      console.log('🔔 Notifications created for both parties');
      
    } catch (notifyError) {
      console.error('❌ Notification/Email error:', notifyError);
      // Don't fail the payment if notifications fail
    }
    
    res.json({
      success: true,
      payment_id: paymentId,
      client_new_balance: newBalance,
      message: `$${paymentAmount} held in escrow for booking`
    });
    
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('❌ Escrow payment error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

// POST release escrow funds (after job completion)
router.post('/release/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { approved_by_client = false } = req.body;
    
    console.log('💰 Releasing escrow funds for payment:', paymentId);
    
    // Get payment details
    const [payments] = await pool.query(
      `SELECT 
        p.*,
        b.client_id,
        b.worker_id,
        b.total_amount
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE p.id = ? AND p.status = 'held_in_escrow'`,
      [paymentId]
    );
    
    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Payment not found or already released'
      });
    }
    
    const payment = payments[0];
    const totalAmount = parseFloat(payment.amount);
    
    // Calculate 12Fingers commission (1%)
    const commission = totalAmount * 0.01;
    const workerAmount = totalAmount - commission;
    
    console.log('💸 Amount breakdown:', {
      total: totalAmount,
      commission,
      workerAmount
    });
    
    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    try {
      // 1. Get worker's wallet
      const [workerWallets] = await connection.query(
        'SELECT id, balance FROM wallets WHERE user_id = ?',
        [payment.worker_id]
      );
      
      let workerWalletId;
      let workerNewBalance;
      
      if (workerWallets.length === 0) {
        // Create wallet for worker if doesn't exist
        const [result] = await connection.query(
          'INSERT INTO wallets (user_id, balance, currency) VALUES (?, ?, "USD")',
          [payment.worker_id, workerAmount]
        );
        workerWalletId = result.insertId;
        workerNewBalance = workerAmount;
      } else {
        workerWalletId = workerWallets[0].id;
        workerNewBalance = parseFloat(workerWallets[0].balance) + workerAmount;
        
        await connection.query(
          'UPDATE wallets SET balance = ? WHERE id = ?',
          [workerNewBalance, workerWalletId]
        );
      }
      
      // 2. Create transaction for worker payment
      await connection.query(
        `INSERT INTO wallet_transactions 
          (wallet_id, booking_id, type, amount, description, created_at)
        VALUES (?, ?, 'escrow_release', ?, 'Payment for completed work', NOW())`,
        [workerWalletId, payment.booking_id, workerAmount]
      );
      
      // 3. Update payment status
      await connection.query(
        `UPDATE payments 
        SET status = 'released', 
            released_at = NOW(),
            escrow_release_date = NOW()
        WHERE id = ?`,
        [paymentId]
      );
      
      // 4. Update booking status
      await connection.query(
        'UPDATE bookings SET status = ?, completed_at = NOW() WHERE id = ?',
        ['completed', payment.booking_id]
      );
      
      // 5. Create commission record
      console.log('🏦 12Fingers commission:', commission);
      // TODO: Add commission to 12Fingers admin wallet
      
      await connection.commit();
      
      console.log('✅ Escrow funds released successfully');
      
      // 🔴 NEW: Create notification for worker
      try {
        await connection.query(
          `INSERT INTO notifications 
           (id, user_id, type, title, message, booking_id, created_at)
           VALUES (UUID(), ?, 'payment_released', 'Payment Released!', 
                   CONCAT('$', ?, ' has been released to your wallet for completed work.'), 
                   ?, NOW())`,
          [payment.worker_id, workerAmount, payment.booking_id]
        );
        console.log('🔔 Release notification created for worker');
      } catch (notifyError) {
        console.error('❌ Release notification error:', notifyError);
      }
      
      res.json({
        success: true,
        released: true,
        amounts: {
          total: totalAmount,
          worker_received: workerAmount,
          commission: commission
        },
        worker_new_balance: workerNewBalance
      });
      
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
    
  } catch (error) {
    console.error('❌ Escrow release error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET payment status
router.get('/status/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const [payments] = await pool.query(
      `SELECT 
        p.*,
        b.status as booking_status,
        b.completed_at
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      WHERE p.booking_id = ?`,
      [bookingId]
    );
    
    if (payments.length === 0) {
      return res.json({
        success: true,
        payment: null,
        message: 'No payment found for this booking'
      });
    }
    
    const payment = payments[0];
    
    res.json({
      success: true,
      payment: {
        id: payment.id,
        amount: parseFloat(payment.amount),
        status: payment.status,
        payment_method: payment.payment_method,
        created_at: payment.created_at,
        released_at: payment.released_at,
        booking_status: payment.booking_status,
        completed_at: payment.completed_at
      }
    });
    
  } catch (error) {
    console.error('❌ Payment status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test wallet endpoint
router.get('/test-wallet/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [wallets] = await pool.query(
      'SELECT * FROM wallets WHERE user_id = ?',
      [userId]
    );
    
    const [transactions] = await pool.query(
      'SELECT * FROM wallet_transactions WHERE wallet_id = ? ORDER BY created_at DESC LIMIT 10',
      [wallets[0]?.id]
    );
    
    const [bookings] = await pool.query(
      'SELECT id, total_amount, status, payment_method FROM bookings WHERE client_id = ? ORDER BY created_at DESC LIMIT 10',
      [userId]
    );
    
    res.json({
      success: true,
      wallet: wallets[0] || null,
      transactions: transactions,
      recentBookings: bookings,
      summary: {
        totalBookings: bookings.length,
        walletBookings: bookings.filter(b => b.payment_method === 'wallet').length,
        totalSpent: bookings.reduce((sum, b) => sum + (parseFloat(b.total_amount) || 0), 0)
      }
    });
    
  } catch (error) {
    console.error('Test wallet error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;