(function() {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['CHART_BACKGROUND_COLOR', 'CHART_HOVER_BACKGROUND_COLOR', 'CheckInAttendancesServices', '$scope', '$http', '$filter', '$state', 'CommonService', 'PRIORITIES', 'Authentication', 'menuService', '$mdDialog', 'Notification',  'userResolve', 'TASK_STATUSES', 'taskResolve', 'TasksService', 'statusResolve'];

  function HomeController(CHART_BACKGROUND_COLOR, CHART_HOVER_BACKGROUND_COLOR, CheckInAttendancesServices, $scope, $http, $filter, $state, CommonService, PRIORITIES, Authentication, menuService, $mdDialog, Notification, userResolve, TASK_STATUSES, taskResolve, TasksService, statusResolve) {
    var vm = this;
    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.getPriorityName = getPriorityName;
    vm.tasks = [];
    vm.hasShowCheckInDialog = false;
    vm.starCase = starCase;
    vm.statuses = statusResolve;

    CommonService.setUserResolve(userResolve);

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    $scope.model = {
      taskFilter: 1
    };

    $scope.chart = {
      data: [],
      labels: _.map(statusResolve, 'name'),
      backgroundColor:_.map( _.map(statusResolve, 'color'), 'code'),
      hoverBackgroundColor: _.map( _.map(statusResolve, 'color'), 'code')
    };

    $scope.loadInitial = function() {      
      CheckInAttendancesServices.requestFindTodayCheckIn(CommonService.buildArrayToFindTodayCheckIn(Authentication.user._id)).then(function(searchResults) {
        Authentication.todayCheckIn[0] = searchResults[0];
        vm.hasShowCheckInDialog = searchResults.length <= 0;  
        if (vm.hasShowCheckInDialog) {
          showCheckInDialog();
        }      
      });      

      $http({
        method: 'GET',
        url: 'api/tasks/assignee/' + vm.authentication.user._id
      }).then(function(tasks) {
        vm.tasks = tasks.data;
        vm.pagedItems = [];
        vm.itemsPerPage = 10;
        vm.currentPage = 1;
        vm.figureOutItemsToDisplay();
        chartSummary();

      }, function(errorResponse) {
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Task error!'
        });
      });
    };

    function figureOutItemsToDisplay() {
      var sortedTasks = $filter('orderBy')(vm.tasks, '-taskID');
      vm.filteredItems = $filter('filter')(sortedTasks, function(sortedTask) {
        return sortedTask.status !== TASK_STATUSES[2].code;
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    function getPriorityName(priority) {
      return CommonService.getArrayValue(PRIORITIES, priority);
    };

    $scope.updateTask = function(task, editMode) {
      var oldShow = $mdDialog.show;
      $mdDialog.show = function(options) {
        if (options.hasOwnProperty("skipHide")) {
          options.multiple = options.skipHide;
        }
        return oldShow(options);
      };
      $mdDialog.show({
        controller: 'TasksController',
        controllerAs: 'vm',
        templateUrl: '/modules/tasks/client/views/form-task.client.view.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: true,
        resolve: {
          task: function() {
            return task;
          },
          editMode: function() {
            return editMode;
          },
          taskResolve: function() {
            return vm.tasks;
          },
          userResolve: function() {
            return userResolve;
          }
        }
      }).then(function(createdItem) {

        var pagedItemsIndex = CommonService.findIndexByID(vm.pagedItems, task._id);
        var taskIndex = CommonService.findIndexByID(vm.tasks, task._id);
        var tasksIndex = CommonService.findIndexByID(taskResolve, task._id);
        if (createdItem.isDelete) {
          vm.pagedItems.splice(pagedItemsIndex, 1);
        } else {
          vm.pagedItems[pagedItemsIndex] = createdItem;
          vm.tasks[taskIndex] = createdItem;
          taskResolve[tasksIndex] = createdItem;

        }
        figureOutItemsToDisplay();
        chartSummary();

      }, function() {
        console.log('You cancelled the dialog.');
      });
    };

    $scope.updateStatus = function(task, status) {
      var comments = {
        name: Authentication.user.displayName,
        comments: "Changed assignee from " + task.status + " to " +  status,
        createdDate: new Date(),
        flag: 1,
      };
      task.comments.push(comments);
      var taskService = new TasksService({_id: task._id, status: status, comments: task.comments, updated: new Date()});
      taskService.$update().then(function(updated) {
        task.editStatus = false;
        figureOutItemsToDisplay();
        chartSummary();
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Status updated successfully'
        });
      });      
    };

    function chartSummary() {
      $scope.chart.data = [];
      if ($scope.model.taskFilter === 2 || $scope.model.taskFilter === '2') {
        var all_tasks = document.getElementById("all_tasks").getContext("2d");
        tasksChart(taskResolve, all_tasks);
      } else {
        var assigned_to_me = document.getElementById("assigned_to_me").getContext("2d");
        tasksChart(vm.tasks, assigned_to_me);
      }

    };

    function tasksChart(tasks, ctx) {
      angular.forEach(statusResolve, function(status) {
        var length = CommonService.getStatusCountFromTasks(tasks, status.code);
        $scope.chart.data.push(length);
      });
      var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: $scope.chart.labels,
          datasets: [{
            data: $scope.chart.data,
            backgroundColor: $scope.chart.backgroundColor,
            hoverBackgroundColor: $scope.chart.hoverBackgroundColor
          }]
        },
        options: {
          legend: {
            display: false
          },
        }
      });
    };

    $scope.taskFilter = function() {
      chartSummary();
    };


    function starCase(status) {
      return _.startCase(status);
    }

    function showCheckInDialog() {
      CommonService.setIsAllowToClick(true);
      $mdDialog.show({
        controller: 'CheckInController',
        controllerAs: 'vm',
        templateUrl: '/modules/core/client/views/check-in.client.view.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false
      }).then(function(createdItem) {
        Authentication.todayCheckIn[0] =createdItem;
        vm.hasShowCheckInDialog = false;
        CommonService.setIsAllowToClick(false);
      }, function() {
        console.log("canceled");
        CommonService.setIsAllowToClick(false);
      });
    };

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      if (!Authentication.user) {
        $state.go('authentication.signin')
      }

      if(vm.hasShowCheckInDialog) {
        $state.go('home');
      }
    }
  }
}());