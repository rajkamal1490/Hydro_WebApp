(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserController', UserController);

  UserController.$inject = ['$scope', '$state', '$window', '$mdDialog', 'Authentication', 'userResolve', 'Notification', 'USER_GROUPS'];

  function UserController($scope, $state, $window, $mdDialog, Authentication, user, Notification, USER_GROUPS) {
    var vm = this;

    vm.authentication = Authentication;
    vm.user = user;
    vm.remove = remove;
    vm.update = update;
    vm.isContextUserSelf = isContextUserSelf;
    vm.userGroups = USER_GROUPS;
    vm.cancel = cancel;

    $scope.ui = {
      isUserInProgress: false
    };

    function remove(user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('User deleted successfully!');
        } else {
          vm.user.$remove(function () {
            $state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User deleted successfully!' });
          });
        }
      }
    }

    function update(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }
      if ($scope.ui.isUserInProgress) {
        return;
      } else {
        $scope.ui.isUserInProgress = true;
      }

      var user = vm.user;

      user.$update(function () {
        $mdDialog.hide(user);
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        $scope.ui.isUserInProgress = false;
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
      });
    }

    function isContextUserSelf() {
      return vm.user.username === vm.authentication.user.username;
    }

    function cancel() {
      $mdDialog.cancel();
    };
  }
}());
