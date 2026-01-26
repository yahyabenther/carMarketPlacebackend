const emailController = require('../controllers/emailController');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
router.use(authMiddleware);
// Send an email
router.get('/verify.email', emailController.verifyEmail);

module.exports = router;
