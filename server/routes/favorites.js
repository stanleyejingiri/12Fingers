// server/routes/favorites.js
import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// Toggle favorite (add/remove)
router.post('/toggle', async (req, res) => {
  console.log('=== 📥 TOGGLE FAVORITE REQUEST ===');
  console.log('Body:', req.body);
  
  try {
    const { user_id, worker_id } = req.body;

    if (!user_id || !worker_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id and worker_id are required'
      });
    }

    // Check if already favorited
    const [existing] = await pool.query(`
      SELECT id FROM user_favorites 
      WHERE user_id = ? AND worker_id = ?
    `, [user_id, worker_id]);

    let action;
    
    if (existing.length > 0) {
      // Remove from favorites
      await pool.query(`
        DELETE FROM user_favorites 
        WHERE user_id = ? AND worker_id = ?
      `, [user_id, worker_id]);
      action = 'removed';
    } else {
      // Add to favorites
      await pool.query(`
        INSERT INTO user_favorites (user_id, worker_id)
        VALUES (?, ?)
      `, [user_id, worker_id]);
      action = 'added';
    }

    console.log(`✅ Favorite ${action} for user ${user_id}, worker ${worker_id}`);

    res.json({
      success: true,
      action: action,
      is_favorite: action === 'added'
    });

  } catch (error) {
    console.error('❌ Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's favorites
router.get('/user/:userId', async (req, res) => {
  console.log('=== 📥 GET USER FAVORITES REQUEST ===');
  
  try {
    const { userId } = req.params;

    const [favorites] = await pool.query(`
      SELECT w.*, uf.created_at as favorited_at
      FROM user_favorites uf
      JOIN worker_profiles w ON uf.worker_id = w.id
      WHERE uf.user_id = ?
      ORDER BY uf.created_at DESC
    `, [userId]);

    console.log(`✅ Found ${favorites.length} favorites for user ${userId}`);

    res.json({
      success: true,
      favorites: favorites
    });

  } catch (error) {
    console.error('❌ Get favorites error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Check if a worker is favorited by user
router.get('/check', async (req, res) => {
  console.log('=== 📥 CHECK FAVORITE REQUEST ===');
  
  try {
    const { user_id, worker_id } = req.query;

    if (!user_id || !worker_id) {
      return res.status(400).json({
        success: false,
        error: 'user_id and worker_id are required'
      });
    }

    const [result] = await pool.query(`
      SELECT id FROM user_favorites 
      WHERE user_id = ? AND worker_id = ?
    `, [user_id, worker_id]);

    const is_favorite = result.length > 0;

    console.log(`✅ Check favorite: user ${user_id}, worker ${worker_id}, is_favorite: ${is_favorite}`);

    res.json({
      success: true,
      is_favorite: is_favorite
    });

  } catch (error) {
    console.error('❌ Check favorite error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;