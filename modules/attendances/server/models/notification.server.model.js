'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Attendance Schema
 */
var NotificationSchema = new Schema({
  notifyTo: {
    type: Object
  },
  type: {
    type: String
  },
  meetingScheduleDate: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Object
  },
  hasPopUped: {
    type: Boolean,
    default: false
  },
  isDismissed: {
    type: Boolean,
    default: false
  }
});

mongoose.model('Notification', NotificationSchema);
