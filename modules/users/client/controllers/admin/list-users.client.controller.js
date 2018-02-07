(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$filter', 'AdminService', 'Authentication', '$mdDialog', 'USER_GROUPS'];

  function UserListController($scope, $filter, AdminService, Authentication, $mdDialog, USER_GROUPS) {
    var vm = this;

    vm.authentication = Authentication;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.user = user;
    vm.isContextUserSelf = isContextUserSelf;
    vm.editUser = editUser;
    vm.getUserGroupName = getUserGroupName;

    AdminService.query(function (data) {
      vm.users = data;
      vm.buildPager();
    });

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.users, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    function isContextUserSelf(email) {
      return email === vm.authentication.user.email;
    }

    function getUserGroupName(role) {
      var userGroup = _.find(USER_GROUPS, ['code', role]);
      return userGroup.name;
    }

    function editUser(user) {
      $mdDialog.show({
        controller: 'UserController',
        controllerAs: 'vm',
        templateUrl: '/modules/users/client/views/admin/view-user.client.view.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: true, 
        resolve: {
          userResolve: function() {
            return user;
          }
        }
      }).then(function(updatedItem) {
        vm.user = updatedItem;
      }, function() {
        console.log('You cancelled the dialog.');
      });
    }
  }
}());
