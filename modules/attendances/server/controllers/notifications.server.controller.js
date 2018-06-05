'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Notification = mongoose.model('Notification'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Notification
 */
exports.create = function(req, res) {
  var notification = new Notification(req.body);

  notification.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(notification);
    }
  });
};

/**
 * Show the current Notification
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var notification = req.notification ? req.notification.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  notification.isCurrentUserOwner = req.user && notification.user && notification.user._id.toString() === req.user._id.toString();

  res.jsonp(notification);
};

/**
 * Update a Notification
 */
exports.update = function(req, res) {

  Notification.update({
    _id: req.body._id
  }, {
    $set: {
      notifyTo: req.body.notifyTo,
      hasPopUped: req.body.hasPopUped,
      isDismissed: req.body.isDismissed
    },
    upsert: true
  }, function(err, result) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(result);
    }
  });
};
/**
 * Delete a Notification
 */
exports.delete = function(req, res) {
  var notification = new Notification();

  Notification.deleteOne({
    _id: req.params.notificationId
  }, function(err) {
    if (err) {
      console.log("failed");
      throw err;
    }
  });
};

/**
 * List of Notifications
 */
exports.list = function(req, res) {
  Notification.find().sort('-created').populate('user', 'displayName').exec(function(err, notifications) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(notifications);
    }
  });
};

/**
 * Find of Notifications to PopUp
 */
exports.findNotificationByUser = function(req, res) {
  Notification.find({
    $and : [
      {
        notifyTo: { $in: [req.body.userId] }
      },
      {
        $or: [ { hasPopUped : { $in: [req.body.hasPopUped ] } }, { hasPopUped : { $exists: false } } ]
      }
    ]
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
 * Find of Notifications to Persistently show in Header
 */
exports.findPersistentNotificationByUser = function(req, res) {
  Notification.find({
    $and : [
      {
        notifyTo: { $in: [req.body.userId] }
      },
      {
        $or: [ { isDismissed : { $in: [req.body.isDismissed ] } }, { isDismissed : { $exists: false } } ]
      }
    ]
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
