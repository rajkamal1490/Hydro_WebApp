'use strict';

/**
 * Module dependencies
 */
var fileManagersPolicy = require('../policies/file-managers.server.policy'),
  fileManagers = require('../controllers/file-managers.server.controller');

module.exports = function(app) {
  // File managers Routes
  app.route('/api/file-managers').all(fileManagersPolicy.isAllowed)
    .get(fileManagers.list)
    .post(fileManagers.create);

  app.route('/api/file-managers/:fileManagerId').all(fileManagersPolicy.isAllowed)
    .get(fileManagers.read)
    .put(fileManagers.update)
    .delete(fileManagers.delete);

  // Finish by binding the File manager middleware
  app.param('fileManagerId', fileManagers.fileManagerByID);
};
