// In your main server file (app.js or server.js)

const express = require('express');
const carRoutes = require('./car.routes');
const carController = require('../controllers/carController');

const app = express();

// Middleware
app.use(express.json());
// ... other middleware

// ===== IMPORTANT: Image serving route MUST be separate and BEFORE car routes =====
app.get('/api/image/:imageId', carController.getImage);

// ===== Then mount car routes =====
app.use('/api/cars', carRoutes);

// ... rest of your app