'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Emdprocess Schema
 */
var EmdprocessSchema = new Schema({
  offerNo: {
    type: String
  },
  emdAmount: {
    type: String,
    required: 'Please fill nit board'
  },
  emdFavour: {
    type: String,
    required: 'Please fill nit tendertype'
  },
  emdModeOrType: {
    type: String,
    required: 'Please fill nit tenderitem'
  },
  dueDateTime: {
    type: Date,
    required: 'Please fill nit dueDateTime'
  },
  fileURL: {
    type: String,
  },
  filename: {
    type: String,
  },
  hasApproved: {
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

mongoose.model('Emdprocess', EmdprocessSchema);
