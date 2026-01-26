const Reports = require('../models/report.model');
exports.createReport = async (reportData) => {
  return await Reports.create(reportData);
};
exports.getReportsByUser = async (userId) => {
  return await Reports.findByUser(userId);
};
exports.getAllReports = async () => {
  return await Reports.findAll();
};  
exports.updateReportStatus = async (reportId, status) => {
  return await Reports.updateStatus(reportId, status);
};
exports.deleteReportById = async (reportId) => {
  return await Reports.deleteById(reportId);
};