(function() {
  'use strict';

  // Accounts controller
  angular
    .module('tasks')
    .controller('TasksEditController', TasksEditController);

  TasksEditController.$inject = ['CommonService', '$scope', '$state', '$window', '$mdDialog', 'Authentication', 'PRIORITIES', 'taskResolve', 'userResolve', 'Notification', 'TASK_STATUSES'];

  function TasksEditController(CommonService, $scope, $state, $window, $mdDialog, Authentication, PRIORITIES, task, userResolve, Notification, TASK_STATUSES) {
    var vm = this;

    vm.authentication = Authentication;
    vm.task = task;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.starCase = starCase;
    vm.getPriorityName = getPriorityName;
    vm.getUserName = getUserName;
    vm.statuses = TASK_STATUSES;
    vm.users = userResolve;

    $scope.ui = {
      editTitle: false,
      editDescription: false,
      editStatus: false,
      editProject: false,
      assigneeProject: false,
      titleMouseHover: false,
      descriptionMouseHover: false,
      statusMouseHover: false,
      projectMouseHover: false,
      assigneeMouseHover: false,
    };

    // Remove existing Account
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.task.$remove($state.go('accounts.list'));
      }
    }

    // Save Account
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.accountForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.task._id) {
        vm.task.$update(successCallback, errorCallback);
      } else {
        vm.task.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('accounts.view', {
          accountId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function getPriorityName(priority) {
      return CommonService.getArrayValue(PRIORITIES, priority);
    };

    function starCase(status) {
      return _.startCase(status);
    }

    function getUserName(user_id) {
      return CommonService.getName(userResolve, user_id);
    }

    $scope.updateTask = function() {
      vm.task.updated = new Date();
      vm.task.$update().then(function(updated) {
        clearUI();
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Task updated successfully'
        });
      });
    };

    $scope.updateStatus = function(status) {
      var comments = {
        name: Authentication.user.displayName,
        comments: "Changed status from " + vm.task.status + " to " +  status,
        createdDate: new Date(),
        flag: 1,
      };
      vm.task.status = status;
      vm.task.updated = new Date();      
      vm.task.comments.push(comments);
      vm.task.$update().then(function(updated) {
        clearUI();
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Status updated successfully'
        });
      });
    }

    $scope.addComment = function() {
      var comments = {
        name: Authentication.user.displayName,
        comments: vm.task.comment,
        createdDate: new Date(),
        flag: 0,
      };

      vm.task.comments.push(comments);
      vm.task.updated = new Date();
      vm.task.$update().then(function(updated) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Comments added successfully'
        });
      });

    };

    $scope.fileUpload = function() {
      $mdDialog.show({
        controller: 'TaskAttachmentController',
        controllerAs: 'vm',
        templateUrl: '/modules/tasks/client/views/task-attachment.client.view.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: true,
        resolve: {
          task: function() {
            return vm.task;
          }
        }
      }).then(function(response) {
        response.created = new Date();
        vm.task.attachments = vm.task.attachments ? vm.task.attachments : [];
        vm.task.attachments.push(response);
        vm.task.updated = new Date();
        vm.task.$update();
      }, function() {
        console.log('You cancelled the dialog.');
      });
    };

    $scope.deleteFile = function(file) {
      vm.task.attachments = _.reject(vm.task.attachments, function(attachment) {
        return _.isEqual(attachment, file);
      });
      vm.task.deletedAttachement = file;
      vm.task.updated = new Date();
      vm.task.$update().then(function(updated) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> File removed successfully'
        });
      });
    };

    $scope.assignToMe = function(id) {      
      var comments = {
        name: Authentication.user.displayName,
        comments: "Changed status from " + getUserName(vm.task.assignee).displayName + " to " +  Authentication.user.displayName,
        createdDate: new Date(),
        flag: 2,
      };
      vm.task.comments.push(comments);
      vm.task.assignee = Authentication.user._id;
      vm.task.updated = new Date();
      vm.task.$update().then(function(updated) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Assignee changed successfully'
        });
      });
    };

    $scope.taskAssignee = function(user) {
      var comments = {
        name: Authentication.user.displayName,
        comments: "Changed status from " + getUserName(vm.task.assignee).displayName + " to " +  user.displayName,
        createdDate: new Date(),
        flag: 2,
      };
      vm.task.comments.push(comments);
      vm.task.assignee = user._id;
      vm.task.updated = new Date();
      vm.task.$update().then(function(updated) {
        clearUI();
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Assignee changed successfully'
        });
      });
    }

    function clearUI() {
      $scope.ui.editTitle = false;
      $scope.ui.editDescription = false;
      $scope.ui.editStatus = false;
      $scope.ui.editProject = false;
      $scope.ui.titleMouseHover = false;
      $scope.ui.descriptionMouseHover = false;
      $scope.ui.statusMouseHover = false;
      $scope.ui.projectMouseHover = false;
      $scope.ui.assigneeProject = false;
      $scope.ui.assigneeMouseHover = false;
    }
  }
}());