// services/conversation.services.js
const ConversationModel = require('../models/Conversation.model');
const UserModel = require('../models/user.model'); // If you have a user model
const MessageModel = require('../models/message.model');

const ConversationService = {
  
  // Get all conversations for a user with participant details
  getConversationsByUserId: async (userId) => {
    try {
      const conversations = await ConversationModel.findByUser(userId);
      
      // Enrich conversations with participant info and last message
      const enrichedConversations = await Promise.all(
        conversations.map(async (conversation) => {
          // Get the other participant's ID
          const otherUserId = conversation.user1_id === userId 
            ? conversation.user2_id 
            : conversation.user1_id;
          
          // Fetch other user's details
          let otherUser = null;
          if (UserModel && UserModel.findById) {
            otherUser = await UserModel.findById(otherUserId);
          }
          
          // Get last message in conversation
          let lastMessage = null;
          if (MessageModel && MessageModel.getLastMessage) {
            lastMessage = await MessageModel.getLastMessage(conversation.id);
          }
          
          // Get unread count
          let unreadCount = 0;
          if (MessageModel && MessageModel.getUnreadCount) {
            unreadCount = await MessageModel.getUnreadCount(conversation.id, userId);
          }
          
          return {
            ...conversation,
            otherUser: otherUser ? {
              id: otherUser.id,
              name: otherUser.name || otherUser.username,
              email: otherUser.email,
              avatar: otherUser.avatar || otherUser.profile_picture,
            } : null,
            lastMessage,
            unreadCount,
          };
        })
      );
      
      return enrichedConversations;
    } catch (error) {
      throw new Error('Failed to fetch conversations: ' + error.message);
    }
  },

  // Create or find existing conversation between two users
  createOrFindConversation: async (participantId, userId) => {
    try {
      // Validate input
      if (!participantId || !userId) {
        throw new Error('Both participantId and userId are required');
      }
      
      // Check if trying to create conversation with self
      if (parseInt(participantId) === parseInt(userId)) {
        throw new Error('Cannot create conversation with yourself');
      }
      
      // Check if conversation already exists between these two users
      const existingConversation = await ConversationModel.findExisting(userId, participantId);
      
      if (existingConversation) {
        return existingConversation;
      }

      // Create new conversation
      const conversationId = await ConversationModel.create(userId, participantId);
      
      // Fetch and return the newly created conversation
      const newConversation = await ConversationModel.findById(conversationId);
      
      return newConversation;
    } catch (error) {
      throw new Error('Failed to create or find conversation: ' + error.message);
    }
  },

  // Get a specific conversation by ID with participant details
  getConversationById: async (conversationId, userId) => {
    try {
      const conversation = await ConversationModel.findById(conversationId);
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Verify user is participant
      if (conversation.user1_id !== userId && conversation.user2_id !== userId) {
        throw new Error('Unauthorized access to conversation');
      }
      
      // Get the other participant's ID
      const otherUserId = conversation.user1_id === userId 
        ? conversation.user2_id 
        : conversation.user1_id;
      
      // Fetch other user's details
      let otherUser = null;
      if (UserModel && UserModel.findById) {
        otherUser = await UserModel.findById(otherUserId);
      }
      
      return {
        ...conversation,
        otherUser: otherUser ? {
          id: otherUser.id,
          name: otherUser.name || otherUser.username,
          email: otherUser.email,
          avatar: otherUser.avatar || otherUser.profile_picture,
        } : null,
      };
    } catch (error) {
      throw new Error('Failed to fetch conversation: ' + error.message);
    }
  },

  // Delete a conversation
  deleteConversation: async (conversationId, userId) => {
    try {
      const conversation = await ConversationModel.findById(conversationId);
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Verify user is participant
      if (conversation.user1_id !== userId && conversation.user2_id !== userId) {
        throw new Error('Unauthorized to delete this conversation');
      }

      const deleted = await ConversationModel.deleteById(conversationId, userId);
      
      if (!deleted) {
        throw new Error('Failed to delete conversation');
      }
      
      return { message: 'Conversation deleted successfully' };
    } catch (error) {
      throw new Error('Failed to delete conversation: ' + error.message);
    }
  },

  // Check if user is participant in conversation
  isParticipant: async (conversationId, userId) => {
    try {
      const conversation = await ConversationModel.findById(conversationId);
      
      if (!conversation) {
        return false;
      }
      
      return conversation.user1_id === userId || conversation.user2_id === userId;
    } catch (error) {
      throw new Error('Failed to check participant: ' + error.message);
    }
  },

  // Get conversation between two specific users
  getConversationBetweenUsers: async (userId1, userId2) => {
    try {
      return await ConversationModel.findExisting(userId1, userId2);
    } catch (error) {
      throw new Error('Failed to find conversation: ' + error.message);
    }
  },

  // Get unread conversations count
  getUnreadConversationsCount: async (userId) => {
    try {
      const conversations = await ConversationModel.findByUser(userId);
      
      let unreadCount = 0;
      
      for (const conversation of conversations) {
        if (MessageModel && MessageModel.getUnreadCount) {
          const count = await MessageModel.getUnreadCount(conversation.id, userId);
          if (count > 0) {
            unreadCount++;
          }
        }
      }
      
      return unreadCount;
    } catch (error) {
      throw new Error('Failed to get unread count: ' + error.message);
    }
  },

  // Update conversation's last activity timestamp
  updateLastActivity: async (conversationId) => {
    try {
      if (ConversationModel.updateTimestamp) {
        await ConversationModel.updateTimestamp(conversationId);
      }
      return true;
    } catch (error) {
      throw new Error('Failed to update conversation: ' + error.message);
    }
  },
};

module.exports = ConversationService;