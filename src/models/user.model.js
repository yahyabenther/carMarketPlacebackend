const db = require('../config/db');

// ============================================
// BASIC USER OPERATIONS
// ============================================

exports.findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
  return rows[0];
};

exports.findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM Users WHERE id = ?', [id]);
  return rows[0];
};

exports.findAll = async () => {
  const [rows] = await db.query('SELECT * FROM Users');
  return rows;
};

exports.create = async (user) => {
  const [result] = await db.query(
    `INSERT INTO Users 
    (firstName, lastName, email, phone, password, verificationCode, verificationCodeExpiry, avatar, avatarMimeType) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.firstName,
      user.lastName,
      user.email,
      user.phone,
      user.password,
      user.verificationCode,
      user.verificationCodeExpiry,
      user.avatar || null,
      user.avatarMimeType || null
    ]
  );
  return result.insertId;
};

// ============================================
// USER PROFILE OPERATIONS
// ============================================

exports.updateProfile = async (id, userData) => {
    const fields = [];
    const values = [];

    // Include avatarMimeType in allowed fields
    const allowedFields = ['firstName', 'lastName', 'email', 'phone', 'avatar', 'avatarMimeType'];

    allowedFields.forEach(field => {
        const value = userData[field];

        // Check if value exists (string for all fields)
        if (value !== undefined && value !== null) {
            fields.push(`${field} = ?`);
            values.push(value);
        }
    });

    if (fields.length === 0) return false;

    values.push(id);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    try {
        const [result] = await db.query(query, values);
        return result.affectedRows > 0;
    } catch (err) {
        console.error("Database Query Error:", err);
        throw err;
    }
};

exports.updateUser = async (id, updates) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  values.push(id);

  const query = `UPDATE Users SET ${fields.join(', ')} WHERE id = ?`;
  const [result] = await db.query(query, values);
  return result.affectedRows > 0;
};

// ============================================
// PASSWORD OPERATIONS
// ============================================

exports.updatePassword = async (id, newPassword) => {
  const [result] = await db.query(
    'UPDATE Users SET password = ? WHERE id = ?',
    [newPassword, id]
  );
  return result.affectedRows > 0;
};

// ============================================
// EMAIL VERIFICATION OPERATIONS
// ============================================

exports.updateVerificationCode = async (id, verificationCode, verificationCodeExpiry) => {
  const [result] = await db.query(
    'UPDATE Users SET verificationCode = ?, verificationCodeExpiry = ? WHERE id = ?',
    [verificationCode, verificationCodeExpiry, id]
  );
  return result.affectedRows > 0;
};

exports.isVerificationCodeValid = async (email, verificationCode) => {
  const [rows] = await db.query(
    'SELECT * FROM Users WHERE email = ? AND verificationCode = ? AND verificationCodeExpiry > NOW()',
    [email, verificationCode]
  );
  return rows[0] || null;
};

exports.verifyEmail = async (email, verificationCode) => {
  const [result] = await db.query(
    'UPDATE Users SET isVerified = true, verificationCode = NULL, verificationCodeExpiry = NULL WHERE email = ? AND verificationCode = ?',
    [email, verificationCode]
  );
  return result.affectedRows > 0;
};

exports.findByVerificationCode = async (verificationCode) => {
  const [rows] = await db.query(
    'SELECT * FROM Users WHERE verificationCode = ? AND verificationCodeExpiry > NOW()',
    [verificationCode]
  );
  return rows[0];
};

exports.clearVerificationCode = async (id) => {
  const [result] = await db.query(
    'UPDATE Users SET verificationCode = NULL, verificationCodeExpiry = NULL WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

// ============================================
// PASSWORD RESET OPERATIONS
// ============================================

exports.setResetCode = async (id, resetCode, resetCodeExpiry) => {
  const [result] = await db.query(
    'UPDATE Users SET resetCode = ?, resetCodeExpiry = ? WHERE id = ?',
    [resetCode, resetCodeExpiry, id]
  );
  return result.affectedRows > 0;
};

exports.isResetCodeValid = async (email, resetCode) => {
  const [rows] = await db.query(
    'SELECT * FROM Users WHERE email = ? AND resetCode = ? AND resetCodeExpiry > NOW()',
    [email, resetCode]
  );
  return rows[0] || null;
};

exports.findByResetCode = async (resetCode) => {
  const [rows] = await db.query(
    'SELECT * FROM Users WHERE resetCode = ? AND resetCodeExpiry > NOW()',
    [resetCode]
  );
  return rows[0];
};

exports.resetPassword = async (email, resetCode, newPassword) => {
  const [result] = await db.query(
    'UPDATE Users SET password = ?, resetCode = NULL, resetCodeExpiry = NULL WHERE email = ? AND resetCode = ?',
    [newPassword, email, resetCode]
  );
  return result.affectedRows > 0;
};

exports.clearResetCode = async (id) => {
  const [result] = await db.query(
    'UPDATE Users SET resetCode = NULL, resetCodeExpiry = NULL WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

// ============================================
// USER DELETION
// ============================================

exports.deleteById = async (id) => {
  const [result] = await db.query('DELETE FROM Users WHERE id = ?', [id]);
  return result.affectedRows > 0;
};