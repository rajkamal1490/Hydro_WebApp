'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Reminder = mongoose.model('Reminder'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * getTodayRemindersByUser
 */

exports.getTodayRemindersByUser = function(req, res) {
  Reminder.find({
    $and: [{
      reminderDateTime: {
        $gte: req.body.endDate
      },
      user: req.body.userId,
      hasReminded: false,
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