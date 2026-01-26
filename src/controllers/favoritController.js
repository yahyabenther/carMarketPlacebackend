const FavoritService = require('../services/favorite.services');

exports.addFavorite = async (req, res) => {
    try {
        const userId = req.user.id; // from authMiddleware
        const { carId } = req.body;

        if (!carId) {
            return res.status(400).json({ message: 'carId is required' });
        }

        const favorite = await FavoritService.addFavorite(userId, carId);
        res.status(201).json(favorite);
    } catch (err) {
        console.error('❌ Add favorite error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.deleteFavorite = async (req, res) => {
    try {
        const userId = req.user.id; // from authMiddleware
        const carId = req.params.id; // This is the car ID, not favorite ID

        const deleted = await FavoritService.deleteFavorite(userId, carId);
        
        if (!deleted) {
            return res.status(404).json({ message: 'Favorite not found' });
        }
        
        res.json({ message: 'Favorite deleted successfully' });
    } catch (err) {
        console.error('❌ Delete favorite error:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.getAllFavorites = async (req, res) => {
    try {
        const userId = req.user.id; // from authMiddleware
        const favorites = await FavoritService.getAllFavorites(userId);
        res.json({ favorites });
    } catch (err) {
        console.error('❌ Get favorites error:', err);
        res.status(500).json({ message: err.message });
    }
};