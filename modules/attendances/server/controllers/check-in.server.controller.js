'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Attendance = mongoose.model('Attendance'),
  Task = mongoose.model('Task'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * findTodayCheckIn
 */

exports.findTodayCheckIn = function(req, res) {
  Attendance.find({
    $and: [{
      year: req.body.year
    }, {
      month: req.body.month
    }, {
      date: req.body.date
    }, {
      user: req.body.userId
    }]
  }, function(err, entries) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(entries);
    }
  });
};

/**
 * findAttendancesByUser
 */

exports.findAttendancesByUser = function(req, res) {
  Attendance.find({
    $and: [{
      user: req.body.userId
    }]
  }, function(err, entries) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(entries);
    }
  });
};

/**
 * awaitingForApprovalLeave
 */

exports.awaitingForApprovalLeave = function(req, res) {
  Attendance.find({
    $and: [{
      isApproved: false
    }]
  }, function(err, entries) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(entries);
    }
  });
};

/**
 * Validate Leave Overlap
 */

exports.validateLeaveOverlap = function(req, res) {
  Attendance.find({
    $and: [{
      "applyLeave.endTime": {
        $gte: req.body.startGMT
      },
      "applyLeave.startTime": {
        $lte: req.body.endGMT
      }
    }],
    user: req.body.userId
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


/**
 * Validate Permission Overlap
 */

exports.validatePermissionOverlap = function(req, res) {
  Attendance.find({
    $and: [{
      "applyPermission.endTime": {
        $gte: req.body.startGMT
      },
      "applyPermission.startTime": {
        $lte: req.body.endGMT
      }
    }],
    user: req.body.userId
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

/**
 *
 * Find Task List
 */

exports.findTaskList = function(req, res) {
  Task.find({
    $and: [{
      dueDateTime: {
        $gte: req.body.startGMT
      },
      startDateTime: {
        $lte: req.body.endGMT
      }
    }],
    assignee: req.body.userId
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


/**
 * Find of Users Checked In Today
 */
exports.findUsersToday = function(req, res) {
  var date = new Date();
  Attendance.find({
    $and: [{
      year: date.getFullYear()
    }, {
      month: date.getMonth()+1
    }, {
      date: date.getDate()
    }]
  }, function(err, entries) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(entries);
    }
  });
};
