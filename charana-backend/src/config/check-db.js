const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database/jagannath.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Updating events table schema...');

db.serialize(() => {
  // Start transaction
  db.run('BEGIN TRANSACTION');

  // Backup existing data
  db.run(`CREATE TABLE IF NOT EXISTS events_backup AS SELECT * FROM events`, (err) => {
    if (err) {
      console.log('❌ No existing events table or backup failed:', err.message);
    } else {
      console.log('✅ Backup created: events_backup');
    }
  });

  // Drop old table
  db.run(`DROP TABLE IF EXISTS events`, (err) => {
    if (err) {
      console.error('❌ Error dropping table:', err.message);
    } else {
      console.log('✅ Old events table dropped');
    }
  });

  // Create new table with simplified schema
  db.run(`
    CREATE TABLE events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      description TEXT NOT NULL,
      contact_number TEXT,
      image_path TEXT,
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_by INTEGER,
      FOREIGN KEY (created_by) REFERENCES admin_users(id),
      FOREIGN KEY (updated_by) REFERENCES admin_users(id)
    )
  `, (err) => {
    if (err) {
      console.error('❌ Error creating new table:', err.message);
    } else {
      console.log('✅ New events table created');
    }
  });

  // Try to restore data from backup if exists
  db.run(`
    INSERT INTO events (id, title, date, time, description, image_path, display_order, is_active, created_at, created_by, updated_at, updated_by)
    SELECT id, title, date, time, description, image_path, display_order, is_active, created_at, created_by, updated_at, updated_by
    FROM events_backup
    WHERE title IS NOT NULL
  `, function(err) {
    if (err) {
      console.log('ℹ️ No data to restore or restore failed:', err.message);
    } else {
      console.log(`✅ Restored ${this.changes} events from backup`);
    }
  });

  // Commit transaction
  db.run('COMMIT', (err) => {
    if (err) {
      console.error('❌ Error committing transaction:', err.message);
    } else {
      console.log('✅ Transaction committed');
    }
  });

  // Verify new schema
  db.all("PRAGMA table_info(events)", (err, columns) => {
    if (err) {
      console.error('❌ Error verifying schema:', err.message);
    } else {
      console.log('\n📋 New events table schema:');
      columns.forEach(col => {
        console.log(`   - ${col.name} (${col.type})`);
      });
    }
  });
});

// Close database after all operations
setTimeout(() => {
  db.close();
  console.log('\n✅ Schema update complete!');
}, 1000);