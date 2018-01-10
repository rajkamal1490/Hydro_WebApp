'use strict';

/**
 * Module dependencies
 */
var filesPolicy = require('../policies/files.server.policy'),
  files = require('../controllers/files.server.controller');

module.exports = function(app) {
  // Files Routes
  app.route('/api/files').all(filesPolicy.isAllowed)
    .get(files.list)
    .post(files.create);

  app.route('/api/files/:fileId').all(filesPolicy.isAllowed)
    .get(files.read)
    .put(files.update)
    .delete(files.delete);

  // Finish by binding the File middleware
  app.param('fileId', files.fileByID);
};
