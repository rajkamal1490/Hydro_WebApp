'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Meeting = mongoose.model('Meeting'),
  nodemailer = require('nodemailer'),
  async = require('async'),
  User = mongoose.model('User'),
  config = require(path.resolve('./config/config')),
  fs = require('fs'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

var smtpTransport = nodemailer.createTransport(config.mailer.options);

var ical = require('ical-generator');

/**
 * Create a Meeting
 */
exports.create = function(req, res) {
  async.waterfall([
    function(done) {
      var meeting = new Meeting(req.body);
      meeting.user = req.user;

      meeting.save(function(err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          done(err, meeting, req);
        }
      });
    },
    // If valid email, send reset email using service
    function(meeting, req, done) {
      var createdName = meeting.facilitator.displayName;
      var fromCreated = "";
      if (createdName != undefined) {
        //fromCreated = config.mailer.from.replace("Hydro-Admin", createdName);
      }
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
      var cal = ical();
      cal.setDomain(baseUrl).setName('My ical invite');
      cal.addEvent({
        start: meeting.startDateTime,
        end: meeting.endDateTime,
        summary: meeting.title,
        uid: meeting._id, // Some unique identifier
        sequence: 0,
        description: meeting.title,
        location: meeting.location,
        organizer: {
          name: meeting.facilitator.displayName,
          email: meeting.facilitator.email
        },
        method: 'request'
      });
      var path = config.uploads.meeting.file.dest + meeting._id + '.ics';
      cal.saveSync(path);
      var mailOptions = {
        from: config.mailer.from,
        to: _.map(meeting.attendees, 'email'),
        subject: meeting.title,
        text: meeting.title,
        alternatives: [{
          contentType: "text/calendar",
          content: new Buffer(cal.toString())
        }]
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log(err);
        if (!err) {
          res.jsonp(meeting);
        } else {
          console.log(err);
          return res.status(302).send({
            message: 'Failure sending email'
          });
        }
        done(err);
      });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
  });
};

/**
 * Show the current Meeting
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var meeting = req.meeting ? req.meeting.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  meeting.isCurrentUserOwner = req.user && meeting.user && meeting.user._id.toString() === req.user._id.toString();

  res.jsonp(meeting);
};

/**
 * Update a Meeting
 */
exports.update = function(req, res) {
  var meeting = req.meeting;

  meeting = _.extend(meeting, req.body);

  meeting.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meeting);
    }
  });
};

/**
 * Delete an Meeting
 */
exports.delete = function(req, res) {
  var meeting = req.meeting;

  meeting.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meeting);
    }
  });
};

/**
 * List of Meetings
 */
exports.list = function(req, res) {
  Meeting.find().sort('-created').populate('user', 'displayName').exec(function(err, meetings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meetings);
    }
  });
};

/**
 * Meeting middleware
 */
exports.meetingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Meeting is invalid'
    });
  }

  Meeting.findById(id).populate('user', 'displayName').exec(function(err, meeting) {
    if (err) {
      return next(err);
    } else if (!meeting) {
      return res.status(404).send({
        message: 'No Meeting with that identifier has been found'
      });
    }
    req.meeting = meeting;
    next();
  });
};
