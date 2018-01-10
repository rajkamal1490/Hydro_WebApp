(function () {
  'use strict';

  // Meetings controller
  angular
    .module('meetings')
    .controller('MeetingsController', MeetingsController);

  MeetingsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'meetingResolve'];

  function MeetingsController ($scope, $state, $window, Authentication, meeting) {
    var vm = this;

    vm.authentication = Authentication;
    vm.meeting = meeting;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Meeting
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.meeting.$remove($state.go('meetings.list'));
      }
    }

    // Save Meeting
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.meetingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.meeting._id) {
        vm.meeting.$update(successCallback, errorCallback);
      } else {
        vm.meeting.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('meetings.view', {
          meetingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
