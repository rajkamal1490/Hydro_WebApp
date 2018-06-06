angular
    .module('core')
    .factory('NotificationsService', NotificationsService);

  NotificationsService.$inject = ['$resource'];

  function NotificationsService($resource) {
    var Notifications = $resource('/api/notifications/:notificationId', { notificationId: '@_id' }, {
      update: {
        method: 'PUT'
      },
      getNotificationByUser: {
        method: 'POST',
        isArray: true,
        url: '/api/notifications/getnotification'
      },
      getPersistentNotificationByUser: {
        method: 'POST',
        isArray: true,
        url: '/api/notifications/getpersistentnotification'
      }
    });

    angular.extend(Notifications, {
      requestFindNotificationByUser: function (notifications) {
        return this.getNotificationByUser(notifications).$promise;
      },
      requestFindPersistentNotificationByUser: function (notifications) {
        return this.getPersistentNotificationByUser(notifications).$promise;
      }
    });

    return Notifications;
  }
