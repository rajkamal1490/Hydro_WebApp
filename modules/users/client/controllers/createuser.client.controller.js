(function () {
  'use strict';

  angular
    .module('users')
    .controller('CreateUserController', CreateUserController);

  CreateUserController.$inject = ['$scope', '$state', 'UsersService', 'Notification', 'clearanceResolve'];

  function CreateUserController($scope, $state, UsersService, Notification, clearanceResolve) {
    var vm = this;

    // vm.authentication = Authentication;
    // vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.userGroups = clearanceResolve;

    $scope.ui = {
      isUserInProgress: false
    };

    function signup(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      if ($scope.ui.isUserInProgress) {
        return;
      } else {
        $scope.ui.isUserInProgress = true;
      }

      UsersService.userSignup(vm.credentials)
        .then(onUserSignupSuccess)
        .catch(onUserSignupError);
    }

    // Authentication Callbacks

    function onUserSignupSuccess(response) {
      $scope.ui.isUserInProgress = false;
      // If successful we assign the response to the global user model
      // vm.authentication.user = response;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User created successful!' });
      // // And redirect to the user list page
      $state.go('admin.users');
    }

    function onUserSignupError(response) {
      $scope.ui.isUserInProgress = false;
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
    }
  }
}());
