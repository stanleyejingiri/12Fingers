// server/routes/bookings.js
/*
import express from 'express';
import { pool } from '../database.js';
import { logAudit } from '../middleware/audit.js';
import { sendPushNotification } from './push.js';

const router = express.Router();

// GET all bookings - BULLETPROOF VERSION
router.get('/', async (req, res) => {
  console.log('=== 📥 GET BOOKINGS REQUEST ===');
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('🔗 Database connected for fetching bookings');

    const [bookings] = await connection.query(`
      SELECT * FROM bookings ORDER BY created_at DESC
    `);

    console.log(`✅ Found ${bookings.length} bookings`);
    
    const bookingsWithWorkerInfo = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const [workers] = await connection.query(
            'SELECT name, category FROM worker_profiles WHERE id = ?',
            [booking.worker_id]
          );
          return {
            ...booking,
            worker_name: workers[0]?.name || 'Unknown Worker',
            worker_category: workers[0]?.category || 'Unknown Category'
          };
        } catch (workerError) {
          console.log(`⚠️ Could not fetch worker info for ${booking.worker_id}`);
          return {
            ...booking,
            worker_name: 'Unknown Worker',
            worker_category: 'Unknown Category'
          };
        }
      })
    );
    
    res.json({
      success: true,
      bookings: bookingsWithWorkerInfo,
      count: bookingsWithWorkerInfo.length
    });

  } catch (error) {
    console.error('❌ DATABASE ERROR:', error);
    
    res.json({
      success: true,
      bookings: [],
      count: 0,
      warning: 'Could not fetch bookings data',
      error: error.message
    });
  } finally {
    if (connection) {
      connection.release();
      console.log('🔗 Database connection released');
    }
    console.log('=== 📤 GET BOOKINGS COMPLETE ===');
  }
});

// POST create new booking
router.post('/', async (req, res) => {
  console.log('=== 📥 BOOKING REQUEST RECEIVED ===');
  
  let connection;
  try {
    const {
      worker_id,
      package_id = null,
      booking_date,
      start_time,
      end_time,
      service_details = '',
      special_instructions = '',
      is_custom_offer = false,
      custom_price = 0,
      client_id,
      total_amount = 0,
      estimated_hours = 0,
      payment_method = 'card'
    } = req.body;

    console.log(`💰 Payment method received: ${payment_method}`);
    console.log(`📝 Is custom offer: ${is_custom_offer}`);

    const final_package_id = (is_custom_offer || package_id === 'custom') ? null : package_id;
    
    const validationErrors = [];
    
    if (!client_id) validationErrors.push('client_id is required');
    if (!worker_id) validationErrors.push('worker_id is required');
    if (!booking_date) validationErrors.push('booking_date is required');
    if (!start_time) validationErrors.push('start_time is required');
    if (!end_time) validationErrors.push('end_time is required');

    if (validationErrors.length > 0) {
      console.log('❌ Validation errors:', validationErrors);
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed',
        details: validationErrors
      });
    }

    connection = await pool.getConnection();
    console.log('🔗 Database connected');

    const [workers] = await connection.query(
      'SELECT id, name FROM worker_profiles WHERE id = ?',
      [worker_id]
    );

    if (workers.length === 0) {
      console.log('❌ Worker not found:', worker_id);
      return res.status(404).json({
        success: false,
        error: 'Worker not found'
      });
    }

    console.log('✅ Worker verified:', workers[0].name);

    const final_amount = total_amount > 0 ? total_amount : (is_custom_offer ? custom_price : 100.00);
    
    let bookingStatus;
    if (is_custom_offer) {
      bookingStatus = 'offer_pending';
      console.log('📝 Custom offer created - status: offer_pending');
    } else {
      bookingStatus = 'pending';
      console.log('📅 Direct booking created - status: pending');
    }
	
	const [result] = await connection.query(
      `INSERT INTO bookings (
        client_id, worker_id, package_id, booking_date, start_time, end_time,
        service_details, special_instructions, is_custom_offer, total_amount, status,
        payment_method, estimated_hours
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client_id, 
        worker_id, 
        final_package_id,
        booking_date, 
        start_time, 
        end_time,
        service_details, 
        special_instructions, 
        is_custom_offer, 
        final_amount,
        bookingStatus,
        payment_method,
        estimated_hours || 0
      ]
    );

    const bookingId = result.insertId;
	console.log('✅ Database insert successful, ID:', bookingId);

	// 🔴 SEND PUSH NOTIFICATION TO WORKER (INSIDE the try block)
	try {
	  const [client] = await connection.query('SELECT name FROM clients WHERE id = ?', [client_id]);
	  const clientName = client[0]?.name || 'A client';
	  
	  // Only send if we have a valid worker_id
	  if (worker_id) {
		await sendPushNotification(
		  worker_id,
		  'New Booking Request',
		  `${clientName} wants to book you on ${booking_date} at ${start_time}`,
		  '/worker-dashboard'
		);
		console.log('📱 Push notification sent to worker');
	  }
	} catch (pushError) {
	  console.error('Push notification failed:', pushError);
	  // Don't fail the booking if push fails
	}

	res.json({
	  success: true,
	  booking_id: bookingId,
	  booking: {
		id: bookingId,
		worker_id,
		client_id,
		booking_date,
		start_time,
		end_time,
		total_amount: final_amount,
		status: bookingStatus,
		payment_method: payment_method,
		is_custom_offer: is_custom_offer
	  },
	  message: is_custom_offer 
		? 'Custom offer created successfully. Worker will review and respond.' 
		: 'Booking created successfully'
	});
		
	
  } catch (error) {
    console.error('❌ DATABASE ERROR:', error);
    
    let errorMessage = 'Database error: ' + error.message;
    let statusCode = 500;

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      errorMessage = 'Referenced record not found. Please check worker exists.';
      statusCode = 400;
    } else if (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
      errorMessage = 'Invalid data format. Please check date/time values.';
      statusCode = 400;
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      errorMessage = 'Database table missing. Please ensure bookings table exists.';
      statusCode = 500;
    }

    res.status(statusCode).json({ 
      success: false, 
      error: errorMessage,
      code: error.code
    });
  } finally {
    if (connection) {
      connection.release();
      console.log('🔗 Database connection released');
    }
    console.log('=== 📤 BOOKING PROCESS COMPLETE ===');
  }
});

// After successful booking insert
await sendPushNotification(
  worker_id,
  'New Booking Request',
  `A client wants to book you on ${booking_date}`,
  '/worker-dashboard'
);

//Worker accepts offer
router.post('/:id/accept', async (req, res) => {
  console.log('=== 📥 WORKER ACCEPT OFFER REQUEST ===');
  
  const { id } = req.params;
  const { worker_id } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Get current state for audit
    const [oldBooking] = await connection.query(
      'SELECT * FROM bookings WHERE id = ?',
      [id]
    );
    
    const [bookings] = await connection.query(
      `SELECT b.*, wp.name as worker_name 
       FROM bookings b
       JOIN worker_profiles wp ON b.worker_id = wp.id
       WHERE b.id = ? AND b.worker_id = ? AND b.status = ?`,
      [id, worker_id, 'offer_pending']
    );
    
    if (bookings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Offer not found, already processed, or you are not the assigned worker' 
      });
    }
    
    const booking = bookings[0];
    
    await connection.query(
      'UPDATE bookings SET status = ?, accepted_at = NOW() WHERE id = ?',
      ['offer_accepted', id]
    );
    
    // Get new state for audit
    const [newBooking] = await connection.query(
      'SELECT * FROM bookings WHERE id = ?',
      [id]
    );
    
    // Create audit log
    await logAudit({
      userId: worker_id,
      action: 'ACCEPT_OFFER',
      entityType: 'booking',
      entityId: id,
      oldValues: oldBooking[0],
      newValues: newBooking[0],
      req
    });
    
    // Rest of your code...
    
  } catch (error) {
    console.error('❌ Accept offer error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to accept offer: ' + error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 ACCEPT OFFER COMPLETE ===');
  }
});




// Worker rejects offer
router.post('/:id/reject', async (req, res) => {
  console.log('=== 📥 WORKER REJECT OFFER REQUEST ===');
  
  const { id } = req.params;
  const { worker_id } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [bookings] = await connection.query(
      `SELECT b.*, wp.name as worker_name 
       FROM bookings b
       JOIN worker_profiles wp ON b.worker_id = wp.id
       WHERE b.id = ? AND b.worker_id = ? AND b.status = ?`,
      [id, worker_id, 'offer_pending']
    );
    
    if (bookings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Offer not found, already processed, or you are not the assigned worker' 
      });
    }
    
    const booking = bookings[0];
    
    await connection.query(
      'UPDATE bookings SET status = ?, rejected_at = NOW() WHERE id = ?',
      ['rejected', id]
    );
    
    try {
      await connection.query(
        `INSERT INTO notifications 
         (id, user_id, type, title, message, booking_id, is_read, created_at)
         VALUES (UUID(), ?, 'offer_rejected', 'Offer Declined', 
                ?, ?, 0, NOW())`,
        [
          booking.client_id,
          `Your offer has been declined by ${booking.worker_name}.`,
          id
        ]
      );
    } catch (notifError) {
      console.error('⚠️ Could not create notification:', notifError);
    }
    
    console.log(`✅ Offer #${id} rejected by worker.`);
    
    res.json({ 
      success: true,
      booking_id: id,
      message: 'Offer rejected successfully.',
      status: 'rejected'
    });
    
  } catch (error) {
    console.error('❌ Reject offer error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to reject offer: ' + error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 REJECT OFFER COMPLETE ===');
  }
});

// Complete payment endpoint
router.post('/:id/complete-payment', async (req, res) => {
  console.log('=== 📥 COMPLETE PAYMENT REQUEST ===');
  
  const { id } = req.params;
  const { client_id, payment_method } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    const [bookings] = await connection.query(
      `SELECT b.*, wp.name as worker_name 
       FROM bookings b
       JOIN worker_profiles wp ON b.worker_id = wp.id
       WHERE b.id = ? AND b.client_id = ? AND b.status = ?`,
      [id, client_id, 'offer_accepted']
    );
    
    if (bookings.length === 0) {
      throw new Error('Booking not found or not ready for payment');
    }
    
    const booking = bookings[0];
    
    if (payment_method === 'wallet') {
      const [wallets] = await connection.query(
        'SELECT id, balance FROM wallets WHERE user_id = ?',
        [client_id]
      );
      
      if (wallets.length === 0) {
        throw new Error('Wallet not found for user');
      }
      
      const wallet = wallets[0];
      const currentBalance = parseFloat(wallet.balance);
      
      if (currentBalance < booking.total_amount) {
        throw new Error(`Insufficient wallet balance. Available: $${currentBalance}`);
      }
      
      const newBalance = currentBalance - booking.total_amount;
      await connection.query(
        'UPDATE wallets SET balance = ? WHERE id = ?',
        [newBalance, wallet.id]
      );
      
      await connection.query(
        `INSERT INTO wallet_transactions 
         (wallet_id, booking_id, type, amount, description, created_at)
         VALUES (?, ?, 'escrow_hold', ?, ?, NOW())`,
        [wallet.id, id, booking.total_amount, `Escrow for booking #${id}`]
      );
      
      await connection.query(
        `INSERT INTO payments 
         (booking_id, amount, status, payment_method, created_at)
         VALUES (?, ?, 'escrow_held', ?, NOW())`,
        [id, booking.total_amount, 'wallet']
      );
    }
    
    await connection.query(
      'UPDATE bookings SET status = ?, confirmed_at = NOW() WHERE id = ?',
      ['confirmed', id]
    );
    
    await connection.commit();
    
    console.log(`✅ Booking #${id} confirmed with ${payment_method} payment`);
    
    res.json({ 
      success: true,
      booking_id: id,
      message: 'Payment completed successfully. Funds held in escrow.',
      status: 'confirmed'
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Complete payment error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to complete payment: ' + error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 COMPLETE PAYMENT COMPLETE ===');
  }
});

// Worker starts job
router.post('/:id/start', async (req, res) => {
  console.log('=== 📥 START JOB REQUEST ===');
  
  const { id } = req.params;
  const { worker_id } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [bookings] = await connection.query(
      `SELECT b.* 
       FROM bookings b
       WHERE b.id = ? AND b.worker_id = ? AND b.status = ?`,
      [id, worker_id, 'confirmed']
    );
    
    if (bookings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Job not found, already started, or you are not the assigned worker' 
      });
    }
    
    await connection.query(
      'UPDATE bookings SET status = ?, started_at = NOW() WHERE id = ?',
      ['in_progress', id]
    );
    
    console.log(`✅ Job #${id} started by worker.`);
    
    res.json({ 
      success: true,
      booking_id: id,
      message: 'Job started successfully.',
      status: 'in_progress'
    });
    
  } catch (error) {
    console.error('❌ Start job error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to start job: ' + error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 START JOB COMPLETE ===');
  }
});

// Worker marks job as complete (awaiting client confirmation)
router.post('/:id/complete', async (req, res) => {
  console.log('=== 📥 COMPLETE JOB REQUEST ===');
  
  const { id } = req.params;
  const { worker_id } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [bookings] = await connection.query(
      `SELECT b.*, wp.name as worker_name, c.email as client_email 
       FROM bookings b
       JOIN worker_profiles wp ON b.worker_id = wp.id
       JOIN clients c ON b.client_id = c.id  
       WHERE b.id = ? AND b.worker_id = ? AND b.status = 'in_progress'`,
      [id, worker_id]
    );
    
    if (bookings.length === 0) {
      connection.release();
      return res.status(404).json({ 
        success: false, 
        error: 'Job not found, not in progress, or you are not the assigned worker' 
      });
    }
    
    const booking = bookings[0];
    
    const autoReleaseAt = new Date();
    autoReleaseAt.setDate(autoReleaseAt.getDate() + 3);
    
    await connection.query(
      `UPDATE bookings 
       SET status = 'awaiting_confirmation', 
           worker_completed_at = NOW(),
           auto_release_at = ?
       WHERE id = ?`,
      [autoReleaseAt, id]
    );
    
    await connection.query(
      `INSERT INTO notifications 
       (id, user_id, type, title, message, booking_id, created_at)
       VALUES (UUID(), ?, 'job_completed', 'Job Completed!', 
               'Worker has marked the job as complete. Please confirm to release payment.', 
               ?, NOW())`,
      [booking.client_id, id]
    );
    
    connection.release();
    
    console.log(`✅ Job #${id} marked as complete, awaiting client confirmation`);
    
    res.json({ 
      success: true,
      message: 'Job marked as complete. Waiting for client confirmation.',
      auto_release_at: autoReleaseAt,
      status: 'awaiting_confirmation'
    });
    
  } catch (error) {
    if (connection) connection.release();
    console.error('❌ Complete job error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Client confirms job completion and releases funds
router.post('/:id/confirm-completion', async (req, res) => {
  console.log('=== 📥 CONFIRM COMPLETION REQUEST ===');
  
  const { id } = req.params;
  const { client_id } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    const [bookings] = await connection.query(
      `SELECT b.*, p.id as payment_id, p.amount 
       FROM bookings b
       LEFT JOIN payments p ON b.id = p.booking_id
       WHERE b.id = ? AND b.client_id = ? AND b.status = 'awaiting_confirmation'`,
      [id, client_id]
    );
    
    if (bookings.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found or not awaiting confirmation' 
      });
    }
    
    const booking = bookings[0];
    const totalAmount = parseFloat(booking.total_amount);
    
    const commission = totalAmount * 0.01;
    const workerAmount = totalAmount - commission;
    
    // 🔴 PLATFORM COMMISSION - FIXED POSITION
    try {
      console.log(`💰 Processing platform commission: $${commission} for booking #${id}`);
      
      // Get platform wallet
      const [platformWallets] = await connection.query(
        'SELECT id, balance FROM wallets WHERE user_id = ?',
        ['12fingers-platform']
      );
      
      let platformWalletId;
      let platformNewBalance;
      
      if (platformWallets.length === 0) {
        // Create platform wallet if doesn't exist
        console.log('🆕 Platform wallet not found, creating...');
        const [result] = await connection.query(
          'INSERT INTO wallets (user_id, balance, currency) VALUES (?, ?, "USD")',
          ['12fingers-platform', commission]
        );
        platformWalletId = result.insertId;
        platformNewBalance = commission;
        console.log(`✅ Created platform wallet ID: ${platformWalletId} with balance: $${commission}`);
      } else {
        platformWalletId = platformWallets[0].id;
        platformNewBalance = parseFloat(platformWallets[0].balance) + commission;
        
        await connection.query(
          'UPDATE wallets SET balance = ? WHERE id = ?',
          [platformNewBalance, platformWalletId]
        );
        console.log(`💰 Platform wallet updated: +$${commission} (new balance: $${platformNewBalance})`);
      }
      
      // Create transaction record for platform commission
      const [txResult] = await connection.query(
        `INSERT INTO wallet_transactions 
          (wallet_id, booking_id, type, amount, description, created_at)
        VALUES (?, ?, 'commission', ?, CONCAT('12Fingers platform fee (1%) for booking #', ?), NOW())`,
        [platformWalletId, id, commission, id]
      );
      
      console.log(`📊 Commission transaction recorded: ${txResult.insertId}`);
      
    } catch (platformError) {
      console.error('⚠️ Error processing platform commission:', platformError);
      // Don't fail the whole transaction - just log it
    }
    
    console.log('💸 Amount breakdown:', {
      total: totalAmount,
      commission,
      workerAmount
    });
    
    // Find the payment record
    const [payments] = await connection.query(
      'SELECT id FROM payments WHERE booking_id = ? AND status = "held_in_escrow"',
      [id]
    );
    
    if (payments.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        error: 'Escrow payment not found' 
      });
    }
    
    const paymentId = payments[0].id;
    
    // Get worker's wallet
    const [workerWallets] = await connection.query(
      'SELECT id, balance FROM wallets WHERE user_id = ?',
      [booking.worker_id]
    );
    
    let workerWalletId;
    let workerNewBalance;
    
    if (workerWallets.length === 0) {
      const [result] = await connection.query(
        'INSERT INTO wallets (user_id, balance, currency) VALUES (?, ?, "USD")',
        [booking.worker_id, workerAmount]
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
    
    await connection.query(
      `INSERT INTO wallet_transactions 
        (wallet_id, booking_id, type, amount, description, created_at)
      VALUES (?, ?, 'escrow_release', ?, 'Payment for completed work', NOW())`,
      [workerWalletId, id, workerAmount]
    );
    
    await connection.query(
      `UPDATE payments 
       SET status = 'released', released_at = NOW()
       WHERE id = ?`,
      [paymentId]
    );
    
    await connection.query(
	  `UPDATE bookings 
	   SET status = 'completed', 
		   client_confirmed_at = NOW()
	   WHERE id = ?`,
	  [id]
	);
    
    await connection.query(
      `INSERT INTO notifications 
       (id, user_id, type, title, message, booking_id, created_at)
       VALUES (UUID(), ?, 'payment_received', 'Payment Received!', 
               CONCAT('Payment of $', ?, ' has been released to your wallet'), 
               ?, NOW())`,
      [booking.worker_id, workerAmount, id]
    );
    
    await connection.commit();
    
    console.log(`✅ Funds released successfully to worker: $${workerAmount}`);
    
    res.json({
      success: true,
      message: 'Job confirmed! Payment released to worker.',
      amounts: {
        total: totalAmount,
        worker_received: workerAmount,
        commission: commission
      }
    });
    
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('❌ Confirm completion error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) connection.release();
  }
});

// GET bookings by client ID
router.get('/client/:clientId', async (req, res) => {
  console.log('=== 📥 GET CLIENT BOOKINGS REQUEST ===');
  
  let connection;
  try {
    const { clientId } = req.params;
    connection = await pool.getConnection();

    const [bookings] = await connection.query(`
      SELECT 
        b.*,
        wp.name as worker_name,
        wp.category as worker_category
      FROM bookings b
      LEFT JOIN worker_profiles wp ON b.worker_id = wp.id
      WHERE b.client_id = ?
      ORDER BY b.created_at DESC
    `, [clientId]);

    console.log(`✅ Found ${bookings.length} bookings for client ${clientId}`);
    
    res.json({
      success: true,
      bookings: bookings,
      count: bookings.length
    });

  } catch (error) {
    console.error('❌ DATABASE ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch client bookings: ' + error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 GET CLIENT BOOKINGS COMPLETE ===');
  }
});

// GET bookings by worker ID
router.get('/worker/:workerId', async (req, res) => {
  console.log('=== 📥 GET WORKER BOOKINGS REQUEST ===');
  
  let connection;
  try {
    const { workerId } = req.params;
    connection = await pool.getConnection();

    const [bookings] = await connection.query(`
      SELECT 
        b.*,
        wp.name as worker_name,
        wp.category as worker_category,
        c.name as client_name,
        c.email as client_email
      FROM bookings b
      LEFT JOIN worker_profiles wp ON b.worker_id = wp.id
      LEFT JOIN clients c ON b.client_id = c.id 
      WHERE b.worker_id = ?
      ORDER BY 
        CASE 
          WHEN b.status = 'offer_pending' THEN 1
          WHEN b.status = 'offer_accepted' THEN 2
          WHEN b.status = 'confirmed' THEN 3
          WHEN b.status = 'in_progress' THEN 4
          WHEN b.status = 'awaiting_confirmation' THEN 5
          WHEN b.status = 'completed' THEN 6
          ELSE 7
        END,
        b.created_at DESC
    `, [workerId]);

    console.log(`✅ Found ${bookings.length} bookings for worker ${workerId}`);
    
    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});
    
    res.json({
      success: true,
      bookings: bookings,
      count: bookings.length,
      status_counts: statusCounts
    });

  } catch (error) {
    console.error('❌ DATABASE ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch worker bookings: ' + error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 GET WORKER BOOKINGS COMPLETE ===');
  }
});

// GET bookings by user ID (client)
router.get('/user/:userId', async (req, res) => {
  console.log('=== 📥 GET USER BOOKINGS REQUEST ===');
  
  const { userId } = req.params;
  let connection;
  
  try {
    connection = await pool.getConnection();
    
    const [bookings] = await connection.query(
      `SELECT b.*, 
              wp.name as worker_name,
              wp.category as worker_category,
              c.name as client_name,
              c.email as client_email
       FROM bookings b
       LEFT JOIN worker_profiles wp ON b.worker_id = wp.id
       LEFT JOIN clients c ON b.client_id = c.id  
       WHERE b.client_id = ?
       ORDER BY b.created_at DESC`,
      [userId]
    );
    
    console.log(`✅ Found ${bookings.length} bookings for user ${userId}`);
    
    res.json({
      success: true,
      bookings: bookings || []
    });
    
  } catch (error) {
    console.error('❌ Error fetching user bookings:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 GET USER BOOKINGS COMPLETE ===');
  }
});

// GET booking by ID with details
router.get('/:id', async (req, res) => {
  console.log('=== 📥 GET BOOKING DETAILS REQUEST ===');
  
  const { id } = req.params;
  let connection;
  
  try {
    connection = await pool.getConnection();

    const [bookings] = await connection.query(`
      SELECT 
        b.*,
        wp.name as worker_name,
        wp.category as worker_category,
        c.name as client_name,
        c.email as client_email
      FROM bookings b
      LEFT JOIN worker_profiles wp ON b.worker_id = wp.id
      LEFT JOIN clients c ON b.client_id = c.id
      WHERE b.id = ?
    `, [id]);

    if (bookings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }
    
    const booking = bookings[0];
    
    res.json({
      success: true,
      booking: booking
    });

  } catch (error) {
    console.error('❌ DATABASE ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch booking details: ' + error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 GET BOOKING DETAILS COMPLETE ===');
  }
});

export default router;
*/

