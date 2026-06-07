//server/routes/push.js
import express from 'express';
import webpush from 'web-push';
import { pool } from '../database.js';

const router = express.Router();

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Subscribe
/*
router.post('/subscribe', async (req, res) => {
  const { userId, subscription } = req.body;
  
  try {
    await pool.query(
      `INSERT INTO push_subscriptions (user_id, subscription) 
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE subscription = ?`,
      [userId, JSON.stringify(subscription), JSON.stringify(subscription)]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});*/

// POST /api/push/subscribe
router.post('/subscribe', async (req, res) => {
  const { userId, subscription } = req.body;
  
  if (!userId || !subscription) {
    return res.status(400).json({ error: 'Missing userId or subscription' });
  }
  
  try {
    // Check if subscription already exists
    const [existing] = await pool.query(
      'SELECT id FROM push_subscriptions WHERE user_id = ?',
      [userId]
    );
    
    if (existing.length > 0) {
      await pool.query(
        'UPDATE push_subscriptions SET subscription = ? WHERE user_id = ?',
        [JSON.stringify(subscription), userId]
      );
    } else {
      await pool.query(
        'INSERT INTO push_subscriptions (user_id, subscription) VALUES (?, ?)',
        [userId, JSON.stringify(subscription)]
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send notification to a user
export async function sendPushNotification(userId, title, body, url = '/dashboard') {
  try {
    const [rows] = await pool.query(
      'SELECT subscription FROM push_subscriptions WHERE user_id = ?',
      [userId]
    );
    
    if (rows.length === 0) return;
    
    const subscription = rows[0].subscription;
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title, body, url })
    );
  } catch (error) {
    console.error('Push error:', error);
  }
}

// Test endpoint – send a test notification
router.post('/test/:userId', async (req, res) => {
  const { userId } = req.params;
  const { title, body } = req.body;
  
  try {
    await sendPushNotification(
      userId,
      title || 'Test Notification',
      body || 'This is a test push notification from 12Fingers',
      '/dashboard'
    );
    res.json({ success: true, message: 'Test notification sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;