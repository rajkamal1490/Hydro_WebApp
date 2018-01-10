'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Attendance = mongoose.model('Attendance'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Attendance
 */
exports.create = function(req, res) {
  var attendance = new Attendance(req.body);
  attendance.user = req.user;

  attendance.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(attendance);
    }
  });
};

/**
 * Show the current Attendance
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var attendance = req.attendance ? req.attendance.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  attendance.isCurrentUserOwner = req.user && attendance.user && attendance.user._id.toString() === req.user._id.toString();

  res.jsonp(attendance);
};

/**
 * Update a Attendance
 */
exports.update = function(req, res) {
  var attendance = req.attendance;

  attendance = _.extend(attendance, req.body);

  attendance.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(attendance);
    }
  });
};

/**
 * Delete an Attendance
 */
exports.delete = function(req, res) {
  var attendance = req.attendance;

  attendance.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(attendance);
    }
  });
};

/**
 * List of Attendances
 */
exports.list = function(req, res) {
  Attendance.find().sort('-created').populate('user', 'displayName').exec(function(err, attendances) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(attendances);
    }
  });
};

/**
 * Attendance middleware
 */
exports.attendanceByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Attendance is invalid'
    });
  }

  Attendance.findById(id).populate('user', 'displayName').exec(function (err, attendance) {
    if (err) {
      return next(err);
    } else if (!attendance) {
      return res.status(404).send({
        message: 'No Attendance with that identifier has been found'
      });
    }
    req.attendance = attendance;
    next();
  });
};
