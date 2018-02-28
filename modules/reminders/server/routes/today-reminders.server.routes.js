'use strict';

/**
 * Module dependencies
 */
var todayreminders = require('../controllers/today-reminders.server.controller');

module.exports = function(app) {
  // Meetings Routes
  app.route('/api/todayreminders/getreminders')
    .post(todayreminders.getTodayRemindersByUser);

  app.route('/admin/api/todayreminders/getreminders')
	.post(todayreminders.getTodayRemindersByUser);

  app.route('/authentication/api/todayreminders/getreminders')
	.post(todayreminders.getTodayRemindersByUser); 

  app.route('/settings/api/todayreminders/getreminders')
	.post(todayreminders.getTodayRemindersByUser); 
};
