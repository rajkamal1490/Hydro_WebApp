(function () {
  'use strict';

  // Tasks controller
  angular
    .module('tasks')
    .controller('TasksController', TasksController);

  TasksController.$inject = ['$scope', '$state', '$window', 'Authentication', 'editMode', 'PRIORITIES', '$mdDialog', '$mdpDatePicker', 'Notification', 'task', 'taskResolve', 'TasksService', 'TASK_STATUSES', 'userResolve'];

  function TasksController ($scope, $state, $window, Authentication, editMode, PRIORITIES, $mdDialog, $mdpDatePicker, Notification, task, taskResolve, TasksService, TASK_STATUSES, userResolve) {
    var vm = this;

    vm.authentication = Authentication;
    vm.task = new TasksService(task);
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.cancel = cancel;
    vm.priorities = PRIORITIES;
    vm.statuses = TASK_STATUSES
    vm.loadinitial = loadinitial;

    $scope.eventTime = {
      mStartClock: task ? new Date(task.startDateTime) : new Date(),
      mEndClock: task ? new Date(task.dueDateTime) : new Date(),      
      mStartToServer: task ? getTimeToServer(new Date(task.startDateTime)) : getTimeToServer(new Date()),
      mEndToServer: task ? getTimeToServer(new Date(task.dueDateTime)) : getTimeToServer(new Date())
    };

    $scope.model = {
      users: userResolve
    };

    $scope.ui = {
      isTaskInProgress: false,
      editMode: editMode
    };


    function loadinitial() {
      vm.task.startDateTime = task ? getTimeToDisplay(new Date(task.startDateTime)) : getTimeToDisplay(new Date());
      vm.task.dueDateTime = task ? getTimeToDisplay(new Date(task.dueDateTime)) : getTimeToDisplay(new Date());
    }

    // Remove existing Task
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.task.$remove($state.go('tasks.list'));
      }
    }

    // Save Task
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.taskForm');
        return false;
      }

      if ($scope.ui.isTaskInProgress) {
        return;
      } else {
        $scope.ui.isTaskInProgress = true;
      }      

      vm.task.createdBy = Authentication.user.displayName;
      vm.task.startDateTime = $scope.eventTime.mStartToServer;
      vm.task.dueDateTime = $scope.eventTime.mEndToServer;

      // TODO: move create/update logic to service
      if (vm.task._id) {
        vm.task.$update(successCallback, errorCallback);
      } else {
        if(taskResolve.length > 0) {
          var taskIDs = _.map(taskResolve, 'taskID');
          var latestTaskID = _.max(taskIDs);
          vm.task.taskID = latestTaskID + 1;
        } else {
          vm.task.taskID = 1;
        }
        vm.task.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var msg = editMode ? "Task updated successfully" : "Task created successfully"
        $mdDialog.hide(res);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
        });
      }

      function errorCallback(errorResponse) {
        $scope.ui.isTaskInProgress = false;
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Task error!'
        });
      }
    }

    $scope.showStartDatePicker = function(ev) {
      $mdpDatePicker($scope.eventTime.mStartClock, {
          targetEvent: ev
        })
        .then(function(dateTime) {
          $scope.eventTime.mStartClock = dateTime;
          vm.task.startDateTime = getTimeToDisplay(dateTime);
          $scope.eventTime.mStartToServer = getTimeToServer(dateTime);

          validateStartAndEndDate();          
        });
    };

    $scope.showEndDatePicker = function(ev) {
      $mdpDatePicker($scope.eventTime.mEndClock, {
          targetEvent: ev
        })
        .then(function(dateTime) {
          $scope.eventTime.mEndClock = dateTime;
          vm.task.dueDateTime = getTimeToDisplay(dateTime);
          $scope.eventTime.mEndToServer = getTimeToServer(dateTime);

          validateStartAndEndDate();
        });
    };

    function validateStartAndEndDate() {
      if (vm.taskForm) {        
        var bool = (Date.parse($scope.eventTime.mEndToServer) > Date.parse($scope.eventTime.mStartToServer));
        vm.taskForm.end.$setValidity('greater', bool);
        vm.taskForm.start.$setValidity('lesser', bool);
      }
    }

    function getTimeToDisplay(date) {
      return moment(date).format('YYYY:MM:DD');
    }

    function getTimeToServer(date) {
      var dt = new Date(date);
      var dtGMT = new Date((new Date(dt)).toUTCString()).toISOString();

      return dtGMT;
    }

    function cancel() {
      $mdDialog.cancel();
    };

  }
}());