// server/routes/bookings.js
import express from 'express';
import { pool } from '../database.js';
import { logAudit } from '../middleware/audit.js';
import { sendPushNotification } from './push.js';

const router = express.Router();

// GET all bookings - BULLETPROOF VERSION
router.get('/', async (req, res) => {
  console.log('=== 📥 GET BOOKINGS REQUEST ===');
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('🔗 Database connected for fetching bookings');

    const [bookings] = await connection.query(`
      SELECT * FROM bookings ORDER BY created_at DESC
    `);

    console.log(`✅ Found ${bookings.length} bookings`);
    
    const bookingsWithWorkerInfo = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const [workers] = await connection.query(
            'SELECT name, category FROM worker_profiles WHERE id = ?',
            [booking.worker_id]
          );
          return {
            ...booking,
            worker_name: workers[0]?.name || 'Unknown Worker',
            worker_category: workers[0]?.category || 'Unknown Category'
          };
        } catch (workerError) {
          console.log(`⚠️ Could not fetch worker info for ${booking.worker_id}`);
          return {
            ...booking,
            worker_name: 'Unknown Worker',
            worker_category: 'Unknown Category'
          };
        }
      })
    );
    
    res.json({
      success: true,
      bookings: bookingsWithWorkerInfo,
      count: bookingsWithWorkerInfo.length
    });

  } catch (error) {
    console.error('❌ DATABASE ERROR:', error);
    
    res.json({
      success: true,
      bookings: [],
      count: 0,
      warning: 'Could not fetch bookings data',
      error: error.message
    });
  } finally {
    if (connection) {
      connection.release();
      console.log('🔗 Database connection released');
    }
    console.log('=== 📤 GET BOOKINGS COMPLETE ===');
  }
});

