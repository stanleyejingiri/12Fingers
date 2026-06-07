// server/routes/notifications.js
/*
import express from 'express';
import { pool } from '../database.js';  // Note: '../database.js' not '../db'

const router = express.Router();

// GET notifications for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    console.log(`📨 GET /api/notifications/${userId}`);
    
    const connection = await pool.getConnection();
    
    const [notifications] = await connection.query(
      `SELECT id, user_id, type, title, message, booking_id, is_read, created_at 
       FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [userId]
    );
    
    connection.release();
    
    res.json({
      success: true,
      notifications: notifications || []
    });
    
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Mark notification as read
router.patch('/:notificationId/read', async (req, res) => {
  const { notificationId } = req.params;
  
  try {
    const connection = await pool.getConnection();
    
    await connection.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ?',
      [notificationId]
    );
    
    connection.release();
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
  
  const markNotificationAsRead = async (notificationId: string) => {
  console.log('🔘 Closing notification:', notificationId);
  console.log('🔘 Request URL:', `http://localhost:3001/api/notifications/${notificationId}/read`);

  try {
    const response = await fetch(`http://localhost:3001/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('🔘 Response status:', response.status);
    const data = await response.json();
    console.log('🔘 Response data:', data);

    if (!response.ok) throw new Error(data.error || 'Failed to mark as read');

    // Refetch notifications
    refetchNotifications();

    toast({ title: "Notification dismissed" });
  } catch (error) {
    console.error('❌ Error:', error);
    toast({ title: "Error", description: error.message, variant: "destructive" });
  }
};
});

export default router;  
*/
// server/routes/notifications.js
import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// GET notifications for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    console.log(`📨 GET /api/notifications/${userId}`);
    
    const connection = await pool.getConnection();
    
    const [notifications] = await connection.query(
      `SELECT id, user_id, type, title, message, booking_id, is_read, created_at 
       FROM notifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [userId]
    );
    
    connection.release();
    
    res.json({
      success: true,
      notifications: notifications || []
    });
    
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Mark notification as read
router.patch('/:notificationId/read', async (req, res) => {
  const { notificationId } = req.params;
  
  try {
    const connection = await pool.getConnection();
    
    await connection.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ?',
      [notificationId]
    );
    
    connection.release();
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;