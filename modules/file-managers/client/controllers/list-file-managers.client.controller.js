(function() {
  'use strict';

  angular
    .module('file-managers')
    .controller('FileManagersListController', FileManagersListController);

  FileManagersListController.$inject = ['CommonService', '$http', '$scope', '$mdDialog', 'fileManagerResolve', 'folderManagerResolve', 'Authentication', 'Notification', 'FileManagersService', 'MinutesOfMeetingResolve'];

  function FileManagersListController(CommonService, $http, $scope, $mdDialog, fileManagerResolve, folderManagerResolve, Authentication, Notification, FileManagersService, MinutesOfMeetingResolve) {
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

    $scope.hasShowFile = function(file) {
			if(Authentication.user._id == file.user._id){
				return true;
			}
      if (typeof file.visible !== 'undefined' && file.visible.length > 0) {
        return _.intersection(Authentication.user.userGroup, file.visible).length > 0;
      }
			return false;
    };

		vm.userGroups;

    $http({
      method: 'GET',
      url: '/api/clearances'
    }).then(function(response) {
      vm.userGroups = response.data;
      // console.log(response.data);

    }, function(errorResponse) {
      Notification.error({
        message: errorResponse.data.message,
        title: '<i class="glyphicon glyphicon-remove"></i> Cannot get User Groups!'
      });
    });

		$scope.displayVisibility = function(visible) {
			var string ="Visible to " + Authentication.user.displayName;
      if (typeof visible !== 'undefined' && visible.length > 0) {
				string += " and User-Groups:";
				angular.forEach(visible, function(value, key) {
					angular.forEach(vm.userGroups, function(matchvalue, matchkey) {
						if(matchvalue.code==value)
							string+=" "+matchvalue.name;
					})
					if(visible.length-2>key)
						string+=",";
					if(visible.length-2==key)
						string+=" and";
				});
				// console.log(visible);
        // console.log(vm.userGroups);
      }
			return string+".";
    };
  }
}());
