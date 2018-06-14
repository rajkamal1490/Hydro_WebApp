'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Nitprocess Schema
 */
var NitprocessSchema = new Schema({
  name: {
    type: String
  },
  state: {
    type: String,
    required: 'Please fill nit state'
  },
  board: {
    type: String,
    required: 'Please fill nit board'
  },
  tendertype: {
    type: String,
    required: 'Please fill nit tendertype'
  },
  tenderitem: {
    type: String,
    required: 'Please fill nit tenderitem'
  },
  refurl: {
    type: String,
    required: 'Please fill nit refurl'
  },
  ecv: {
    type: String,
    required: 'Please fill nit ecv'
  },
  emd: {
    type: String,
    required: 'Please fill nit emd'
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
    type: Number,
    default: 0
  },
  offerNo: {
    type: String
  },
  tender: {
    type: Object
  },
  comments: {
    type: Object
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

mongoose.model('Nitprocess', NitprocessSchema);
