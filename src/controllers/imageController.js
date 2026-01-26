// src/controllers/imageController.js

const imageModel = require('../models/image.model');

exports.uploadImage = async (req, res) => {
  try {
    console.log('📸 Upload request received');

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { carId } = req.body;
    if (!carId) {
      return res.status(400).json({ success: false, message: 'Car ID is required' });
    }

    const id = await imageModel.create({
      car_id: carId,
      image_data: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      image: { id }
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
};

exports.uploadMultipleImages = async (req, res) => {
  try {
    console.log('📸 Multiple upload request');

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const { carId } = req.body;
    if (!carId) {
      return res.status(400).json({ success: false, message: 'Car ID is required' });
    }

    const uploadedImages = [];
    for (const file of req.files) {
      const id = await imageModel.create({
        car_id: carId,
        image_data: file.buffer,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size
      });
      uploadedImages.push({ id });
    }

    res.json({
      success: true,
      message: `${uploadedImages.length} images uploaded`,
      images: uploadedImages
    });

  } catch (error) {
    console.error('❌ Multiple upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed', error: error.message });
  }
};

exports.getImage = async (req, res) => {
  try {
    const image = await imageModel.findById(req.params.imageId);

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    res.set('Content-Type', image.mimeType);
    res.set('Content-Length', image.fileSize);
    res.send(image.image_data);

  } catch (error) {
    console.error('❌ Get image error:', error);
    res.status(500).json({ success: false, message: 'Fetch failed', error: error.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await imageModel.findById(req.params.imageId);

    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    await imageModel.delete(req.params.imageId);

    res.json({ success: true, message: 'Image deleted' });

  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
  }
};