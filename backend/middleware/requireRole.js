// module.exports = function requireRole(...allowedRoles) {
//   return function(req, res, next) {
//     try {
    
//       const role = req.role || req.userRole || req.user?.role;
//       if (!role && req.headers["authorization"]) {
//         // if verifyToken put payload on req, read it if present
//       }
//       const userRole = req.userRole || req.role || req.user?.role || req.tokenRole;
//       console.log('Role', userRole, allowedRoles);
//       if (!userRole) {
//         return res.status(403).json({ success: false, message: 'Role not found' });
//       }
//       if (!allowedRoles.includes(userRole)) {
//         return res.status(403).json({ success: false, message: 'Forbidden' });
//       }
//       next();
//     } catch (e) {
//       return res.status(403).json({ success: false, message: 'Forbidden' });
//     }
//   }
// }



module.exports = function requireRole(...allowedRoles) {
  return function(req, res, next) {
    try {
      // Get role from various possible locations
      const userRole = req.role || req.userRole || (req.user && req.user.role);
      
      // Flatten the allowedRoles array in case nested arrays are passed
      const flattenedRoles = allowedRoles.flat();
      
      // If no role found, try to extract from token payload (if verifyToken stores it in req)
      if (!userRole) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. User role not available.' 
        });
      }
      
      // Check if user has any of the allowed roles
      const hasAccess = flattenedRoles.includes(userRole);
      
      if (!hasAccess) {
        // More descriptive error message
        const isProduction = process.env.NODE_ENV === 'production';
        const message = isProduction 
          ? 'Access denied. Insufficient permissions.' 
          : `Access denied. Required role(s): ${flattenedRoles.join(', ')}. Your role: ${userRole}`;
        
        return res.status(403).json({ 
          success: false, 
          message 
        });
      }
      
      // Attach the role to the request for potential downstream use
      req.authenticatedRole = userRole;
      
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error during authorization.' 
      });
    }
  }
}