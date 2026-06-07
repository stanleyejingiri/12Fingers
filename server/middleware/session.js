// server/middleware/session.js
export const sessionTimeout = (req, res, next) => {
  // You'll need to implement this based on your auth system
  // For JWT tokens, check expiration
  // For session cookies, check last activity
  
  // Example for JWT:
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Check if token is about to expire (less than 15 minutes)
      const timeUntilExpiry = decoded.exp * 1000 - Date.now();
      
      if (timeUntilExpiry < 15 * 60 * 1000) {
        // Token expires soon - you could refresh it here
        console.log('Token expires soon');
      }
      
      req.user = decoded;
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Session expired' });
    }
  }
  
  next();
};