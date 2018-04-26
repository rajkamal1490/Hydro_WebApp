(function() {
	'use strict';

	angular
		.module('projects')
		.controller('ProjectsListController', ProjectsListController);

	ProjectsListController.$inject = ['CommonService', 'DEFAULT_ROWS_DISPLAYED_COUNT', '$filter', '$scope', '$mdDialog', 'projectResolve', 'Notification', 'userResolve'];

	function ProjectsListController(CommonService, DEFAULT_ROWS_DISPLAYED_COUNT, $filter, $scope, $mdDialog, projectResolve, Notification, userResolve) {
		var vm = this;

		vm.projects = projectResolve;
		vm.remove = remove;
		//vm.filteredProjects = [];
		vm.getUserName = getUserName;

		$scope.searchParams = {
			keyword: undefined
		};

		$scope.ui = {
			rowsDisplayedCount: DEFAULT_ROWS_DISPLAYED_COUNT,
		};

		$scope.loadinitial = function() {

		};

		$scope.createOrUpdateProject = function(project, editMode) {
			var oldShow = $mdDialog.show;
			$mdDialog.show = function(options) {
				if (options.hasOwnProperty("skipHide")) {
					options.multiple = options.skipHide;
				}
				return oldShow(options);
			};
			$mdDialog.show({
				controller: 'ProjectsController',
				controllerAs: 'vm',
				templateUrl: '/modules/projects/client/views/form-project.client.view.html',
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				escapeToClose: false,
				fullscreen: true,
				resolve: {
					project: function() {
						return project;
					},
					editMode: function() {
						return editMode;
					},
					users: function() {
						return userResolve;
					}
				}
			}).then(function(createdItem) {

				if (editMode) {
					var projectIndex = CommonService.findIndexByID(vm.projects, project._id);
					vm.projects[projectIndex] = createdItem;
				} else {
					//vm.filteredProjects.push(createdItem);
					vm.projects.push(createdItem);
				}

			}, function() {
				console.log('You cancelled the dialog.');
			});
		};


		function remove(project, index) {
			var confirm = $mdDialog.confirm().title('Do you want to delete the project?').textContent('project detail will be deleted permanently.').ok('Yes').cancel('No').multiple(true);
			$mdDialog.show(confirm).then(function() {
					project.$remove(deleteSuccessCallback, deleteErrorCallback);

					function deleteSuccessCallback(res) {
						var projectIndex = CommonService.findIndexByID(vm.projects, project._id);
						vm.projects.splice(projectIndex, 1);
						Notification.success({
							message: '<i class="glyphicon glyphicon-ok"></i> project deleted successfully'
						});
					}

					function deleteErrorCallback(res) {
						Notification.error({
							message: res.data.message,
							title: '<i class="glyphicon glyphicon-remove"></i> Delete project Error'
						});
					}
				},
				function() {
					console.log('no');
				});
		}

		$scope.loadMoreRows = function() {
			if ($scope.ui.rowsDisplayedCount < vm.projects.length) {
				$scope.ui.rowsDisplayedCount += DEFAULT_ROWS_DISPLAYED_COUNT;
			}
		};

		function getUserName(userID) {
			return CommonService.getName(userResolve, userID);
		}
	}
}());