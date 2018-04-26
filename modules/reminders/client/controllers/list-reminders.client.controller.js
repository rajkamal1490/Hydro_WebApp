(function() {
	'use strict';

	angular
		.module('reminders')
		.controller('RemindersListController', RemindersListController);

	RemindersListController.$inject = ['CommonService', 'DEFAULT_ROWS_DISPLAYED_COUNT', 'PRIORITIES', '$filter', '$scope', '$mdDialog', 'reminderResolve', 'Notification'];

	function RemindersListController(CommonService, DEFAULT_ROWS_DISPLAYED_COUNT, PRIORITIES, $filter, $scope, $mdDialog, reminderResolve, Notification) {
		var vm = this;
		
		vm.reminders = reminderResolve;
		vm.remove = remove;
		//vm.filteredReminders = [];

		$scope.searchParams = {
			keyword: undefined
		};

		$scope.ui = {
			rowsDisplayedCount: DEFAULT_ROWS_DISPLAYED_COUNT,
		};

		$scope.loadinitial = function() {
			
		};	

		$scope.createOrUpdateReminder = function(reminder, editMode) {
			var oldShow = $mdDialog.show;
			$mdDialog.show = function(options) {
				if (options.hasOwnProperty("skipHide")) {
					options.multiple = options.skipHide;
				}
				return oldShow(options);
			};
			$mdDialog.show({
				controller: 'RemindersController',
				controllerAs: 'vm',
				templateUrl: '/modules/reminders/client/views/form-reminder.client.view.html',
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				escapeToClose: false,
				fullscreen: true,
				resolve: {
					reminder: function() {
						return reminder;
					},
					editMode: function() {
						return editMode;
					}
				}
			}).then(function(createdItem) {

				if (editMode) {
					var reminderIndex = CommonService.findIndexByID(vm.reminders, reminder._id);
					vm.reminders[reminderIndex] = createdItem;
				} else {
					//vm.filteredReminders.push(createdItem);
					vm.reminders.push(createdItem);
				}

			}, function() {
				console.log('You cancelled the dialog.');
			});
		};


		function remove(reminder, index) {
			var confirm = $mdDialog.confirm().title('Do you want to delete the reminder?').textContent('Reminder detail will be deleted permanently.').ok('Yes').cancel('No').multiple(true);
			$mdDialog.show(confirm).then(function() {
				reminder.$remove(deleteSuccessCallback, deleteErrorCallback);
				function deleteSuccessCallback(res) {
					var reminderIndex = CommonService.findIndexByID(vm.reminders, reminder._id);
					vm.reminders.splice(reminderIndex, 1);				
					Notification.success({
						message: '<i class="glyphicon glyphicon-ok"></i> Reminder deleted successfully'
					});
				}

				function deleteErrorCallback(res) {
					Notification.error({
						message: res.data.message,
						title: '<i class="glyphicon glyphicon-remove"></i> Delete Reminder Error'
					});
				}
			},
			function() {
				console.log('no');
			});
		}

		$scope.loadMoreRows = function() {
			if ($scope.ui.rowsDisplayedCount < vm.reminders.length) {
				$scope.ui.rowsDisplayedCount += DEFAULT_ROWS_DISPLAYED_COUNT;
			}
		};
	}
}());