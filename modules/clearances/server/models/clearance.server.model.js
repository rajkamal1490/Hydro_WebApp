'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Clearance Schema
 */
var ClearanceSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Clearance name',
    trim: true
  },
  code: {
    type: String,
    lowercase: true
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

mongoose.model('Clearance', ClearanceSchema);
