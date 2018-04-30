'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Folder manager Schema
 */
var FolderManagerSchema = new Schema({  
  name: {
    type: String,
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

mongoose.model('FolderManager', FolderManagerSchema);
