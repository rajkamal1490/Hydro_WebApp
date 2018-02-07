(function () {
  'use strict';

  // Attendances controller
  angular
    .module('attendances')
    .controller('AttendancesController', AttendancesController);

  AttendancesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'attendanceResolve', '$mdDialog'];

  function AttendancesController ($scope, $state, $window, Authentication, attendance, $mdDialog) {
    var vm = this;

    vm.authentication = Authentication;
    vm.attendance = attendance;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.cancel = cancel;
    vm.save = save;
    vm.checkInTime = moment(attendance.checkInTime).format('YYYY:MM:DD hh:mm:ss');
    vm.checkOutTime = attendance.checkOutTime ? moment(attendance.checkOutTime).format('YYYY:MM:DD hh:mm:ss') : "";

    // Remove existing Attendance
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.attendance.$remove($state.go('attendances.list'));
      }
    }

    // Save Attendance
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.attendanceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.attendance._id) {
        vm.attendance.$update(successCallback, errorCallback);
      } else {
        vm.attendance.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('attendances.view', {
          attendanceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
    
    function cancel() {
      $mdDialog.cancel();
    };
  }
}());
