(function () {
  'use strict';

  // Files controller
  angular
    .module('files')
    .controller('FilesController', FilesController);

  FilesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'fileResolve'];

  function FilesController ($scope, $state, $window, Authentication, file) {
    var vm = this;

    vm.authentication = Authentication;
    vm.file = file;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing File
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.file.$remove($state.go('files.list'));
      }
    }

    // Save File
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.fileForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.file._id) {
        vm.file.$update(successCallback, errorCallback);
      } else {
        vm.file.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('files.view', {
          fileId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
