const express = require('express');
const multer = require('multer');
const carController = require('../controllers/carController');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize');
const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

// ===== PUBLIC ROUTES (no authentication) =====
router.get('/', carController.getAllCars);
router.get('/search', carController.searchCars);
router.get('/filter', carController.filterCars);

// ===== PROTECTED ROUTES (authentication required) =====
router.use(authenticate);

// User's cars route - MUST come before /:id route to avoid conflicts
router.get('/user/:userId', carController.getCarsByUser);

// CRUD operations
router.post('/', upload.array('images', 10), carController.createCar);
router.put('/:id', upload.array('images', 10), carController.updateCar);

// DELETE route - only admin can delete
router.delete('/:id', authorize('admin'), carController.deleteCar);

router.patch('/:id/status', carController.updateCarStatus);

// Get car by ID - MUST come after /user/:userId
router.get('/:id', carController.getCarById);

module.exports = router;