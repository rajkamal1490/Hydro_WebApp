'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Tenderprocess Schema
 */
var ItemSheetprocessSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill ItemSheet name',
    trim: true
  },
  rating: {
    type: String,
    required: 'Please fill ItemSheet rating',
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

mongoose.model('ItemSheetprocess', ItemSheetprocessSchema);
