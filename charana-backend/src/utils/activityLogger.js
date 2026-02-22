const db = require('./db');

class ActivityLogger {
  /**
   * Log an activity to the database
   * @param {number} userId - ID of the user performing the action
   * @param {string} action - Action performed (e.g., 'CREATE_ADMIN', 'LOGIN_SUCCESS')
   * @param {string} entityType - Type of entity affected (e.g., 'admin_users', 'events')
   * @param {number} entityId - ID of the affected entity
   * @param {object} oldValues - Previous values (for updates)
   * @param {object} newValues - New values
   * @param {object} req - Express request object (for IP)
   */
  async log(userId, action, entityType, entityId = null, oldValues = null, newValues = null, req = null) {
    try {
      // Ensure activity_log table exists
      await db.runAsync(`
        CREATE TABLE IF NOT EXISTS activity_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          action TEXT NOT NULL,
          entity_type TEXT NOT NULL,
          entity_id INTEGER,
          old_values TEXT,
          new_values TEXT,
          ip_address TEXT,
          user_agent TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES admin_users(id)
        )
      `);

      const ipAddress = req ? 
        (req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip) : 
        null;
      
      const userAgent = req ? req.headers['user-agent'] : null;

      await db.runAsync(
        `INSERT INTO activity_log 
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
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📝 Activity logged: ${action} - ${entityType} #${entityId} by user ${userId}`);
      }
    } catch (error) {
      console.error('❌ Error logging activity:', error.message);
      // Don't throw - logging should not break the main operation
    }
  }

  /**
   * Get recent activity logs
   * @param {number} limit - Number of logs to retrieve
   * @param {string} entityType - Filter by entity type
   * @param {number} userId - Filter by user ID
   */
  async getRecentLogs(limit = 100, entityType = null, userId = null) {
    try {
      let query = `
        SELECT al.*, au.username, au.full_name 
        FROM activity_log al
        LEFT JOIN admin_users au ON al.user_id = au.id
        WHERE 1=1
      `;
      const params = [];

      if (entityType) {
        query += ' AND al.entity_type = ?';
        params.push(entityType);
      }

      if (userId) {
        query += ' AND al.user_id = ?';
        params.push(userId);
      }

      query += ' ORDER BY al.created_at DESC LIMIT ?';
      params.push(limit);

      return await db.allAsync(query, params);
    } catch (error) {
      console.error('❌ Error fetching activity logs:', error.message);
      return [];
    }
  }

  /**
   * Get activity summary by action type
   * @param {number} days - Number of days to look back
   */
  async getSummary(days = 7) {
    try {
      return await db.allAsync(`
        SELECT 
          action,
          entity_type,
          COUNT(*) as count,
          DATE(created_at) as date
        FROM activity_log
        WHERE created_at >= DATE('now', ?)
        GROUP BY action, entity_type, DATE(created_at)
        ORDER BY date DESC, count DESC
      `, [`-${days} days`]);
    } catch (error) {
      console.error('❌ Error fetching activity summary:', error.message);
      return [];
    }
  }
}

module.exports = new ActivityLogger();