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
      /*success_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=deposit&amount=${amount}&userId=${userId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard`,*/
	  success_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/#/payment-success?session_id={CHECKOUT_SESSION_ID}&type=deposit&amount=${amount}&userId=${userId}`,
	  cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/#/dashboard`,
      metadata: {
        userId,
        type: 'deposit',
        amount: amount.toString()
      },
	  payment_intent_data: {
        metadata: {
          userId,
          type: 'deposit',
          amount: amount.toString()
        }
      }
    });
    console.log('🔗 Full session details:', {
	  id: session.id,
	  url: session.url,
	  status: session.status,
	  expires_at: session.expires_at
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
      error: 'Payment processing failed. Please try again.'
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
      /*success_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=booking&amount=${amount}&userId=${clientId}&bookingId=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard`,*/
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/#/payment-success?session_id={CHECKOUT_SESSION_ID}&type=booking&amount=${amount}&userId=${clientId}&bookingId=${bookingId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/#/dashboard`,
	  metadata: {
        userId: clientId,
        bookingId: bookingId,
        workerId: workerId,
        type: 'booking',
        amount: amount.toString()
      },
	  payment_intent_data: {
        metadata: {
          userId: clientId,
          bookingId: bookingId,
          workerId: workerId,
          type: 'booking',
          amount: amount.toString()
        }
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
      error: 'Payment processing failed. Please try again.'
    });
  }
});

// 3. Check payment status AND update wallet (fallback for unreliable webhooks)
router.get('/check-payment/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log('🔍 Checking payment status for session:', sessionId);
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('📊 Session status:', session.payment_status);
    
    if (session.payment_status !== 'paid') {
      return res.json({ success: true, paid: false, payment_status: session.payment_status });
    }

    const userId = session.metadata?.userId;
    const amount = session.metadata?.amount;
    const type = session.metadata?.type;

    if (!userId || !amount || !type) {
      console.log('⚠️ Check-payment skipped: missing metadata');
      return res.json({ success: true, paid: true, skipped: true });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();

      // Idempotency: check if already processed by webhook OR a previous check-payment call
      const [existing] = await connection.query(
        'SELECT status FROM stripe_payment_intents WHERE payment_intent_id = ?',
        [sessionId]
      );

      if (existing.length > 0 && existing[0].status === 'completed') {
        await connection.rollback();
        console.log('✅ Payment already processed, skipping wallet update');
        return res.json({ success: true, paid: true, alreadyProcessed: true });
      }

      // Mark as completed to prevent double-processing
      await connection.query(
        'UPDATE stripe_payment_intents SET status = ? WHERE payment_intent_id = ?',
        ['completed', sessionId]
      );

      if (type === 'deposit') {
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
          walletIdToUse = uuidv4();
          newBalance = parseFloat(amount);
          await connection.query(
            'INSERT INTO wallets (id, user_id, balance, currency) VALUES (?, ?, ?, "USD")',
            [walletIdToUse, userId, newBalance]
          );
        }

        await connection.query(
          `INSERT INTO wallet_transactions 
           (id, wallet_id, type, amount, description)
           VALUES (?, ?, 'deposit', ?, 'Stripe deposit via check-payment fallback')`,
          [uuidv4(), walletIdToUse, amount]
        );

        console.log(`✅ Check-payment: Wallet updated for user ${userId} +$${amount}`);
      }

      await connection.commit();
    } catch (dbError) {
      if (connection) await connection.rollback();
      console.error('❌ Check-payment DB error:', dbError);
      return res.status(500).json({ success: false, error: 'Payment processing failed.' });
    } finally {
      if (connection) connection.release();
    }

    res.json({ success: true, paid: true, amount, type, message: 'Payment processed successfully' });
  } catch (error) {
    console.error('❌ Check payment error:', error);
    res.status(500).json({ success: false, error: 'Failed to check payment status' });
  }
});

// 4. Stripe webhook for payment confirmation
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('🔔 WEBHOOK ENDPOINT HIT!');
  
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type !== 'checkout.session.completed') {
    return res.json({ received: true });
  }

  const session = event.data.object;
  const userId = session.metadata?.userId;
  const amount = session.metadata?.amount;
  const type = session.metadata?.type;

  // GUARD: Skip events without proper metadata (e.g. CLI test fixtures)
  if (!userId || !amount || !type) {
    console.log('⚠️ Webhook skipped: missing metadata', { userId, amount, type });
    return res.json({ received: true, skipped: true });
  }

  console.log(`💰 Webhook: Payment successful for user ${userId}, amount $${amount}`);

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Idempotency: skip if already processed
    const [existing] = await connection.query(
      'SELECT status FROM stripe_payment_intents WHERE payment_intent_id = ?',
      [session.id]
    );

    if (existing.length > 0 && existing[0].status === 'completed') {
      await connection.rollback();
      console.log('✅ Payment already processed, skipping');
      return res.json({ received: true, alreadyProcessed: true });
    }

    await connection.query(
      'UPDATE stripe_payment_intents SET status = ? WHERE payment_intent_id = ?',
      ['completed', session.id]
    );

    if (type === 'deposit') {
      const [wallets] = await connection.query(
        'SELECT id, balance FROM wallets WHERE user_id = ?',
        [userId]
      );

      if (wallets.length > 0) {
        const walletIdToUse = wallets[0].id;
        const newBalance = parseFloat(wallets[0].balance) + parseFloat(amount);

        await connection.query(
          'UPDATE wallets SET balance = ? WHERE id = ?',
          [newBalance, walletIdToUse]
        );

        await connection.query(
          `INSERT INTO wallet_transactions 
           (wallet_id, type, amount, description)
           VALUES (?, 'deposit', ?, 'Stripe deposit via webhook')`,
          [walletIdToUse, amount]
        );
      } else {
        const walletIdToUse = uuidv4();
        const newBalance = parseFloat(amount);

        await connection.query(
          'INSERT INTO wallets (id, user_id, balance, currency) VALUES (?, ?, ?, "USD")',
          [walletIdToUse, userId, newBalance]
        );

        await connection.query(
          `INSERT INTO wallet_transactions 
           (id, wallet_id, type, amount, description)
           VALUES (?, ?, 'deposit', ?, 'Stripe deposit via webhook')`,
          [uuidv4(), walletIdToUse, amount]
        );
      }

      console.log(`✅ Webhook: Wallet updated for user ${userId} +$${amount}`);
    }

    await connection.commit();
  } catch (dbError) {
    if (connection) await connection.rollback();
    console.error('❌ Webhook DB error:', dbError);
    return res.status(500).json({
      success: false,
      error: 'Payment processing failed. Please try again.'
    });
  } finally {
    if (connection) connection.release();
  }

  res.json({ received: true });
});

export default router;



