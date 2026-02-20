const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs-extra');

// Ensure database directory exists
const dbDir = path.join(__dirname, '../../database');
fs.ensureDirSync(dbDir);

const dbPath = path.join(dbDir, 'jagannath.db');
const db = new sqlite3.Database(dbPath);

console.log('📦 Initializing database...');

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create tables
db.serialize(() => {
  // Notifications table
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('seva', 'update', 'bhajan', 'special', 'festival')),
      is_active BOOLEAN DEFAULT 1,
      display_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Events table
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Gallery images table
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
      last_accessed DATETIME,
      access_count INTEGER DEFAULT 0,
      is_archived BOOLEAN DEFAULT 0,
      archive_path TEXT
    )
  `);

  // PDF documents table
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
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Admin users table
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    )
  `);

  // Settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert default admin (password: Jagannath@123)
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync('Jagannath@123', salt);

  db.get("SELECT * FROM admin_users WHERE username = 'admin'", (err, row) => {
    if (!row) {
      db.run(
        "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
        ['admin', hash],
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

  sampleNotifications.forEach(([message, type], index) => {
    db.run(
      "INSERT INTO notifications (message, type, display_order) VALUES (?, ?, ?)",
      [message, type, index]
    );
  });

  // Insert sample events
  const sampleEvents = [
    [
      'ରଥଯାତ୍ରା ମହୋତ୍ସବ',
      'Rath Yatra Festival',
      'ଜୁନ ୨୦୨୬',
      'June 2026',
      'ପୂରା ଦିନ',
      'Full Day',
      'ଶ୍ରୀ ଜଗନ୍ନାଥଙ୍କ ପବିତ୍ର ରଥଯାତ୍ରା ଉତ୍ସବରେ ଯୋଗଦିଅନ୍ତୁ।',
      'Join the sacred Rath Yatra festival of Lord Jagannath.'
    ],
    [
      'ଦୈନିକ ଦର୍ଶନ',
      'Daily Darshan',
      'ପ୍ରତିଦିନ',
      'Everyday',
      'ସକାଳ ୬ଟା - ରାତି ୯ଟା',
      '6 AM - 9 PM',
      'ପବିତ୍ର ଦର୍ଶନ ଓ ମହାପ୍ରସାଦ ସେବନ କରନ୍ତୁ।',
      'Have holy darshan and partake Mahaprasad.'
    ]
  ];

  sampleEvents.forEach((event, index) => {
    db.run(
      `INSERT INTO events 
       (title, title_en, date, date_en, time, time_en, description, description_en, display_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [...event, index]
    );
  });

  console.log('✅ Sample data inserted');
});

db.close();
console.log('✅ Database initialization complete!');