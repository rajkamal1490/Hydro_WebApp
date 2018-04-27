// Meetings service used to communicate Meetings REST endpoints
(function () {
  'use strict';

  angular
    .module('meetings')
    .factory('StartMeetingsService', StartMeetingsService);

  StartMeetingsService.$inject = ['$resource'];

  function StartMeetingsService($resource) {
    return $resource('api/startmeetings/:startmeetingId', {
      startmeetingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
