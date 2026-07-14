// server/index.js 
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './database.js';
import authRouter from './routes/auth.js';
import bookingsRouter from './routes/bookings.js';
import messagesRouter from './routes/messages.js';
import Stripe from 'stripe';
import reportsRouter from './routes/reports.js';
import commentsRouter from './routes/comments.js';
import favoritesRouter from './routes/favorites.js';
import locationsRouter from './routes/locations.js';
import workersRouter from './routes/workers.js';
import walletsRouter from './routes/wallets.js';
import paymentsRouter from './routes/payments.js';
import stripePaymentsRouter from './routes/stripePayments.js';
import notificationsRouter from './routes/notifications.js'; 
import dotenv from 'dotenv';
import withdrawalsRouter from './routes/withdrawals.js';
import adminRouter from './routes/admin.js';
import { apiLimiter, authLimiter, paymentLimiter } from './middleware/rateLimiter.js';
import { checkEnvironment } from './config/envCheck.js';
import testRouter from './routes/test.js';
import clientsRouter from './routes/clients.js';
import verificationRouter from './routes/verification.js';
import packagesRouter from './routes/packages.js';
//import pushRouter from './routes/push.js';


// Initialize dotenv
dotenv.config();

// Run this right after dotenv.config()
checkEnvironment(); 

const app = express();

// ✅ WEBHOOK MUST COME FIRST - before any body parsing middleware
app.use('/api/stripe/stripe-webhook', express.raw({ type: 'application/json' }));

// Initialize port
//const PORT = process.env.PORT || 3001;
const PORT = 3001;

// Initialize Stripe with your test key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// CORS MUST come before routes
app.use(cors({
  origin: [
    'http://localhost:8080', 
    'http://127.0.0.1:8080',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://one2fingers-frontend.onrender.com',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'user-data',
    'x-client-info'
  ]
}));

// Handle preflight requests for ALL routes
app.options('*', cors());

app.use(express.json());

// Debug middleware to see all requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Test database connection
try {
  const connection = await pool.getConnection();
  console.log('✅ Connected to MySQL database');
  connection.release();
} catch (err) {
  console.error('❌ Database connection error:', err);
}  

// Mount routers
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/workers', workersRouter);
app.use('/api/stripe', stripePaymentsRouter);
app.use('/api/wallets', walletsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/withdrawals', withdrawalsRouter);
app.use('/api/admin', adminRouter);
app.use('/api/verification', verificationRouter);
app.use('/uploads', express.static('uploads'));
app.use('/api/', apiLimiter); // Apply to all API routes
app.use('/api/auth/login', authLimiter); // Stricter for login
app.use('/api/payments/', paymentLimiter); // Stricter for payments
app.use('/api/test', testRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/packages', packagesRouter);
//app.use('/api/push', pushRouter);

console.log('✅ All routers loaded successfully');

//const notificationsRouter = require('./routes/notifications');
app.use('/api/notifications', notificationsRouter);
// Existing health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});
app.get('/api/workers', async (req, res) => {
  try {
    console.log('📋 Attempting to fetch workers with packages...');
    
    // First, let's check if the table exists
    const [tables] = await pool.query(`
      SHOW TABLES LIKE 'worker_profiles'
    `);
    
    if (tables.length === 0) {
      return res.status(404).json({ 
        error: 'worker_profiles table not found',
        availableTables: await getAvailableTables(pool)
      });
    }
    
    const [workers] = await pool.query(`
      SELECT 
        wp.id, wp.user_id, wp.name, wp.category, wp.hourly_rate, wp.description,
        wp.is_verified, wp.profile_image_url, wp.average_rating,
        wp.total_ratings, wp.years_of_experience, wp.contact_phone,
        wp.contact_email, wp.offers_warranty, wp.warranty_details
      FROM worker_profiles wp 
      ORDER BY wp.created_at DESC
    `);
    
    // Fetch packages for each worker
    const workersWithPackages = await Promise.all(
      workers.map(async (worker) => {
        const [packages] = await pool.query(`
          SELECT 
            id, name, description, price, features, accepts_custom_offers
          FROM service_packages 
          WHERE worker_id = ?
          ORDER BY created_at DESC
        `, [worker.id]);
        
        return {
          ...worker,
          servicePackages: packages.map(pkg => ({
            id: pkg.id,
            name: pkg.name,
            description: pkg.description,
            price: parseFloat(pkg.price) || 0,
            features: pkg.features ? JSON.parse(pkg.features) : [],
            acceptsCustomOffers: Boolean(pkg.accepts_custom_offers)
          }))
        };
      })
    );
    
    console.log(`✅ Found ${workersWithPackages.length} workers with packages`);
    res.json(workersWithPackages);
    
  } catch (error) {
    console.error('❌ Workers endpoint error:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.code,
      sqlState: error.sqlState
    });
  }
});

// Helper function to see available tables
async function getAvailableTables(pool) {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    return tables.map(table => Object.values(table)[0]);
  } catch (err) {
    return ['Cannot fetch tables'];
  }
}

