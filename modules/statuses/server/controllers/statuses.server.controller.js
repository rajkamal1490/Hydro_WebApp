'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Status = mongoose.model('Status'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Status
 */
exports.create = function(req, res) {
  var status = new Status(req.body);
  status.user = req.user;

  status.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(status);
    }
  });
};

/**
 * Show the current Status
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var status = req.status ? req.status.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  status.isCurrentUserOwner = req.user && status.user && status.user._id.toString() === req.user._id.toString();

  res.jsonp(status);
};

/**
 * Update a Status
 */
exports.update = function(req, res) {
  var status = req.status;

  status = _.extend(status, req.body);

  status.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(status);
    }
  });
};

/**
 * Delete an Status
 */
exports.delete = function(req, res) {
  var status = req.status;

  status.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(status);
    }
  });
};

/**
 * List of Statuses
 */
exports.list = function(req, res) {
  Status.find().sort('-created').populate('user', 'displayName').exec(function(err, statuses) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(statuses);
    }
  });
};

/**
 * Status middleware
 */
exports.statusByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Status is invalid'
    });
  }

  Status.findById(id).populate('user', 'displayName').exec(function (err, status) {
    if (err) {
      return next(err);
    } else if (!status) {
      return res.status(404).send({
        message: 'No Status with that identifier has been found'
      });
    }
    req.status = status;
    next();
  });
};
