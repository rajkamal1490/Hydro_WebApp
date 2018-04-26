(function () {
  'use strict';

  // Refcodetasks controller
  angular
    .module('refcodetasks')
    .controller('RefcodetasksController', RefcodetasksController);

  RefcodetasksController.$inject = ['$scope', '$state', '$window', 'Authentication', 'refcodetaskResolve'];

  function RefcodetasksController ($scope, $state, $window, Authentication, refcodetask) {
    var vm = this;

    vm.authentication = Authentication;
    vm.refcodetask = refcodetask;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Refcodetask
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.refcodetask.$remove($state.go('refcodetasks.list'));
      }
    }

    // Save Refcodetask
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.refcodetaskForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.refcodetask._id) {
        vm.refcodetask.$update(successCallback, errorCallback);
      } else {
        vm.refcodetask.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('refcodetasks.view', {
          refcodetaskId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
