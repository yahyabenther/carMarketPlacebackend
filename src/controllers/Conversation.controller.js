const ConversationService = require('../services/conversation.services');

// Get all conversations for the authenticated user
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await ConversationService.getConversationsByUserId(userId);
    res.json(conversations);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

// Create a new conversation with a participant
exports.createConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ message: 'participantId is required' });
    }

    const conversation = await ConversationService.createOrFindConversation(
      participantId,
      userId
    );

    res.status(201).json(conversation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a specific conversation by ID
exports.getConversationById = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await ConversationService.getConversationById(conversationId, userId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a conversation
exports.deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    await ConversationService.deleteConversation(conversationId, userId);

    res.json({ message: 'Conversation deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};