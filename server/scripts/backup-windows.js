// server/scripts/backup-windows.js
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create backups directory
const backupDir = path.join(__dirname, '../../backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').split('.')[0];
const backupFile = path.join(backupDir, `backup_${timestamp}.sql`);

const {
  DB_HOST = 'localhost',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'twelvefingers'
} = process.env;

// Windows MySQL paths - try common locations
const possibleMysqlPaths = [
  'C:\\xampp\\mysql\\bin\\mysqldump.exe',
  'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe',
  'C:\\Program Files\\MySQL\\MySQL Server 5.7\\bin\\mysqldump.exe',
  'C:\\Program Files (x86)\\MySQL\\MySQL Server 5.7\\bin\\mysqldump.exe',
  'mysqldump' // If it's in PATH
];

// Find mysqldump
let mysqldumpPath = 'mysqldump';
for (const testPath of possibleMysqlPaths) {
  if (fs.existsSync(testPath)) {
    mysqldumpPath = `"${testPath}"`;
    console.log(`✅ Found mysqldump at: ${testPath}`);
    break;
  }
}

// Build command
const passwordPart = DB_PASSWORD ? `-p${DB_PASSWORD}` : '';
const command = `${mysqldumpPath} -h ${DB_HOST} -u ${DB_USER} ${passwordPart} ${DB_NAME} > "${backupFile}"`;

console.log('💾 Starting database backup...');
console.log(`📁 Backup file: ${backupFile}`);

exec(command, { shell: 'cmd.exe' }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Backup failed:', error.message);
    
    const logEntry = `${new Date().toISOString()} - BACKUP FAILED: ${error.message}\n`;
    fs.appendFileSync(path.join(backupDir, 'backup_log.txt'), logEntry);
    
    // Suggest manual backup method
    console.log('\n📌 Manual backup instructions:');
    console.log('1. Open MySQL Workbench or phpMyAdmin');
    console.log('2. Export your database manually');
    console.log('3. Save the SQL file to: ' + backupDir);
    
    return;
  }
  
  console.log(`✅ Backup successful: ${backupFile}`);
  
  const logEntry = `${new Date().toISOString()} - BACKUP SUCCESS: ${backupFile}\n`;
  fs.appendFileSync(path.join(backupDir, 'backup_log.txt'), logEntry);
  
  // Delete old backups
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