const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    name: process.env.DB_NAME
  },
  jwtSecret: process.env.JWT_SECRET
};
