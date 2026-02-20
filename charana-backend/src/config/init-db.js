const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs-extra');

// Ensure database directory exists
const dbDir = path.join(__dirname, '../../database');
fs.ensureDirSync(dbDir);

const dbPath = path.join(dbDir, 'jagannath.db');
const db = new sqlite3.Database(dbPath);

console.log('📦 Initializing database with audit tracking...');

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

db.serialize(() => {
  // Notifications table with audit fields
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('seva', 'update', 'bhajan', 'special', 'festival')),
      is_active BOOLEAN DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by INTEGER,
      FOREIGN KEY (created_by) REFERENCES admin_users(id),
      FOREIGN KEY (updated_by) REFERENCES admin_users(id)
    )
  `);

  // Events table with audit fields
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      title_en TEXT,
      date TEXT NOT NULL,
      date_en TEXT,
      time TEXT NOT NULL,
      time_en TEXT,
      description TEXT NOT NULL,
      description_en TEXT,
      image_path TEXT,
      is_active BOOLEAN DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by INTEGER,
      FOREIGN KEY (created_by) REFERENCES admin_users(id),
      FOREIGN KEY (updated_by) REFERENCES admin_users(id)
    )
  `);

  // Gallery images table with audit fields
  db.run(`
    CREATE TABLE IF NOT EXISTS gallery_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      title_en TEXT,
      image_path TEXT NOT NULL,
      thumbnail_path TEXT,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      uploaded_by INTEGER,
      last_accessed DATETIME,
      access_count INTEGER DEFAULT 0,
      is_archived BOOLEAN DEFAULT 0,
      archive_path TEXT,
      archived_at DATETIME,
      archived_by INTEGER,
      FOREIGN KEY (uploaded_by) REFERENCES admin_users(id),
      FOREIGN KEY (archived_by) REFERENCES admin_users(id)
    )
  `);

  // PDF documents table with audit fields
  db.run(`
    CREATE TABLE IF NOT EXISTS pdf_documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      title_en TEXT,
      file_path TEXT NOT NULL,
      file_size INTEGER,
      description TEXT,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by INTEGER,
      FOREIGN KEY (created_by) REFERENCES admin_users(id),
      FOREIGN KEY (updated_by) REFERENCES admin_users(id)
    )
  `);

  // Admin users table
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT,
      role TEXT DEFAULT 'admin',
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Activity log table for all changes
  db.run(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      old_values TEXT,
      new_values TEXT,
      ip_address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES admin_users(id)
    )
  `);

  // Settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by INTEGER,
      FOREIGN KEY (updated_by) REFERENCES admin_users(id)
    )
  `);

  // Insert default admin if not exists
  db.get("SELECT * FROM admin_users WHERE username = 'admin'", (err, row) => {
    if (!row) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('Jagannath@123', salt);
      
      db.run(
        "INSERT INTO admin_users (username, password_hash, full_name, role) VALUES (?, ?, ?, ?)",
        ['admin', hash, 'Administrator', 'super_admin'],
        function(err) {
          if (err) {
            console.error('Error creating admin:', err);
          } else {
            console.log('✅ Default admin created (username: admin, password: Jagannath@123)');
          }
        }
      );
    }
  });

  // Insert sample notifications
  const sampleNotifications = [
    ['🙏 ମଙ୍ଗଳ ଆରତି ପ୍ରତିଦିନ ସକାଳ ୬ଟାରେ', 'seva'],
    ['🛕 ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ଦର୍ଶନ ସମୟ ଅଦ୍ୟତନ', 'update'],
    ['📿 ଭକ୍ତମାନଙ୍କ ପାଇଁ ନୂତନ ଭଜନ ଯୋଡାଯାଇଛି', 'bhajan'],
    ['✨ ଆସନ୍ତା ପୂର୍ଣ୍ଣିମାରେ ବିଶେଷ ପୂଜା', 'special'],
    ['🚩 ରଥଯାତ୍ରା ପାଇଁ ପ୍ରସ୍ତୁତି ଆରମ୍ଭ', 'festival']
  ];

  db.get("SELECT id FROM admin_users WHERE username = 'admin'", (err, admin) => {
    if (admin) {
      sampleNotifications.forEach(([message, type], index) => {
        db.run(
          "INSERT INTO notifications (message, type, display_order, created_by) VALUES (?, ?, ?, ?)",
          [message, type, index, admin.id]
        );
      });
    }
  });

  console.log('✅ Database initialization complete with audit tracking!');
});

db.close();