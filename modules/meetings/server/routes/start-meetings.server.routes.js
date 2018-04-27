'use strict';

/**
 * Module dependencies
 */
var startMeetings = require('../controllers/start-meetings.server.controller');

module.exports = function(app) {
  // Meetings Routes
  app.route('/api/startmeetings')
    .get(startMeetings.list)
    .post(startMeetings.create);

  app.route('/api/startmeetings/:meetingId')
    .get(startMeetings.read)
    .put(startMeetings.update)
    .delete(startMeetings.delete);

  app.route('/api/startmeetings/validatealreadycreatedminutes')
    .post(startMeetings.validateAlreadyCreatedMinutes);  
};