(function() {
  'use strict';

  // Clearances controller
  angular
    .module('clearances')
    .controller('ClearancesController', ClearancesController);

  ClearancesController.$inject = ['$scope', '$state', '$window', 'Authentication', '$mdDialog', 'clearance', 'ClearancesService', 'editMode', 'Notification'];

  function ClearancesController($scope, $state, $window, Authentication, $mdDialog, clearance, ClearancesService, editMode, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.clearance = new ClearancesService(clearance);
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.cancel = cancel;
    vm.date = new Date();

    $scope.ui = {
      isClearanceInProgress: false,
      editMode: editMode
    };

    // Save clearance
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.clearanceForm');
        return false;
      }

      vm.clearance.code = vm.clearance.name;

      // TODO: move create/update logic to service
      if (vm.clearance._id) {
        vm.clearance.$update(successCallback, errorCallback);
      } else {
        vm.clearance.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var msg = editMode ? "clearance updated successfully" : "clearance created successfully"
        $mdDialog.hide(res);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
        });
      }

      function errorCallback(errorResponse) {
        $scope.ui.isClearanceInProgress = false;
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> clearance error!'
        });
      }
    }

    function cancel() {
      $mdDialog.cancel();
    };
  }
}());