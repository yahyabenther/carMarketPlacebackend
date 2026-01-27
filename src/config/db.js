const mysql = require('mysql2/promise');
const config = require('./env');

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 5,                // REDUCED from 10 - prevents pool exhaustion
  queueLimit: 0,
  
  // TIMEOUT CONFIGURATIONS - CRITICAL FIX
  connectTimeout: 30000,             // 30 seconds to establish connection
  acquireTimeout: 30000,             // 30 seconds to acquire from pool
  idleTimeout: 60000,                // 60 seconds idle timeout
  
  // KEEP-ALIVE - PREVENTS STALE CONNECTIONS
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
});

// ERROR HANDLING
pool.on('connection', (connection) => {
  console.log('✅ MySQL: New connection established');
});

pool.on('error', (err) => {
  console.error('❌ MySQL Pool Error:', err.code, err.message);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection lost.');
  }
  if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
    console.error('Fatal error, attempting reconnect...');
  }
});

module.exports = pool;