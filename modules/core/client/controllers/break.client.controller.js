(function() {
  'use strict';

  angular
    .module('core')
    .controller('BreakController', BreakController);

  BreakController.$inject = ['breakStartTime', '$scope', '$state', 'AttendancesService', 'Notification', '$mdDialog', '$interval', 'todayCheckIn'];

  function BreakController(breakStartTime, $scope, $state, AttendancesService, Notification, $mdDialog, $interval, todayCheckIn) {
    var vm = this;
    vm.stop = stop;
    vm.attendances = new AttendancesService(todayCheckIn);
    vm.breakInProgress = false;

    $scope.currentDateTime = moment(Date.now()).format('MMMM Do YYYY');   

    var clock = function() {
      $scope.clock = moment.utc(moment(new Date(), "HH:mm:ss").diff(moment(new Date(breakStartTime), "HH:mm:ss"))).format("HH:mm:ss");
    }
    clock();
    $interval(clock, 1000);

    function stop() {

      if (vm.breakInProgress) {
        return;
      } else {
        vm.breakInProgress = true;
      }

      var breakTime = [{
        startDateTime: breakStartTime,
        endDateTime: new Date(),
        breakDiff: $scope.clock
      }];

      if(vm.attendances.breakTime) {
        vm.attendances.breakTime.push(breakTime[0]);
      } else {
        vm.attendances.breakTime = breakTime;
      }

      vm.attendances.$update(successCallback, errorCallback);

      function successCallback(res) {
        vm.breakInProgress = false;
        $mdDialog.hide(res);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Your check-in time inserted successfully '
        });
      }

      function errorCallback(errorResponse) {
        vm.breakInProgress = false;
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Your check-in time not inserted successfully, Please contact your adminstrator'
        });
      }

    };

  }
}());