const reportController = require('../controllers/reportController');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
router.use(authMiddleware);
// Get all reports
router.get('/', reportController.getallReports);
// Create a new report
router.post('/', reportController.createReport);
// Get a specific report by ID
router.get('/:id', reportController.getReportById);
// Delete a report by ID
router.delete('/:id', reportController.deleteReportById);


module.exports = router;