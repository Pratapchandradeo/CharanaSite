const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

console.log('🔍 Database Diagnostic Tool');
console.log('===========================\n');

// Check current working directory
console.log(`📂 Current directory: ${process.cwd()}`);

// Build database path
const dbPath = path.join(__dirname, '../../database/jagannath.db');
console.log(`📂 Database path: ${dbPath}`);

// Check if directory exists
const dbDir = path.dirname(dbPath);
console.log(`📂 Database directory: ${dbDir}`);

if (fs.existsSync(dbDir)) {
  console.log('✅ Database directory exists');
  
  // List files in directory
  const files = fs.readdirSync(dbDir);
  console.log('📋 Files in database directory:');
  files.forEach(file => {
    const stats = fs.statSync(path.join(dbDir, file));
    console.log(`   - ${file} (${stats.size} bytes)`);
  });
} else {
  console.log('❌ Database directory does NOT exist');
  console.log('📝 Creating database directory...');
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ Database directory created');
}

// Check if database file exists
if (fs.existsSync(dbPath)) {
  console.log('\n✅ Database file exists');
  const stats = fs.statSync(dbPath);
  console.log(`   Size: ${stats.size} bytes`);
  console.log(`   Modified: ${stats.mtime}`);
  
  // Try to open the database
  console.log('\n🔄 Attempting to open database...');
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error('❌ Failed to open database:', err.message);
    } else {
      console.log('✅ Successfully opened database');
      
      // Try to query
      db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) {
          console.error('❌ Failed to query tables:', err.message);
        } else {
          console.log('\n📊 Tables in database:');
          if (tables.length === 0) {
            console.log('   No tables found');
          } else {
            tables.forEach(table => {
              console.log(`   - ${table.name}`);
            });
          }
        }
        db.close();
      });
    }
  });
} else {
  console.log('\n❌ Database file does NOT exist');
  console.log('📝 Creating new database...');
  
  // Create new database
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('❌ Failed to create database:', err.message);
    } else {
      console.log('✅ Database created successfully');
      db.close();
    }
  });
}