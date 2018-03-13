(function() {
  'use strict';

  angular
    .module('users')
    .controller('ChangeProfilePictureController', ChangeProfilePictureController);

  ChangeProfilePictureController.$inject = ['Authentication', '$mdDialog'];

  function ChangeProfilePictureController(Authentication, $mdDialog) {
    var vm = this;

    vm.user = Authentication.user;

    vm.upload = function() {

      $mdDialog.show({
        controller: 'ProfileUploadCtrl',
        controllerAs: 'vm',
        templateUrl: '/modules/users/client/views/settings/profile-upload.client.view.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: true,
        resolve: {
          hasProfileUpload: function() {
            return true;
          }
        }
      }).then(function(response) {
        vm.user = Authentication.user = response;
      }, function() {
        console.log('You cancelled the dialog.');
      });

    };
  }
}());