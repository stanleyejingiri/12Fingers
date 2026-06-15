// server/routes/auth.js - COMPLETE CORRECTED VERSION
import express from 'express';
import { pool } from '../database.js';
import bcrypt from 'bcrypt';
import sendEmail from '../config/email.js';
import { welcomeEmail } from '../templates/emails.js';

const router = express.Router();

const { v4: uuidv4 } = require('uuid');

// LOGIN ENDPOINT - FIXED WITH BETTER DEBUGGING
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt for:', email);
    
    console.log('🔐 Password debug:', {
      rawPassword: password,
      length: password?.length,
      type: typeof password,
      first5Chars: password?.substring(0, 5),
      last5Chars: password?.substring(Math.max(0, password?.length - 5))
    });
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    // Check worker_profiles first
    const [workers] = await pool.query(
      'SELECT * FROM worker_profiles WHERE contact_email = ?',
      [email]
    );

    console.log('👷 Found workers:', workers.length, 'for email:', email);
    
    if (workers.length > 0) {
      const worker = workers[0];
	  
      // Check if worker is suspended
      if (worker.status && worker.status !== 'active') {
        const suspendDate = worker.suspended_at ? new Date(worker.suspended_at).toLocaleDateString() : 'recently';
        return res.status(403).json({
          success: false,
          error: `Your worker account has been ${worker.status}. Reason: ${worker.suspension_reason || 'No reason provided'}. Contact support for assistance.`,
          suspended: true
        });
      }
      
      console.log('🔑 Worker password debug:', {
        hasPassword: !!worker.password,
        passwordLength: worker.password?.length,
        passwordPrefix: worker.password?.substring(0, 10),
        passwordType: typeof worker.password
      });
      
      let isValidPassword = false;
      
      try {
        if (worker.password && worker.password.startsWith('$2')) {
          console.log('🔄 Trying bcrypt compare for worker...');
          isValidPassword = await bcrypt.compare(password, worker.password);
          console.log('✅ Bcrypt result for worker:', isValidPassword);
        } else {
          console.log('📝 Using plaintext comparison for worker (not a bcrypt hash)');
          isValidPassword = (worker.password === password);
        }
      } catch (bcryptError) {
        console.log('⚠️ Bcrypt error for worker:', bcryptError.message);
        console.log('📝 Falling back to plaintext comparison for worker');
        isValidPassword = (worker.password === password);
      }
      
      if (isValidPassword) {
        console.log('✅ Worker logged in:', worker.name);
        return res.json({
          success: true,
          message: 'Login successful',
          user: {
            id: worker.id,
            name: worker.name,
            email: worker.contact_email,
            category: worker.category,
            is_verified: worker.is_verified,
            userType: 'worker',
            phone: null
          }
        });
      } else {
        console.log('❌ Password incorrect for worker:', worker.name);
      }
    }

    const [clients] = await pool.query(
	  'SELECT id, name, email, phone, password, created_at FROM clients WHERE email = ?',
	  [email]
	);

    console.log('👤 Found clients:', clients.length, 'for email:', email);
    
    if (clients.length > 0) {
      const client = clients[0];
      
      // Check if user is suspended
      if (client.status && client.status !== 'active') {
        const suspendDate = client.suspended_at ? new Date(client.suspended_at).toLocaleDateString() : 'recently';
        return res.status(403).json({
          success: false,
          error: `Your account has been ${client.status}. Reason: ${client.suspension_reason || 'No reason provided'}. Contact support for assistance.`,
          suspended: true
        });
      }
      
      console.log('🔑 Client password debug:', {
        hasPassword: !!client.password,
        passwordLength: client.password?.length,
        passwordPrefix: client.password?.substring(0, 10),
        passwordType: typeof client.password
      });
      
      let isValidPassword = false;
      
      try {
        if (client.password && client.password.startsWith('$2')) {
          console.log('🔄 Trying bcrypt compare for client...');
          isValidPassword = await bcrypt.compare(password, client.password);
          console.log('✅ Bcrypt result for client:', isValidPassword);
        } else {
          console.log('📝 Using plaintext comparison for client (not a bcrypt hash)');
          isValidPassword = (client.password === password);
        }
      } catch (bcryptError) {
        console.log('⚠️ Bcrypt error for client:', bcryptError.message);
        console.log('📝 Falling back to plaintext comparison for client');
        isValidPassword = (client.password === password);
      }
      
      if (isValidPassword) {
        console.log('✅ Client logged in:', client.name);
        return res.json({
          success: true,
          message: 'Login successful',
          user: {
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone || null,   // 🔴 ADDED phone field
            category: 'client',
            is_verified: true,
            userType: 'client'
          }
        });
      } else {
        console.log('❌ Password incorrect for client:', client.name);
      }
    }

    console.log('❌ No user found or password incorrect for:', email);
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid email or password' 
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('❌ Login error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed: ' + error.message 
    });
  }
});

