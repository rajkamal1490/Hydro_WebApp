'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Contact Schema
 */
var ContactSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your first name'
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your last name'
  },
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true // For this to work on a previously indexed field, the index must be dropped & the application restarted.
    },
    lowercase: true,
    trim: true,
    default: '',
    required: 'Please fill a valid email address'
  },
  mobileNumber: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your mobile number'
  }, 
  designation: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your designation'
  },
  department: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your department'
  }, 
  state: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your state'
  }, 
  company: {
    type: String,
    trim: true,
    default: '',
    required: 'Please fill in your company'
  }, 
  photoIdPath:{
    type:String,
    trim: true
  },
  visible: {
    type: [{
      type: String,
      enum: ['executive', 'vp', 'manager', 'tl', 'staff']
    }],    
    required: 'Please provide at least one group'
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Contact', ContactSchema);
