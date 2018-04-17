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

  app.route('/settings/api/checkins/validateLeaveOverlap')
    .post(checkins.validateLeaveOverlap);

  app.route('/admin/api/checkins/validateLeaveOverlap')
    .post(checkins.validateLeaveOverlap);

  app.route('/settings/api/checkins/validatePermissionOverlap')
    .post(checkins.validatePermissionOverlap);

  app.route('/admin/api/checkins/validatePermissionOverlap')
    .post(checkins.validatePermissionOverlap);

  app.route('/admin/api/checkins/todaycheckin')
    .post(checkins.findTodayCheckIn);

    app.route('/settings/api/checkins/todaycheckin')
    .post(checkins.findTodayCheckIn);

  app.route('/api/checkins/findattendancesbyuser')
    .post(checkins.findAttendancesByUser); 

  app.route('/admin/api/checkins/awaitingforapprovalleave')
    .post(checkins.awaitingForApprovalLeave);

  app.route('/authentication/api/checkins/awaitingforapprovalleave')
    .post(checkins.awaitingForApprovalLeave);

  app.route('/api/checkins/awaitingforapprovalleave')
    .post(checkins.awaitingForApprovalLeave);  

  app.route('/settings/api/checkins/awaitingforapprovalleave')
    .post(checkins.awaitingForApprovalLeave);
};