// REGISTRATION ENDPOINT - CLEAN VERSION
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone, userType, ...workerData } = req.body;
    
    console.log('📝 Registration attempt for:', email);

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }
    
    // Set default name if not provided
    const userName = name || email.split('@')[0];

    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT id FROM clients WHERE email = ? UNION SELECT id FROM worker_profiles WHERE contact_email = ?',
      [email, email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let userData;
    let insertResult;

    if (userType === 'worker') {
      // Register as worker
      /*[insertResult] = await pool.query(
        `INSERT INTO worker_profiles (
          name, contact_email, password, 
          category, years_of_experience, hourly_rate,
          country, state, city, description,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          userName,
          email,
          hashedPassword,
          workerData.category || 'General',
          workerData.years_of_experience || 0,
          workerData.hourly_rate || 0,
          workerData.country || '',
          workerData.state || '',
          workerData.city || '',
          workerData.description || ''
        ]
      );*/
	  // Register as worker
		const workerId = uuidv4();
		[insertResult] = await pool.query(
		  `INSERT INTO worker_profiles (
			id, name, contact_email, password,
			category, years_of_experience, hourly_rate,
			country, state, city, description,
			created_at
		  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
		  [
			workerId,
			userName,
			email,
			hashedPassword,
			workerData.category || 'General',
			workerData.years_of_experience || 0,
			workerData.hourly_rate || 0,
			workerData.country || '',
			workerData.state || '',
			workerData.city || '',
			workerData.description || ''
		  ]
		);

      userData = {
        /*id: insertResult.insertId,*/
		id: workerId,
        name: userName,
        email: email,
        category: workerData.category || 'General',
        is_verified: false,
        userType: 'worker',
        phone: null
      };

      console.log('👷 Worker registered:', userName);
      
    } else {
      // Register as client
      [/*insertResult] = await pool.query(
        `INSERT INTO clients (name, email, password, phone, created_at) 
         VALUES (?, ?, ?, ?, NOW())`,
        [userName, email, hashedPassword, phone || null]
      );*/
	  // Register as client
		const clientId = uuidv4();
		[insertResult] = await pool.query(
		  `INSERT INTO clients (id, name, email, password, phone, created_at)
		   VALUES (?, ?, ?, ?, ?, NOW())`,
		  [clientId, userName, email, hashedPassword, phone || null]
		);

      userData = {
       /* id: insertResult.insertId,*/
		id: clientId,
        name: userName,
        email: email,
        phone: phone || null,
        category: 'client',
        is_verified: false,
        userType: 'client'
      };

      console.log('👤 Client registered:', userName);
    }

    // SEND WELCOME EMAIL
    console.log('📧 SENDING WELCOME EMAIL TO:', email);
    
    try {
      const emailResult = await sendEmail({
        to: email,
        ...welcomeEmail(userName)
      });
      console.log('📧 EMAIL SENT:', emailResult);
    } catch (emailError) {
      console.error('❌ EMAIL FAILED:', emailError.message);
    }

    // Send response
    res.json({
      success: true,
      message: `${userType} registered successfully`,
      user: userData
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Registration failed: ' + error.message 
    });
  }
});

// PUT update client profile
router.put('/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;
  
  console.log('📥 Update client request:', { id, name, phone });
  
  try {
    // Check if client exists
    const [existing] = await pool.query(
      'SELECT id FROM clients WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }
    
    // Update the profile
    await pool.query(
      'UPDATE clients SET name = ?, phone = ? WHERE id = ?',
      [name, phone, id]
    );
    
    // Fetch updated client
    const [updated] = await pool.query(
      'SELECT id, name, email, phone, created_at FROM clients WHERE id = ?',
      [id]
    );
    
    res.json({
      success: true,
      user: updated[0],
      message: 'Profile updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Update client error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;