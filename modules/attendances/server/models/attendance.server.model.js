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
    type: Date,
    default: Date.now
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
  leaveFrom: {
    type: Date
  },
  leaveTo: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  breakTime: {
    type: Object
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Attendance', AttendanceSchema);
