const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes');
const carRoutes = require('./routes/car.routes');
const messageRoutes = require('./routes/messages.routes');
const conversationRoutes = require('./routes/conversation.routes');
const favoriteRoutes = require('./routes/favorit.routes');
const reportRoutes = require('./routes/reportroutes');
const emailRoutes = require('./routes/email.routes');
const userRoutes = require('./routes/user.routes');
const carController = require('./controllers/carController');
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));
app.use(express.json());

// ===== IMAGE SERVING ROUTE (must come before car routes) =====
app.get('/api/image/:imageId', carController.getImage);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/user', userRoutes);

const fs = require('fs');
const path = require('path');

const routesPath = path.join(__dirname, 'routes');
console.log('Files found in routes folder:', fs.readdirSync(routesPath));

module.exports = app;