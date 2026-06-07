// server/routes/messages.js - CORRECTED FOR YOUR ACTUAL TABLE STRUCTURE
import express from 'express';
import { pool } from '../database.js';

const router = express.Router();

// Handle preflight for messages routes
router.options('/', (req, res) => {
  res.status(200).end();
});


router.get('/', async (req, res) => {
  console.log('=== 📥 GET MESSAGES REQUEST ===');
  
  try {
    const { userId, workerUserId } = req.query;

    if (!userId || !workerUserId) {
      return res.status(400).json({
        success: false,
        error: 'userId and workerUserId are required'
      });
    }

    // NOW we can properly fetch conversations with receiver_id
    const [messages] = await pool.query(`
      SELECT * FROM booking_messages 
      WHERE (sender_id = ? AND receiver_id = ?)
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `, [userId, workerUserId, workerUserId, userId]);

    console.log(`✅ Found ${messages.length} messages between ${userId} and ${workerUserId}`);

    res.json({
      success: true,
      messages: messages
    });

  } catch (error) {
    console.error('❌ Get messages error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/messages/conversations/:userId
router.get('/conversations/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Find all distinct users who have exchanged messages with this user
    const [conversations] = await pool.query(`
      SELECT DISTINCT 
        CASE 
          WHEN sender_id = ? THEN receiver_id
          ELSE sender_id
        END as other_user_id,
        MAX(created_at) as last_message_time
      FROM booking_messages
      WHERE sender_id = ? OR receiver_id = ?
      GROUP BY other_user_id
      ORDER BY last_message_time DESC
    `, [userId, userId, userId]);

    // For each other user, get their name and the latest message preview
    const enriched = await Promise.all(conversations.map(async (conv) => {
      const [userRows] = await pool.query(
        'SELECT name FROM clients WHERE id = ? UNION SELECT name FROM worker_profiles WHERE user_id = ?',
        [conv.other_user_id, conv.other_user_id]
      );
      
      const [lastMsgRows] = await pool.query(
        `SELECT message, created_at, sender_id 
         FROM booking_messages 
         WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?)
         ORDER BY created_at DESC LIMIT 1`,
        [userId, conv.other_user_id, conv.other_user_id, userId]
      );
      
      const lastMsg = lastMsgRows[0];
      const isUnread = lastMsg && lastMsg.sender_id === conv.other_user_id && !lastMsg.is_read;
      
      return {
        userId: conv.other_user_id,
        name: userRows[0]?.name || 'Unknown User',
        lastMessage: lastMsg?.message || '',
        lastMessageTime: lastMsg?.created_at || conv.last_message_time,
        unread: isUnread
      };
    }));
    
    res.json({ success: true, conversations: enriched });
  } catch (error) {
    console.error('Conversations error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  console.log('=== 📥 SEND MESSAGE REQUEST ===');
  console.log('Body:', req.body);
  
  try {
    const { sender_id, receiver_id, content, message_type = 'text' } = req.body;

    if (!sender_id || !receiver_id || !content) {
      return res.status(400).json({
        success: false,
        error: 'sender_id, receiver_id, and content are required'
      });
    }

    // Allow booking_id to be NULL for standalone messages
    const booking_id = null;

    const [result] = await pool.query(`
      INSERT INTO booking_messages 
        (booking_id, sender_id, receiver_id, message_type, message, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `, [booking_id, sender_id, receiver_id, message_type, content, false]);

    console.log('✅ Message sent with ID:', result.insertId);

    res.json({
      success: true,
      message: {
        id: result.insertId,
        booking_id,
        sender_id,
        receiver_id,
        message_type,
        message: content,
        is_read: false,
        created_at: new Date()
      }
    });

  } catch (error) {
    console.error('❌ Send message error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET all conversations for a user
router.get('/conversations/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(`📨 GET /api/messages/conversations/${userId}`);
  
  try {
    // Find all distinct users who have exchanged messages with this user
    const [conversations] = await pool.query(`
      SELECT DISTINCT 
        CASE 
          WHEN sender_id = ? THEN receiver_id
          ELSE sender_id
        END as other_user_id,
        MAX(created_at) as last_message_time
      FROM booking_messages
      WHERE sender_id = ? OR receiver_id = ?
      GROUP BY other_user_id
      ORDER BY last_message_time DESC
    `, [userId, userId, userId]);

    // For each other user, get their name and the latest message preview
    const enriched = await Promise.all(conversations.map(async (conv) => {
      // Try to find the user in clients table first, then worker_profiles
      let [userRows] = await pool.query(
        'SELECT name FROM clients WHERE id = ?',
        [conv.other_user_id]
      );
      
      if (userRows.length === 0) {
        [userRows] = await pool.query(
          'SELECT name FROM worker_profiles WHERE user_id = ?',
          [conv.other_user_id]
        );
      }
      
      const [lastMsgRows] = await pool.query(
        `SELECT message, created_at, sender_id, is_read 
         FROM booking_messages 
         WHERE (sender_id = ? AND receiver_id = ?) 
            OR (sender_id = ? AND receiver_id = ?)
         ORDER BY created_at DESC LIMIT 1`,
        [userId, conv.other_user_id, conv.other_user_id, userId]
      );
      
      const lastMsg = lastMsgRows[0];
      const isUnread = lastMsg && lastMsg.sender_id === conv.other_user_id && !lastMsg.is_read;
      
      return {
        userId: conv.other_user_id,
        name: userRows[0]?.name || 'Unknown User',
        lastMessage: lastMsg?.message || '',
        lastMessageTime: lastMsg?.created_at || conv.last_message_time,
        unread: isUnread
      };
    }));
    
    res.json({ success: true, conversations: enriched });
  } catch (error) {
    console.error('❌ Conversations error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;