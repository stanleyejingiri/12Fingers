// server/routes/reports.js
import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// Submit a report
router.post('/', async (req, res) => {
  console.log('=== 📥 SUBMIT REPORT REQUEST ===');
  console.log('Body:', req.body);
  
  try {
    const { reported_worker_id, reported_review_id, reporter_id, reason } = req.body;

    if (!reporter_id || !reason) {
      return res.status(400).json({
        success: false,
        error: 'reporter_id and reason are required'
      });
    }

    const [result] = await pool.query(`
      INSERT INTO reports 
        (reported_worker_id, reported_review_id, reporter_id, reason, status)
      VALUES (?, ?, ?, ?, 'pending')
    `, [reported_worker_id, reported_review_id, reporter_id, reason]);

    console.log('✅ Report submitted with ID:', result.insertId);

    res.json({
      success: true,
      report_id: result.insertId,
      message: 'Report submitted successfully'
    });

  } catch (error) {
    console.error('❌ Submit report error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;