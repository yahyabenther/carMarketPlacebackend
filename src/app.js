// src/app.js
const express = require('express');
const cors = require("cors");
const fs = require('fs');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth.routes');
const carRoutes = require('./routes/car.routes');
const messageRoutes = require('./routes/messages.routes');
const conversationRoutes = require('./routes/conversation.routes');
const favoriteRoutes = require('./routes/favorit.routes');
const reportRoutes = require('./routes/reportroutes');
const emailRoutes = require('./routes/email.routes');
const userRoutes = require('./routes/user.routes');

// Controllers
const carController = require('./controllers/carController');

const app = express();

// ===== Middleware =====
app.use(express.json());

// ===== CORS =====
app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL // set this in Railway variables
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

// ===== Image route (must be before other routes) =====
app.get('/api/image/:imageId', carController.getImage);

// ===== Mount Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/user', userRoutes);

// ===== Debug: list routes folder =====
const routesPath = path.join(__dirname, 'routes');
console.log('Files found in routes folder:', fs.readdirSync(routesPath));

module.exports = app;
