const favoritController = require('../controllers/favoritController');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
router.use(authMiddleware);
// Get all favorites for the authenticated user
router.get('/:userId', favoritController.getAllFavorites);

// Add a new favorite
router.post('/addFavorite', favoritController.addFavorite);
// Remove a favorite
router.delete('/:id', favoritController.deleteFavorite);

module.exports = router;
