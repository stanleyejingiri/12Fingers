// server/simple-server.js - MINIMAL WORKING SERVER
import cors from 'cors';
import { pool } from './database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple server running' });
});

// GET all bookings
app.get('/api/bookings', async (req, res) => {
  console.log('=== 📥 GET BOOKINGS REQUEST ===');
  
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('🔗 Database connected for fetching bookings');

    // Fetch all bookings with related data
    const [bookings] = await connection.query(`
      SELECT 
        b.*,
        wp.name as worker_name,
        wp.category as worker_category
      FROM bookings b
      LEFT JOIN worker_profiles wp ON b.worker_id = wp.id
      ORDER BY b.created_at DESC
    `);

    console.log(`✅ Found ${bookings.length} bookings`);
    
    res.json({
      success: true,
      bookings: bookings
    });

  } catch (error) {
    console.error('❌ DATABASE ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch bookings: ' + error.message 
    });
  } finally {
    if (connection) {
      connection.release();
      console.log('🔗 Database connection released');
    }
    console.log('=== 📤 GET BOOKINGS COMPLETE ===');
  }
});

// POST create booking
app.post('/api/bookings', (req, res) => {
  console.log('📅 Booking request received:', req.body);
  res.json({ 
    success: true, 
    booking_id: 1,
    message: 'Booking received successfully',
    data: req.body
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SIMPLE Server running on http://localhost:${PORT}`);
});*/

// server/simple-server.js - UPDATED WITH AUTH ROUTES
import express from 'express';
import cors from 'cors';
import { pool } from './database.js';
import authRouter from './routes/auth.js'; // ADD THIS IMPORT

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ✅ ADD THIS LINE - Mount auth routes
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple server running' });
});

// GET all bookings
app.get('/api/bookings', async (req, res) => {
  console.log('=== 📥 GET BOOKINGS REQUEST ===');
  
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('🔗 Database connected for fetching bookings');

    const [bookings] = await connection.query(`
      SELECT 
        b.*,
        wp.name as worker_name,
        wp.category as worker_category
      FROM bookings b
      LEFT JOIN worker_profiles wp ON b.worker_id = wp.id
      ORDER BY b.created_at DESC
    `);

    console.log(`✅ Found ${bookings.length} bookings`);
    
    res.json({
      success: true,
      bookings: bookings
    });

  } catch (error) {
    console.error('❌ DATABASE ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch bookings: ' + error.message 
    });
  } finally {
    if (connection) {
      connection.release();
      console.log('🔗 Database connection released');
    }
    console.log('=== 📤 GET BOOKINGS COMPLETE ===');
  }
});

// POST create booking
app.post('/api/bookings', (req, res) => {
  console.log('📅 Booking request received:', req.body);
  res.json({ 
    success: true, 
    booking_id: 1,
    message: 'Booking received successfully',
    data: req.body
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SIMPLE Server running on http://localhost:${PORT}`);
  console.log(`✅ Auth routes available at: http://localhost:${PORT}/api/auth/login`);
  console.log(`✅ Auth routes available at: http://localhost:${PORT}/api/auth/register`);
});