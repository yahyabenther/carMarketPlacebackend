const { v4: uuidv4 } = require('uuid');
const imageModel = require('../models/image.model');

exports.createImage = async ({ carId, buffer, originalName, mimeType, fileSize }) => {
  return await imageModel.create({
    id: uuidv4(),
    car_id: carId,
    image_data: buffer,
    originalName,
    mimeType,
    fileSize
  });
};

exports.createMultipleImages = async (files, carId) => {
  const results = [];

  for (const file of files) {
    const id = await exports.createImage({
      carId,
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size
    });

    results.push({
      id,
      originalName: file.originalname,
      fileSize: file.size
    });
  }

  return results;
};

exports.getImageById = async (id) => {
  return await imageModel.findById(id);
};

exports.deleteImage = async (id) => {
  return await imageModel.delete(id);
};
