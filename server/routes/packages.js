import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// Get all packages for a worker
router.get('/worker/:workerId', async (req, res) => {
  const { workerId } = req.params;
  try {
    const [packages] = await pool.query(
      'SELECT * FROM service_packages WHERE worker_id = ? ORDER BY price ASC',
      [workerId]
    );
    res.json({ success: true, packages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new package
router.post('/', async (req, res) => {
  const { worker_id, name, description, price, features, accepts_custom_offers } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO service_packages 
       (worker_id, name, description, price, features, accepts_custom_offers) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [worker_id, name, description, price, features || null, accepts_custom_offers || 1]
    );
    res.json({ success: true, packageId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Update a package
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, features, accepts_custom_offers } = req.body;
  try {
    await pool.query(
      `UPDATE service_packages 
       SET name = ?, description = ?, price = ?, features = ?, accepts_custom_offers = ?
       WHERE id = ?`,
      [name, description, price, features, accepts_custom_offers, id]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a package
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM service_packages WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;