// POST create new booking
router.post('/', async (req, res) => {
  console.log('=== 📥 BOOKING REQUEST RECEIVED ===');
  
  let connection;
  try {
    const {
      worker_id,
      package_id = null,
      booking_date,
      start_time,
      end_time,
      service_details = '',
      special_instructions = '',
      is_custom_offer = false,
      custom_price = 0,
      client_id,
      total_amount = 0,
      estimated_hours = 0,
      payment_method = 'card'
    } = req.body;

    console.log(`💰 Payment method received: ${payment_method}`);
    console.log(`📝 Is custom offer: ${is_custom_offer}`);

    const final_package_id = (is_custom_offer || package_id === 'custom') ? null : package_id;
    
    const validationErrors = [];
    
    if (!client_id) validationErrors.push('client_id is required');
    if (!worker_id) validationErrors.push('worker_id is required');
    if (!booking_date) validationErrors.push('booking_date is required');
    if (!start_time) validationErrors.push('start_time is required');
    if (!end_time) validationErrors.push('end_time is required');

    if (validationErrors.length > 0) {
      console.log('❌ Validation errors:', validationErrors);
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed',
        details: validationErrors
      });
    }

    connection = await pool.getConnection();
    console.log('🔗 Database connected');

    const [workers] = await connection.query(
      'SELECT id, name FROM worker_profiles WHERE id = ?',
      [worker_id]
    );

    if (workers.length === 0) {
      console.log('❌ Worker not found:', worker_id);
      return res.status(404).json({
        success: false,
        error: 'Worker not found'
      });
    }

    console.log('✅ Worker verified:', workers[0].name);

    const final_amount = total_amount > 0 ? total_amount : (is_custom_offer ? custom_price : 100.00);
    
    let bookingStatus;
    if (is_custom_offer) {
      bookingStatus = 'offer_pending';
      console.log('📝 Custom offer created - status: offer_pending');
    } else {
      bookingStatus = 'pending';
      console.log('📅 Direct booking created - status: pending');
    }
	
	const [result] = await connection.query(
      `INSERT INTO bookings (
        client_id, worker_id, package_id, booking_date, start_time, end_time,
        service_details, special_instructions, is_custom_offer, total_amount, status,
        payment_method, estimated_hours
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client_id, 
        worker_id, 
        final_package_id,
        booking_date, 
        start_time, 
        end_time,
        service_details, 
        special_instructions, 
        is_custom_offer, 
        final_amount,
        bookingStatus,
        payment_method,
        estimated_hours || 0
      ]
    );

    const bookingId = result.insertId;
	console.log('✅ Database insert successful, ID:', bookingId);

	// 🔴 SEND PUSH NOTIFICATION TO WORKER
	try {
	  const [client] = await connection.query('SELECT name FROM clients WHERE id = ?', [client_id]);
	  const clientName = client[0]?.name || 'A client';
	  
	  if (worker_id) {
		await sendPushNotification(
		  worker_id,
		  'New Booking Request',
		  `${clientName} wants to book you on ${booking_date} at ${start_time}`,
		  '/worker-dashboard'
		);
		console.log('📱 Push notification sent to worker');
	  }
	} catch (pushError) {
	  console.error('Push notification failed:', pushError);
	}

	res.json({
	  success: true,
	  booking_id: bookingId,
	  booking: {
		id: bookingId,
		worker_id,
		client_id,
		booking_date,
		start_time,
		end_time,
		total_amount: final_amount,
		status: bookingStatus,
		payment_method: payment_method,
		is_custom_offer: is_custom_offer
	  },
	  message: is_custom_offer 
		? 'Custom offer created successfully. Worker will review and respond.' 
		: 'Booking created successfully'
	});
		
	
  } catch (error) {
    console.error('❌ DATABASE ERROR:', error);
    
    let errorMessage = 'Database error: ' + error.message;
    let statusCode = 500;

    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      errorMessage = 'Referenced record not found. Please check worker exists.';
      statusCode = 400;
    } else if (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
      errorMessage = 'Invalid data format. Please check date/time values.';
      statusCode = 400;
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      errorMessage = 'Database table missing. Please ensure bookings table exists.';
      statusCode = 500;
    }

    res.status(statusCode).json({ 
      success: false, 
      error: errorMessage,
      code: error.code
    });
  } finally {
    if (connection) {
      connection.release();
      console.log('🔗 Database connection released');
    }
    console.log('=== 📤 BOOKING PROCESS COMPLETE ===');
  }
});

//Worker accepts offer
router.post('/:id/accept', async (req, res) => {
  console.log('=== 📥 WORKER ACCEPT OFFER REQUEST ===');
  
  const { id } = req.params;
  const { worker_id } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Get current state for audit
    const [oldBooking] = await connection.query(
      'SELECT * FROM bookings WHERE id = ?',
      [id]
    );
    
    const [bookings] = await connection.query(
      `SELECT b.*, wp.name as worker_name 
       FROM bookings b
       JOIN worker_profiles wp ON b.worker_id = wp.id
       WHERE b.id = ? AND b.worker_id = ? AND b.status = ?`,
      [id, worker_id, 'offer_pending']
    );
    
    if (bookings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Offer not found, already processed, or you are not the assigned worker' 
      });
    }
    
    const booking = bookings[0];
    
    await connection.query(
      'UPDATE bookings SET status = ?, accepted_at = NOW() WHERE id = ?',
      ['offer_accepted', id]
    );
    
    // Get new state for audit
    const [newBooking] = await connection.query(
      'SELECT * FROM bookings WHERE id = ?',
      [id]
    );
    
    // Create audit log
    await logAudit({
      userId: worker_id,
      action: 'ACCEPT_OFFER',
      entityType: 'booking',
      entityId: id,
      oldValues: oldBooking[0],
      newValues: newBooking[0],
      req
    });
    
    // Rest of your code...
    
  } catch (error) {
    console.error('❌ Accept offer error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to accept offer: ' + error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 ACCEPT OFFER COMPLETE ===');
  }
});

// Worker rejects offer
router.post('/:id/reject', async (req, res) => {
  console.log('=== 📥 WORKER REJECT OFFER REQUEST ===');
  
  const { id } = req.params;
  const { worker_id } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [bookings] = await connection.query(
      `SELECT b.*, wp.name as worker_name 
       FROM bookings b
       JOIN worker_profiles wp ON b.worker_id = wp.id
       WHERE b.id = ? AND b.worker_id = ? AND b.status = ?`,
      [id, worker_id, 'offer_pending']
    );
    
    if (bookings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Offer not found, already processed, or you are not the assigned worker' 
      });
    }
    
    const booking = bookings[0];
    
    await connection.query(
      'UPDATE bookings SET status = ?, rejected_at = NOW() WHERE id = ?',
      ['rejected', id]
    );
    
    try {
      await connection.query(
        `INSERT INTO notifications 
         (id, user_id, type, title, message, booking_id, is_read, created_at)
         VALUES (UUID(), ?, 'offer_rejected', 'Offer Declined', 
                ?, ?, 0, NOW())`,
        [
          booking.client_id,
          `Your offer has been declined by ${booking.worker_name}.`,
          id
        ]
      );
    } catch (notifError) {
      console.error('⚠️ Could not create notification:', notifError);
    }
    
    console.log(`✅ Offer #${id} rejected by worker.`);
    
    res.json({ 
      success: true,
      booking_id: id,
      message: 'Offer rejected successfully.',
      status: 'rejected'
    });
    
  } catch (error) {
    console.error('❌ Reject offer error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to reject offer: ' + error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 REJECT OFFER COMPLETE ===');
  }
});

