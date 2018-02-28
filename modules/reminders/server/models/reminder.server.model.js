'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Reminder Schema
 */
var ReminderSchema = new Schema({
  title: {
    type: String,
    default: '',
    required: 'Please fill Reminder title',
    trim: true
  },
  reminderDateTime: {
    type: Date
  },
  hasReminded: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Reminder', ReminderSchema);
