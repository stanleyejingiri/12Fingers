// server/middleware/audit.js
import { pool } from '../database.js';

export const logAudit = async ({
  userId,
  action,
  entityType,
  entityId,
  oldValues = null,
  newValues = null,
  req = null
}) => {
  try {
    const ipAddress = req ? 
      req.headers['x-forwarded-for'] || req.socket.remoteAddress : 
      null;
    
    const userAgent = req ? req.headers['user-agent'] : null;
    
    await pool.query(
      `INSERT INTO audit_logs 
       (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        action,
        entityType,
        entityId,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null,
        ipAddress,
        userAgent
      ]
    );
    
    console.log(`📝 Audit log created: ${action} for ${entityType} ${entityId}`);
  } catch (error) {
    console.error('❌ Failed to create audit log:', error);
    // Don't throw - audit logging should not break the main flow
  }
};

// Middleware version for easy use in routes
export const auditMiddleware = (action, entityType) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json;
    
    // Override json method to capture response
    res.json = function(data) {
      if (data.success && req.auditData) {
        const { userId, entityId, oldValues, newValues } = req.auditData;
        
        logAudit({
          userId: userId || req.user?.id,
          action,
          entityType,
          entityId,
          oldValues,
          newValues,
          req
        }).catch(console.error);
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};