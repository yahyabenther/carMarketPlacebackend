const db = require('../config/db');

const Favorites = {
  addFavorite: async (userId, carId) => {
    const [result] = await db.query(
      'INSERT INTO favorites (user_id, car_id) VALUES (?, ?)',
      [userId, carId]
    );
    return result.affectedRows;
  },

  removeFavorite: async (userId, carId) => {
    const [result] = await db.query(
      'DELETE FROM favorites WHERE user_id = ? AND car_id = ?',
      [userId, carId]
    );
    return result.affectedRows;
  },

  findByUser: async (userId) => {
    try {
      const [rows] = await db.query(
        `SELECT cars.* 
         FROM favorites 
         JOIN cars ON favorites.car_id = cars.id
         WHERE favorites.user_id = ?`,
        [userId]
      );

      // Get images for each car (same pattern as car.model.js)
      for (let car of rows) {
        const [images] = await db.query(
          'SELECT id, originalName, fileSize, mimeType FROM images WHERE car_id = ?',
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