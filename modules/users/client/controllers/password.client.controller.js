(function() {
  'use strict';

  angular
    .module('users')
    .controller('PasswordController', PasswordController);

  PasswordController.$inject = ['$scope', '$stateParams', 'UsersService', '$location', 'Authentication', 'PasswordValidator', 'Notification', '$state'];

  function PasswordController($scope, $stateParams, UsersService, $location, Authentication, PasswordValidator, Notification, $state) {
    var vm = this;

    vm.resetUserPassword = resetUserPassword;
    vm.askForPasswordReset = askForPasswordReset;
    vm.authentication = Authentication;
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.isButtonLoading = false;


    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    function askForPasswordReset(isValid) {
      vm.isButtonLoading = true;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.forgotPasswordForm');

        return false;
      }

      UsersService.requestPasswordReset(vm.credentials)
        .then(onRequestPasswordResetSuccess)
        .catch(onRequestPasswordResetError);
    }

    // Change user password
    function resetUserPassword(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.resetPasswordForm');

        return false;
      }

      UsersService.resetPassword($stateParams.token, vm.passwordDetails)
        .then(onResetPasswordSuccess)
        .catch(onResetPasswordError);
    }

    // Password Reset Callbacks

    function onRequestPasswordResetSuccess(response) {
      // Show user success message and clear form
      vm.credentials = null;
      vm.isButtonLoading = false;      
      Notification.success({ message: response.message, title: '<i class="glyphicon glyphicon-ok"></i> Password reset email sent successfully!' });
    }

    function onRequestPasswordResetError(response) {
      // Show user error message and clear form
      vm.credentials = null;
      vm.isButtonLoading = false;
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to send password reset email!', delay: 10000 });
    }

    function onResetPasswordSuccess(response) {
      // If successful show success message and clear form
      vm.passwordDetails = null;

      // Attach user profile
      // Authentication.user = response;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Password reset successful!' });
      // And redirect to the index page
      $location.path('/');
    }

    function onResetPasswordError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Password reset failed!', delay: 10000 });
    }
  }
}());
