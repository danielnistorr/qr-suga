const sqlite3 = require('sqlite3').verbose();

// Utilizza una promise per gestire l'apertura del database
const db = new sqlite3.Database(
  './database.sqlite',
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("Errore di connessione al database:", err.message);
    } else {
      console.log('Connesso al database SQLite');
      initializeDatabase();
    }
  }
);

function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS qr_codes (
      id TEXT PRIMARY KEY,
      user_name TEXT,
      valid_until TEXT,
      is_used INTEGER DEFAULT 0
    )
  `);
}

module.exports = db;