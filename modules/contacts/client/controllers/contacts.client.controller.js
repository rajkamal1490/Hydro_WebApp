(function() {
  'use strict';

  // Contacts controller
  angular
    .module('contacts')
    .controller('ContactsController', ContactsController);

  ContactsController.$inject = ['$scope', 'ContactsService', 'editMode', '$state', '$window', 'Authentication', 'Upload', 'contactResolve', 'clearanceResolve', 'Notification', '$mdDialog', '$timeout'];

  function ContactsController($scope, ContactsService, editMode, $state, $window, Authentication, Upload, contact, clearanceResolve, Notification, $mdDialog, $timeout) {

    var vm = this;

    vm.authentication = Authentication;
    vm.contact = new ContactsService(contact);
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.userGroups = clearanceResolve;
    vm.cancel = cancel;

    $scope.ui = {
      editMode: editMode,
      isContactInProgress: false,
      photoIdFile: '',
      isDataChanged: false,
      fileUploaded: false
    }

    // Remove existing Contact
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.contact.$remove($state.go('contacts.list'));
      }
    }

    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contactForm');
        return false;
      }

      if ($scope.ui.isMeetingInProgress) {
        return;
      } else {
        $scope.ui.isMeetingInProgress = true;
      }

      if(editMode && vm.picFile) {
        uploadContactPicture(vm.contact);
      } else {
        saveOrUpdate();
      }
    }

    function saveOrUpdate() {
      // TODO: move create/update logic to service
      if (vm.contact._id) {
        vm.contact.$update(successCallback, errorCallback);
      } else {
        vm.contact.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        if(!editMode && !$scope.ui.fileUploaded) {
          uploadContactPicture(res);          
          Notification.success({
            message: '<i class="glyphicon glyphicon-ok"></i> Contact created successfully'
          });
        } else if(editMode) {
          Notification.success({
            message: '<i class="glyphicon glyphicon-ok"></i> Contact updated successfully'
          });
        }
        $mdDialog.hide(res);
        
      }

      function errorCallback(errorResponse) {
        $scope.ui.isContactInProgress = false;
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Contact error!'
        });
      }
    }

    function cancel() {
      $mdDialog.cancel();
    };

    $scope.deleteContact = function() {
      var confirm = $mdDialog.confirm().title('Do you want to delete the contact?').textContent('Contact detail will be deleted permanently.').ok('Yes').cancel('No').multiple(true);
      $mdDialog.show(confirm).then(function() {
          contact.$remove(deleteSuccessCallback, deleteErrorCallback);

          function deleteSuccessCallback(res) {
            res.isDelete = true;
            $mdDialog.hide(res);
            Notification.success({
              message: '<i class="glyphicon glyphicon-ok"></i> Contact deleted successfully'
            });
          }

          function deleteErrorCallback(res) {
            Notification.error({
              message: res.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> Delete Contact Detail Error'
            });
          }
        },
        function() {
          console.log('no');
        });
    };

    function uploadContactPicture(contact) {
      $scope.ui.fileUploaded = true;
      if (vm.picFile) {        
        //  Uploading PhotoId
        Upload.upload({
          url: '/api/contacts/picture/' + contact._id,
          data: {
            newProfilePicture: vm.picFile
          }
        }).then(function(response) { // Success
          $timeout(function() {
            vm.contact.photoIdPath = response.data.path;
            saveOrUpdate();
          });
        }, function(response) { //  failed
          saveOrUpdate();
        }, function(evt) {
          //  var progress = parseInt(100.0 * evt.loaded / evt.total, 10);
        });
      } else {
        vm.contact.photoIdPath = 'modules/users/client/img/profile/default.png';
        saveOrUpdate();
      }
    }

    $scope.upload = function() {
      $mdDialog.show({
        controller: 'ProfileUploadCtrl',
        controllerAs: 'vm',
        templateUrl: '/modules/users/client/views/settings/profile-upload.client.view.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: true,
        multiple: true,
        resolve: {
          hasProfileUpload: function() {
            return false;
          }
        }
      }).then(function(response) {
        vm.fileSelected = true;
        vm.picFile = response;
      }, function() {
        console.log('You cancelled the dialog.');
      });
    };

    $scope.onFileSelected = function(files, events, b) {

      $scope.ui.isDataChanged = true;
      if (files.length > 0) {
        $scope.ui.photoIdFile = files[0];
        var fileExtension = $scope.ui.photoIdFile.name.split('.').pop();
        if (fileExtension === 'png' || fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'gif') {
          $scope.ui.fileSelected = true;
        } else {
          $scope.ui.fileSelected = false;
          $scope.ui.photoIdFile = '';

          Notification.error({
            message: MESSAGES.ERR_MSG_UNSUPPORTED_FILE,
            title: '<i class="glyphicon glyphicon-remove"></i> Image Error'
          });
        }
      }
    };
  }
}());