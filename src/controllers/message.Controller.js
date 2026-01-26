const MessageService = require("../services/message.services");
const ConversationModel = require('../models/Conversation.model');

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { conversationId } = req.params;
    const { content, text } = req.body;

    const messageContent = content || text;

    if (!messageContent || !messageContent.trim()) {
      return res.status(400).json({ message: "Message content required" });
    }

    console.log('📨 Sending message:', {
      conversationId,
      senderId,
      content: messageContent
    });

    // Save message to database
    const message = await MessageService.sendMessage(
      conversationId,
      senderId,
      messageContent
    );

    // Get conversation to find recipient
    const conversation = await ConversationModel.findById(conversationId);
    const recipientId = conversation.user1_id === senderId 
      ? conversation.user2_id 
      : conversation.user1_id;

    // Get io instance
    const io = req.app.get("io");
    if (io) {
      // Send message to all users in conversation (both users viewing chat)
      io.to(`conversation_${conversationId}`).emit("newMessage", {
        id: message.id,
        conversationId: message.conversation_id || conversationId,
        senderId: message.sender_id || senderId,
        content: message.content,
        createdAt: message.created_at,
      });

      // Send notification to recipient's personal room (even if not viewing chat)
      io.to(`user_${recipientId}`).emit("messageNotification", {
        conversationId: conversationId,
        senderId: senderId,
        senderName: req.user.name || req.user.firstName,
        preview: messageContent.substring(0, 50),
        timestamp: new Date()
      });
    }

    res.status(201).json(message);

  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: err.message || "Failed to send message" });
  }
};

// Keep your other functions unchanged
exports.getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const messages = await MessageService.getConversationMessages(conversationId, userId);
    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: "Failed to load messages" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    await MessageService.markAsRead(conversationId, userId);
    res.json({ message: "Marked as read" });
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({ message: "Failed to update read status" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    await MessageService.deleteMessage(messageId, userId);
    res.json({ message: "Message deleted" });
  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({ message: "Failed to delete message" });
  }
};