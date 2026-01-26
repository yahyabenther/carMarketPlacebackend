exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const user = await UserService.findByVerificationToken(token);

    if (!user) return res.status(400).json({ message: 'Invalid token' });

    user.isVerified = true;
    user.verificationToken = null; // optional: remove token
    await UserService.updateUser(user);

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
