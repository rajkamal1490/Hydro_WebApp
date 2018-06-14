'use strict';

/**
 * Module dependencies
 */
var emdprocess = require('../controllers/emdprocesses.server.controller');

module.exports = function(app) {
  // Tenderprocesses Routes
  app.route('/api/tenderprocesses/emd')
    .get(emdprocess.list)
    .post(emdprocess.create);

  app.route('/api/tenderprocesses/emd/:emdId')
    .get(emdprocess.read)
    .put(emdprocess.update)
    .delete(emdprocess.delete);

  app.route('/api/tenderprocesses/emd/upload/:emdId').post(emdprocess.uploadFiles);  

  // Finish by binding the emdprocess middleware
  app.param('emdId', emdprocess.emdprocessByID);
};
