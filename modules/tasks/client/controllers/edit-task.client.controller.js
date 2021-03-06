(function() {
  'use strict';

  // Accounts controller
  angular
    .module('tasks')
    .controller('TasksEditController', TasksEditController);

  TasksEditController.$inject = ['CommonService', '$scope', '$state', '$window', '$mdDialog', 'Authentication', 'PRIORITIES', 'taskResolve', 'userResolve', 'Notification', 'statusResolve', 'projectResolve'];

  function TasksEditController(CommonService, $scope, $state, $window, $mdDialog, Authentication, PRIORITIES, task, userResolve, Notification, statusResolve, projectResolve) {
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
    vm.statuses = statusResolve;
    vm.users = userResolve;
    vm.hasLoading = false;
    vm.originalTask = angular.copy(task);
    vm.projects = projectResolve;

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

    function remove(task, index) {
			var confirm = $mdDialog.confirm().title('Do you want to delete the task?').textContent('task detail will be deleted permanently.').ok('Yes').cancel('No').multiple(true);
			$mdDialog.show(confirm).then(function() {
        console.log(angular.toJson($state.get()));
					vm.task.$remove(deleteSuccessCallback, deleteErrorCallback);
					function deleteSuccessCallback(res) {
            $window.location.href= '/tasks';
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tasks deleted successfully!' });
					}

					function deleteErrorCallback(res) {
						Notification.error({
							message: res.data.message,
							title: '<i class="glyphicon glyphicon-remove"></i> Delete Task Error'
						});
					}
				},
				function() {
					console.log('no');
				});
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
      vm.hasLoading = true;
      vm.task.updated = new Date();
      if ($scope.ui.editTitle) {
        var comments = {
          name: Authentication.user.displayName,
          comments: "Changed the title from " + vm.originalTask.title + " to " + vm.task.title,
          createdDate: new Date(),
          flag: 4,
        };
        vm.task.hasTitle = true;
        vm.task.originalTaskTitle = vm.originalTask.title;
      }
      if ($scope.ui.editDescription) {
        var comments = {
          name: Authentication.user.displayName,
          comments: "Changed the description from " + vm.originalTask.description + " to " + vm.task.description,
          createdDate: new Date(),
          flag: 5,
        };
        vm.task.hasDescription = true;
        vm.task.originalTaskDescription = vm.originalTask.description;
      };
      vm.task.comments.push(comments);
      vm.task.$update().then(function(updated) {
        clearUI();
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Task updated successfully'
        });
        vm.hasLoading = false;
      });
    };

    $scope.updateStatus = function(status) {
      vm.hasLoading = true;
      var comments = {
        name: Authentication.user.displayName,
        comments: "Changed status from " + vm.task.status + " to " +  status,
        createdDate: new Date(),
        flag: 1,
      };
      vm.task.status = status;
      vm.task.updated = new Date();
      vm.task.comments.push(comments);
      vm.task.hasAssignee = false;
      vm.task.hasCommets = false;
      vm.task.hasStatus = true;
      vm.task.$update().then(function(updated) {
        clearUI();
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Status updated successfully'
        });
        vm.hasLoading = false;
      });
    };

    $scope.updateProject = function(projectCode) {
      vm.hasLoading = true;
      var comments = {
        name: Authentication.user.displayName,
        comments: "Changed project from " + vm.task.projectCode + " to " +  projectCode,
        createdDate: new Date(),
        flag: 6,
      };
      vm.task.projectCode = projectCode;
      vm.task.updated = new Date();
      vm.task.comments.push(comments);
      vm.task.hasProjectCode = true;
      vm.task.$update().then(function(updated) {
        clearUI();
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Project updated successfully'
        });
        vm.hasLoading = false;
      });
    }

    $scope.addComment = function() {
      vm.hasLoading = true;
      var comments = {
        name: Authentication.user.displayName,
        comments: vm.task.comment,
        createdDate: new Date(),
        flag: 0,
      };

      vm.task.comments.push(comments);
      vm.task.updated = new Date();
      vm.task.hasAssignee = false;
      vm.task.hasCommets = true;
      vm.task.hasStatus = false;
      vm.task.latestComment = vm.task.comment;
      vm.task.$update().then(function(updated) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Comments added successfully'
        });
        vm.hasLoading = false;
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
        var comments = {
          name: Authentication.user.displayName,
          comments: "Uploaded the file " + response.filename,
          createdDate: new Date(),
          flag: 3,
        };
        vm.task.hasAttachments = true;
        vm.task.comments.push(comments);
        vm.task.updated = new Date();
        vm.task.$update();
      }, function() {
        console.log('You cancelled the dialog.');
      });
    };

    $scope.deleteFile = function(file) {
      vm.hasLoading = true;
      vm.task.attachments = _.reject(vm.task.attachments, function(attachment) {
        return _.isEqual(attachment, file);
      });
      vm.task.deletedAttachement = file;
      vm.task.updated = new Date();
      vm.task.$update().then(function(updated) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> File removed successfully'
        });
        vm.hasLoading = false;
      });
    };

    $scope.assignToMe = function(id) {
      var comments = {
        name: Authentication.user.displayName,
        comments: "Changed assignee from " + getUserName(vm.task.assignee).displayName + " to " +  Authentication.user.displayName,
        createdDate: new Date(),
        flag: 2,
      };
      vm.task.comments.push(comments);
      vm.task.assignee = Authentication.user._id;
      vm.task.updated = new Date();
      vm.task.hasAssignee = true;
      vm.task.hasCommets = false;
      vm.task.hasStatus = false;
      vm.task.$update().then(function(updated) {
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Assignee changed successfully'
        });
      });
    };

    $scope.taskAssignee = function(user) {
      vm.hasLoading = true;
      var comments = {
        name: Authentication.user.displayName,
        comments: "Changed assignee from " + getUserName(vm.task.assignee).displayName + " to " +  user.displayName,
        createdDate: new Date(),
        flag: 2,
      };
      vm.task.comments.push(comments);
      vm.task.assignee = user._id;
      vm.task.updated = new Date();
      vm.task.hasAssignee = true;
      vm.task.hasCommets = false;
      vm.task.hasStatus = false;
      vm.task.$update().then(function(updated) {
        clearUI();
        vm.hasLoading = false;
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
