const authController = require('../controllers/authController');
const express = require('express');
const router = express.Router();
// User registration
router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-code', authController.resendVerificationCode);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', authController.resetPassword);
router.post('/resend-reset-code', authController.resendResetCode);
router.post('/login', authController.login);
module.exports = router;