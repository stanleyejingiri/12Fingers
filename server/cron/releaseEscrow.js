// server/cron/releaseEscrow.js
import { pool } from '../database.js';

// Run every hour to check for auto-release
export async function checkAutoRelease() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Find bookings pending client confirmation past auto-release date
    const [expiredBookings] = await connection.query(
      `SELECT b.*, p.id as payment_id 
       FROM bookings b
       JOIN payments p ON b.id = p.booking_id
       WHERE b.status = 'awaiting_confirmation' 
       AND b.auto_release_at < NOW()
       AND p.status = 'escrow_held'`,
      []
    );
    
    for (const booking of expiredBookings) {
      console.log(`🔄 Auto-releasing escrow for booking: ${booking.id}`);
      
      // Same release logic as confirm-completion endpoint
      // You can call the confirm-completion logic here
      // Or move the release logic to a shared function
      
      await connection.query(
        `UPDATE bookings 
         SET status = 'completed', 
             completed_at = NOW(),
             auto_released = 1
         WHERE id = ?`,
        [booking.id]
      );
    }
    
  } catch (error) {
    console.error('❌ Auto-release error:', error);
  } finally {
    if (connection) connection.release();
  }
}

// Run every hour
setInterval(checkAutoRelease, 60 * 60 * 1000);