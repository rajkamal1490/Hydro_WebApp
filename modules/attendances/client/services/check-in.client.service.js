angular
    .module('attendances')
    .factory('CheckInAttendancesServices', CheckInAttendancesServices);

  CheckInAttendancesServices.$inject = ['$resource'];

  function CheckInAttendancesServices($resource) {
    var CheckIns = $resource('api/checkins/', { attendanceId: '@_id' }, {
      update: {
        method: 'PUT'
      },
      todayCheckIn: {
        method: 'POST',
        isArray: true,
        url: 'api/checkins/todaycheckin'
      }
    });

    angular.extend(CheckIns, {
      requestFindTodayCheckIn: function (attendances) {
        return this.todayCheckIn(attendances).$promise;
      }
    });

    return CheckIns;
  }