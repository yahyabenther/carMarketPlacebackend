const db = require('../config/db');

const Favorites = {
  addFavorite: async (userId, carId) => {
    const [result] = await db.query(
      'INSERT INTO Favorites (user_id, car_id) VALUES (?, ?)',
      [userId, carId]
    );
    return result.affectedRows;
  },

  removeFavorite: async (userId, carId) => {
    const [result] = await db.query(
      'DELETE FROM Favorites WHERE user_id = ? AND car_id = ?',
      [userId, carId]
    );
    return result.affectedRows;
  },

  findByUser: async (userId) => {
    try {
      const [rows] = await db.query(
        `SELECT Cars.* 
         FROM Favorites 
         JOIN Cars ON Favorites.car_id = Cars.id
         WHERE Favorites.user_id = ?`,
        [userId]
      );

      // Get images for each car (same pattern as car.model.js)
      for (let car of rows) {
        const [images] = await db.query(
          'SELECT id, originalName, fileSize, mimeType FROM Images WHERE car_id = ?',
          [car.id]
        );
        car.images = images;
      }

      return rows;
    } catch (error) {
      console.error('Error in findByUser:', error);
      throw error;
    }
  }
};

module.exports = Favorites;