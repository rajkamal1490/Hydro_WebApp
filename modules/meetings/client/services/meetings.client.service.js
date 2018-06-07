// Meetings service used to communicate Meetings REST endpoints
(function () {
  'use strict';

  angular
    .module('meetings')
    .factory('MeetingsService', MeetingsService);

  MeetingsService.$inject = ['$resource'];

  function MeetingsService($resource) {
    var Meetings = $resource('/api/meetings/:meetingId', {
      meetingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getMeetingByNotifcationID: {
        method: 'POST',
        isArray: false,
        url: '/api/meetings/filter/notification'
      }
    });

    angular.extend(Meetings, {
      getMeetingByNotifcationIDFromNotificationClick: function (notifications) {
        return this.getMeetingByNotifcationID(notifications).$promise;
      }
    });

    return Meetings;
  }
}());
