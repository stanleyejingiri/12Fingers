//server/routes/workers.js
/*
import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// Get all workers with their service packages
router.get('/', async (req, res) => {
  console.log('📨 GET /api/workers');
  
  try {
    // First get all workers
    const [workers] = await pool.query(`
      SELECT 
        wp.*,
        c.name as client_name,
        c.email as client_email
      FROM worker_profiles wp
      LEFT JOIN clients c ON wp.user_id = c.id
      ORDER BY wp.created_at DESC
    `);

    console.log(`✅ Found ${workers.length} workers`);

    // For each worker, get their service packages
    const workersWithPackages = await Promise.all(
      workers.map(async (worker) => {
        const [packages] = await pool.query(`
          SELECT * FROM service_packages 
          WHERE worker_id = ?
          ORDER BY price
        `, [worker.id]);

        return {
          ...worker,
          servicePackages: packages || []
        };
      })
    );

    console.log(`✅ Added packages to ${workersWithPackages.length} workers`);

    res.json({
      success: true,
      workers: workersWithPackages
    });

  } catch (error) {
    console.error('❌ Get workers error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET all worker categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name FROM worker_categories WHERE is_active = 1 ORDER BY display_order'
    );
    res.json({ success: true, categories: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get single worker by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [workers] = await pool.query(`
      SELECT 
        wp.*,
        c.name as client_name,
        c.email as client_email
      FROM worker_profiles wp
      LEFT JOIN clients c ON wp.user_id = c.id
      WHERE wp.id = ? AND wp.is_verified = 1
    `, [id]);

    if (workers.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Worker not found'
      });
    }

    const worker = workers[0];
    
    // Get service packages
    const [packages] = await pool.query(`
      SELECT * FROM service_packages 
      WHERE worker_id = ?
      ORDER BY price
    `, [id]);

    // Get certifications if any
    const [certifications] = await pool.query(`
      SELECT * FROM worker_certifications 
      WHERE worker_id = ?
      ORDER BY issue_date DESC
    `, [id]);

    res.json({
      success: true,
      worker: {
        ...worker,
        servicePackages: packages || [],
        certifications: certifications || []
      }
    });

  } catch (error) {
    console.error('❌ Get worker error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name FROM worker_categories WHERE is_active = 1 ORDER BY display_order'
    );
    res.json({ success: true, categories: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/workers/categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name FROM worker_categories WHERE is_active = 1 ORDER BY display_order'
    );
    res.json({ success: true, categories: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Save Stripe Connect account ID
router.post('/:workerId/stripe-connect', async (req, res) => {
  const { workerId } = req.params;
  const { stripeAccountId, connected } = req.body;
  
  try {
    await pool.query(
      `UPDATE worker_profiles 
       SET stripe_account_id = ?, 
           stripe_connected = ? 
       WHERE id = ?`,
      [stripeAccountId, connected ? 1 : 0, workerId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving Stripe account:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update worker profile
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    years_of_experience,
    hourly_rate,
    description,
    contact_phone,
    contact_email,
    city,
    state,
    country,
    offers_warranty,
    warranty_details
  } = req.body;

  try {
    // First check if worker exists
    const [existing] = await pool.query(
      'SELECT id FROM worker_profiles WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Worker not found'
      });
    }

    // Update the profile
    await pool.query(
      `UPDATE worker_profiles SET
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        years_of_experience = COALESCE(?, years_of_experience),
        hourly_rate = COALESCE(?, hourly_rate),
        description = COALESCE(?, description),
        contact_phone = COALESCE(?, contact_phone),
        contact_email = COALESCE(?, contact_email),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        country = COALESCE(?, country),
        offers_warranty = COALESCE(?, offers_warranty),
        warranty_details = COALESCE(?, warranty_details),
        updated_at = NOW()
      WHERE id = ?`,
      [
        name, category, years_of_experience, hourly_rate, description,
        contact_phone, contact_email, city, state, country,
        offers_warranty, warranty_details, id
      ]
    );

    // Fetch updated profile
    const [updated] = await pool.query(
      'SELECT * FROM worker_profiles WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      worker: updated[0],
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('❌ Update worker error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
export default router;
*/
// server/routes/workers.js
import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// ✅ SPECIFIC ROUTES FIRST (before parameterized routes)

