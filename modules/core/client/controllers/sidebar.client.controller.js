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

    function diffGetTime(dateString, dateObject) {
      return dateString - dateObject;
    }

    var logInLimit = setInterval(keepLogInLimit, 1000);

    var printTime = true;

    function keepLogInLimit() {
      if(user!=null){
        var today = new Date();
        var office_opening_time = today.setHours(9, 0, 0, 0);
        var office_closing_time = today.setHours(18, 0, 0, 0);
        var office_overtime = today.setHours(21, 0, 0, 0);
        var time_now = new Date();

        if(localStorage.getItem('log_in_time')==null){
          clearInterval(logInLimit);
        }
        //
        // console.log("time now : " + time_now );
        // if(printTime){
        // console.log("log_in_time : " + localStorage.getItem('log_in_time') );
        //   console.log("office_opening_time : " + office_opening_time );
        //   console.log("office_closing_time : " + office_closing_time );
        //   console.log("office_overtime : " + office_overtime );
        // var temp = new Date(new Number(localStorage.getItem('log_in_time')));
        // temp.setHours(temp.getHours()-24);
        // console.log("consider logged in Yesterday : " + temp);
        //   printTime = false;
        // }

        if( 0 < diffGetTime(time_now, office_opening_time) && 0 > diffGetTime(localStorage.getItem('log_in_time'), office_opening_time) ){
          // console.log("check if logged in from Yesterday");
          localStorage.removeItem('log_in_time');
          window.location.href = '/api/auth/signout';
        }
        else if( 0 < diffGetTime(time_now, office_overtime) && 0 > diffGetTime(localStorage.getItem('log_in_time'), office_overtime) ){
          // console.log("check if logged in before over time");
          localStorage.removeItem('log_in_time');
          window.location.href = '/api/auth/signout';
        }
        else if( 0 < diffGetTime(time_now, office_closing_time) && 0 > diffGetTime(localStorage.getItem('log_in_time'), office_closing_time) ){
          // console.log("check if logged in before closing time");
          localStorage.removeItem('log_in_time');
          window.location.href = '/api/auth/signout';
        }
        else{
          // console.log("keep logged in!");
        }
      }
    }

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

    $scope.setActive = function(e) {
        $('li').removeClass('active');
        $('span').removeClass('active');
        $('.children').hide();
        $(this).addClass('active');
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
