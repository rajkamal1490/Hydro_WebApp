(function () {
  'use strict';

  // Projects controller
  angular
    .module('projects')
    .controller('ProjectsController', ProjectsController);

  ProjectsController.$inject = ['$scope', '$state', '$window', 'Authentication', '$mdDialog', 'project', 'ProjectsService', 'editMode', 'Notification', 'users'];

  function ProjectsController ($scope, $state, $window, Authentication, $mdDialog, project, ProjectsService, editMode, Notification, users) {
    var vm = this;

    vm.authentication = Authentication;
    vm.project = new ProjectsService(project);
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.cancel = cancel;
    vm.date = new Date();
    vm.users = users;

    $scope.ui = {
      isProjectInProgress: false,
      editMode: editMode
    };

    // Save project
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.projectForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.project._id) {
        vm.project.$update(successCallback, errorCallback);
      } else {
        vm.project.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var msg = editMode ? "project updated successfully" : "project created successfully"
        $mdDialog.hide(res);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
        });
      }

      function errorCallback(errorResponse) {
        $scope.ui.isProjectInProgress = false;
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> project error!'
        });
      }
    }

    function cancel() {
      $mdDialog.cancel();
    };

  }
}());
