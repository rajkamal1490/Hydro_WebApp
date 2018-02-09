'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Meeting = mongoose.model('Meeting'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * getTodayMeetingsByUser
 */

exports.getTodayMeetingsByUser = function(req, res) {
  Meeting.find({
    $and: [{
      startDateTime: {
        $lte: req.body.startDate
      },
      startDateTime: {
        $gte: req.body.endDate
      },
      attendees: {
        $elemMatch: {
          _id: {
            $in: [req.body.userId]
          }
        }
      }
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