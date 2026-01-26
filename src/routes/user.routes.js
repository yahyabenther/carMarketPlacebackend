const usercontroller = require('../controllers/userController');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Get all users
router.get('/', usercontroller.getAllUsers);

// Get user by email
router.get('/email/:email', usercontroller.getUserByEmail);

// Update user profile (with file upload)
router.put('/profile', authMiddleware, upload.single('avatar'), usercontroller.updateUserProfile);

// Get user avatar - NEW ENDPOINT
router.get('/:userId/avatar', usercontroller.getUserAvatar);

// Get user by verification token
router.get('/verification/:token', usercontroller.getUserByVerificationToken);

// Verify user email
router.put('/verification/verify', usercontroller.verifyUserEmail);
//DELETE USER
router.delete('/:id', authMiddleware, usercontroller.deleteUser);

module.exports = router;