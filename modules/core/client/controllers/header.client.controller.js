(function() {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'AttendancesService', 'Authentication', 'menuService', '$mdDialog', 'Notification'];

  function HeaderController($scope, $state, AttendancesService, Authentication, menuService, $mdDialog, Notification) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.checkOutInProgress = false;

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    $scope.logout = function(ev, todayCheckIn) {
      if (vm.checkOutInProgress) {
        return;
      } else {
        vm.checkOutInProgress = true;
      }

      if (todayCheckIn.checkOutTime) {
        window.location.href = '/api/auth/signout';
      } else {
        checkOut(ev, todayCheckIn);
      }

    };

    function checkOut(ev, todayCheckIn) {
      var confirm = $mdDialog.confirm()
        .title('Do you want to checkout before logout?')
        .targetEvent(ev)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(confirm).then(function() {
          var attendance = new AttendancesService(todayCheckIn);
          attendance.checkOutTime = new Date();
          attendance.$update(successCallback, errorCallback);

          function successCallback(res) {
            vm.checkOutInProgress = false;
            Notification.success({
              message: '<i class="glyphicon glyphicon-ok"></i> Your check-out time inserted successfully '
            });
          }

          function errorCallback(errorResponse) {
            vm.checkOutInProgress = false;
            Notification.error({
              message: errorResponse.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> Your check-out time not inserted successfully, Please contact your adminstrator'
            });
          }
          window.location.href = '/api/auth/signout';
        },
        function() {
          window.location.href = '/api/auth/signout';
        });
    }

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }
  }
}());