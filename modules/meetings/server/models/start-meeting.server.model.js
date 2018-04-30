'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meeting Schema
 */
var StartMeetingSchema = new Schema({
  title: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your title'
  },
  meetingId: {
    type: String
  },
  startDateTime: {
    type: Date
  },
  endDateTime: {
    type: Date
  },
  meetingDiff: {
    type: String,
  },
  minutesFilePath: {
    type: String
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
    type: Object,
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

mongoose.model('StartMeeting', StartMeetingSchema);
