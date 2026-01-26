const reportService = require('../services/report.services');
exports.createReport = async (req, res) => {
    try {
        const reportData = req.body;
        const report = await reportService.createReport(reportData);
        res.status(201).json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getReportById = async (req, res) => {
    try {   
        const reportId = req.params.id;
        const report = await reportService.getReportById(reportId);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json(report);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getallReports = async (req, res) => {
    try {
        const reports = await reportService.getAllReports();    
        res.json(reports);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.deleteReportById = async (req, res) => {
    try {
        const reportId = req.params.id;
        const deleted = await reportService.deleteReportById(reportId);
        if (!deleted) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.json({ message: 'Report deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};