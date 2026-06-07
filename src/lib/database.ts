//src/lib/database.ts
/*import { Pool } from 'pg';

const pool = new Pool({
  user: 'twelvefingers_mainAdmin',
  password: '12fingers',
  host: 'localhost',
  port: 5432,
  database: 'twelvefingers',
});

// Test connection on startup
pool.query('SELECT NOW()')
  .then(() => console.log('✅ PostgreSQL database connected successfully'))
  .catch(err => console.error('❌ PostgreSQL connection failed:', err));

export const query = (text: string, params?: any[]) => pool.query(text, params);
*/


// src/lib/database.ts - FIXED FOR MYSQL
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'twelvefingers_mainAdmin',
  password: process.env.DB_PASSWORD || '12fingers',
  database: process.env.DB_NAME || 'twelvefingers',
  port: Number(process.env.DB_PORT) || 3306, // MySQL default port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err);
  });

export const query = async (text: string, params?: any[]) => {
  const [rows] = await pool.execute(text, params || []);
  return rows;
};

export const queryWithFields = async (text: string, params?: any[]) => {
  return await pool.execute(text, params || []);
};

export default pool;




