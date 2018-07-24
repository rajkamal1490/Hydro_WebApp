'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ItemSheetprocess = mongoose.model('ItemSheetprocess'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a ItemSheetprocess
 */
exports.create = function(req, res) {
  var itemsheetprocess = new ItemSheetprocess(req.body);
  itemsheetprocess.user = req.user;

  itemsheetprocess.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(itemsheetprocess);
    }
  });
};

/**
 * Show the current ItemSheetprocess
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var itemsheetprocess = req.itemsheetprocess ? req.itemsheetprocess.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  itemsheetprocess.isCurrentUserOwner = req.user && itemsheetprocess.user && itemsheetprocess.user._id.toString() === req.user._id.toString();

  res.jsonp(itemsheetprocess);
};

/**
 * Update a ItemSheetprocess
 */
exports.update = function(req, res) {
  var itemsheetprocess = req.itemsheetprocess;

  itemsheetprocess = _.extend(itemsheetprocess, req.body);

  itemsheetprocess.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(itemsheetprocess);
    }
  });
};

/**
 * Delete an ItemSheetprocess
 */
exports.delete = function(req, res) {
  var itemsheetprocess = req.itemsheetprocess;

  itemsheetprocess.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(itemsheetprocess);
    }
  });
};

/**
 * List of ItemSheetprocesses
 */
exports.list = function(req, res) {
  ItemSheetprocess.find().sort('-created').populate('user', 'displayName').exec(function(err, itemsheetprocesses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(itemsheetprocesses);
    }
  });
};

/**
 * ItemSheetprocess middleware
 */
exports.itemsheetprocessByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'ItemSheetprocess is invalid'
    });
  }

  ItemSheetprocess.findById(id).populate('user', 'displayName').exec(function (err, itemsheetprocess) {
    if (err) {
      return next(err);
    } else if (!itemsheetprocess) {
      return res.status(404).send({
        message: 'No ItemSheetprocess with that identifier has been found'
      });
    }
    req.itemsheetprocess = itemsheetprocess;
    next();
  });
};
