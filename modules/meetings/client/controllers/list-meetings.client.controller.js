(function() {
  'use strict';

  angular
    .module('meetings')
    .controller('MeetingsListController', MeetingsListController);

  MeetingsListController.$inject = ['Authentication', 'MeetingsService', 'EmployeeMeetingsService', 'CommonService', '$scope', '$state', '$mdDialog', 'meetingResolve', '$timeout', 'userResolve'];

  function MeetingsListController(Authentication, MeetingsService, EmployeeMeetingsService, CommonService, $scope, $state, $mdDialog, meetingResolve, $timeout, userResolve) {
    var vm = this;

    $scope.model = {
      events: [],
      newEvents: meetingResolve
    }

    $scope.loadInitial = function() {
      angular.forEach($scope.model.newEvents, function(meeting) {
        eventsPush(meeting);
      });

      var calendar = $('#calendar').fullCalendar({
        editable: true,
        displayEventTime: true,
        height: $(window).height() - 200,
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        events: $scope.model.events,
        defaultView: 'month',
        navLinks: true,
        eventLimit: true,
        dayClick: $scope.dayClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventClick: $scope.eventClick,
        viewRender: $scope.renderView,
        dayRender: function(date, cell) {
          if ((new Date(date).getFullYear() === new Date().getFullYear()) && (new Date(date).getMonth() === new Date().getMonth()) && (new Date(date).getDate() === new Date().getDate()))
            cell.css("background-color", "#00BFFF");
        }
      });
    };

    $scope.dayClick = function(date, allDay, jsEvent, view) {
      var oldShow = $mdDialog.show;
      $mdDialog.show = function(options) {
        if (options.hasOwnProperty("skipHide")) {
          options.multiple = options.skipHide;
        }
        return oldShow(options);
      };

      var now = moment(new Date()).format('YYYY-MM-DD');
      var selectedData = moment(date).format('YYYY-MM-DD');

      if (selectedData > now || selectedData === now) {
        openCreateMeetingDialog(date);
      } else {
        var confirm = $mdDialog.confirm().title("Not allow to create a meetings for past days!!!").ok('OK');
        $mdDialog.show(confirm).then(function() {
            $mdDialog.hide();
          },
          function() {
            console.log('no');
          });
      }

    }

    $scope.eventClick = function(event) {
      var oldShow = $mdDialog.show;
      $mdDialog.show = function(options) {
        if (options.hasOwnProperty("skipHide")) {
          options.multiple = options.skipHide;
        }
        return oldShow(options);
      };

      var postData = {
        meetingId: event._id
      };

      if (event.facilitator === Authentication.user._id) {
        EmployeeMeetingsService.validateAlreadyCreatedMinutes(postData).then(function(results) {
          if (results.length > 0) {
            editMeeting(event);
          } else {
            var confirm = $mdDialog.confirm().title('Do you edit or start the meeting?').ok('Edit Meeting').cancel('Start Meeting').multiple(true).clickOutsideToClose(false).escapeToClose(false);
            $mdDialog.show(confirm).then(function() {
                editMeeting(event);
              },
              function() {
                startMeeting(event);
              });
          }

        });
      } else {
        editMeeting(event);
      }
    }

    function editMeeting(event) {
      $state.go('meetings.edit', {
        meetingId: event._id
      });     
    };

    function startMeeting(event) {
      $state.go('meetings.view', {
        meetingId: event._id
      });      
    };

    $scope.renderView = function(view) {
      //alert(view)
    }


    //with this you can handle the events that generated by droping any event to different position in the calendar
    $scope.alertOnDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view) {
      $scope.$apply();
    };


    //with this you can handle the events that generated by resizing any event to different position in the calendar
    $scope.alertOnResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view) {
      $scope.$apply();
    };

    function eventsPush(meeting) {
      $scope.model.events.push({
        _id: meeting._id,
        title: meeting.title,
        start: new Date(meeting.startDateTime),
        end: new Date(meeting.endDateTime),
        facilitator: meeting.facilitator._id,
        className: 'bg-red',
        stick: true
      });
    };

    function openCreateMeetingDialog(date) {
      $state.go('meetings.create', {
        meetingId: date
      });      
    }

    function fullCalenderRerender() {
      $('#calendar').fullCalendar('removeEvents');
      $('#calendar').fullCalendar('addEventSource', $scope.model.events);
      $('#calendar').fullCalendar('rerenderEvents');
    }

  }
}());