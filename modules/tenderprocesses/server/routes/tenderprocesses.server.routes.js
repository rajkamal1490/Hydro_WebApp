'use strict';

/**
 * Module dependencies
 */
var tenderprocessesPolicy = require('../policies/tenderprocesses.server.policy'),
  tenderprocesses = require('../controllers/tenderprocesses.server.controller');

module.exports = function(app) {
  // Tenderprocesses Routes
  app.route('/api/tenderprocesses').all(tenderprocessesPolicy.isAllowed)
    .get(tenderprocesses.list)
    .post(tenderprocesses.create);

  app.route('/api/tenderprocesses/:tenderprocessId').all(tenderprocessesPolicy.isAllowed)
    .get(tenderprocesses.read)
    .put(tenderprocesses.update)
    .delete(tenderprocesses.delete);

  // Finish by binding the Tenderprocess middleware
  app.param('tenderprocessId', tenderprocesses.tenderprocessByID);
};
