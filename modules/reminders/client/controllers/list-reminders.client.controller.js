(function() {
	'use strict';

	angular
		.module('reminders')
		.controller('RemindersListController', RemindersListController);

	RemindersListController.$inject = ['CommonService', 'PRIORITIES', '$filter', '$scope', '$mdDialog', 'reminderResolve', 'Notification'];

	function RemindersListController(CommonService, PRIORITIES, $filter, $scope, $mdDialog, reminderResolve, Notification) {
		var vm = this;

		vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
		vm.pageChanged = pageChanged;
		vm.reminders = reminderResolve;
		vm.remove = remove;

		$scope.searchParams = {
			keyword: undefined
		};

		$scope.loadinitial = function() {
			vm.pagedItems = [];
			vm.itemsPerPage = 10;
			vm.currentPage = 1;
			vm.figureOutItemsToDisplay();
		};

		function figureOutItemsToDisplay() {			
			vm.filteredItems = $filter('filter')(reminderResolve, {
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
					var reminderIndex = CommonService.findIndexByID(vm.pagedItems, reminder._id);
					vm.pagedItems[reminderIndex] = createdItem;
				} else {
					vm.pagedItems.push(createdItem);
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
					vm.pagedItems.splice(index, 1);				
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
	}
}());