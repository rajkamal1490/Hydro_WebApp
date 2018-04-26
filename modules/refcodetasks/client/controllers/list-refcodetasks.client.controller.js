(function() {
	'use strict';

	angular
		.module('refcodetasks')
		.controller('RefcodetasksListController', RefcodetasksListController);

	RefcodetasksListController.$inject = ['CommonService', 'DEFAULT_ROWS_DISPLAYED_COUNT', '$filter', '$scope', '$mdDialog', 'refcodetasksResolve', 'Notification'];

	function RefcodetasksListController(CommonService, DEFAULT_ROWS_DISPLAYED_COUNT, $filter, $scope, $mdDialog, refcodetasksResolve, Notification) {
		var vm = this;

		vm.refcodetasks = refcodetasksResolve;
		vm.remove = remove;
		vm.filteredrefcodetasks = [];

		$scope.searchParams = {
			keyword: undefined
		};

		$scope.ui = {
			rowsDisplayedCount: DEFAULT_ROWS_DISPLAYED_COUNT,
		};

		$scope.loadinitial = function() {

		};

		$scope.createOrUpdateRefCode = function(refcodetasks, editMode) {
			var oldShow = $mdDialog.show;
			$mdDialog.show = function(options) {
				if (options.hasOwnProperty("skipHide")) {
					options.multiple = options.skipHide;
				}
				return oldShow(options);
			};
			$mdDialog.show({
				controller: 'RefcodetasksController',
				controllerAs: 'vm',
				templateUrl: '/modules/refcodetasks/client/views/form-refcodetask.client.view.html',
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				escapeToClose: false,
				fullscreen: true,
				resolve: {
					refcodetask: function() {
						return refcodetasks;
					},
					editMode: function() {
						return editMode;
					}
				}
			}).then(function(createdItem) {

				if (editMode) {
					var refcodetasksIndex = CommonService.findIndexByID(vm.filteredrefcodetasks, refcodetasks._id);
					vm.filteredrefcodetasks[refcodetasksIndex] = createdItem;
				} else {
					vm.filteredrefcodetasks.push(createdItem);
					vm.refcodetasks.push(createdItem);
				}

			}, function() {
				console.log('You cancelled the dialog.');
			});
		};


		function remove(refcodetasks, index) {
			var confirm = $mdDialog.confirm().title('Do you want to delete the Reference Code?').textContent('refcodetasks detail will be deleted permanently.').ok('Yes').cancel('No').multiple(true);
			$mdDialog.show(confirm).then(function() {
					refcodetasks.$remove(deleteSuccessCallback, deleteErrorCallback);

					function deleteSuccessCallback(res) {
						vm.filteredrefcodetasks.splice(index, 1);
						Notification.success({
							message: '<i class="glyphicon glyphicon-ok"></i> Reference Code deleted successfully'
						});
					}

					function deleteErrorCallback(res) {
						Notification.error({
							message: res.data.message,
							title: '<i class="glyphicon glyphicon-remove"></i> Delete Reference Code Error'
						});
					}
				},
				function() {
					console.log('no');
				});
		}

		$scope.loadMoreRows = function() {
			if ($scope.ui.rowsDisplayedCount < vm.filteredrefcodetasks.length) {
				$scope.ui.rowsDisplayedCount += DEFAULT_ROWS_DISPLAYED_COUNT;
			}
		};
	}
}());