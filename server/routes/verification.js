//server/routes/verifications.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { pool } from '../database.js';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/verification';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Submit verification request
router.post('/request', upload.single('document'), async (req, res) => {
  const { worker_id, legal_name, id_number, id_type, business_name, business_type } = req.body;
  const document_url = req.file ? `/uploads/verification/${req.file.filename}` : null;

  try {
    // Check if already pending
    const [existing] = await pool.query(
      'SELECT id FROM verification_requests WHERE worker_id = ? AND status = "pending"',
      [worker_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'You already have a pending verification request' });
    }

    const [result] = await pool.query(
      `INSERT INTO verification_requests 
       (worker_id, legal_name, id_number, id_type, document_url, business_name, business_type, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [worker_id, legal_name, id_number, id_type, document_url, business_name, business_type]
    );

    res.json({ success: true, message: 'Verification request submitted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Get pending verification requests
router.get('/pending', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT vr.*, wp.name as worker_name 
      FROM verification_requests vr
      JOIN worker_profiles wp ON vr.worker_id = wp.id
      WHERE vr.status = 'pending'
      ORDER BY vr.requested_at ASC
    `);
    res.json({ success: true, requests: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Approve verification
router.post('/approve/:requestId', async (req, res) => {
  const { requestId } = req.params;
  const { admin_id, notes } = req.body;

  try {
    await pool.query(
      `UPDATE verification_requests SET status = 'approved', admin_notes = ?, reviewed_at = NOW(), reviewed_by = ? WHERE id = ?`,
      [notes, admin_id, requestId]
    );
    // Get worker_id to update worker_profiles
    const [reqRow] = await pool.query('SELECT worker_id FROM verification_requests WHERE id = ?', [requestId]);
    if (reqRow.length) {
      await pool.query('UPDATE worker_profiles SET is_verified = 1 WHERE id = ?', [reqRow[0].worker_id]);
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Reject verification
router.post('/reject/:requestId', async (req, res) => {
  const { requestId } = req.params;
  const { admin_id, reason } = req.body;

  try {
    await pool.query(
      `UPDATE verification_requests SET status = 'rejected', admin_notes = ?, reviewed_at = NOW(), reviewed_by = ? WHERE id = ?`,
      [reason, admin_id, requestId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;