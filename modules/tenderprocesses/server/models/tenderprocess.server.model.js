'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tenderprocess Schema
 */
var TenderprocessSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Tenderprocess name',
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

mongoose.model('Tenderprocess', TenderprocessSchema);
