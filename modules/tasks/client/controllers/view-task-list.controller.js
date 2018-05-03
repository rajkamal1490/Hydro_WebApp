(function() {
	'use strict';

	angular
		.module('tasks')
		.controller('ViewTaskListCtrl', ViewTaskListCtrl);

	ViewTaskListCtrl.$inject = ['CommonService', 'PRIORITIES', '$scope', '$mdDialog', 'taskResolve', 'userResolve'];

	function ViewTaskListCtrl(CommonService, PRIORITIES, $scope, $mdDialog, taskResolve, userResolve) {
		var vm = this;
		
		vm.getPriorityName = getPriorityName;
		vm.getUserName = getUserName;
		vm.tasks = taskResolve;
		vm.users = userResolve;
		vm.cancel = cancel;


		function getPriorityName(priority) {
			return CommonService.getArrayValue(PRIORITIES, priority);
		};

		function getUserName(userID) {
			return CommonService.getName(userResolve, userID);
		}

		function cancel() {
			$mdDialog.cancel();
		};
	}
}());