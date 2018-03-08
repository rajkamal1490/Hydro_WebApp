(function() {
  'use strict';

  angular
    .module('meetings')
    .controller('AllMyNotificationController', AllMyNotificationController);

  AllMyNotificationController.$inject = ['Authentication', 'EmployeeMeetingsService', '$scope', '$timeout', '$filter'];

  function AllMyNotificationController(Authentication, EmployeeMeetingsService, $scope, $timeout, $filter) {
    var vm = this;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    $scope.loadinitial = function() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    };

    function figureOutItemsToDisplay() {
      EmployeeMeetingsService.requestFindMyMeetingsByUser({
        userId: Authentication.user._id
      }).then(function(meetings) {
        vm.filteredItems = $filter('filter')(meetings, {
          $: vm.search
        });
        vm.filterLength = vm.filteredItems.length;
        var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
        var end = begin + vm.itemsPerPage;
        vm.pagedItems = vm.filteredItems.slice(begin, end);
      });
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

  }
}());