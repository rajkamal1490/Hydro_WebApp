angular
    .module('core')
    .factory('NotificationsService', NotificationsService);

  NotificationsService.$inject = ['$resource'];

  function NotificationsService($resource) {
    var Notifications = $resource('../api/notifications/:notificationId', { notificationId: '@_id' }, {
      update: {
        method: 'PUT'
      },
      getNotificationByUser: {
        method: 'POST',
        isArray: true,
        url: '../api/notifications/getnotification'
      },
    });

    angular.extend(Notifications, {
      requestFindNotificationByUser: function (notifications) {
        return this.getNotificationByUser(notifications).$promise;
      }
    });

    return Notifications;
  }