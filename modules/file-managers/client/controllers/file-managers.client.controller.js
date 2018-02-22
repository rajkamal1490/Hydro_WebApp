(function () {
  'use strict';

  // File managers controller
  angular
    .module('file-managers')
    .controller('FileManagersController', FileManagersController);

  FileManagersController.$inject = ['$scope', '$state', '$window', 'Authentication', 'fileManagerResolve'];

  function FileManagersController ($scope, $state, $window, Authentication, fileManager) {
    var vm = this;

    vm.authentication = Authentication;
    vm.fileManager = fileManager;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing File manager
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.fileManager.$remove($state.go('file-managers.list'));
      }
    }

    // Save File manager
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.fileManagerForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.fileManager._id) {
        vm.fileManager.$update(successCallback, errorCallback);
      } else {
        vm.fileManager.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('file-managers.view', {
          fileManagerId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
