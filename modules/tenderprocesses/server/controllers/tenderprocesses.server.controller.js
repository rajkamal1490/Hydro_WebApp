'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tenderprocess = mongoose.model('Tenderprocess'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Tenderprocess
 */
exports.create = function(req, res) {
  var tenderprocess = new Tenderprocess(req.body);
  tenderprocess.user = req.user;

  tenderprocess.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tenderprocess);
    }
  });
};

/**
 * Show the current Tenderprocess
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var tenderprocess = req.tenderprocess ? req.tenderprocess.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  tenderprocess.isCurrentUserOwner = req.user && tenderprocess.user && tenderprocess.user._id.toString() === req.user._id.toString();

  res.jsonp(tenderprocess);
};

/**
 * Update a Tenderprocess
 */
exports.update = function(req, res) {
  var tenderprocess = req.tenderprocess;

  tenderprocess = _.extend(tenderprocess, req.body);

  tenderprocess.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tenderprocess);
    }
  });
};

/**
 * Delete an Tenderprocess
 */
exports.delete = function(req, res) {
  var tenderprocess = req.tenderprocess;

  tenderprocess.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tenderprocess);
    }
  });
};

/**
 * List of Tenderprocesses
 */
exports.list = function(req, res) {
  Tenderprocess.find().sort('-created').populate('user', 'displayName').exec(function(err, tenderprocesses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(tenderprocesses);
    }
  });
};

/**
 * Tenderprocess middleware
 */
exports.tenderprocessByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tenderprocess is invalid'
    });
  }

  Tenderprocess.findById(id).populate('user', 'displayName').exec(function (err, tenderprocess) {
    if (err) {
      return next(err);
    } else if (!tenderprocess) {
      return res.status(404).send({
        message: 'No Tenderprocess with that identifier has been found'
      });
    }
    req.tenderprocess = tenderprocess;
    next();
  });
};
