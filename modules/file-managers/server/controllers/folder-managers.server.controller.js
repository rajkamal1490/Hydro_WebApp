'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  fs = require('fs'),
  FolderManager = mongoose.model('FolderManager'),
  multer = require('multer'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a File manager
 */
exports.create = function(req, res) {
  var folderManager = new FolderManager(req.body);
  folderManager.user = req.user;

  folderManager.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(folderManager);
    }
  });
};

/**
 * Show the current File manager
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var folderManager = req.folderManager ? req.folderManager.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  folderManager.isCurrentUserOwner = req.user && folderManager.user && folderManager.user._id.toString() === req.user._id.toString();

  res.jsonp(folderManager);
};

/**
 * Update a File manager
 */
exports.update = function(req, res) {
  var folderManager = req.folderManager;

  folderManager = _.extend(folderManager, req.body);

  folderManager.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(folderManager);
    }
  });
};

/**
 * Delete an File manager
 */
exports.delete = function(req, res) {
  var folderManager = req.folderManager;

  fs.unlink(folderManager.fileURL);

  folderManager.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(folderManager);
    }
  });
};

/**
 * List of File managers
 */
exports.list = function(req, res) {
  FolderManager.find().sort('-created').populate('user', 'displayName').exec(function(err, folderManagers) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(folderManagers);
    }
  });
};

/**
 * File manager middleware
 */
exports.folderManagerByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'File manager is invalid'
    });
  }

  FolderManager.findById(id).populate('user', 'displayName').exec(function (err, folderManager) {
    if (err) {
      return next(err);
    } else if (!folderManager) {
      return res.status(404).send({
        message: 'No File manager with that identifier has been found'
      });
    }
    req.folderManager = folderManager;
    next();
  });
};
