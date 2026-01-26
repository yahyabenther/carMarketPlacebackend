const MessageModel = require('../models/message.model');
const ConversationModel = require('../models/Conversation.model');

const MessageService = {
  // Get all messages in a conversation
  getConversationMessages: async (conversationId, userId) => {
    // Verify user is participant in conversation
    const conversation = await ConversationModel.findById(conversationId);
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (conversation.user1_id !== userId && conversation.user2_id !== userId) {
      throw new Error('Unauthorized access to conversation');
    }

    return await MessageModel.findByConversation(conversationId);
  },

  // Send a message
  sendMessage: async (conversationId, userId, content) => {
    if (!content || content.trim() === '') {
      throw new Error('Message content cannot be empty');
    }

    // Verify user is participant in conversation
    const conversation = await ConversationModel.findById(conversationId);
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (conversation.user1_id !== userId && conversation.user2_id !== userId) {
      throw new Error('Unauthorized to send message in this conversation');
    }

    // ✅ Use the exact field names your model expects
    const message = await MessageModel.create({
      conversationId: conversationId,  // camelCase to match your model
      senderId: userId,                // camelCase to match your model
      content: content.trim(),
    });

    // Update conversation timestamp
    if (ConversationModel.updateTimestamp) {
      await ConversationModel.updateTimestamp(conversationId);
    }

    return message;
  },

  // Mark messages as read
  markAsRead: async (conversationId, userId) => {
    // Verify user is participant in conversation
    const conversation = await ConversationModel.findById(conversationId);
    
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    if (conversation.user1_id !== userId && conversation.user2_id !== userId) {
      throw new Error('Unauthorized access to conversation');
    }

    const affectedRows = await MessageModel.markAsRead(conversationId, userId);
    
    return { message: 'Messages marked as read', count: affectedRows };
  },

  // Delete a message
  deleteMessage: async (messageId, userId) => {
    const message = await MessageModel.findById(messageId);

    if (!message) {
      throw new Error('Message not found');
    }

    if (message.sender_id !== userId && message.senderId !== userId) {
      throw new Error('Unauthorized to delete this message');
    }

    const deleted = await MessageModel.deleteById(messageId, userId);

    if (!deleted) {
      throw new Error('Failed to delete message');
    }

    return { message: 'Message deleted successfully' };
  },

  // Get unread count
  getUnreadCount: async (conversationId, userId) => {
    return await MessageModel.getUnreadCount(conversationId, userId);
  },

  // Get conversations by userId
  getConversationsByUserId: async (userId) => {
    return await ConversationModel.findByUser(userId);
  },
};

module.exports = MessageService;