// GET all worker categories
router.get('/categories', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name FROM worker_categories WHERE is_active = 1 ORDER BY display_order'
    );
    res.json({ success: true, categories: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Get all workers with their service packages
router.get('/', async (req, res) => {
  /*console.log('📨 GET /api/workers');*/
    try {
	console.log('📨 GET /api/workers');
    const [workers] = await pool.query(`
      SELECT 
        wp.*,
        c.name as client_name,
        c.email as client_email
      FROM worker_profiles wp
      LEFT JOIN clients c ON wp.user_id = c.id
      ORDER BY wp.created_at DESC
    `);

    console.log(`✅ Found ${workers.length} workers`);

    const workersWithPackages = await Promise.all(
      workers.map(async (worker) => {
        const [packages] = await pool.query(`
          SELECT * FROM service_packages 
          WHERE worker_id = ?
          ORDER BY price
        `, [worker.id]);

        return {
          ...worker,
          servicePackages: packages || []
        };
      })
    );

    console.log(`✅ Added packages to ${workersWithPackages.length} workers`);

    res.json({
      success: true,
      workers: workersWithPackages
    });

  } catch (error) {
    console.error('❌ Get workers error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ PARAMETERIZED ROUTES AFTER

// Get single worker by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const [workers] = await pool.query(`
      SELECT 
        wp.*,
        c.name as client_name,
        c.email as client_email
      FROM worker_profiles wp
      LEFT JOIN clients c ON wp.user_id = c.id
      WHERE wp.id = ? AND wp.is_verified = 1
    `, [id]);

    if (workers.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Worker not found'
      });
    }

    const worker = workers[0];
    
    const [packages] = await pool.query(`
      SELECT * FROM service_packages 
      WHERE worker_id = ?
      ORDER BY price
    `, [id]);

    const [certifications] = await pool.query(`
      SELECT * FROM worker_certifications 
      WHERE worker_id = ?
      ORDER BY issue_date DESC
    `, [id]);

    res.json({
      success: true,
      worker: {
        ...worker,
        servicePackages: packages || [],
        certifications: certifications || []
      }
    });

  } catch (error) {
    console.error('❌ Get worker error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Save Stripe Connect account ID
router.post('/:workerId/stripe-connect', async (req, res) => {
  const { workerId } = req.params;
  const { stripeAccountId, connected } = req.body;
  
  try {
    await pool.query(
      `UPDATE worker_profiles 
       SET stripe_account_id = ?, 
           stripe_connected = ? 
       WHERE id = ?`,
      [stripeAccountId, connected ? 1 : 0, workerId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving Stripe account:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update worker profile
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    years_of_experience,
    hourly_rate,
    description,
    contact_phone,
    contact_email,
    city,
    state,
    country,
    offers_warranty,
    warranty_details
  } = req.body;

  try {
    const [existing] = await pool.query(
      'SELECT id FROM worker_profiles WHERE id = ?',
      [id]
    );
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Worker not found'
      });
    }

    await pool.query(
      `UPDATE worker_profiles SET
        name = COALESCE(?, name),
        category = COALESCE(?, category),
        years_of_experience = COALESCE(?, years_of_experience),
        hourly_rate = COALESCE(?, hourly_rate),
        description = COALESCE(?, description),
        contact_phone = COALESCE(?, contact_phone),
        contact_email = COALESCE(?, contact_email),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        country = COALESCE(?, country),
        offers_warranty = COALESCE(?, offers_warranty),
        warranty_details = COALESCE(?, warranty_details),
        updated_at = NOW()
      WHERE id = ?`,
      [
        name, category, years_of_experience, hourly_rate, description,
        contact_phone, contact_email, city, state, country,
        offers_warranty, warranty_details, id
      ]
    );

    const [updated] = await pool.query(
      'SELECT * FROM worker_profiles WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      worker: updated[0],
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('❌ Update worker error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;