(function() {
	'use strict';

	angular
		.module('statuses')
		.controller('StatusesListController', StatusesListController);

	StatusesListController.$inject = ['CommonService', 'COLORS', 'DEFAULT_ROWS_DISPLAYED_COUNT', '$filter', '$scope', '$mdDialog', 'statusResolve', 'Notification'];

	function StatusesListController(CommonService, COLORS, DEFAULT_ROWS_DISPLAYED_COUNT, $filter, $scope, $mdDialog, statusResolve, Notification) {
		var vm = this;

		vm.statuses = statusResolve;
		vm.remove = remove;
		vm.filteredStatuses = [];

		$scope.searchParams = {
			keyword: undefined
		};

		$scope.ui = {
			rowsDisplayedCount: DEFAULT_ROWS_DISPLAYED_COUNT,
		};

		$scope.loadinitial = function() {

		};

		$scope.createOrUpdateStatus = function(status, editMode) {
			var oldShow = $mdDialog.show;
			$mdDialog.show = function(options) {
				if (options.hasOwnProperty("skipHide")) {
					options.multiple = options.skipHide;
				}
				return oldShow(options);
			};

			var savedColors = _.map(vm.statuses, 'color');
			var colours = [];
			var colors = _.map(COLORS, function(o) {
				return _.pick(o, ['name', 'code']);
			});
			if (status) {
				var statusColors = _.reject(savedColors, function(savedColor) {
					return savedColor.name === status.color.name;
				});
				colours = _.pullAllBy(colors, statusColors, 'name');
			} else {
				colours = _.pullAllBy(colors, savedColors, 'name');				
			}
			$mdDialog.show({
				controller: 'StatusesController',
				controllerAs: 'vm',
				templateUrl: '/modules/statuses/client/views/form-status.client.view.html',
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				escapeToClose: false,
				fullscreen: true,
				resolve: {
					status: function() {
						return status;
					},
					editMode: function() {
						return editMode;
					},
					colorResolve: function() {
						return colours;
					}
				}
			}).then(function(createdItem) {

				if (editMode) {
					var statusIndex = CommonService.findIndexByID(vm.filteredStatuses, status._id);
					vm.filteredStatuses[statusIndex] = createdItem;
				} else {
					// vm.filteredStatuses.push(createdItem);
					vm.statuses.push(createdItem);
				}

			}, function() {
				console.log('You cancelled the dialog.');
			});
		};


		function remove(status, index) {
			var confirm = $mdDialog.confirm().title('Do you want to delete the status?').textContent('status detail will be deleted permanently.').ok('Yes').cancel('No').multiple(true);
			$mdDialog.show(confirm).then(function() {
					status.$remove(deleteSuccessCallback, deleteErrorCallback);

					function deleteSuccessCallback(res) {
						var statusIndex = CommonService.findIndexByID(vm.filteredStatuses, status._id);
						vm.filteredStatuses.splice(statusIndex, 1);
						Notification.success({
							message: '<i class="glyphicon glyphicon-ok"></i> status deleted successfully'
						});
					}

					function deleteErrorCallback(res) {
						Notification.error({
							message: res.data.message,
							title: '<i class="glyphicon glyphicon-remove"></i> Delete status Error'
						});
					}
				},
				function() {
					console.log('no');
				});
		}

		$scope.loadMoreRows = function() {
			if ($scope.ui.rowsDisplayedCount < vm.filteredStatuses.length) {
				$scope.ui.rowsDisplayedCount += DEFAULT_ROWS_DISPLAYED_COUNT;
			}
		};
	}
}());