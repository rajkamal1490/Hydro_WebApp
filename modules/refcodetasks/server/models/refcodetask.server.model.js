'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Refcodetask Schema
 */
var RefcodetaskSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Refcodetask name',
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

mongoose.model('Refcodetask', RefcodetaskSchema);