// Complete payment endpoint
router.post('/:id/complete-payment', async (req, res) => {
  console.log('=== 📥 COMPLETE PAYMENT REQUEST ===');
  
  const { id } = req.params;
  const { client_id, payment_method } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    const [bookings] = await connection.query(
      `SELECT b.*, wp.name as worker_name 
       FROM bookings b
       JOIN worker_profiles wp ON b.worker_id = wp.id
       WHERE b.id = ? AND b.client_id = ? AND b.status = ?`,
      [id, client_id, 'offer_accepted']
    );
    
    if (bookings.length === 0) {
      throw new Error('Booking not found or not ready for payment');
    }
    
    const booking = bookings[0];
    
    if (payment_method === 'wallet') {
      const [wallets] = await connection.query(
        'SELECT id, balance FROM wallets WHERE user_id = ?',
        [client_id]
      );
      
      if (wallets.length === 0) {
        throw new Error('Wallet not found for user');
      }
      
      const wallet = wallets[0];
      const currentBalance = parseFloat(wallet.balance);
      
      if (currentBalance < booking.total_amount) {
        throw new Error(`Insufficient wallet balance. Available: $${currentBalance}`);
      }
      
      const newBalance = currentBalance - booking.total_amount;
      await connection.query(
        'UPDATE wallets SET balance = ? WHERE id = ?',
        [newBalance, wallet.id]
      );
      
      await connection.query(
        `INSERT INTO wallet_transactions 
         (wallet_id, booking_id, type, amount, description, created_at)
         VALUES (?, ?, 'escrow_hold', ?, ?, NOW())`,
        [wallet.id, id, booking.total_amount, `Escrow for booking #${id}`]
      );
      
      await connection.query(
        `INSERT INTO payments 
         (booking_id, amount, status, payment_method, created_at)
         VALUES (?, ?, 'escrow_held', ?, NOW())`,
        [id, booking.total_amount, 'wallet']
      );
    }
    
    await connection.query(
      'UPDATE bookings SET status = ?, confirmed_at = NOW() WHERE id = ?',
      ['confirmed', id]
    );
    
    await connection.commit();
    
    console.log(`✅ Booking #${id} confirmed with ${payment_method} payment`);
    
    res.json({ 
      success: true,
      booking_id: id,
      message: 'Payment completed successfully. Funds held in escrow.',
      status: 'confirmed'
    });
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Complete payment error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to complete payment: ' + error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 COMPLETE PAYMENT COMPLETE ===');
  }
});

