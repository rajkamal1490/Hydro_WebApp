(function() {
  'use strict';

  angular
    .module('attendances')
    .controller('UsersTodayController', UsersTodayController);

  UsersTodayController.$inject = ['$scope', '$state', '$http', '$filter'];

  function UsersTodayController($scope, $state, $http, $filter) {
    var vm = this;
    vm.usersToday = [];
    vm.pagedItems = [];
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.getUserName = getUserName;

    $http({
      method: 'GET',
      url: '/api/checkins/getuserstoday'
    }).then(function(usersToday) {
      vm.usersToday = usersToday.data;

      angular.forEach(vm.usersToday, function(value, key) {
        getUserName(value.user).then(function(result) {
          vm.usersToday[key].displayName = result;
        });
        if (value.checkInTime)
          vm.usersToday[key].checkInTime = moment(value.checkInTime).toDate().getHours() + ":" + moment(value.checkInTime).toDate().getMinutes();
        if (value.checkOutTime)
          vm.usersToday[key].checkOutTime = moment(value.checkOutTime).toDate().getHours() + ":" + moment(value.checkOutTime).toDate().getMinutes();
      });

      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();

      // console.log(vm.usersToday);

    }, function(errorResponse) {
      Notification.error({
        message: errorResponse.data.message,
        title: '<i class="glyphicon glyphicon-remove"></i> Cannot get User\'s who have checked in today!'
      });
    });

    function figureOutItemsToDisplay() {
      vm.filterLength = vm.usersToday.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.usersToday.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    function getUserName(userID) {
      return $http({
        method: 'GET',
        url: '/api/users/' + userID
      }).then(function(response) {
        // console.log(response.data);
        return response.data.displayName;
      }, function(errorResponse) {
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Cannot get User\'s Name for Today\'s Check In Info!'
        });
      });
    }
  }
}());
