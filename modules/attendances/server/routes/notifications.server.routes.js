'use strict';

/**
 * Module dependencies
 */
var notifications = require('../controllers/notifications.server.controller');

module.exports = function(app) {
  // Notifications Routes
  app.route('/api/notifications')
    .get(notifications.list)
    .post(notifications.create);

  app.route('/api/notifications/:notificationId')
    .get(notifications.read)
    .put(notifications.update)
    .delete(notifications.delete);

  app.route('/admin/api/notifications/:notificationId')
    .get(notifications.read)
    .put(notifications.update)
    .delete(notifications.delete);

  app.route('/settings/api/notifications/:notificationId')
    .get(notifications.read)
    .put(notifications.update)
    .delete(notifications.delete);

  app.route('/api/notifications/getnotification')
    .post(notifications.findNotificationByUser);

  app.route('/admin/api/notifications/getnotification')
    .post(notifications.findNotificationByUser);

  app.route('/settings/api/notifications/getnotification')
    .post(notifications.findNotificationByUser);

  app.route('/authentication/api/notifications/getnotification')
    .post(notifications.findNotificationByUser);

  app.route('/api/notifications/getpersistentnotification')
    .post(notifications.findPersistentNotificationByUser);
};
