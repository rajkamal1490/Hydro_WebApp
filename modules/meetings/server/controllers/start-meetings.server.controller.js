'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  StartMeeting = mongoose.model('StartMeeting'),
  config = require(path.resolve('./config/config')),
  officegen = require('officegen'),
  docx = officegen('docx'),
  fs = require('fs'),
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

exports.createMinutesOfMeetingDocx = function(req, res) {
  var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + req.headers.host + "/";
  var table = [
    [{
      val: "No.",
      opts: {
        align: "center",
        cellColWidth: 42,
        b: true,
        sz: '24',
        shd: {
          fill: "000000",
        }
      }
    }, {
      val: "Topics",
      opts: {
        align: "center",
        cellColWidth: 42,
        b: true,
        sz: '24',
        shd: {
          fill: "000000",
        }
      }
    }, {
      val: "Solution Provided",
      opts: {
        align: "center",
        cellColWidth: 20,
        b: true,
        sz: '24',
        shd: {
          fill: "000000",
        }
      }
    }, {
      val: "Action Plan",
      opts: {
        align: "center",
        cellColWidth: 20,
        b: true,
        sz: '24',
        shd: {
          fill: "000000",
        }
      }
    }, {
      val: "Decision By",
      opts: {
        align: "center",
        cellColWidth: 20,
        b: true,
        sz: '24',
        shd: {
          fill: "000000",
        }
      }
    }]
  ];
  var sn = 0;
  req.body.minutes.agendas.forEach(function(element) {
    var neededAttributes = _.pick(element, ['agendaTitle', 'agendaSolution', 'agendaActionPlan', 'agendaResponsiblePerson'] );
    sn += 1;
    var values = _.values(neededAttributes);
    element = [sn].concat(values);
    var array = [];
    element.forEach(function(ele) {
      array.push({val: ele, opts: { shd: {fill: "000000"} }});
    });
    table.push(array);
  });
  var filePath = config.uploads.fileManager.file.dest + req.body.minutes.title + '.docx';
  var out = fs.createWriteStream(filePath);
  var title = docx.createP({
    align: 'center'
  });
  title.addText(req.body.minutes.title, {
    bold: true,
    underline: true
  });

  var date = docx.createP({
    align: 'left'
  });
  date.addText('Started Date: ' + req.body.minutes.startedTime, {
    bold: true,
  });

  var duration = docx.createP({
    align: 'left'
  });
  duration.addText('Duration: ' + req.body.minutes.duration, {
    bold: true,
  });

  var attendees = docx.createP({
    align: 'left'
  });
  attendees.addText('Attendess: ' + _.map(req.body.minutes.attendees, 'displayName'), {
    bold: true,
  });

  var facilator = docx.createP({
    align: 'left'
  });
  facilator.addText('Facilator: ' + req.body.minutes.facilitator.displayName, {
    bold: true,
  });

  var tableStyle = {
    tableColWidth: 1850,
    tableSize: 15,
    tableColor: "white",
    tableAlign: "center",
    borders: true
  };
  docx.createTable(table, tableStyle);
  docx.generate(out);
  var split = filePath.split("./");
  res.jsonp([{"filePath": server + split[1]}]);
}
