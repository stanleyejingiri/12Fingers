// server/scripts/backup.js
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create backups directory if it doesn't exist
const backupDir = path.join(__dirname, '../../backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0];
const backupFile = path.join(backupDir, `backup_${timestamp}.sql`);

// Get database config from environment
const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

// Build mysqldump command
const command = `mysqldump -h ${DB_HOST} -u ${DB_USER} ${DB_PASSWORD ? `-p${DB_PASSWORD}` : ''} ${DB_NAME} > "${backupFile}"`;

console.log('💾 Starting database backup...');

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Backup failed:', error.message);
    
    // Log failure to a file
    const logEntry = `${new Date().toISOString()} - BACKUP FAILED: ${error.message}\n`;
    fs.appendFileSync(path.join(backupDir, 'backup_log.txt'), logEntry);
    
    return;
  }
  
  console.log(`✅ Backup successful: ${backupFile}`);
  
  // Log success
  const logEntry = `${new Date().toISOString()} - BACKUP SUCCESS: ${backupFile}\n`;
  fs.appendFileSync(path.join(backupDir, 'backup_log.txt'), logEntry);
  
  // Delete backups older than 30 days
  const files = fs.readdirSync(backupDir);
  const now = Date.now();
  
  files.forEach(file => {
    if (file.endsWith('.sql')) {
      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      const daysOld = (now - stats.mtimeMs) / (1000 * 60 * 60 * 24);
      
      if (daysOld > 30) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted old backup: ${file}`);
      }
    }
  });
});