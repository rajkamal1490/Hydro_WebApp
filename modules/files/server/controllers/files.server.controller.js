'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  File = mongoose.model('File'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a File
 */
exports.create = function(req, res) {
  var file = new File(req.body);
  file.user = req.user;

  file.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(file);
    }
  });
};

/**
 * Show the current File
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var file = req.file ? req.file.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  file.isCurrentUserOwner = req.user && file.user && file.user._id.toString() === req.user._id.toString();

  res.jsonp(file);
};

/**
 * Update a File
 */
exports.update = function(req, res) {
  var file = req.file;

  file = _.extend(file, req.body);

  file.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(file);
    }
  });
};

/**
 * Delete an File
 */
exports.delete = function(req, res) {
  var file = req.file;

  file.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(file);
    }
  });
};

/**
 * List of Files
 */
exports.list = function(req, res) {
  File.find().sort('-created').populate('user', 'displayName').exec(function(err, files) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(files);
    }
  });
};

/**
 * File middleware
 */
exports.fileByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'File is invalid'
    });
  }

  File.findById(id).populate('user', 'displayName').exec(function (err, file) {
    if (err) {
      return next(err);
    } else if (!file) {
      return res.status(404).send({
        message: 'No File with that identifier has been found'
      });
    }
    req.file = file;
    next();
  });
};
