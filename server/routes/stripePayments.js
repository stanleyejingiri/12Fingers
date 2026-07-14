// server/routes/stripePayments.js
import express from 'express';
import Stripe from 'stripe';
import { pool } from '../database.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. Create deposit checkout session (wallet funding)
router.post('/create-deposit-session', async (req, res) => {
  try {
    const { userId, amount, email } = req.body;
    
    console.log('💰 Creating deposit session:', { userId, amount });
    
    if (!userId || !amount || amount < 1) {
      return res.status(400).json({
        success: false,
        error: 'Valid userId and amount (min $1) required'
      });
    }
    
    // Get or create Stripe customer
    let stripeCustomerId;
    const [existingCustomers] = await pool.query(
      'SELECT stripe_customer_id FROM stripe_customers WHERE user_id = ?',
      [userId]
    );
    
    if (existingCustomers.length > 0) {
      stripeCustomerId = existingCustomers[0].stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: email,
        metadata: { userId }
      });
      
      stripeCustomerId = customer.id;
      
      await pool.query(
        'INSERT INTO stripe_customers (user_id, stripe_customer_id, email) VALUES (?, ?, ?)',
        [userId, stripeCustomerId, email]
      );
      
      console.log('✅ Created new Stripe customer:', stripeCustomerId);
    }
    
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: '12Fingers Wallet Deposit',
            description: 'Add funds to your wallet for bookings'
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=deposit&amount=${amount}&userId=${userId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard`,
      metadata: {
        userId,
        type: 'deposit',
        amount: amount.toString()
      }
    });
    
    await pool.query(
      `INSERT INTO stripe_payment_intents 
       (payment_intent_id, user_id, amount, status, metadata)
       VALUES (?, ?, ?, 'pending', ?)`,
      [session.id, userId, amount, JSON.stringify({ type: 'deposit' })]
    );
    
    console.log('✅ Checkout session created:', session.id);
    
    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
    
  } catch (error) {
    console.error('❌ Create deposit session error:', error);
    res.status(500).json({
      success: false,
	  error: 'Payment processing failed. Please try again.'  // ✅ Generic error message
      //error: error.message
    });
  }
});


// 2. Create booking payment checkout session (NEW)
router.post('/create-booking-session', async (req, res) => {
  try {
    const { bookingId, amount, clientId, workerId, email } = req.body;
    
    console.log('💰 Creating booking payment session:', { bookingId, amount, clientId });
    
    if (!bookingId || !amount || amount < 1) {
      return res.status(400).json({
        success: false,
        error: 'Valid bookingId and amount (min $1) required'
      });
    }
    
    // Get or create Stripe customer
    let stripeCustomerId;
    const [existingCustomers] = await pool.query(
      'SELECT stripe_customer_id FROM stripe_customers WHERE user_id = ?',
      [clientId]
    );
    
    if (existingCustomers.length > 0) {
      stripeCustomerId = existingCustomers[0].stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: email,
        metadata: { userId: clientId }
      });
      
      stripeCustomerId = customer.id;
      
      await pool.query(
        'INSERT INTO stripe_customers (user_id, stripe_customer_id, email) VALUES (?, ?, ?)',
        [clientId, stripeCustomerId, email]
      );
      
      console.log('✅ Created new Stripe customer:', stripeCustomerId);
    }
    
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: '12Fingers Booking Payment',
            description: `Payment for booking #${bookingId}`
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=booking&amount=${amount}&userId=${clientId}&bookingId=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard`,
      metadata: {
        userId: clientId,
        bookingId: bookingId,
        workerId: workerId,
        type: 'booking',
        amount: amount.toString()
      }
    });
    
    await pool.query(
      `INSERT INTO stripe_payment_intents 
       (payment_intent_id, user_id, amount, status, metadata)
       VALUES (?, ?, ?, 'pending', ?)`,
      [session.id, clientId, amount, JSON.stringify({ type: 'booking', bookingId })]
    );
    
    console.log('✅ Booking checkout session created:', session.id);
    
    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
    
  } catch (error) {
    console.error('❌ Create booking session error:', error);
    res.status(500).json({
      success: false,
      //error: error.message
	  error: 'Booking failed. Please try again.'  // ✅ Generic error message
    });
  }
});

// 3. Check payment status (handles both deposit and booking)
router.get('/check-payment/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    console.log('🔍 Checking payment status for session:', sessionId);
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log('📊 Session status:', session.payment_status);
    console.log('📦 Session metadata:', session.metadata);
    
    if (session.payment_status === 'paid') {
      const userId = session.metadata.userId;
      const amount = session.metadata.amount;
      const type = session.metadata.type;
      const bookingId = session.metadata.bookingId;
      
      const connection = await pool.getConnection();
      
      try {
        await connection.beginTransaction();
        
        // Check if already processed
        const [existing] = await connection.query(
          'SELECT status FROM stripe_payment_intents WHERE payment_intent_id = ?',
          [sessionId]
        );
        
        if (existing.length > 0 && existing[0].status === 'completed') {
          console.log('✅ Payment already processed');
          await connection.rollback();
          connection.release();
          
          return res.json({
            success: true,
            paid: true,
            alreadyProcessed: true,
            amount: amount
          });
        }
        
        // Update payment intent status
        await connection.query(
          'UPDATE stripe_payment_intents SET status = ? WHERE payment_intent_id = ?',
          ['completed', sessionId]
        );
        
        // Create payment transaction record
        await connection.query(
          `INSERT INTO payment_transactions 
           (user_id, type, amount, status, stripe_payment_intent_id, description)
           VALUES (?, ?, ?, 'completed', ?, ?)`,
          [userId, type, amount, sessionId, `${type} via Stripe`]
        );
        
        // Handle different payment types
        if (type === 'deposit') {
		  // Update wallet balance for deposit
		  const [wallets] = await connection.query(
			'SELECT id, balance FROM wallets WHERE user_id = ?',
			[userId]
		  );
		  
		  let walletId;
		  let newBalance;
		  
		  if (wallets.length > 0) {
			// Existing wallet - update it
			walletId = wallets[0].id;
			newBalance = parseFloat(wallets[0].balance) + parseFloat(amount);
			
			await connection.query(
			  'UPDATE wallets SET balance = ? WHERE id = ?',
			  [newBalance, walletId]
			);
		  } else {
			// 🔴 NEW: Create wallet if it doesn't exist - ADD UUID HERE
			walletId = uuidv4();
			newBalance = parseFloat(amount);
			
			await connection.query(
			  'INSERT INTO wallets (id, user_id, balance, currency) VALUES (?, ?, ?, "USD")',
			  [walletId, userId, newBalance]
			);
			
			console.log(`🆕 New wallet created for user ${userId} with ID ${walletId}`);
		  }
		  
		  // 🔴 MOVE THIS OUTSIDE the if/else - it should run for both cases
		  await connection.query(
			`INSERT INTO wallet_transactions 
			 (wallet_id, type, amount, description)
			 VALUES (?, 'deposit', ?, 'Stripe deposit')`,
			[walletId, amount]
		  );
		  
		  console.log(`✅ Wallet updated: User ${userId} +$${amount}`);
		} else if (type === 'booking' && bookingId) {
          // 🔴 NEW: Create escrow payment record for booking
          const [existingPayment] = await connection.query(
            'SELECT id FROM payments WHERE booking_id = ?',
            [bookingId]
          );
          
          if (existingPayment.length === 0) {
            await connection.query(
              `INSERT INTO payments 
               (booking_id, amount, status, payment_method, created_at, updated_at)
               VALUES (?, ?, 'held_in_escrow', 'card', NOW(), NOW())`,
              [bookingId, amount]
            );
            console.log(`✅ Escrow payment record created for booking ${bookingId}`);
          }
          
          // Update booking status to confirmed
          await connection.query(
            'UPDATE bookings SET status = ? WHERE id = ?',
            ['confirmed', bookingId]
          );
          console.log(`✅ Booking ${bookingId} status updated to confirmed`);
        }
        
        await connection.commit();
        console.log('✅ Payment processed successfully');
        
        res.json({
          success: true,
          paid: true,
          amount: amount,
          type: type,
          message: 'Payment processed successfully'
        });
        
      } catch (dbError) {
        await connection.rollback();
        throw dbError;
      } finally {
        connection.release();
      }
      
    } else {
      res.json({
        success: true,
        paid: false,
        payment_status: session.payment_status,
        message: 'Payment not yet completed'
      });
    }
    
  } catch (error) {
    console.error('❌ Check payment error:', error);
    res.status(500).json({
      success: false,
      //error: error.message
	  error: 'Payment processing failed. Please try again.'  // ✅ Generic error message
    });
  }
});

// 4. Stripe webhook for payment confirmation (MOST RELIABLE)
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const amount = session.metadata.amount;
    const type = session.metadata.type;

    console.log(`💰 Webhook: Payment successful for user ${userId}, amount $${amount}`);

    try {
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      // Check if already processed
      const [existing] = await connection.query(
        'SELECT status FROM stripe_payment_intents WHERE payment_intent_id = ?',
        [session.id]
      );

      if (existing.length > 0 && existing[0].status === 'completed') {
        await connection.rollback();
        connection.release();
        return res.json({ received: true, alreadyProcessed: true });
      }

      // Update payment status
      await connection.query(
        'UPDATE stripe_payment_intents SET status = ? WHERE payment_intent_id = ?',
        ['completed', session.id]
      );

      // Handle deposit
      if (type === 'deposit') {
        const walletId = uuidv4();
        const [wallets] = await connection.query(
          'SELECT id, balance FROM wallets WHERE user_id = ?',
          [userId]
        );

        let walletIdToUse;
        let newBalance;

        if (wallets.length > 0) {
          walletIdToUse = wallets[0].id;
          newBalance = parseFloat(wallets[0].balance) + parseFloat(amount);
          await connection.query(
            'UPDATE wallets SET balance = ? WHERE id = ?',
            [newBalance, walletIdToUse]
          );
        } else {
          walletIdToUse = walletId;
          newBalance = parseFloat(amount);
          await connection.query(
            'INSERT INTO wallets (id, user_id, balance, currency) VALUES (?, ?, ?, "USD")',
            [walletIdToUse, userId, newBalance]
          );
        }

        await connection.query(
          `INSERT INTO wallet_transactions 
           (wallet_id, type, amount, description)
           VALUES (?, 'deposit', ?, 'Stripe deposit via webhook')`,
          [walletIdToUse, amount]
        );

        console.log(`✅ Webhook: Wallet updated for user ${userId} +$${amount}`);
      }

      await connection.commit();
      connection.release();

    } catch (dbError) {
		console.error('❌ Webhook DB error:', dbError);
		return res.status(500).json({ 
		success: false,
		error: 'Payment processing failed. Please try again.' 
	}
 }

  res.json({ received: true });
});

export default router;