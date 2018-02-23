'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke File managers Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/file-managers',
      permissions: '*'
    }, {
      resources: '/api/file-managers/:fileManagerId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/file-managers',
      permissions: ['get', 'post']
    }, {
      resources: '/api/file-managers/:fileManagerId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/file-managers',
      permissions: ['get']
    }, {
      resources: '/api/file-managers/:fileManagerId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If File managers Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an File manager is being processed and the current user created it then allow any manipulation
  if (req.fileManager && req.user && req.fileManager.user && req.fileManager.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
