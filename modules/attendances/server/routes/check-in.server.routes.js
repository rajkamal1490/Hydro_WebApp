'use strict';

/**
 * Module dependencies
 */
var attendancesPolicy = require('../policies/attendances.server.policy'),
  checkins = require('../controllers/check-in.server.controller');

module.exports = function(app) {
  // Attendances Routes
  app.route('/api/checkins/todaycheckin')
    .post(checkins.findTodayCheckIn);
};
