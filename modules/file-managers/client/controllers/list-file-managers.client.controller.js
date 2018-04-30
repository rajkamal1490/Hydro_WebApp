(function() {
	'use strict';

	angular
		.module('file-managers')
		.controller('FileManagersListController', FileManagersListController);

	FileManagersListController.$inject = ['CommonService', '$scope', '$mdDialog', 'fileManagerResolve', 'folderManagerResolve', 'Notification', 'FileManagersService', 'MinutesOfMeetingResolve'];

	function FileManagersListController(CommonService, $scope, $mdDialog, fileManagerResolve, folderManagerResolve, Notification, FileManagersService, MinutesOfMeetingResolve) {
		var vm = this;

		vm.gotoFolder = false;
		vm.foldercode = undefined;

		$scope.model = {
			files: fileManagerResolve,
			folders: folderManagerResolve,
			minutesOfMeeting: MinutesOfMeetingResolve
		};

		$scope.fileUpload = function() {

			$mdDialog.show({
				controller: 'FileManagersController',
				controllerAs: 'vm',
				templateUrl: '/modules/file-managers/client/views/form-file-manager.client.view.html',
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				escapeToClose: false,
				fullscreen: true,
				resolve: {
					folders: function() {
						return $scope.model.folders;
					}
				}
			}).then(function(response) {
				$scope.model.files.unshift(response);
			}, function() {
				console.log('You cancelled the dialog.');
			});

		};

		$scope.creatFolder = function() {

			$mdDialog.show({
				controller: 'CreateFolderController',
				controllerAs: 'vm',
				templateUrl: '/modules/file-managers/client/views/create-folder.client.view.html',
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				escapeToClose: false,
				fullscreen: true,
				resolve: {
					folder: function() {
						return null;
					},
					editMode: function() {
						return true;
					}
				}
			}).then(function(response) {
				$scope.model.folders.unshift(response);
			}, function() {
				console.log('You cancelled the dialog.');
			});

		};

		$scope.deleteFile = function(file) {
			var confirm = $mdDialog.confirm().title('Do you want to delete the file?').textContent('File detail will be deleted permanently.').ok('Yes').cancel('No').multiple(true);
			FileManagersService.get({
				fileManagerId: file._id
			}, function(data) {
				$mdDialog.show(confirm).then(function() {
					data.$remove(deleteSuccessCallback, deleteErrorCallback);

					function deleteSuccessCallback(res) {
						var index = CommonService.findIndexByID($scope.model.files, file._id);
						$scope.model.files.splice(index, 1);
						Notification.success({
							message: '<i class="glyphicon glyphicon-ok"></i> File deleted successfully'
						});
					}

					function deleteErrorCallback(res) {
						Notification.error({
							message: res.data.message,
							title: '<i class="glyphicon glyphicon-remove"></i> Delete File Error'
						});
					}
				},
				function() {
					console.log('no');
				});
			});
		};

		$scope.clickFolder = function(folder) {
			vm.gotoFolder = true;
			vm.foldercode = folder.code;
		};
	}
}());