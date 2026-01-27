const db = require('../config/db');

exports.findAll = async (limit = null) => {
  try {
    let query = 'SELECT * FROM cars WHERE status="available" ORDER BY created_at DESC';
    let params = [];

    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
    }

    const [rows] = await db.query(query, params);

    // Get images for each car
    for (let car of rows) {
      const [images] = await db.query(
        'SELECT id, originalName, fileSize, mimeType FROM images WHERE car_id = ?',
        [car.id]
      );
      car.images = images;
    }

    return rows;
  } catch (error) {
    console.error('Error in findAll:', error);
    throw error;
  }
};

exports.findById = async (id) => {
  try {
    const [rows] = await db.query('SELECT * FROM cars WHERE id=?', [id]);
    const car = rows[0];

    if (car) {
      const [images] = await db.query(
        'SELECT id, originalName, fileSize, mimeType FROM images WHERE car_id = ?',
        [id]
      );
      car.images = images;
    }

    return car;
  } catch (error) {
    console.error('Error in findById:', error);
    throw error;
  }
};

exports.findByOwnerId = async (ownerId) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM cars WHERE user_id = ? ORDER BY created_at DESC',
      [ownerId]
    );

    for (let car of rows) {
      const [images] = await db.query(
        'SELECT id, originalName, fileSize, mimeType FROM images WHERE car_id = ?',
        [car.id]
      );
      car.images = images;
    }

    return rows || [];
  } catch (error) {
    console.error('Error in findByOwnerId:', error);
    throw error;
  }
};

exports.create = async (car) => {
  try {
    const [result] = await db.query(
      `INSERT INTO cars (title, brand, model, year, price, mileage, fuel, transmission, location, user_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        car.title || `${car.year} ${car.brand} ${car.model}`,
        car.brand,
        car.model,
        car.year,
        car.price,
        car.mileage || 0,
        car.fuel,
        car.transmission,
        car.location,
        car.user_id,
        'available'
      ]
    );

    return result.insertId;
  } catch (error) {
    console.error('Error in create:', error);
    throw error;
  }
};

exports.update = async (id, car) => {
  try {
    await db.query(
      `UPDATE cars SET title=?, brand=?, model=?, year=?, price=?, mileage=?, fuel=?, transmission=?, location=? WHERE id=?`,
      [
        car.title || `${car.year} ${car.brand} ${car.model}`,
        car.brand,
        car.model,
        car.year,
        car.price,
        car.mileage || 0,
        car.fuel,
        car.transmission,
        car.location,
        id
      ]
    );
    return true;
  } catch (error) {
    console.error('Error in update:', error);
    throw error;
  }
};

exports.updateStatus = async (id, status) => {
  try {
    await db.query('UPDATE cars SET status=? WHERE id=?', [status, id]);
    return true;
  } catch (error) {
    console.error('Error in updateStatus:', error);
    throw error;
  }
};

exports.delete = async (id) => {
  try {
    // Delete images first
    await db.query('DELETE FROM images WHERE car_id = ?', [id]);
    // Then delete car
    await db.query('DELETE FROM cars WHERE id=?', [id]);
    return true;
  } catch (error) {
    console.error('Error in delete:', error);
    throw error;
  }
};

exports.search = async (query) => {
  try {
    const searchTerm = `%${query}%`;
    const [rows] = await db.query(
      `SELECT * FROM cars WHERE status="available" AND (title LIKE ? OR brand LIKE ? OR model LIKE ? OR location LIKE ?)`,
      [searchTerm, searchTerm, searchTerm, searchTerm]
    );

    for (let car of rows) {
      const [images] = await db.query(
        'SELECT id, originalName, fileSize, mimeType FROM images WHERE car_id = ?',
        [car.id]
      );
      car.images = images;
    }

    return rows;
  } catch (error) {
    console.error('Error in search:', error);
    throw error;
  }
};

exports.filter = async (filters) => {
  try {
    let query = 'SELECT * FROM cars WHERE status="available"';
    let params = [];

    if (filters.brand) {
      query += ' AND brand = ?';
      params.push(filters.brand);
    }
    if (filters.fuel) {
      query += ' AND fuel = ?';
      params.push(filters.fuel);
    }
    if (filters.transmission) {
      query += ' AND transmission = ?';
      params.push(filters.transmission);
    }
    if (filters.minPrice) {
      query += ' AND price >= ?';
      params.push(filters.minPrice);
    }
    if (filters.maxPrice) {
      query += ' AND price <= ?';
      params.push(filters.maxPrice);
    }
    if (filters.minYear) {
      query += ' AND year >= ?';
      params.push(filters.minYear);
    }
    if (filters.maxYear) {
      query += ' AND year <= ?';
      params.push(filters.maxYear);
    }
    if (filters.minMileage) {
      query += ' AND mileage >= ?';
      params.push(filters.minMileage);
    }
    if (filters.maxMileage) {
      query += ' AND mileage <= ?';
      params.push(filters.maxMileage);
    }
    if (filters.location) {
      query += ' AND location LIKE ?';
      params.push(`%${filters.location}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.query(query, params);

    for (let car of rows) {
      const [images] = await db.query(
        'SELECT id, originalName, fileSize, mimeType FROM images WHERE car_id = ?',
        [car.id]
      );
      car.images = images;
    }

    return rows;
  } catch (error) {
    console.error('Error in filter:', error);
    throw error;
  }
};
