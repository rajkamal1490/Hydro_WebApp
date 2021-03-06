'use strict';

/**
 * Module dependencies
 */
var employeeMeetings = require('../controllers/employee-meetings.server.controller');

module.exports = function(app) {
  // Meetings Routes
  app.route('/api/employeemeetings/gettodaymeetings')
    .post(employeeMeetings.getTodayMeetingsByUser);

  app.route('/admin/api/employeemeetings/gettodaymeetings')
	.post(employeeMeetings.getTodayMeetingsByUser);

  app.route('/authentication/api/employeemeetings/gettodaymeetings')
	.post(employeeMeetings.getTodayMeetingsByUser); 

  app.route('/settings/api/employeemeetings/gettodaymeetings')
	.post(employeeMeetings.getTodayMeetingsByUser);

  app.route('/api/employeemeetings/getmymeetings')
    .post(employeeMeetings.getMyMeetingsByUser);

  app.route('/admin/api/employeemeetings/getmymeetings')
	.post(employeeMeetings.getMyMeetingsByUser);

  app.route('/authentication/api/employeemeetings/getmymeetings')
	.post(employeeMeetings.getMyMeetingsByUser); 

  app.route('/settings/api/employeemeetings/getmymeetings')
	.post(employeeMeetings.getMyMeetingsByUser); 	
};
