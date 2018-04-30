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
        url: '../api/employeemeetings/gettodaymeetings'
      },
      getMyMeetings: {
        method: 'POST',
        isArray: true,
        url: 'api/employeemeetings/getmymeetings'
      },
      getAlreadyCreatedMinutes: {
        method: 'POST',
        isArray: true,
        url: 'api/startmeetings/validatealreadycreatedminutes'
      },
      createAndUploadMinutes: {
        method: 'POST',
        isArray: true,
        url: 'api/startmeetings/createminutesofmeetingdocx'
      },
    });

    angular.extend(EmployeeMeetings, {
      requestFindTodayMeetingsByUser: function (meetings) {
        return this.getTodayMeetingsByUser(meetings).$promise;
      },
      requestFindMyMeetingsByUser: function (meetings) {
        return this.getMyMeetings(meetings).$promise;
      },
      validateAlreadyCreatedMinutes: function (meetings) {
        return this.getAlreadyCreatedMinutes(meetings).$promise;
      },
      createMinutesOfMeetingDocx: function (meetings) {
        return this.createAndUploadMinutes(meetings).$promise;
      },
    });

    return EmployeeMeetings;
  }