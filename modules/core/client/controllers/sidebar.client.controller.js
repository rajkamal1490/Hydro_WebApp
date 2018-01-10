(function () {
  'use strict';

  angular
    .module('core')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$scope', '$state', 'Authentication', '$location', 'CommonService'];

  function SidebarController($scope, $state, Authentication, $location, CommonService) {
    var vm = this;    
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.CommonService = CommonService;
    
    $scope.isActive = function(nav) {
      var splitNav = _.split('nav', ',');
      return $location.path() === nav;
    };

    $scope.isChildrenActive = function(childNav) {
      return $location.path() === childNav;
    };

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }
  }
}());
