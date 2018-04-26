(function() {
  'use strict';

  // Statuses controller
  angular
    .module('statuses')
    .controller('StatusesController', StatusesController);

  StatusesController.$inject = ['$scope', '$state', '$window', 'colorResolve', 'Authentication', '$mdDialog', 'status', 'StatusesService', 'editMode', 'Notification'];

  function StatusesController($scope, $state, $window, colorResolve, Authentication, $mdDialog, status, StatusesService, editMode, Notification) {
    
    var vm = this;

    vm.authentication = Authentication;
    vm.status = new StatusesService(status);
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.cancel = cancel;
    vm.date = new Date();
    vm.colors = colorResolve;

    $scope.ui = {
      isStatusInProgress: false,
      editMode: editMode
    };

    // Save status
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.statusForm');
        return false;
      }

      vm.status.code = vm.status.name;

      // TODO: move create/update logic to service
      if (vm.status._id) {
        vm.status.$update(successCallback, errorCallback);
      } else {
        vm.status.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var msg = editMode ? "status updated successfully" : "status created successfully"
        $mdDialog.hide(res);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
        });
      }

      function errorCallback(errorResponse) {
        $scope.ui.isStatusInProgress = false;
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> status error!'
        });
      }
    }

    function cancel() {
      $mdDialog.cancel();
    };
  }
}());