(function() {
  'use strict';

  angular
    .module('core')
    .controller('CheckInController', CheckInController);

  CheckInController.$inject = ['$scope', '$state', 'AttendancesService', 'Authentication', 'Notification', '$mdDialog'];

  function CheckInController($scope, $state, AttendancesService, Authentication, Notification, $mdDialog) {
    var vm = this;
    vm.authentication = Authentication;
    vm.checkIn = checkIn;
    vm.attendances = new AttendancesService();
    vm.checkInProgress = false;

    function checkIn() {

      if (vm.checkInProgress) {
        return;
      } else {
        vm.checkInProgress = true;
      }

      vm.attendances.date = new Date().getDate();
      vm.attendances.month = new Date().getMonth() + 1;
      vm.attendances.year = new Date().getFullYear();
      vm.attendances.checkInTime = new Date();
      vm.attendances.user = Authentication.user._id;

      vm.attendances.$save(successCallback, errorCallback);

      function successCallback(res) {
        vm.checkInProgress = false;
        $mdDialog.hide(res);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Your check-in time inserted successfully '
        });
      }

      function errorCallback(errorResponse) {
        vm.checkInProgress = false;
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Your check-in time not inserted successfully, Please contact your adminstrator'
        });
      }

    };

  }
}());