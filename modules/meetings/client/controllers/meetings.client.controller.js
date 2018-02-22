(function() {
  'use strict';

  // Meetings controller
  angular
    .module('meetings')
    .controller('MeetingsController', MeetingsController);

  MeetingsController.$inject = ['$scope', '$state', '$window', 'Authentication', '$mdDialog', '$mdpTimePicker', 'selectedDate', 'selectedEvent', 'MeetingsService', 'Notification', 'NotificationsService', 'viewMode', 'userResolve'];

  function MeetingsController($scope, $state, $window, Authentication, $mdDialog, $mdpTimePicker, selectedDate, selectedEvent, MeetingsService, Notification, NotificationsService, viewMode, userResolve) {
    var vm = this;

    vm.authentication = Authentication;
    vm.meeting = new MeetingsService(selectedEvent);
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.cancel = cancel;
    vm.agendas = selectedEvent ? (selectedEvent.agendas ? selectedEvent.agendas : []) : [];
    vm.users = userResolve;

    $scope.eventTime = {
      mStartClock: selectedEvent ? new Date(selectedEvent.startDateTime) : new Date('1991-05-04T06:00:00'),
      mEndClock: selectedEvent ? new Date(selectedEvent.endDateTime) : new Date('1991-05-04T13:00:00'),
      startTime: selectedEvent ? getTimeToDisplay(new Date(selectedEvent.startDateTime)) : getTimeToDisplay(new Date('1991-05-04T06:00:00')),
      endTime: selectedEvent ? getTimeToDisplay(new Date(selectedEvent.endDateTime)) : getTimeToDisplay(new Date('1991-05-04T13:00:00')),
      mStartToServer: selectedEvent ? getTimeToServer(new Date(selectedEvent.startDateTime)) : getTimeToServer(new Date('1991-05-04T06:00:00')),
      mEndToServer: selectedEvent ? getTimeToServer(new Date(selectedEvent.endDateTime)) : getTimeToServer(new Date('1991-05-04T13:00:00'))
    };

    $scope.ui = {
      isMeetingInProgress: false,
      viewMode: viewMode
    };

    $scope.unconfirmedAgenda = {     
      agendaTitle: undefined,
      agendaDescription: undefined,
      agendaResponsiblePerson: undefined
    };

    // $scope.unconfirmedAgenda = {
    //   serialNo: 1,
    //   agendaTopics: undefined,
    //   agendaSolutions: undefined,
    //   agendaActionPlan: undefined,
    //   agendaAssignedTo: undefined,
    //   agendaDecisionTaken: undefined,
    //   agendaDueDate: undefined,
    //   agendaTask: undefined
    // };

    // Save Meeting
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.meetingForm');
        return false;
      }

      if ($scope.ui.isMeetingInProgress) {
        return;
      } else {
        $scope.ui.isMeetingInProgress = true;
      }

      $scope.addAgenda();

      vm.meeting.startDateTime = $scope.eventTime.mStartToServer;
      vm.meeting.endDateTime = $scope.eventTime.mEndToServer;
      vm.meeting.agendas = vm.agendas;

      var notification = new NotificationsService({
        notifyTo: _.map(vm.meeting.attendees, '_id'),
        user: vm.meeting.facilitator,
        type: 'meeting',
        meetingScheduleDate: $scope.eventTime.mStartToServer
      });

      // TODO: move create/update logic to service
      if (vm.meeting._id) {
        vm.meeting.$update(successCallback, errorCallback);
      } else {
        vm.meeting.$save(successCallback, errorCallback);
        notification.$save();
      }

      function successCallback(res) {
        var msg = viewMode ? "Meeting updated successfully" : "Meeting created successfully"
        $mdDialog.hide(res);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
        });
      }

      function errorCallback(errorResponse) {
        $scope.ui.isMeetingInProgress = false;
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Meeting error!'
        });
      }
    }

    $scope.showStartTimePicker = function(ev) {
      $mdpTimePicker($scope.eventTime.mStartClock, {
          targetEvent: ev
        })
        .then(function(dateTime) {
          $scope.eventTime.mStartClock = dateTime;
          vm.meeting.startTime = getTimeToDisplay(dateTime);
          $scope.eventTime.mStartToServer = getTimeToServer(dateTime);

          validateStartAndEndTime();

          // $scope.ui.isDataChanged = true;
        });
    };

    $scope.showEndTimePicker = function(ev) {
      $mdpTimePicker($scope.eventTime.mEndClock, {
          targetEvent: ev
        })
        .then(function(dateTime) {
          $scope.eventTime.mEndClock = dateTime;
          vm.meeting.endTime = getTimeToDisplay(dateTime);
          $scope.eventTime.mEndToServer = getTimeToServer(dateTime);

          validateStartAndEndTime();
        });
    };

    $scope.deleteMeeting = function() {
      var confirm = $mdDialog.confirm().title('Do you want to delete the meeting?').textContent('Meeting detail will be deleted permanently.').ok('Yes').cancel('No').multiple(true);
      $mdDialog.show(confirm).then(function() {
          selectedEvent.$remove(deleteSuccessCallback, deleteErrorCallback);

          function deleteSuccessCallback(res) {
            res.isDelete = true;
            $mdDialog.hide(res);
            Notification.success({
              message: '<i class="glyphicon glyphicon-ok"></i> Meeting deleted successfully'
            });
          }

          function deleteErrorCallback(res) {
            Notification.error({
              message: res.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> Delete Meeting Detail Error'
            });
          }
        },
        function() {
          console.log('no');
        });
    };

    $scope.isEdit = function(agenda) {
      agenda.isEdit = true;
    }

    $scope.addIsEdit = function(agenda) {
      agenda.isEdit = false;
    };

    $scope.removeAgenda = function(index) {
      vm.agendas.splice(index, 1);
    };

    $scope.addAgenda = function() {
      if ($scope.unconfirmedAgenda.agendaTitle && $scope.unconfirmedAgenda.agendaDescription && $scope.unconfirmedAgenda.agendaResponsiblePerson) {
        vm.agendas.push($scope.unconfirmedAgenda);
        clearUnconfirmed();
      }
    };

    function validateStartAndEndTime() {
      if (vm.meetingForm) {
        var bool = (Date.parse($scope.eventTime.mEndToServer) > Date.parse($scope.eventTime.mStartToServer));
        vm.meetingForm.end.$setValidity('greater', bool);
        vm.meetingForm.start.$setValidity('lesser', bool);
      }
    }

    function getTimeToDisplay(date) {
      return moment(date).format('hh:mm:a');
    }

    function getTimeToServer(date) {
      var dt = (new Date(selectedDate)).setHours(date.getHours(), date.getMinutes(), 0, 0);
      var dtGMT = new Date((new Date(dt)).toUTCString()).toISOString();

      return dtGMT;
    }

    function cancel() {
      $mdDialog.cancel();
    };

    function clearUnconfirmed() {
      $scope.unconfirmedAgenda = {
        agendaTitle: undefined,
        agendaDescription: undefined,
        agendaResponsiblePerson: undefined
      };
    }
  }
}());