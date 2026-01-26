// routes/conversation.routes.js
const conversationController = require('../controllers/Conversation.controller');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware);

// Get all conversations for the authenticated user
router.get('/', conversationController.getConversations);

// Create a new conversation with a participant
router.post('/', conversationController.createConversation);

// Get a specific conversation by ID
router.get('/:conversationId', conversationController.getConversationById);

// Delete a conversation
router.delete('/:conversationId', conversationController.deleteConversation);

module.exports = router;