(function () {
  'use strict';

  // Attendances controller
  angular
    .module('attendances')
    .controller('AttendancesController', AttendancesController);

  AttendancesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'attendanceResolve'];

  function AttendancesController ($scope, $state, $window, Authentication, attendance) {
    var vm = this;

    vm.authentication = Authentication;
    vm.attendance = attendance;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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
  }
}());
