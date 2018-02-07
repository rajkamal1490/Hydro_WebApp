'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meeting Schema
 */
var MeetingSchema = new Schema({
  title: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your title'
  },
  startDateTime: {
    type: Date
  },
  endDateTime: {
    type: Date
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
  agendas: {
    type: Object
  },
  location: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your location'
  },
  attendees: {
    type: Object,
    required: 'Please fill in attendees'
  },
  facilitator: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in facilitator'
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Meeting', MeetingSchema);
