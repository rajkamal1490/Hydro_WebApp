'use strict';

/**
 * Module dependencies
 */
var itemsheetprocess = require('../controllers/itemsheetprocesses.server.controller');

module.exports = function(app) {
  // Tenderprocesses Routes
  app.route('/api/tenderprocesses/itemsheet')
    .get(itemsheetprocess.list)
    .post(itemsheetprocess.create);

  app.route('/api/tenderprocesses/itemsheet/:itemSheetId')
    .get(itemsheetprocess.read)
    .put(itemsheetprocess.update)
    .delete(itemsheetprocess.delete);

  // Finish by binding the itemsheetprocess middleware
  app.param('itemSheetId', itemsheetprocess.itemsheetprocessByID);
};
