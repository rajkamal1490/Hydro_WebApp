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
      },
      findAttendancesByUser: {
        method: 'POST',
        isArray: true,
        url: 'api/checkins/findattendancesbyuser'
      },
      validateLeaveOverlap: {
        method: 'POST',
        isArray: true,
        url: 'api/checkins/validateLeaveOverlap'
      },
      validatePermissionOverlap: {
        method: 'POST',
        isArray: true,
        url: 'api/checkins/validatePermissionOverlap'
      },
    });

    angular.extend(CheckIns, {
      requestFindTodayCheckIn: function (attendances) {
        return this.todayCheckIn(attendances).$promise;
      },
      requestFindAttendancesByUser: function (attendances) {
        return this.findAttendancesByUser(attendances).$promise;
      },
      requestValidateOverlap: function (attendances) {
        if(attendances.hasApplyLeave) {
          return this.validateLeaveOverlap(attendances).$promise;
        } else {
          return this.validatePermissionOverlap(attendances).$promise;
        }
        
      }
    });

    return CheckIns;
  }