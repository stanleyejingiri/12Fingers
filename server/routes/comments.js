// server/routes/comments.js
import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// Get comments for a worker
router.get('/worker/:workerId', async (req, res) => {
  console.log('=== 📥 GET COMMENTS REQUEST ===');
  
  try {
    const { workerId } = req.params;

    const [comments] = await pool.query(`
      SELECT 
        wc.*,
        c.name as user_name,
        c.email as user_email
      FROM worker_comments wc
      LEFT JOIN clients c ON wc.user_id = c.id
      WHERE wc.worker_id = ?
      ORDER BY wc.created_at DESC
    `, [workerId]);

    console.log(`✅ Found ${comments.length} comments for worker ${workerId}`);

    res.json({
      success: true,
      comments: comments
    });

  } catch (error) {
    console.error('❌ Get comments error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add a new comment
router.post('/', async (req, res) => {
  console.log('=== 📥 ADD COMMENT REQUEST ===');
  console.log('Body:', req.body);
  
  try {
    const { worker_id, user_id, comment, rating } = req.body;

    if (!worker_id || !user_id || !comment || !rating) {
      return res.status(400).json({
        success: false,
        error: 'worker_id, user_id, comment, and rating are required'
      });
    }

    const [result] = await pool.query(`
      INSERT INTO worker_comments 
        (worker_id, user_id, comment, rating)
      VALUES (?, ?, ?, ?)
    `, [worker_id, user_id, comment, rating]);

    console.log('✅ Comment added with ID:', result.insertId);

    // Get the newly created comment with user info
    const [newComment] = await pool.query(`
      SELECT 
        wc.*,
        c.name as user_name,
        c.email as user_email
      FROM worker_comments wc
      LEFT JOIN clients c ON wc.user_id = c.id
      WHERE wc.id = ?
    `, [result.insertId]);

    res.json({
      success: true,
      comment: newComment[0],
      message: 'Comment added successfully'
    });

  } catch (error) {
    console.error('❌ Add comment error:', error);
    
    // Handle duplicate comment error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        error: 'You have already commented on this worker'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;