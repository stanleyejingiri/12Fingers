// server/config/envCheck.js
const requiredEnvVars = [
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'STRIPE_SECRET_KEY',
  'FRONTEND_URL'
];

export const checkEnvironment = () => {
  const missing = [];
  
  for (const envVar of requiredEnvVars) {
    // 🔴 CHANGE THIS LINE - check for undefined, not falsy
    if (process.env[envVar] === undefined) {
      missing.push(envVar);
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('Please check your .env file');
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated');
};