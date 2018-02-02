(function() {
	'use strict';

	angular
		.module('tasks')
		.controller('TasksListController', TasksListController);

	TasksListController.$inject = ['Authentication', 'CommonService', 'PRIORITIES', '$filter', '$scope', '$mdDialog', 'taskResolve', 'TASK_STATUSES', 'userResolve'];

	function TasksListController(Authentication, CommonService, PRIORITIES, $filter, $scope, $mdDialog, taskResolve, TASK_STATUSES, userResolve) {
		var vm = this;

		vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
		vm.pageChanged = pageChanged;
		vm.getPriorityName = getPriorityName;
		vm.getStatusName = getStatusName;
		vm.getUserName = getUserName;
		vm.tasks = taskResolve;
		vm.statuses = TASK_STATUSES;
		vm.users = userResolve;

		$scope.searchParams = {
			status: undefined,
			keyword: undefined,
			assignee: undefined
		};

		$scope.loadinitial = function() {
			vm.pagedItems = [];
			vm.itemsPerPage = 10;
			vm.currentPage = 1;
			vm.figureOutItemsToDisplay();
		}

		function figureOutItemsToDisplay() {
			var sortedTasks = $filter('orderBy')(taskResolve, '-taskID');
			vm.filteredItems = $filter('filter')(sortedTasks, {
				$: vm.search
			});
			vm.filterLength = vm.filteredItems.length;
			var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
			var end = begin + vm.itemsPerPage;
			vm.pagedItems = vm.filteredItems.slice(begin, end);
		}

		function pageChanged() {
			vm.figureOutItemsToDisplay();
		}

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
					var taskIndex = CommonService.findIndexByID(vm.pagedItems, task._id);
					if (createdItem.isDelete) {
						vm.pagedItems.splice(taskIndex, 1);
					} else {
						vm.pagedItems[taskIndex] = createdItem;
					}
				} else {
					vm.pagedItems.push(createdItem);
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