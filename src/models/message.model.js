const db = require('../config/db');

// Get all messages in a conversation
exports.findByConversation = async (conversationId) => {
  const [rows] = await db.query(
    `SELECT m.*, 
            u.id AS senderId,
            CONCAT(u.firstName, ' ', u.lastName) AS senderName,
            u.avatar AS senderAvatar
     FROM messages m
     LEFT JOIN users u ON m.sender_id = u.id
     WHERE m.conversation_id = ?
     ORDER BY m.created_at ASC`,
    [conversationId]
  );
  return rows;
};

// Get a specific message by id
exports.findById = async (messageId) => {
  const [rows] = await db.query(
    `SELECT m.*, 
            CONCAT(u.firstName, ' ', u.lastName) AS senderName,
            u.avatar AS senderAvatar
     FROM messages m
     LEFT JOIN users u ON m.sender_id = u.id
     WHERE m.id = ?`,
    [messageId]
  );
  return rows[0];
};

// Send / create message
exports.create = async ({ conversationId, senderId, content }) => {
  const [result] = await db.query(
    `INSERT INTO messages (conversation_id, sender_id, content, is_read, created_at)
     VALUES (?, ?, ?, 0, NOW())`,
    [conversationId, senderId, content]
  );

  const [rows] = await db.query(
    `SELECT m.*, 
            CONCAT(u.firstName, ' ', u.lastName) AS senderName,
            u.avatar AS senderAvatar
     FROM messages m
     LEFT JOIN users u ON m.sender_id = u.id
     WHERE m.id = ?`,
    [result.insertId]
  );

  return rows[0];
};

// Mark all messages as read in a conversation
exports.markAsRead = async (conversationId, userId) => {
  const [result] = await db.query(
    `UPDATE messages 
     SET is_read = 1
     WHERE conversation_id = ? AND sender_id != ? AND is_read = 0`,
    [conversationId, userId]
  );
  
  return result.affectedRows;
};

// Delete a specific message
exports.deleteById = async (messageId, userId) => {
  const [result] = await db.query(
    `DELETE FROM messages 
     WHERE id = ? AND sender_id = ?`,
    [messageId, userId]
  );

  return result.affectedRows > 0;
};

// Get unread message count for a user in a conversation
exports.getUnreadCount = async (conversationId, userId) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) as unreadCount
     FROM messages
     WHERE conversation_id = ? AND sender_id != ? AND is_read = 0`,
    [conversationId, userId]
  );

  return rows[0].unreadCount;
};