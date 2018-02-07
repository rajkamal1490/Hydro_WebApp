'use strict';

/**
 * Module dependencies
 */
var attendancesPolicy = require('../policies/attendances.server.policy'),
  attendances = require('../controllers/attendances.server.controller');

module.exports = function(app) {
  // Attendances Routes
  app.route('/api/attendances').all(attendancesPolicy.isAllowed)
    .get(attendances.list)
    .post(attendances.create);

  app.route('/api/attendances/:attendanceId').all(attendancesPolicy.isAllowed)
    .get(attendances.read)
    .put(attendances.update)
    .delete(attendances.delete);

  app.route('/admin/api/attendances/:attendanceId').all(attendancesPolicy.isAllowed)
    .get(attendances.read)
    .put(attendances.update)
    .delete(attendances.delete);

  // Finish by binding the Attendance middleware
  app.param('attendanceId', attendances.attendanceByID);
};
