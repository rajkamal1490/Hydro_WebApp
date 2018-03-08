(function() {
  'use strict';

  angular
    .module('users')
    .controller('ProfileUploadCtrl', ProfileUploadCtrl);

  ProfileUploadCtrl.$inject = ['$timeout', 'Authentication', 'Upload', 'Notification', 'havingProgressBar', '$scope', '$mdDialog', 'PROFILE_MAX_SIZE', 'VALID_IMAGE_TYPES'];

  function ProfileUploadCtrl($timeout, Authentication, Upload, Notification, havingProgressBar, $scope, $mdDialog, PROFILE_MAX_SIZE, VALID_IMAGE_TYPES) {


    var vm = this;

    vm.user = Authentication.user;

    $scope.model = {
      profileUpload: undefined
    }

    $scope.ui = {
      showLoading: false
    };

    $scope.mixins = {
      havingProgressBar: havingProgressBar,
    };

    $scope.onFile = function(blob) {
      if (blob.size > PROFILE_MAX_SIZE) {
        Notification.error({message: 'An attachments image size cannot exceed 2MB'});
        return
      };
      var imageType = blob.type.split('/').pop().toLowerCase();      
      if (!_.includes(VALID_IMAGE_TYPES, imageType)) {
        Notification.error({message: 'An image type should be png/jpg/jpeg'});
        return
      };
      $scope.model.profileUpload = blob;
      $scope.ui.showLoading = true;
      var file = blob;
      var reader = new FileReader();
      reader.onload = function(evt) {
        $scope.$apply(function($scope) {
          $scope.dataUrl = evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };

    $scope.myCroppedImage = '';   

    $scope.save = function() {      
      b64toBlob($scope.myCroppedImage,
        function(dataUrl) {          
          if (dataUrl.type.match('image.*')) {
            $scope.mixins.havingProgressBar.start();
            Upload.upload({
              url: '/api/users/picture',
              data: {
                newProfilePicture: dataUrl
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
          } else {
            Notification.error({
              message: 'Invalid Image Type...'
            });
          }
        },
        function(error) {
          Notification.error({message: error});
        });     
    };

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      $mdDialog.hide(response);
      Notification.success({
        message: '<i class="glyphicon glyphicon-ok"></i> Successfully changed profile picture'
      });

      // Populate user object
      vm.user = Authentication.user = response;

      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({
        message: response.message,
        title: '<i class="glyphicon glyphicon-remove"></i> Failed to change profile picture'
      });
    }

    function b64toBlob(b64, onsuccess, onerror) {
      var img = new Image();
      img.onerror = onerror;
      img.onload = function onload() {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(onsuccess);
      };
      img.src = b64;
    }

    $scope.close = function() {
      $mdDialog.cancel();
    }
  }
}());