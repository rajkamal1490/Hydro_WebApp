(function() {
	'use strict';

	angular
		.module('tasks')
		.controller('TasksListController', TasksListController);

	TasksListController.$inject = ['CommonService', 'DEFAULT_ROWS_DISPLAYED_COUNT', 'PRIORITIES', '$filter', '$scope', '$mdDialog', 'statusResolve', 'taskResolve', 'userResolve', 'refCodeResolve', 'projectResolve'];

	function TasksListController(CommonService, DEFAULT_ROWS_DISPLAYED_COUNT, PRIORITIES, $filter, $scope, $mdDialog, statusResolve, taskResolve, userResolve, refCodeResolve, projectResolve) {
		var vm = this;
		
		vm.getPriorityName = getPriorityName;
		vm.getStatusName = getStatusName;
		vm.getUserName = getUserName;
		vm.tasks = taskResolve;
		vm.statuses = statusResolve;
		vm.users = userResolve;
		//vm.filteredTasks = [];

		$scope.searchParams = {
			status: undefined,
			keyword: undefined,
			assignee: undefined
		};

		$scope.ui = {
			rowsDisplayedCount: DEFAULT_ROWS_DISPLAYED_COUNT,
		};

		$scope.loadinitial = function() {
			
		};

		$scope.statusFilterFunc = function(status) {
			if (angular.isDefined(status) && status !== null) {
				return function(task) {
					return task.status === status;
					//return _.includes(status, task.status);
				}
			}
		};

		$scope.assigneefilterFunc = function(assignee) {
			if (angular.isDefined(assignee) && assignee !== null) {
				return function(task) {
					return task.assignee === assignee;
					//return _.includes(assignee, task.assignee);
				}
			}
		};

		$scope.loadMoreRows = function() {
			if ($scope.ui.rowsDisplayedCount < vm.tasks.length) {
				$scope.ui.rowsDisplayedCount += DEFAULT_ROWS_DISPLAYED_COUNT;
			}
		};

		function getPriorityName(priority) {
			return CommonService.getArrayValue(PRIORITIES, priority);
		};

		function getStatusName(status) {
			return CommonService.getArrayValue(statusResolve, status);
		};

		function getUserName(userID) {
			return CommonService.getName(userResolve, userID);
		}
	}
}());