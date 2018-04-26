'use strict';

/**
 * Module dependencies
 */
var refcodetasksPolicy = require('../policies/refcodetasks.server.policy'),
  refcodetasks = require('../controllers/refcodetasks.server.controller');

module.exports = function(app) {
  // Refcodetasks Routes
  app.route('/api/refcodetasks').all(refcodetasksPolicy.isAllowed)
    .get(refcodetasks.list)
    .post(refcodetasks.create);

  app.route('/api/refcodetasks/:refcodetaskId').all(refcodetasksPolicy.isAllowed)
    .get(refcodetasks.read)
    .put(refcodetasks.update)
    .delete(refcodetasks.delete);

  // Finish by binding the Refcodetask middleware
  app.param('refcodetaskId', refcodetasks.refcodetaskByID);
};
