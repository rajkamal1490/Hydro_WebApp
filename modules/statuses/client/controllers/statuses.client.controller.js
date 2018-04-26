(function () {
  'use strict';

  // Statuses controller
  angular
    .module('statuses')
    .controller('StatusesController', StatusesController);

  StatusesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'statusResolve'];

  function StatusesController ($scope, $state, $window, Authentication, status) {
    var vm = this;

    vm.authentication = Authentication;
    vm.status = status;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Status
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.status.$remove($state.go('statuses.list'));
      }
    }

    // Save Status
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.statusForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.status._id) {
        vm.status.$update(successCallback, errorCallback);
      } else {
        vm.status.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('statuses.view', {
          statusId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
