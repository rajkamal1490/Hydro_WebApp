'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Project name',
    trim: true
  },
  code: {
    type: String,
    default: '',
    required: 'Please fill Project code',
    trim: true
  },
  state: {
    type: String,
    default: '',
    required: 'Please fill Project state',
    trim: true
  },
  location: {
    type: String,
    default: '',
    required: 'Please fill Project location',
    trim: true
  },
  manager: {
    type: String,
    default: '',
    required: 'Please fill Project manager',
    trim: true
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

mongoose.model('Project', ProjectSchema);
