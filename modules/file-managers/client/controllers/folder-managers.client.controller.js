(function() {
  'use strict';

  // Clearances controller
  angular
    .module('file-managers')
    .controller('CreateFolderController', CreateFolderController);

  CreateFolderController.$inject = ['$scope', '$state', '$window', 'Authentication', '$mdDialog', 'folder', 'FolderManagersService', 'editMode', 'Notification'];

  function CreateFolderController($scope, $state, $window, Authentication, $mdDialog, folder, FolderManagersService, editMode, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.folder = new FolderManagersService(folder);
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.cancel = cancel;
    vm.date = new Date();

    $scope.ui = {
      isClearanceInProgress: false,
      editMode: editMode
    };

    // Save folder
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.folderForm');
        return false;
      }

      var name = vm.folder.name;

      vm.folder.code = name.split(' ').length > 1 ? name.replace(/ /g,"_") : name;

      // TODO: move create/update logic to service
      if (vm.folder._id) {
        vm.folder.$update(successCallback, errorCallback);
      } else {
        vm.folder.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var msg = editMode ? "Folder updated successfully" : "Folder created successfully"
        $mdDialog.hide(res);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
        });
      }

      function errorCallback(errorResponse) {
        $scope.ui.isClearanceInProgress = false;
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Folder error!'
        });
      }
    }

    function cancel() {
      $mdDialog.cancel();
    };
  }
}());