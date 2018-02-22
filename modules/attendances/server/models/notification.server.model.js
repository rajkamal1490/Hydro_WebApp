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
  }
});

mongoose.model('Notification', NotificationSchema);
