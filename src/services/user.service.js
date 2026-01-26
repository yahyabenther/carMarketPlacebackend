const User = require('../models/user.model');

// ✅ Get user by ID
exports.getUserById = async (userId) => {
    return await User.findById(userId);
};

// ✅ Create new user
exports.create= async (userData) => {
    return await User.create(userData);
};

// ✅ Update user password
exports.updateUserPassword = async (userId, newPassword) => {
    return await User.updatePassword(userId, newPassword);
};

// ✅ Delete user by ID
exports.deleteUserById = async (userId) => {
    return await User.deleteById(userId);
};

// ✅ Get all users
exports.getAllUsers = async () => {
    return await User.findAll();
};

// ✅ Find user by email
exports.findByEmail = async (email) => {
    return await User.findByEmail(email);
};

// ✅ Update user profile
exports.updateProfile = async (userId, profileData) => {
    return await User.updateProfile(userId, profileData);
};

// ✅ Find user by verification token (OLD - for backward compatibility)
exports.findByVerificationToken = async (token) => {
    return await User.findByVerificationToken(token);
};

// ✅ Update user verification status (OLD)
exports.updateUserVerificationStatus = async (userId, isVerified) => {
    return await User.updateUser(userId, { isVerified });
};

// ✅ Update verified (OLD - for backward compatibility)
exports.updateVerified = async (userId) => {
    return await User.updateVerified(userId);
};

// ✨ NEW FUNCTIONS FOR 6-DIGIT VERIFICATION CODE SYSTEM

// ✅ Update user with dynamic fields
exports.updateUser = async (userId, updates) => {
    return await User.updateUser(userId, updates);
};

// ✅ Verify email with 6-digit code
exports.verifyEmail = async (email, verificationCode) => {
    return await User.verifyEmail(email, verificationCode);
};

// ✅ Check if verification code is valid and not expired
exports.isVerificationCodeValid = async (email, verificationCode) => {
    return await User.isVerificationCodeValid(email, verificationCode);
};

// ✅ Update verification code (for resend)
exports.updateVerificationCode = async (userId, verificationCode, verificationCodeExpiry) => {
    return await User.updateVerificationCode(userId, verificationCode, verificationCodeExpiry);
};

// ✅ Find user by verification code
exports.findByVerificationCode = async (verificationCode) => {
    return await User.findByVerificationCode(verificationCode);
};

// ✅ Clear verification code
exports.clearVerificationCode = async (userId) => {
    return await User.clearVerificationCode(userId);
};

// ✨ PASSWORD RESET FUNCTIONS

// ✅ Set reset code for password recovery
exports.setResetCode = async (userId, resetCode, resetCodeExpiry) => {
    return await User.setResetCode(userId, resetCode, resetCodeExpiry);
};

// ✅ Check if reset code is valid and not expired
exports.isResetCodeValid = async (email, resetCode) => {
    return await User.isResetCodeValid(email, resetCode);
};

// ✅ Find user by reset code
exports.findByResetCode = async (resetCode) => {
    return await User.findByResetCode(resetCode);
};

// ✅ Reset password and clear reset code
exports.resetPassword = async (email, resetCode, newPassword) => {
    return await User.resetPassword(email, resetCode, newPassword);
};

// ✅ Clear reset code
exports.clearResetCode = async (userId) => {
    return await User.clearResetCode(userId);
};