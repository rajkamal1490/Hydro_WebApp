'use strict';

/**
 * Module dependencies
 */
var statusesPolicy = require('../policies/statuses.server.policy'),
  statuses = require('../controllers/statuses.server.controller');

module.exports = function(app) {
  // Statuses Routes
  app.route('/api/statuses').all(statusesPolicy.isAllowed)
    .get(statuses.list)
    .post(statuses.create);

  app.route('/api/statuses/:statusId').all(statusesPolicy.isAllowed)
    .get(statuses.read)
    .put(statuses.update)
    .delete(statuses.delete);

  // Finish by binding the Status middleware
  app.param('statusId', statuses.statusByID);
};
