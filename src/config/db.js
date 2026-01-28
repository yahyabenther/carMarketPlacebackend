// FIXED: src/config/db.js

const mysql = require('mysql2/promise');
const config = require('./env');

console.log('🔧 Initializing MySQL Connection Pool...');
console.log('📍 Host:', config.db.host);
console.log('📍 Database:', config.db.name);

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port || 3306,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  
  // CONNECTION POOL SETTINGS
  waitForConnections: true,
  connectionLimit: 15,        // ← INCREASED from 3 to 15 for production
  queueLimit: 10,             // Queue up to 10 requests
  
  // TIMEOUT SETTINGS (CRITICAL)
  connectTimeout: 30000,      // 30 seconds to establish connection
  acquireTimeout: 15000,      // 15 seconds to acquire from pool
  idleTimeout: 60000,         // 60 seconds before closing idle connections
  
  // KEEP-ALIVE & RECONNECT
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

// CONNECTION POOL EVENT HANDLERS
pool.on('connection', (connection) => {
  console.log('✅ MySQL: New connection established');
});

pool.on('acquire', (connection) => {
  console.log('📤 MySQL: Connection acquired from pool');
});

pool.on('enqueue', () => {
  console.log('⏳ MySQL: Connection request queued (waiting for available connection)');
});

pool.on('release', (connection) => {
  console.log('📥 MySQL: Connection released back to pool');
});

pool.on('error', (err) => {
  console.error('❌ MYSQL POOL ERROR:', err.code, '-', err.message);
  
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('   → Database connection was lost');
  }
  if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
    console.error('   → Fatal error occurred, connection cannot be reused');
  }
  if (err.code === 'PROTOCOL_ENQUEUE_AFTER_SOCKET_CLOSE') {
    console.error('   → Socket was closed unexpectedly');
  }
  if (err.code === 'PROTOCOL_SOCKET_TIMEOUT') {
    console.error('   → Socket timeout occurred');
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('   → Too many connections to MySQL');
  }
});

module.exports = pool;