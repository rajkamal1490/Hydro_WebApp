(function() {
  'use strict';

  // File managers controller
  angular
    .module('file-managers')
    .controller('FileManagersController', FileManagersController);

  FileManagersController.$inject = ['$http', '$timeout', 'Upload', 'Notification', 'havingProgressBar', '$scope', '$mdDialog', 'PROFILE_MAX_SIZE', 'FileManagersService', 'folders'];

  function FileManagersController($http, $timeout, Upload, Notification, havingProgressBar, $scope, $mdDialog, PROFILE_MAX_SIZE, FileManagersService, folders) {
    var vm = this;

    vm.fileManager = new FileManagersService();

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

    $scope.model = {
      fileUpload: undefined,
      folders: folders
    }

    $scope.ui = {
      showLoading: false
    };

    $scope.mixins = {
      havingProgressBar: havingProgressBar,
    };

    $scope.save = function() {
      if (vm.picFile.size > PROFILE_MAX_SIZE) {
        Notification.error({
          message: 'An attachments file size cannot exceed 5MB'
        });
        return
      };
      $scope.mixins.havingProgressBar.start();
      vm.fileManager.$save(successCallback, errorCallback);

      function successCallback(res) {
        uploadFile(res);
      }

      function errorCallback(errorResponse) {
        onErrorItem(errorResponse.data);
      }
    };


    function uploadFile(res) {
      Upload.upload({
        url: '/api/file-managers/upload/' + res._id,
        data: {
          newProfilePicture: vm.picFile
        }
      }).then(function(response) {
        $scope.mixins.havingProgressBar.complete();
        $timeout(function() {
          $scope.mixins.havingProgressBar.reset();
          onSuccessItem(response.data);
        });
      }, function(response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function(evt) {
        $scope.mixins.havingProgressBar.reset();
      });
    }

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      $mdDialog.hide(response);
      Notification.success({
        message: '<i class="glyphicon glyphicon-ok"></i> File successfully uploaded'
      });

      // Reset form
      vm.fileSelected = false;
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;
      $scope.mixins.havingProgressBar.reset();
      // Show error message
      Notification.error({
        message: response.message,
        title: '<i class="glyphicon glyphicon-remove"></i> Failed to upload file'
      });
    }

    $scope.close = function() {
      $mdDialog.cancel();
    }
  }
}());
