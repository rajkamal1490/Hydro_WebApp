'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * File Schema
 */
var FileSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill File name',
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

mongoose.model('File', FileSchema);
