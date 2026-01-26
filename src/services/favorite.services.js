const Favorites = require('../models/favorite.model');

exports.addFavorite = async (userId, carId) => {
  return await Favorites.addFavorite(userId, carId);
};
exports.deleteFavorite = async (userId, carId) => {
  return await Favorites.removeFavorite(userId, carId);
};
exports.getAllFavorites = async (userId) => {
  return await Favorites.findByUser(userId);
};