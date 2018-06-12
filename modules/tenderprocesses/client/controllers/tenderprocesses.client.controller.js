(function () {
  'use strict';

  // Tenderprocesses controller
  angular
    .module('tenderprocesses')
    .controller('TenderprocessesController', TenderprocessesController);

  TenderprocessesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'tenderprocessResolve'];

  function TenderprocessesController ($scope, $state, $window, Authentication, tenderprocess) {
    var vm = this;

    vm.authentication = Authentication;
    vm.tenderprocess = tenderprocess;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Tenderprocess
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.tenderprocess.$remove($state.go('tenderprocesses.list'));
      }
    }

    // Save Tenderprocess
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tenderprocessForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.tenderprocess._id) {
        vm.tenderprocess.$update(successCallback, errorCallback);
      } else {
        vm.tenderprocess.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('tenderprocesses.view', {
          tenderprocessId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
