const db = require('../config/db');

exports.create = async (report) => {
  const [result] = await db.query(
    'INSERT INTO reports (user_id, car_id, reason, details) VALUES (?, ?, ?, ?)',
    [report.user_id, report.car_id, report.reason, report.details || '']
  );
  return result.insertId;
};

exports.findAll = async () => {
  const [rows] = await db.query(
    `SELECT 
       reports.*,
       CONCAT(users.firstName, ' ', users.lastName) AS reporter_name,
       users.email AS reporter_email,
       CONCAT(cars.title, ' ', cars.model, ' ', cars.year) AS car_title
     FROM reports
     LEFT JOIN users ON reports.user_id = users.id
     LEFT JOIN cars ON reports.car_id = cars.id
     ORDER BY reports.created_at DESC`
  );
  return rows;
};

exports.findById = async (id) => {
  const [rows] = await db.query(
    `SELECT 
       reports.*,
       CONCAT(users.firstName, ' ', users.lastName) AS reporter_name,
       users.email AS reporter_email,
       CONCAT(cars.title, ' ', cars.model, ' ', cars.year) AS car_title
     FROM reports
     LEFT JOIN users ON reports.user_id = users.id
     LEFT JOIN cars ON reports.car_id = cars.id
     WHERE reports.id = ?`,
    [id]
  );
  return rows[0];
};

exports.deleteById = async (id) => {
  const [result] = await db.query('DELETE FROM reports WHERE id = ?', [id]);
  return result.affectedRows;
};