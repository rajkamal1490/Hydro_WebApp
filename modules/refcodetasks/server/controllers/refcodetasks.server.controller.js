'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Refcodetask = mongoose.model('Refcodetask'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Refcodetask
 */
exports.create = function(req, res) {
  var refcodetask = new Refcodetask(req.body);
  refcodetask.user = req.user;

  refcodetask.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(refcodetask);
    }
  });
};

/**
 * Show the current Refcodetask
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var refcodetask = req.refcodetask ? req.refcodetask.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  refcodetask.isCurrentUserOwner = req.user && refcodetask.user && refcodetask.user._id.toString() === req.user._id.toString();

  res.jsonp(refcodetask);
};

/**
 * Update a Refcodetask
 */
exports.update = function(req, res) {
  var refcodetask = req.refcodetask;

  refcodetask = _.extend(refcodetask, req.body);

  refcodetask.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(refcodetask);
    }
  });
};

/**
 * Delete an Refcodetask
 */
exports.delete = function(req, res) {
  var refcodetask = req.refcodetask;

  refcodetask.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(refcodetask);
    }
  });
};

/**
 * List of Refcodetasks
 */
exports.list = function(req, res) {
  Refcodetask.find().sort('-created').populate('user', 'displayName').exec(function(err, refcodetasks) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(refcodetasks);
    }
  });
};

/**
 * Refcodetask middleware
 */
exports.refcodetaskByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Refcodetask is invalid'
    });
  }

  Refcodetask.findById(id).populate('user', 'displayName').exec(function (err, refcodetask) {
    if (err) {
      return next(err);
    } else if (!refcodetask) {
      return res.status(404).send({
        message: 'No Refcodetask with that identifier has been found'
      });
    }
    req.refcodetask = refcodetask;
    next();
  });
};