// Worker starts job
router.post('/:id/start', async (req, res) => {
  console.log('=== 📥 START JOB REQUEST ===');
  
  const { id } = req.params;
  const { worker_id } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [bookings] = await connection.query(
      `SELECT b.* 
       FROM bookings b
       WHERE b.id = ? AND b.worker_id = ? AND b.status = ?`,
      [id, worker_id, 'confirmed']
    );
    
    if (bookings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Job not found, already started, or you are not the assigned worker' 
      });
    }
    
    await connection.query(
      'UPDATE bookings SET status = ?, started_at = NOW() WHERE id = ?',
      ['in_progress', id]
    );
    
    console.log(`✅ Job #${id} started by worker.`);
    
    res.json({ 
      success: true,
      booking_id: id,
      message: 'Job started successfully.',
      status: 'in_progress'
    });
    
  } catch (error) {
    console.error('❌ Start job error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to start job: ' + error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 START JOB COMPLETE ===');
  }
});

// Worker marks job as complete (awaiting client confirmation)
router.post('/:id/complete', async (req, res) => {
  console.log('=== 📥 COMPLETE JOB REQUEST ===');
  
  const { id } = req.params;
  const { worker_id } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [bookings] = await connection.query(
      `SELECT b.*, wp.name as worker_name, c.email as client_email 
       FROM bookings b
       JOIN worker_profiles wp ON b.worker_id = wp.id
       JOIN clients c ON b.client_id = c.id  
       WHERE b.id = ? AND b.worker_id = ? AND b.status = 'in_progress'`,
      [id, worker_id]
    );
    
    if (bookings.length === 0) {
      connection.release();
      return res.status(404).json({ 
        success: false, 
        error: 'Job not found, not in progress, or you are not the assigned worker' 
      });
    }
    
    const booking = bookings[0];
    
    const autoReleaseAt = new Date();
    autoReleaseAt.setDate(autoReleaseAt.getDate() + 3);
    
    await connection.query(
      `UPDATE bookings 
       SET status = 'awaiting_confirmation', 
           worker_completed_at = NOW(),
           auto_release_at = ?
       WHERE id = ?`,
      [autoReleaseAt, id]
    );
    
    await connection.query(
      `INSERT INTO notifications 
       (id, user_id, type, title, message, booking_id, created_at)
       VALUES (UUID(), ?, 'job_completed', 'Job Completed!', 
               'Worker has marked the job as complete. Please confirm to release payment.', 
               ?, NOW())`,
      [booking.client_id, id]
    );
    
    connection.release();
    
    console.log(`✅ Job #${id} marked as complete, awaiting client confirmation`);
    
    res.json({ 
      success: true,
      message: 'Job marked as complete. Waiting for client confirmation.',
      auto_release_at: autoReleaseAt,
      status: 'awaiting_confirmation'
    });
    
  } catch (error) {
    if (connection) connection.release();
    console.error('❌ Complete job error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Client confirms job completion and releases funds
router.post('/:id/confirm-completion', async (req, res) => {
  console.log('=== 📥 CONFIRM COMPLETION REQUEST ===');
  
  const { id } = req.params;
  const { client_id } = req.body;
  
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    const [bookings] = await connection.query(
      `SELECT b.*, p.id as payment_id, p.amount 
       FROM bookings b
       LEFT JOIN payments p ON b.id = p.booking_id
       WHERE b.id = ? AND b.client_id = ? AND b.status = 'awaiting_confirmation'`,
      [id, client_id]
    );
    
    if (bookings.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found or not awaiting confirmation' 
      });
    }
    
    const booking = bookings[0];
    const totalAmount = parseFloat(booking.total_amount);
    
    const commission = totalAmount * 0.01;
    const workerAmount = totalAmount - commission;
    
    // Platform commission
    try {
      console.log(`💰 Processing platform commission: $${commission} for booking #${id}`);
      
      const [platformWallets] = await connection.query(
        'SELECT id, balance FROM wallets WHERE user_id = ?',
        ['12fingers-platform']
      );
      
      let platformWalletId;
      let platformNewBalance;
      
      if (platformWallets.length === 0) {
        console.log('🆕 Platform wallet not found, creating...');
        const [result] = await connection.query(
          'INSERT INTO wallets (user_id, balance, currency) VALUES (?, ?, "USD")',
          ['12fingers-platform', commission]
        );
        platformWalletId = result.insertId;
        platformNewBalance = commission;
        console.log(`✅ Created platform wallet ID: ${platformWalletId} with balance: $${commission}`);
      } else {
        platformWalletId = platformWallets[0].id;
        platformNewBalance = parseFloat(platformWallets[0].balance) + commission;
        
        await connection.query(
          'UPDATE wallets SET balance = ? WHERE id = ?',
          [platformNewBalance, platformWalletId]
        );
        console.log(`💰 Platform wallet updated: +$${commission} (new balance: $${platformNewBalance})`);
      }
      
      await connection.query(
        `INSERT INTO wallet_transactions 
          (wallet_id, booking_id, type, amount, description, created_at)
        VALUES (?, ?, 'commission', ?, CONCAT('12Fingers platform fee (1%) for booking #', ?), NOW())`,
        [platformWalletId, id, commission, id]
      );
      
    } catch (platformError) {
      console.error('⚠️ Error processing platform commission:', platformError);
    }
    
    console.log('💸 Amount breakdown:', {
      total: totalAmount,
      commission,
      workerAmount
    });
    
    const [payments] = await connection.query(
      'SELECT id FROM payments WHERE booking_id = ? AND status = "held_in_escrow"',
      [id]
    );
    
    if (payments.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        error: 'Escrow payment not found' 
      });
    }
    
    const paymentId = payments[0].id;
    
    const [workerWallets] = await connection.query(
      'SELECT id, balance FROM wallets WHERE user_id = ?',
      [booking.worker_id]
    );
    
    let workerWalletId;
    let workerNewBalance;
    
    if (workerWallets.length === 0) {
      const [result] = await connection.query(
        'INSERT INTO wallets (user_id, balance, currency) VALUES (?, ?, "USD")',
        [booking.worker_id, workerAmount]
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
    
    await connection.query(
      `INSERT INTO wallet_transactions 
        (wallet_id, booking_id, type, amount, description, created_at)
      VALUES (?, ?, 'escrow_release', ?, 'Payment for completed work', NOW())`,
      [workerWalletId, id, workerAmount]
    );
    
    await connection.query(
      `UPDATE payments 
       SET status = 'released', released_at = NOW()
       WHERE id = ?`,
      [paymentId]
    );
    
    await connection.query(
	  `UPDATE bookings 
	   SET status = 'completed', 
		   client_confirmed_at = NOW()
	   WHERE id = ?`,
	  [id]
	);
    
    await connection.query(
      `INSERT INTO notifications 
       (id, user_id, type, title, message, booking_id, created_at)
       VALUES (UUID(), ?, 'payment_received', 'Payment Received!', 
               CONCAT('Payment of $', ?, ' has been released to your wallet'), 
               ?, NOW())`,
      [booking.worker_id, workerAmount, id]
    );
    
    await connection.commit();
    
    console.log(`✅ Funds released successfully to worker: $${workerAmount}`);
    
    res.json({
      success: true,
      message: 'Job confirmed! Payment released to worker.',
      amounts: {
        total: totalAmount,
        worker_received: workerAmount,
        commission: commission
      }
    });
    
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('❌ Confirm completion error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) connection.release();
  }
});

// GET bookings by client ID
router.get('/client/:clientId', async (req, res) => {
  console.log('=== 📥 GET CLIENT BOOKINGS REQUEST ===');
  
  let connection;
  try {
    const { clientId } = req.params;
    connection = await pool.getConnection();

    const [bookings] = await connection.query(`
      SELECT 
        b.*,
        wp.name as worker_name,
        wp.category as worker_category
      FROM bookings b
      LEFT JOIN worker_profiles wp ON b.worker_id = wp.id
      WHERE b.client_id = ?
      ORDER BY b.created_at DESC
    `, [clientId]);

    console.log(`✅ Found ${bookings.length} bookings for client ${clientId}`);
    
    res.json({
      success: true,
      bookings: bookings,
      count: bookings.length
    });

  } catch (error) {
    console.error('❌ DATABASE ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch client bookings: ' + error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 GET CLIENT BOOKINGS COMPLETE ===');
  }
});

// GET bookings by worker ID
router.get('/worker/:workerId', async (req, res) => {
  console.log('=== 📥 GET WORKER BOOKINGS REQUEST ===');
  
  let connection;
  try {
    const { workerId } = req.params;
    connection = await pool.getConnection();

    const [bookings] = await connection.query(`
      SELECT 
        b.*,
        wp.name as worker_name,
        wp.category as worker_category,
        c.name as client_name,
        c.email as client_email
      FROM bookings b
      LEFT JOIN worker_profiles wp ON b.worker_id = wp.id
      LEFT JOIN clients c ON b.client_id = c.id 
      WHERE b.worker_id = ?
      ORDER BY 
        CASE 
          WHEN b.status = 'offer_pending' THEN 1
          WHEN b.status = 'offer_accepted' THEN 2
          WHEN b.status = 'confirmed' THEN 3
          WHEN b.status = 'in_progress' THEN 4
          WHEN b.status = 'awaiting_confirmation' THEN 5
          WHEN b.status = 'completed' THEN 6
          ELSE 7
        END,
        b.created_at DESC
    `, [workerId]);

    console.log(`✅ Found ${bookings.length} bookings for worker ${workerId}`);
    
    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {});
    
    res.json({
      success: true,
      bookings: bookings,
      count: bookings.length,
      status_counts: statusCounts
    });

  } catch (error) {
    console.error('❌ DATABASE ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch worker bookings: ' + error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 GET WORKER BOOKINGS COMPLETE ===');
  }
});

// GET bookings by user ID (client)
router.get('/user/:userId', async (req, res) => {
  console.log('=== 📥 GET USER BOOKINGS REQUEST ===');
  
  const { userId } = req.params;
  let connection;
  
  try {
    connection = await pool.getConnection();
    
    const [bookings] = await connection.query(
      `SELECT b.*, 
              wp.name as worker_name,
              wp.category as worker_category,
              c.name as client_name,
              c.email as client_email
       FROM bookings b
       LEFT JOIN worker_profiles wp ON b.worker_id = wp.id
       LEFT JOIN clients c ON b.client_id = c.id  
       WHERE b.client_id = ?
       ORDER BY b.created_at DESC`,
      [userId]
    );
    
    console.log(`✅ Found ${bookings.length} bookings for user ${userId}`);
    
    res.json({
      success: true,
      bookings: bookings || []
    });
    
  } catch (error) {
    console.error('❌ Error fetching user bookings:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 GET USER BOOKINGS COMPLETE ===');
  }
});

// GET booking by ID with details
router.get('/:id', async (req, res) => {
  console.log('=== 📥 GET BOOKING DETAILS REQUEST ===');
  
  const { id } = req.params;
  let connection;
  
  try {
    connection = await pool.getConnection();

    const [bookings] = await connection.query(`
      SELECT 
        b.*,
        wp.name as worker_name,
        wp.category as worker_category,
        c.name as client_name,
        c.email as client_email
      FROM bookings b
      LEFT JOIN worker_profiles wp ON b.worker_id = wp.id
      LEFT JOIN clients c ON b.client_id = c.id
      WHERE b.id = ?
    `, [id]);

    if (bookings.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }
    
    const booking = bookings[0];
    
    res.json({
      success: true,
      booking: booking
    });

  } catch (error) {
    console.error('❌ DATABASE ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch booking details: ' + error.message
    });
  } finally {
    if (connection) connection.release();
    console.log('=== 📤 GET BOOKING DETAILS COMPLETE ===');
  }
});

export default router;

