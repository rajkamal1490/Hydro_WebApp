(function () {
  'use strict';

  // File managers controller
  angular
    .module('tasks')
    .controller('TaskAttachmentController', TaskAttachmentController);

  TaskAttachmentController.$inject = ['$timeout', 'Upload', 'Notification', 'havingProgressBar', '$scope', '$mdDialog', 'PROFILE_MAX_SIZE', 'task'];

  function TaskAttachmentController ($timeout, Upload, Notification, havingProgressBar, $scope, $mdDialog, PROFILE_MAX_SIZE, task) {
    var vm = this;
    
    vm.task = task;
   
    $scope.model = {
      fileUpload: undefined
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
      Upload.upload({
        url: '../api/tasks/upload/' + task._id,
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
    };

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
