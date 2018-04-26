(function () {
  'use strict';

  // Clearances controller
  angular
    .module('clearances')
    .controller('ClearancesController', ClearancesController);

  ClearancesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'clearanceResolve'];

  function ClearancesController ($scope, $state, $window, Authentication, clearance) {
    var vm = this;

    vm.authentication = Authentication;
    vm.clearance = clearance;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Clearance
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.clearance.$remove($state.go('clearances.list'));
      }
    }

    // Save Clearance
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.clearanceForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.clearance._id) {
        vm.clearance.$update(successCallback, errorCallback);
      } else {
        vm.clearance.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('clearances.view', {
          clearanceId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
