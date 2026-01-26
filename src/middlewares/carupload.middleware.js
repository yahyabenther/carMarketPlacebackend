// ============================================
// middlewares/carUploadMiddleware.js
// ============================================

const upload = require('./upload.middleware'); // Your existing upload middleware

// Handle multiple car images
exports.uploadCarImages = upload.array('images', 10); // Max 10 images

// Middleware to process uploaded files
exports.processCarImages = (req, res, next) => {
  console.log('Files received:', req.files);
  console.log('Body received:', req.body);
  
  if (req.files && req.files.length > 0) {
    req.body.images = req.files.map(file => {
      const imageUrl = `/uploads/${file.filename}`;
      console.log('Processing image:', imageUrl);
      return {
        url: imageUrl,
        filename: file.filename
      };
    });
    console.log('Processed images:', req.body.images);
  } else {
    console.log('No files received');
    req.body.images = [];
  }
  next();
};