// Local Stripe checkout endpoint
app.post('/api/create-checkout', async (req, res) => {
  try {
    console.log('💰 Creating Stripe checkout session...');
    
    const {
      workerId,
      bookingId,
      bookingDate,
      startTime,
      endTime,
      totalAmount,
      packageId,
      paymentMethod
    } = req.body;

    console.log('📦 Checkout data:', {
      workerId,
      bookingId,
      bookingDate,
      startTime,
      endTime,
      totalAmount,
      packageId,
      paymentMethod
    });

    // Calculate platform fee (1%)
    const platformFee = Math.round(totalAmount * 0.01 * 100); // In cents
    const finalAmount = Math.round(totalAmount * 100); // Stripe expects cents

    console.log('💸 Amount breakdown:', {
      totalAmount,
      finalAmount,
      platformFee
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: getPaymentMethods(paymentMethod),
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: finalAmount,
            product_data: {
              name: 'Worker Booking',
              description: `Booking for ${bookingDate} from ${startTime} to ${endTime}`,
            },
          },
        },
      ],
      metadata: {
        workerId,
        bookingId,
        bookingDate,
        startTime,
        endTime,
        packageId,
        paymentMethod,
        platformFee: platformFee.toString(),
      },
      success_url: `${req.headers.origin}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/booking-cancel`,
    });

    console.log('✅ Stripe session created:', session.id);
    
    res.json({ 
      success: true, 
      url: session.url 
    });

  } catch (error) {
    console.error('❌ Stripe checkout error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Helper function to map payment methods
function getPaymentMethods(selectedMethod) {
  switch (selectedMethod) {
    case 'card':
      return ['card'];
    case 'paypal':
      return ['paypal'];
    case 'wallet':
      return ['card', 'paypal']; // Wallet can use multiple methods
    default:
      return ['card'];
  }
}

// verify Stripe payments
app.get('/api/verify-payment', async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    console.log('🔍 Verifying Stripe session:', session_id);

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['payment_intent']
    });

    console.log('✅ Stripe session retrieved:', session.id);
    console.log('💰 Payment status:', session.payment_status);

    // Prepare payment details
    const paymentDetails = {
      sessionId: session.id,
      amount: session.amount_total,
      currency: session.currency,
      status: session.payment_status,
      bookingId: session.metadata?.bookingId,
      workerName: 'Worker Name', // You'll need to fetch this from your database
      bookingDate: session.metadata?.bookingDate
    };

    res.json({
      success: true,
      payment: paymentDetails
    });

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.set('trust proxy', 1);

// Stripe Connect endpoint 
app.post('/api/create-connect-account', async (req, res) => {
  try {
    const { workerId, returnUrl, refreshUrl } = req.body;

    console.log('🔗 Creating Stripe Connect account for worker:', workerId);

    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      business_type: 'individual',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        product_description: 'Skilled worker services',
      },
    });

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });

    console.log('✅ Stripe Connect account created:', account.id);

    // TODO: Save account.id to your worker_profiles table
    // await saveStripeAccountId(workerId, account.id);

    res.json({
      success: true,
      url: accountLink.url,
      accountId: account.id
    });

  } catch (error) {
    console.error('❌ Stripe Connect error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/workers`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/bookings`);
  console.log(`   - POST /api/messages`);
  console.log(`   - POST /api/create-checkout`);
  console.log(`   - GET  /api/wallets/balance/:userId`);
  console.log(`   - POST /api/payments/escrow`);
  console.log(`   - POST /api/payments/release/:paymentId`);
});