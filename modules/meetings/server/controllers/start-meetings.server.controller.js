'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  StartMeeting = mongoose.model('StartMeeting'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a StartMeeting
 */
exports.create = function(req, res) {
  var startmeeting = new StartMeeting(req.body);
  startmeeting.user = req.user;

  startmeeting.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(startmeeting);
    }
  });
};

/**
 * Show the current StartMeeting
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var startmeeting = req.startmeeting ? req.startmeeting.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  startmeeting.isCurrentUserOwner = req.user && startmeeting.user && startmeeting.user._id.toString() === req.user._id.toString();

  res.jsonp(startmeeting);
};

/**
 * Update a StartMeeting
 */
exports.update = function(req, res) {
  var startmeeting = req.startmeeting;

  startmeeting = _.extend(startmeeting, req.body);

  startmeeting.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(startmeeting);
    }
  });
};

/**
 * Delete an StartMeeting
 */
exports.delete = function(req, res) {
  var startmeeting = req.startmeeting;

  startmeeting.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(startmeeting);
    }
  });
};

/**
 * List of StartMeetings
 */
exports.list = function(req, res) {
  StartMeeting.find().sort('-created').populate('user', 'displayName').exec(function(err, startmeetings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(startmeetings);
    }
  });
};

exports.validateAlreadyCreatedMinutes = function(req, res) {
  StartMeeting.find({
    $and: [{
      meetingId: req.body.meetingId
    }]
  }, function(err, searchResults) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(searchResults);
    }

  });
};

