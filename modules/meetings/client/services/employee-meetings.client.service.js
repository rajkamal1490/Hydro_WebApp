angular
    .module('meetings')
    .factory('EmployeeMeetingsService', EmployeeMeetingsService);

  EmployeeMeetingsService.$inject = ['$resource'];

  function EmployeeMeetingsService($resource) {
    var EmployeeMeetings = $resource('api/employeemeetings/', { meetingId: '@_id' }, {
      update: {
        method: 'PUT'
      },
      getTodayMeetingsByUser: {
        method: 'POST',
        isArray: true,
        url: 'api/employeemeetings/gettodaymeetings'
      },
    });

    angular.extend(EmployeeMeetings, {
      requestFindTodayMeetingsByUser: function (meetings) {
        return this.getTodayMeetingsByUser(meetings).$promise;
      }
    });

    return EmployeeMeetings;
  }