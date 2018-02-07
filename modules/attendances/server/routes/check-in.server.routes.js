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

  app.route('/api/checkins/validateLeaveOverlap')
    .post(checkins.validateLeaveOverlap);

  app.route('/api/checkins/validatePermissionOverlap')
    .post(checkins.validatePermissionOverlap);

  app.route('/admin/api/checkins/todaycheckin')
    .post(checkins.findTodayCheckIn);

  app.route('/api/checkins/findattendancesbyuser')
    .post(checkins.findAttendancesByUser);  
};
