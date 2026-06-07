// server/routes/clients.js
/*
import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// PUT update client profile
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;
  console.log('📥 Received phone:', phone);
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
console.log('📥 Update client request:', { id: req.params.id, body: req.body });
export default router;
*/
// server/routes/clients.js
import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// PUT update client profile
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;
  
  // Move console.log INSIDE the route handler
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