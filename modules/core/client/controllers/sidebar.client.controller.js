(function () {
  'use strict';

  angular
    .module('core')
    .controller('SidebarController', SidebarController);

  SidebarController.$inject = ['$scope', '$state', 'Authentication', '$location', 'CheckInAttendancesServices', 'CommonService', '$mdDialog'];

  function SidebarController($scope, $state, Authentication, $location, CheckInAttendancesServices, CommonService, $mdDialog) {
    var vm = this;    
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.CommonService = CommonService;

    $scope.ui = {
      isAllowToClick: false
    };
    
    $scope.isActive = function(nav) {
      var splitNav = _.split('nav', ',');
      return $location.path() === nav;
    };

    $scope.isChildrenActive = function(childNav) {
      return $location.path() === childNav;
    };

    $scope.takeABreak = function() {
      CheckInAttendancesServices.requestFindTodayCheckIn(CommonService.buildArrayToFindTodayCheckIn(Authentication.user._id)).then(function(searchResults) {        
        $scope.ui.isAllowToClick = true;
        CommonService.setIsAllowToClick(true);
        $mdDialog.show({
          controller: 'BreakController',
          controllerAs: 'vm',
          templateUrl: '/modules/core/client/views/break.client.view.html',
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          escapeToClose: false,
          resolve: {
            breakStartTime: function() {
              return new Date();
            },
            todayCheckIn: function() {
              return searchResults[0];
            }
          }
        }).then(function(createdItem) {
          $scope.ui.isAllowToClick = false;
          CommonService.setIsAllowToClick(false);
          Authentication.todayCheckIn[0] = createdItem;
        }, function() {
          console.log("canceled");
          $scope.ui.isAllowToClick = false;
          CommonService.setIsAllowToClick(false);
        });
      });
    };

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }
  }
}());
