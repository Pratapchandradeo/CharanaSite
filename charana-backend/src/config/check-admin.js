const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, '../../database/jagannath.db');
const db = new sqlite3.Database(dbPath);

console.log('👤 Checking Admin User\n');

// Check admin_users table structure
db.all("PRAGMA table_info(admin_users)", [], (err, columns) => {
  if (err) {
    console.error('Error getting table info:', err);
  } else {
    console.log('📋 Admin Users Table Structure:');
    columns.forEach(col => {
      console.log(`   - ${col.name} (${col.type})`);
    });
    console.log('');
  }

  // Get all admin users
  db.all('SELECT * FROM admin_users', [], async (err, users) => {
    if (err) {
      console.error('Error fetching admin users:', err);
      return;
    }

    console.log(`👥 Found ${users.length} admin user(s):\n`);
    
    for (const user of users) {
      console.log(`📌 User ID: ${user.id}`);
      console.log(`   Username: ${user.username}`);
      console.log(`   Full Name: ${user.full_name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.created_at}`);
      console.log(`   Last Login: ${user.last_login || 'Never'}`);
      console.log(`   Is Active: ${user.is_active !== 0 ? 'Yes' : 'No'}`);
      console.log(`   Password Hash: ${user.password_hash.substring(0, 30)}...`);
      
      // Test the default password
      const testPassword = 'Jagannath@123';
      const isValid = await bcrypt.compare(testPassword, user.password_hash);
      console.log(`   🔑 Password "Jagannath@123": ${isValid ? '✅ MATCHES' : '❌ DOES NOT MATCH'}`);
      
      // If it doesn't match, try common variations
      if (!isValid) {
        const variations = ['admin123', 'password', 'Admin@123', 'Jagannath', 'admin'];
        for (const pwd of variations) {
          const matches = await bcrypt.compare(pwd, user.password_hash);
          if (matches) {
            console.log(`   ✅ Found matching password: "${pwd}"`);
            break;
          }
        }
      }
      console.log('');
    }

    db.close();
  });
});