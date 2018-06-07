'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Attendance Schema
 */
var AttendanceSchema = new Schema({
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  year: {
    type: Number
  },
  month: {
    type: Number
  },
  date: {
    type: Number
  },
  applyLeave: {
    type: Object
  },
  applyPermission: {
    type: Object
  },
  created: {
    type: Date,
    default: Date.now
  },
  breakTime: {
    type: Object
  },
  isApproved: {
    type: Boolean
  },
  onHold: {
    type: Boolean
  },
  reason: {
    type: String
  },
  comments: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Attendance', AttendanceSchema);
