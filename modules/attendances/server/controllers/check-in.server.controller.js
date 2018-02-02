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

