// middleware/authorize.js
module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    console.log('🔑 Checking authorization. User role:', req.user.role, 'Required:', allowedRoles);
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Forbidden: You do not have permission to perform this action',
        userRole: req.user.role,
        requiredRoles: allowedRoles
      });
    }
    
    console.log('✅ Authorization granted for role:', req.user.role);
    next();
  };
};