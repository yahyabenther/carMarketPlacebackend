// routes/messages.routes.js
const messageController = require('../controllers/message.Controller');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

// Get all messages from a specific conversation
router.get('/:conversationId', messageController.getConversationMessages);

// Send a message to a conversation
router.post('/:conversationId', messageController.sendMessage);

// Mark conversation messages as read
router.put('/:conversationId/read', messageController.markAsRead);

// Delete a specific message
router.delete('/:messageId', messageController.deleteMessage);


module.exports = router;