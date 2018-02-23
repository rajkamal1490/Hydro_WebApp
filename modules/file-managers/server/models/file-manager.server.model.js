'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * File manager Schema
 */
var FileManagerSchema = new Schema({
  fileURL: {
    type: String,
  },
  filename: {
    type: String,
  },
  hasImportant: {
    type: Boolean,
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

mongoose.model('FileManager', FileManagerSchema);
