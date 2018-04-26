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
  orderCodes: {
    type: Object,
  },
  stateCodes: {
    type: Object
  },
  workCodes: {
    type: Object
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Refcodetask', RefcodetaskSchema);
