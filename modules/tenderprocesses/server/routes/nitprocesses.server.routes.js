'use strict';

/**
 * Module dependencies
 */
var nitprocess = require('../controllers/nitprocesses.server.controller');

module.exports = function(app) {
  // Tenderprocesses Routes
  app.route('/api/tenderprocesses/nit')
    .get(nitprocess.list)
    .post(nitprocess.create);

  app.route('/api/tenderprocesses/nit/:nitId')
    .get(nitprocess.read)
    .put(nitprocess.update)
    .delete(nitprocess.delete);

  app.route('/api/tenderprocesses/nit/upload/:nitId').post(nitprocess.uploadFiles);

  app.route('/api/tenderprocesses/nit/awaitingnitforms').post(nitprocess.awaitingForNitApproval);   

  // Finish by binding the nitprocess middleware
  app.param('nitId', nitprocess.nitprocessByID);
};
