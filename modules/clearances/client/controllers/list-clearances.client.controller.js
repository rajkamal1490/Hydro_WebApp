(function() {
	'use strict';

	angular
		.module('clearances')
		.controller('ClearancesListController', ClearancesListController);

	ClearancesListController.$inject = ['CommonService', 'DEFAULT_ROWS_DISPLAYED_COUNT', '$filter', '$scope', '$mdDialog', 'clearanceResolve', 'Notification'];

	function ClearancesListController(CommonService, DEFAULT_ROWS_DISPLAYED_COUNT, $filter, $scope, $mdDialog, clearanceResolve, Notification) {
		var vm = this;

		vm.clearances = clearanceResolve;
		vm.remove = remove;
		//vm.filteredClearances = [];

		$scope.searchParams = {
			keyword: undefined
		};

		$scope.ui = {
			rowsDisplayedCount: DEFAULT_ROWS_DISPLAYED_COUNT,
		};

		$scope.loadinitial = function() {

		};

		$scope.createOrUpdateClearance = function(clearance, editMode) {
			var oldShow = $mdDialog.show;
			$mdDialog.show = function(options) {
				if (options.hasOwnProperty("skipHide")) {
					options.multiple = options.skipHide;
				}
				return oldShow(options);
			};
			$mdDialog.show({
				controller: 'ClearancesController',
				controllerAs: 'vm',
				templateUrl: '/modules/clearances/client/views/form-clearance.client.view.html',
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				escapeToClose: false,
				fullscreen: true,
				resolve: {
					clearance: function() {
						return clearance;
					},
					editMode: function() {
						return editMode;
					}
				}
			}).then(function(createdItem) {

				if (editMode) {
					var clearanceIndex = CommonService.findIndexByID(vm.clearances, clearance._id);
					vm.clearances[clearanceIndex] = createdItem;
				} else {
					// vm.filteredClearances.push(createdItem);
					vm.clearances.push(createdItem);
				}

			}, function() {
				console.log('You cancelled the dialog.');
			});
		};


		function remove(clearance, index) {
			var confirm = $mdDialog.confirm().title('Do you want to delete the clearance?').textContent('clearance detail will be deleted permanently.').ok('Yes').cancel('No').multiple(true);
			$mdDialog.show(confirm).then(function() {
					clearance.$remove(deleteSuccessCallback, deleteErrorCallback);

					function deleteSuccessCallback(res) {
						var clearanceIndex = CommonService.findIndexByID(vm.clearances, clearance._id);
						vm.clearances.splice(clearanceIndex, 1);
						Notification.success({
							message: '<i class="glyphicon glyphicon-ok"></i> clearance deleted successfully'
						});
					}

					function deleteErrorCallback(res) {
						Notification.error({
							message: res.data.message,
							title: '<i class="glyphicon glyphicon-remove"></i> Delete clearance Error'
						});
					}
				},
				function() {
					console.log('no');
				});
		}

		$scope.loadMoreRows = function() {
			if ($scope.ui.rowsDisplayedCount < vm.clearances.length) {
				$scope.ui.rowsDisplayedCount += DEFAULT_ROWS_DISPLAYED_COUNT;
			}
		};
	}
}());