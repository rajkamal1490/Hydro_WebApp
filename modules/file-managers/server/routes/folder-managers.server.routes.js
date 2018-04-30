'use strict';

/**
 * Module dependencies
 */
var folderManagers = require('../controllers/folder-managers.server.controller');

module.exports = function(app) {
  // File managers Routes
  app.route('/api/folder-managers')
    .get(folderManagers.list)
    .post(folderManagers.create);

  app.route('/api/folder-managers/:folderManagerId')
    .get(folderManagers.read)
    .put(folderManagers.update)
    .delete(folderManagers.delete);

  // Finish by binding the File manager middleware
  app.param('folderManagerByID', folderManagers.folderManagerByID);
};
