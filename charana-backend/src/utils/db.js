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

// Ensure admin_users table exists with all required columns
db.ensureAdminTableAsync = async function() {
  try {
    // Create table if not exists with all columns
    await this.runAsync(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        mobile_no TEXT,
        address TEXT,
        role TEXT DEFAULT 'admin',
        can_manage_admins BOOLEAN DEFAULT 0,
        can_manage_events BOOLEAN DEFAULT 1,
        can_manage_gallery BOOLEAN DEFAULT 1,
        can_manage_pdfs BOOLEAN DEFAULT 1,
        can_manage_notifications BOOLEAN DEFAULT 1,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `);

    // Check if we need to add any missing columns (for existing DBs)
    const tableInfo = await this.allAsync('PRAGMA table_info(admin_users)');
    const existingColumns = tableInfo.map(col => col.name);

    const columnsToAdd = [
      { name: 'full_name', type: 'TEXT' },
      { name: 'mobile_no', type: 'TEXT' },
      { name: 'address', type: 'TEXT' },
      { name: 'role', type: 'TEXT DEFAULT "admin"' },
      { name: 'can_manage_admins', type: 'BOOLEAN DEFAULT 0' },
      { name: 'can_manage_events', type: 'BOOLEAN DEFAULT 1' },
      { name: 'can_manage_gallery', type: 'BOOLEAN DEFAULT 1' },
      { name: 'can_manage_pdfs', type: 'BOOLEAN DEFAULT 1' },
      { name: 'can_manage_notifications', type: 'BOOLEAN DEFAULT 1' },
      { name: 'is_active', type: 'BOOLEAN DEFAULT 1' }
    ];

    for (const column of columnsToAdd) {
      if (!existingColumns.includes(column.name)) {
        console.log(`📝 Adding column: ${column.name}`);
        await this.runAsync(`ALTER TABLE admin_users ADD COLUMN ${column.name} ${column.type}`);
      }
    }

    console.log('✅ Admin users table schema verified');
  } catch (error) {
    console.error('❌ Error ensuring admin table:', error.message);
    throw error;
  }
};

// Ensure master admin exists
db.ensureMasterAdminAsync = async function() {
  try {
    const masterUsername = process.env.MASTER_ADMIN_USERNAME || 'masteradmin';
    const masterPassword = process.env.MASTER_ADMIN_PASSWORD || 'Master@123456';
    const masterName = process.env.MASTER_ADMIN_NAME || 'Master Administrator';

    // Check if master admin exists
    const masterAdmin = await this.getAsync(
      'SELECT id FROM admin_users WHERE role = ?',
      ['master_admin']
    );

    if (masterAdmin) {
      console.log(`✅ Master admin already exists`);
      return { created: false };
    }

    // Check if any admin exists to promote to master
    const anyAdmin = await this.getAsync(
      'SELECT id FROM admin_users LIMIT 1'
    );

    if (anyAdmin) {
      // Promote first admin to master
      await this.runAsync(
        `UPDATE admin_users 
         SET role = ?, 
             can_manage_admins = 1,
             can_manage_events = 1,
             can_manage_gallery = 1,
             can_manage_pdfs = 1,
             can_manage_notifications = 1
         WHERE id = ?`,
        ['master_admin', anyAdmin.id]
      );
      console.log(`✅ Promoted existing admin to master_admin (ID: ${anyAdmin.id})`);
      return { created: true, promoted: true };
    }

    // Create new master admin
    console.log('👤 Creating master admin...');
    const passwordHash = await bcrypt.hash(masterPassword, 10);

    const result = await this.runAsync(
      `INSERT INTO admin_users (
        username, password_hash, full_name, role,
        can_manage_admins, can_manage_events, can_manage_gallery,
        can_manage_pdfs, can_manage_notifications, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        masterUsername, passwordHash, masterName, 'master_admin',
        1, 1, 1, 1, 1, 1
      ]
    );

    console.log(`✅ Master admin created with ID: ${result.id}`);
    console.log(`   Username: ${masterUsername}`);
    console.log(`   Password: ${masterPassword}`);
    console.log(`   ⚠️  CHANGE THIS PASSWORD IN PRODUCTION!`);

    return { created: true, id: result.id };
  } catch (error) {
    console.error('❌ Failed to create master admin:', error.message);
    throw error;
  }
};

// Combined initialization function
db.initializeAuthSystem = async function() {
  try {
    await this.ensureAdminTableAsync();
    await this.ensureMasterAdminAsync();
    console.log('✅ Authentication system initialized');
  } catch (error) {
    console.error('❌ Failed to initialize auth system:', error.message);
  }
};

module.exports = db;