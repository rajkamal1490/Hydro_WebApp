'use strict';

/**
 * Module dependencies
 */
var clearancesPolicy = require('../policies/clearances.server.policy'),
  clearances = require('../controllers/clearances.server.controller');

module.exports = function(app) {
  // Clearances Routes
  app.route('/api/clearances').all(clearancesPolicy.isAllowed)
    .get(clearances.list)
    .post(clearances.create);

  app.route('/api/clearances/:clearanceId').all(clearancesPolicy.isAllowed)
    .get(clearances.read)
    .put(clearances.update)
    .delete(clearances.delete);

  // Finish by binding the Clearance middleware
  app.param('clearanceId', clearances.clearanceByID);
};
