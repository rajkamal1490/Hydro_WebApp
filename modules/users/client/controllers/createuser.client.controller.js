(function () {
  'use strict';

  angular
    .module('users')
    .controller('CreateUserController', CreateUserController);

  CreateUserController.$inject = ['$scope', '$state', 'UsersService', 'Notification', 'USER_GROUPS'];

  function CreateUserController($scope, $state, UsersService, Notification, USER_GROUPS) {
    var vm = this;

    // vm.authentication = Authentication;
    // vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.signup = signup;
    vm.userGroups = USER_GROUPS;
   

    function signup(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      UsersService.userSignup(vm.credentials)
        .then(onUserSignupSuccess)
        .catch(onUserSignupError);
    }

    // Authentication Callbacks

    function onUserSignupSuccess(response) {
      // If successful we assign the response to the global user model
      // vm.authentication.user = response;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User created successful!' });
      // // And redirect to the user list page
      $state.go('admin.users');
    }

    function onUserSignupError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
    }
  }
}());
