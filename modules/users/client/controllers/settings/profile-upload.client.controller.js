(function() {
  'use strict';

  angular
    .module('users')
    .controller('ProfileUploadCtrl', ProfileUploadCtrl);

  ProfileUploadCtrl.$inject = ['Cropper', '$timeout', 'Authentication', 'Upload', 'Notification', 'havingProgressBar', '$scope', '$mdDialog', 'PROFILE_MAX_SIZE'];

  function ProfileUploadCtrl(Cropper, $timeout, Authentication, Upload, Notification, havingProgressBar, $scope, $mdDialog, PROFILE_MAX_SIZE) {
    

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

    var file, data;

    /**
     * Method is called every time file input's value changes.
     * Because of Angular has not ng-change for file inputs a hack is needed -
     * call `angular.element(this).scope().onFile(this.files[0])`
     * when input's event is fired.
     */
    $scope.onFile = function(blob) {
      if (blob.size > PROFILE_MAX_SIZE) {
        Notification.error({message: 'An attachments image size cannot exceed 2MB'});
        return
      };
      $scope.model.profileUpload = blob;
      $scope.ui.showLoading = true;
      Cropper.encode((file = blob)).then(function(dataUrl) {
        $scope.dataUrl = dataUrl;
        $timeout(showCropper); // wait for $digest to set image's src
      });
    };

    $scope.save = function() {
      if (!file || !data) {
        Notification.error({message: 'Invalid Image Type...'});
        return;
      }
      Cropper.crop(file, data).then(function(dataUrl) {
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
          Notification.error({message: 'Invalid Image Type...'});
        }
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

    /**
     * Croppers container object should be created in controller's scope
     * for updates by directive via prototypal inheritance.
     * Pass a full proxy name to the `ng-cropper-proxy` directive attribute to
     * enable proxing.
     */
    $scope.cropper = {};
    $scope.cropperProxy = 'cropper.first';

    /**
     * Object is used to pass options to initalize a cropper.
     * More on options - https://github.com/fengyuanchen/cropper#options
     */
    $scope.options = {
      maximize: true,
      aspectRatio: 1 / 1,
      rotatable: true,
      scalable: true,
      movable: true,
      zoomable: true,
      crop: function(dataNew) {
        data = dataNew;
      }
    };

    /**
     * Showing (initializing) and hiding (destroying) of a cropper are started by
     * events. The scope of the `ng-cropper` directive is derived from the scope of
     * the controller. When initializing the `ng-cropper` directive adds two handlers
     * listening to events passed by `ng-cropper-show` & `ng-cropper-hide` attributes.
     * To show or hide a cropper `$broadcast` a proper event.
     */
    $scope.showEvent = 'show';
    $scope.hideEvent = 'hide';

    function showCropper() {
      $scope.$broadcast($scope.showEvent);
    }

    function hideCropper() {
      $scope.$broadcast($scope.hideEvent);
    }

    $scope.remove = function() {
      $scope.ui.showLoading = false;
      $scope.dataUrl = undefined;
    }

    $scope.close = function() {
      $mdDialog.cancel();
    }
  }
}());