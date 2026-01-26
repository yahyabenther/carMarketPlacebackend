const user = require('../services/user.service');
const db = require('../config/db');
const fs = require('fs').promises;

exports.getAllUsers = async(req, res) => {
    try {
        const users = await user.getAllUsers();
        res.json(users);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};

exports.getUserByEmail = async(req, res) => {
    try {
        const email = req.params.email;
        const userData = await user.findUserByEmail(email);
        if(!userData) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json(userData);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; 
        const profileData = { ...req.body };

        // If file is uploaded, read it and convert to base64
        if (req.file) {
            const imageBuffer = await fs.readFile(req.file.path);
            const base64Image = imageBuffer.toString('base64');
            const mimeType = req.file.mimetype;
            
            // Store complete image data with mime type
            profileData.avatar = base64Image;
            profileData.avatarMimeType = mimeType;

            // Delete the temporary file after reading
            await fs.unlink(req.file.path);
        }

        console.log("--- DEBUG START ---");
        console.log("Target User ID:", userId);
        console.log("File detected by Multer:", req.file ? req.file.filename : "NO FILE");
        console.log("Image size (bytes):", req.file ? req.file.size : 0);

        // Use the model to update
        await user.updateProfile(userId, profileData);

        // Fetch fresh data from users table
        const [rows] = await db.query(
            'SELECT id, firstName, lastName, email, phone, avatar, avatarMimeType FROM users WHERE id = ?', 
            [userId]
        );

        res.json(rows[0]);
    } catch (err) {
        console.error("Avatar Update Error:", err);
        res.status(500).json({ message: err.message });
    }   
};

// New endpoint to get user avatar as image
exports.getUserAvatar = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const [rows] = await db.query(
            'SELECT avatar, avatarMimeType FROM users WHERE id = ?',
            [userId]
        );

        if (!rows[0] || !rows[0].avatar) {
            return res.status(404).json({message: 'Avatar not found'});
        }

        // Convert base64 back to buffer
        const imageBuffer = Buffer.from(rows[0].avatar, 'base64');
        
        // Set appropriate content type
        res.setHeader('Content-Type', rows[0].avatarMimeType || 'image/jpeg');
        res.send(imageBuffer);
    } catch (err) {
        console.error("Avatar Retrieval Error:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.getUserByVerificationToken = async(req, res) => {
    try {
        const token = req.params.token;
        const userData = await user.findByVerificationToken(token);
        if(!userData) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json(userData);
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};

exports.verifyUserEmail = async(req, res) => {
    try {
        const { token } = req.body;
        const userData = await user.findByVerificationToken(token);
        if(!userData) {
            return res.status(404).json({message: 'User not found'});
        }
        await user.updateUserVerificationStatus(userData.id, true);
        res.json({message: 'Email verified successfully'});
    } catch(err) {
        res.status(500).json({message: err.message});
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userData = await user.getUserById(userId);
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.deleteUserById(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};