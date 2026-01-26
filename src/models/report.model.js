const db = require('../config/db');

exports.create = async (report) => {
  const [result] = await db.query(
    'INSERT INTO Reports (user_id, car_id, reason, details) VALUES (?, ?, ?, ?)',
    [report.user_id, report.car_id, report.reason, report.details || '']
  );
  return result.insertId;
};

exports.findAll = async () => {
  const [rows] = await db.query(
    `SELECT 
       Reports.*,
       CONCAT(Users.firstName, ' ', Users.lastName) AS reporter_name,
       Users.email AS reporter_email,
       CONCAT(Cars.title, ' ', Cars.model, ' ', Cars.year) AS car_title
     FROM Reports
     LEFT JOIN Users ON Reports.user_id = Users.id
     LEFT JOIN Cars ON Reports.car_id = Cars.id
     ORDER BY Reports.created_at DESC`
  );
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await db.query(
    `SELECT 
       Reports.*,
       CONCAT(Users.firstName, ' ', Users.lastName) AS reporter_name,
       Users.email AS reporter_email,
       CONCAT(Cars.title, ' ', Cars.model, ' ', Cars.year) AS car_title
     FROM Reports
     LEFT JOIN Users ON Reports.user_id = Users.id
     LEFT JOIN Cars ON Reports.car_id = Cars.id
     WHERE Reports.id = ?`,
    [id]
  );
  return rows[0];
};

exports.deleteById = async (id) => {
  const [result] = await db.query('DELETE FROM Reports WHERE id = ?', [id]);
  return result.affectedRows;
};