const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');
const emailService = require('../services/emailservices');
const config = require('../config/env');

// ✅ REGISTER - Create user and send verification code
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user
    const userId = await userService.create({
      name,
      email,
      password: hashed,
      isVerified: false,
      verificationCode,
      verificationCodeExpiry
    });

    console.log(`✅ User registered: ${email}`);
    console.log(`🔑 Verification code: ${verificationCode}`);

    // Send verification email
    await emailService.sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: 'User registered successfully. Check your email for the verification code.',
      userId,
      email
    });
  } catch (err) {
    console.error('🔥 Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ✅ VERIFY EMAIL - Verify the 6-digit code
exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Validate input
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    // Find user
    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Validate code
    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if code expired
    if (new Date() > new Date(user.verificationCodeExpiry)) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }

    // Update user - mark as verified
    await userService.updateUser(user.id, {
      isVerified: true,
      verificationCode: null,
      verificationCodeExpiry: null
    });

    console.log(`✅ Email verified for user: ${email}`);

    res.json({
      message: 'Email verified successfully. You can now log in.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('❌ Verification error:', err);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

// ✅ RESEND VERIFICATION CODE
exports.resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with new code
    await userService.updateVerificationCode(user.id, verificationCode, verificationCodeExpiry);

    console.log(`🔑 New verification code sent to: ${email}`);
    console.log(`🔑 Verification code: ${verificationCode}`);

    // Send verification email
    await emailService.sendVerificationEmail(email, verificationCode);

    res.json({ message: 'Verification code sent to your email' });
  } catch (err) {
    console.error('❌ Resend error:', err);
    res.status(500).json({ message: 'Server error while resending code' });
  }
};

// ✅ LOGIN - Login user (must be verified)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email first',
        requiresVerification: true,
        email: user.email
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    console.log(`✅ User logged in: ${email} ${user.role}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('🔥 Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ✅ FORGOT PASSWORD - Send reset code
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with reset code
    await userService.setResetCode(user.id, resetCode, resetCodeExpiry);

    console.log(`🔑 Reset code generated for: ${email}`);
    console.log(`🔑 Reset code: ${resetCode}`);

    // Send reset email
    await emailService.sendPasswordResetEmail(email, resetCode);

    res.json({ message: 'Password reset code sent to your email' });
  } catch (err) {
    console.error('❌ Forgot password error:', err);
    res.status(500).json({ message: 'Server error while sending reset code' });
  }
};

// ✅ VERIFY RESET CODE - Check if reset code is valid
exports.verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    // Check if reset code is valid
    const user = await userService.isResetCodeValid(email, code);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    console.log(`✅ Reset code verified for: ${email}`);

    res.json({ message: 'Reset code is valid' });
  } catch (err) {
    console.error('❌ Reset code verification error:', err);
    res.status(500).json({ message: 'Server error while verifying reset code' });
  }
};

// ✅ RESET PASSWORD - Update password with valid reset code
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Validate input
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, code, and password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if reset code is valid
    const user = await userService.isResetCodeValid(email, code);
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    // Hash new password
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset code
    await userService.resetPassword(email, code, hashed);

    console.log(`✅ Password reset for: ${email}`);

    res.json({ message: 'Password reset successfully. You can now log in with your new password.' });
  } catch (err) {
    console.error('❌ Reset password error:', err);
    res.status(500).json({ message: 'Server error while resetting password' });
  }
};

// ✅ RESEND RESET CODE
exports.resendResetCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with new reset code
    await userService.setResetCode(user.id, resetCode, resetCodeExpiry);

    console.log(`🔑 New reset code sent to: ${email}`);
    console.log(`🔑 Reset code: ${resetCode}`);

    // Send reset email
    await emailService.sendPasswordResetEmail(email, resetCode);

    res.json({ message: 'Reset code sent to your email' });
  } catch (err) {
    console.error('❌ Resend reset code error:', err);
    res.status(500).json({ message: 'Server error while resending reset code' });
  }
};

// ✅ LOGOUT (optional - for token invalidation on frontend)
exports.logout = async (req, res) => {
  try {
    console.log(`✅ User logged out`);
    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('❌ Logout error:', err);
    res.status(500).json({ message: 'Server error during logout' });
  }
};