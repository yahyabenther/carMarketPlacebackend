// src/models/image.model.js

const db = require('../config/db');

exports.create = async (imageData) => {
  try {
    console.log('💾 Storing image in database...');
    
    const [result] = await db.query(
      `INSERT INTO images (car_id, image_data, originalName, mimeType, fileSize) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        imageData.car_id,
        imageData.image_data,
        imageData.originalName,
        imageData.mimeType,
        imageData.fileSize
      ]
    );

    console.log('✅ Image stored with ID:', result.insertId);
    return result.insertId;
  } catch (error) {
    console.error('❌ Error storing image:', error);
    throw error;
  }
};

exports.findById = async (id) => {
  try {
    const [rows] = await db.query(
      'SELECT id, car_id, image_data, originalName, mimeType, fileSize FROM images WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('❌ Error finding image:', error);
    throw error;
  }
};

exports.findByIdMetadata = async (id) => {
  try {
    const [rows] = await db.query(
      'SELECT id, car_id, originalName, mimeType, fileSize, created_at FROM images WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('❌ Error finding image metadata:', error);
    throw error;
  }
};

exports.findByCarId = async (carId) => {
  try {
    const [rows] = await db.query(
      'SELECT id, car_id, originalName, mimeType, fileSize, created_at FROM images WHERE car_id = ? ORDER BY created_at DESC',
      [carId]
    );
    return rows || [];
  } catch (error) {
    console.error('❌ Error finding images by car ID:', error);
    throw error;
  }
};

exports.delete = async (id) => {
  try {
    const [result] = await db.query('DELETE FROM images WHERE id = ?', [id]);
    return result.affectedRows;
  } catch (error) {
    console.error('❌ Error deleting image:', error);
    throw error;
  }
};

exports.deleteByCarId = async (carId) => {
  try {
    const [result] = await db.query('DELETE FROM images WHERE car_id = ?', [carId]);
    return result.affectedRows;
  } catch (error) {
    console.error('❌ Error deleting images by car ID:', error);
    throw error;
  }
};
