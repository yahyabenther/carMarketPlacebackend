const db = require('../config/db');

// Get all conversations for a user
exports.findByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM conversations 
     WHERE user1_id = ? OR user2_id = ?
     ORDER BY updated_at DESC`,
    [userId, userId]
  );
  return rows;
};

// Get conversation by id
exports.findById = async (id) => {
  const [rows] = await db.query(
    'SELECT * FROM conversations WHERE id = ?',
    [id]
  );
  return rows[0];
};

// Create conversation between two users (without car_id)
exports.create = async (user1_id, user2_id) => {
  const [result] = await db.query(
    `INSERT INTO conversations (user1_id, user2_id, created_at, updated_at)
     VALUES (?, ?, NOW(), NOW())`,
    [user1_id, user2_id]
  );
  return result.insertId;
};

// Check if conversation already exists between two users
exports.findExisting = async (user1_id, user2_id) => {
  const [rows] = await db.query(
    `SELECT * FROM conversations
     WHERE (
       (user1_id = ? AND user2_id = ?)
       OR
       (user1_id = ? AND user2_id = ?)
     )`,
    [user1_id, user2_id, user2_id, user1_id]
  );

  return rows[0];
};

// Delete conversation by id
exports.deleteById = async (id, userId) => {
  const [result] = await db.query(
    `DELETE FROM conversations 
     WHERE id = ? AND (user1_id = ? OR user2_id = ?)`,
    [id, userId, userId]
  );
  return result.affectedRows > 0;
};