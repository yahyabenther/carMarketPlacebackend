const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV,
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,  // ✅ FIXED: Changed from DB_PASS to DB_PASSWORD
    name: process.env.DB_NAME
  },
  jwtSecret: process.env.JWT_SECRET
};