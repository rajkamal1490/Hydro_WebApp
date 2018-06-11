(function () {
  'use strict';

  angular
    .module('meetings')
    .controller('ShowMeetingsController', ShowMeetingsController);

  ShowMeetingsController.$inject = ['$scope', 'meetingResolve', 'Authentication'];

  function ShowMeetingsController($scope, meeting, Authentication) {
    var vm = this;

    vm.meeting = meeting;
    vm.authentication = Authentication;

  }
}());
