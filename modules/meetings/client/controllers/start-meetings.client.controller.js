(function() {
  'use strict';

  // Meetings controller
  angular
    .module('meetings')
    .controller('StartMeetingsController', StartMeetingsController);

  StartMeetingsController.$inject = ['$scope', '$state', '$window', '$interval', 'Authentication', '$mdDialog', '$mdpTimePicker', 'selectedDate', 'selectedEvent', 'StartMeetingsService', 'meetingStartTime', 'Notification', 'NotificationsService', 'userResolve'];

  function StartMeetingsController($scope, $state, $window, $interval, Authentication, $mdDialog, $mdpTimePicker, selectedDate, selectedEvent, StartMeetingsService, meetingStartTime, Notification, NotificationsService, userResolve) {
    var vm = this;

    vm.authentication = Authentication;
    vm.meeting = selectedEvent;
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.cancel = cancel;
    vm.agendas = selectedEvent.agendas;
    vm.users = userResolve;

    $scope.eventTime = {
      startTime: moment(new Date(selectedEvent.startDateTime)).format('YYYY/MM/DD')
    };

    $scope.ui = {
      isStartMeetingInProgress: false,
    };

    var clock = function() {
      $scope.clock = moment.utc(moment(new Date(), "HH:mm:ss").diff(moment(new Date(meetingStartTime), "HH:mm:ss"))).format("HH:mm:ss");
      $scope.endDateTime = new Date();
    }
    clock();
    $interval(clock, 1000);

    // Save Meeting
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.startMeetingForm');
        return false;
      }

      if ($scope.ui.isStartMeetingInProgress) {
        return;
      } else {
        $scope.ui.isStartMeetingInProgress = true;
      }

      var startMeeting = new StartMeetingsService();

      startMeeting.title = selectedEvent.title;
      startMeeting.startDateTime = meetingStartTime;
      startMeeting.endDateTime = $scope.endDateTime;
      startMeeting.meetingDiff = $scope.clock;
      startMeeting.agendas = vm.agendas;
      startMeeting.location = selectedEvent.location;
      startMeeting.attendees = selectedEvent.attendees;
      startMeeting.facilitator = selectedEvent.facilitator;
      startMeeting.meetingId = selectedEvent._id;

      startMeeting.$save(successCallback, errorCallback);

      function successCallback(res) {
        var msg = "Minutes Of Meeting created successfully"
        $mdDialog.hide(res);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
        });
      }

      function errorCallback(errorResponse) {
        $scope.ui.isStartMeetingInProgress = false;
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Minutes Of Meeting error!'
        });
      }
    }

    function cancel() {
      $mdDialog.cancel();
    };
  }
}());