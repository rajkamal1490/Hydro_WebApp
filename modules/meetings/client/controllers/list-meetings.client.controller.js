(function() {
  'use strict';

  angular
    .module('meetings')
    .controller('MeetingsListController', MeetingsListController);

  MeetingsListController.$inject = ['MeetingsService', 'EmployeeMeetingsService', 'CommonService', '$scope', '$mdDialog', 'meetingResolve', '$timeout', 'userResolve'];

  function MeetingsListController(MeetingsService, EmployeeMeetingsService, CommonService, $scope, $mdDialog, meetingResolve, $timeout, userResolve) {
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
        height: $(window).height(),
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
    }

    function editMeeting(event) {
      MeetingsService.get({
        meetingId: event._id
      }, function(data) {
        $mdDialog.show({
            controller: 'MeetingsController',
            controllerAs: 'vm',
            templateUrl: '/modules/meetings/client/views/form-meeting.client.view.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true,
            resolve: {
              selectedDate: function() {
                return event.start;
              },
              selectedEvent: function() {
                return data;
              },
              viewMode: function() {
                return true;
              },
              userResolve: function() {
                return userResolve;
              }
            },
          })
          .then(function(updatedItem) {
            var index = CommonService.findIndexByID($scope.model.events, event._id);
            var eventIndex = CommonService.findIndexByID($scope.model.newEvents, data._id);
            $scope.model.events.splice(index, 1);
            if (updatedItem.isDelete) {
              $scope.model.newEvents.splice(eventIndex, 1);
              fullCalenderRerender();
            } else {
              $scope.model.newEvents[eventIndex] = updatedItem;
              $timeout(function() {
                eventsPush(updatedItem);
                $scope.$apply();
                fullCalenderRerender();
              })
            }
          }, function() {
            console.log('You cancelled the dialog.');
          });
      });
    };

    function startMeeting(event) {
      MeetingsService.get({
        meetingId: event._id
      }, function(data) {
        $mdDialog.show({
            controller: 'StartMeetingsController',
            controllerAs: 'vm',
            templateUrl: '/modules/meetings/client/views/start-meeting.client.view.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: false,
            fullscreen: true,
            resolve: {
              selectedDate: function() {
                return event.start;
              },
              selectedEvent: function() {
                return data;
              },
              userResolve: function() {
                return userResolve;
              },
              meetingStartTime: function() {
                return new Date();
              }
            },
          })
          .then(function(updatedItem) {
            
          }, function() {
            console.log('You cancelled the dialog.');
          });
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
        className: 'bg-red',
        stick: true
      });
    };

    function openCreateMeetingDialog(date) {
      $mdDialog.show({
        controller: 'MeetingsController',
        controllerAs: 'vm',
        templateUrl: '/modules/meetings/client/views/form-meeting.client.view.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: true,
        resolve: {
          selectedDate: function() {
            return date;
          },
          selectedEvent: function() {
            return null;
          },
          viewMode: function() {
            return false;
          },
          userResolve: function() {
            return userResolve;
          }
        }
      }).then(function(createdItem) {
        $scope.model.newEvents.push(createdItem);
        eventsPush(createdItem);
        fullCalenderRerender();
      }, function() {
        console.log('You cancelled the dialog.');
      });
    }

    function fullCalenderRerender() {
      $('#calendar').fullCalendar('removeEvents');
      $('#calendar').fullCalendar('addEventSource', $scope.model.events);
      $('#calendar').fullCalendar('rerenderEvents');
    }

  }
}());