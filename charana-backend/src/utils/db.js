const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs-extra');
const bcrypt = require('bcryptjs');

// Get database path from env or use default
const configuredDbPath = process.env.DB_PATH || './database/jagannath.db';
const dbPath = path.resolve(__dirname, '../../', configuredDbPath);
const dbDir = path.dirname(dbPath);

console.log('📂 Database path:', dbPath);

// Ensure database directory exists
fs.ensureDirSync(dbDir);
console.log('✅ Database directory ensured');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Promisify database methods
db.runAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

db.getAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.get(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

db.allAsync = function(sql, params = []) {
  return new Promise((resolve, reject) => {
    this.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Function to ensure default admin exists (with correct schema)
db.ensureDefaultAdminAsync = async function() {
  try {
    const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Jagannath@123';

    console.log(`👤 Checking for admin user: ${defaultUsername}`);

    // Ensure admin_users table exists with correct schema
    await this.runAsync(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `);

    // Check if admin already exists
    const existingAdmin = await this.getAsync(
      'SELECT id FROM admin_users WHERE username = ?',
      [defaultUsername]
    );

    if (existingAdmin) {
      console.log(`✅ Admin user '${defaultUsername}' already exists`);
      return { created: false, username: defaultUsername };
    }

    // Create new admin
    console.log(`👤 Creating default admin: ${defaultUsername}`);
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const result = await this.runAsync(
      'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
      [defaultUsername, passwordHash]
    );

    console.log(`✅ Default admin created with ID: ${result.id}`);
    console.log(`   Username: ${defaultUsername}`);
    console.log(`   Password: ${defaultPassword}`);

    return { created: true, username: defaultUsername, id: result.id };
  } catch (error) {
    console.error('❌ Failed to create default admin:', error.message);
    throw error;
  }
};

module.exports = db;