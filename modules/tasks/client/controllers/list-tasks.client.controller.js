(function() {
	'use strict';

	angular
		.module('tasks')
		.controller('TasksListController', TasksListController);

	TasksListController.$inject = ['CommonService', 'DEFAULT_ROWS_DISPLAYED_COUNT', 'PRIORITIES', '$filter', '$scope', '$mdDialog', 'taskResolve', 'TASK_STATUSES', 'userResolve'];

	function TasksListController(CommonService, DEFAULT_ROWS_DISPLAYED_COUNT, PRIORITIES, $filter, $scope, $mdDialog, taskResolve, TASK_STATUSES, userResolve) {
		var vm = this;
		
		vm.getPriorityName = getPriorityName;
		vm.getStatusName = getStatusName;
		vm.getUserName = getUserName;
		vm.tasks = taskResolve;
		vm.statuses = TASK_STATUSES;
		vm.users = userResolve;
		vm.filteredTasks = [];

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
		
		$scope.createOrUpdateTask = function(task, editMode) {
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

				if (editMode) {
					var taskIndex = CommonService.findIndexByID(vm.filteredTasks, task._id);
					if (createdItem.isDelete) {
						vm.filteredTasks.splice(taskIndex, 1);
					} else {
						vm.filteredTasks[taskIndex] = createdItem;
					}
				} else {
					//vm.filteredTasks.push(createdItem);
					vm.tasks.push(createdItem);
				}

			}, function() {
				console.log('You cancelled the dialog.');
			});
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
			if ($scope.ui.rowsDisplayedCount < vm.filteredTasks.length) {
				$scope.ui.rowsDisplayedCount += DEFAULT_ROWS_DISPLAYED_COUNT;
			}
		};

		function getPriorityName(priority) {
			return CommonService.getArrayValue(PRIORITIES, priority);
		};

		function getStatusName(status) {
			return CommonService.getArrayValue(TASK_STATUSES, status);
		};

		function getUserName(userID) {
			return CommonService.getName(userResolve, userID);
		}
	}
}());