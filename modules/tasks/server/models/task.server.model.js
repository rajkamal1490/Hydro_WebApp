'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Task Schema
 */
var TaskSchema = new Schema({
  title: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in task title'
  },
  description: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in task description'
  },
  startDateTime: {
    type: Date
  },
  dueDateTime: {
    type: Date
  },  
  assignee: {
    type: Schema.ObjectId,
    required: 'Please select your assignee',
    ref: 'User'
  },  
  priority: {
    type: String,
    trim: true,
    default: '',
    required: 'Please select your priority'
  },
  status: {
    type: String,
    trim: true,
    default: 'pending'
  },
  createdBy: {
    type: String,
  },
  createdProfileImage: {
    type: String,
  },
  isViewed: {
    type: Boolean,
    default: false
  },
  taskID:{
    type:Number
  },
  notificationId: {
    type: String
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Task', TaskSchema);
