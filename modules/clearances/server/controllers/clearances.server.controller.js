'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Clearance = mongoose.model('Clearance'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Clearance
 */
exports.create = function(req, res) {
  var clearance = new Clearance(req.body);
  clearance.user = req.user;

  clearance.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clearance);
    }
  });
};

/**
 * Show the current Clearance
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var clearance = req.clearance ? req.clearance.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  clearance.isCurrentUserOwner = req.user && clearance.user && clearance.user._id.toString() === req.user._id.toString();

  res.jsonp(clearance);
};

/**
 * Update a Clearance
 */
exports.update = function(req, res) {
  var clearance = req.clearance;

  clearance = _.extend(clearance, req.body);

  clearance.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clearance);
    }
  });
};

/**
 * Delete an Clearance
 */
exports.delete = function(req, res) {
  var clearance = req.clearance;

  clearance.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clearance);
    }
  });
};

/**
 * List of Clearances
 */
exports.list = function(req, res) {
  Clearance.find().sort('-created').populate('user', 'displayName').exec(function(err, clearances) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(clearances);
    }
  });
};

/**
 * Clearance middleware
 */
exports.clearanceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Clearance is invalid'
    });
  }

  Clearance.findById(id).populate('user', 'displayName').exec(function (err, clearance) {
    if (err) {
      return next(err);
    } else if (!clearance) {
      return res.status(404).send({
        message: 'No Clearance with that identifier has been found'
      });
    }
    req.clearance = clearance;
    next();
  });
};
