(function() {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', '$http', 'AdminService', 'AttendancesService', 'Authentication', 'CheckInAttendancesServices', 'CommonService', 'EmployeeMeetingsService', 'menuService', '$mdDialog', '$interval', 'Notification', 'NotificationsService', 'PERMISSION', 'LEAVE', 'RemindersService', 'TodayReminderService'];

  function HeaderController($scope, $state, $http, AdminService, AttendancesService, Authentication, CheckInAttendancesServices, CommonService, EmployeeMeetingsService, menuService, $mdDialog, $interval, Notification, NotificationsService, PERMISSION, LEAVE, RemindersService, TodayReminderService) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.checkOutInProgress = false;
    vm.commonService = CommonService;
    vm.LEAVE = LEAVE;
    vm.PERMISSION = PERMISSION;
    vm.events = [];
    vm.meetings = [];
    vm.reminders = [];

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    var getAttendances = function() {
      CheckInAttendancesServices.requestFindAwaitingForApprovalLeave(function(attendances) {
        vm.events = _.reject(vm.events, function(event) {
          return event._id === CommonService.getAttendanceId;
        });
        attendances = _.reject(attendances, function(attendance) {
          return vm.events ? _.includes(_.map(vm.events, '_id'), attendance._id) : false;
        });        
        angular.forEach(attendances, function(attendance) {
          if (attendance.applyPermission) {
            attendancesPermissionPush(attendance);
          }
          if (attendance.applyLeave) {
            attendancesLeavePush(attendance);
          }
        });
      });
    }

    var getMyTodayMeetings = function() {
      var today = new Date();
      var beforeTwentyMinutes = getDateTimeToServer(today.setMinutes(today.getMinutes() + 20))

      var gmtDateTime = {
        userId: Authentication.user._id,
        startDate: getDateTimeToServer(today.setMinutes(today.getMinutes() + 20)),
        endDate: getDateTimeToServer(new Date())
      };
      EmployeeMeetingsService.requestFindTodayMeetingsByUser(gmtDateTime).then(function(employeeMeetings) {        
        employeeMeetings = _.reject(employeeMeetings, function(employeeMeeting) {
          return vm.meetings ? _.includes(_.map(vm.meetings, '_id'), employeeMeeting._id) : false;
        });
        angular.forEach(employeeMeetings, function(employeeMeeting) {  
          var haveMeetingToday = _.includes(_.map(employeeMeeting.attendees, '_id'), Authentication.user._id);          
          if (moment(beforeTwentyMinutes).format('YYYY-MM-DD hh:mm:ss') >= moment(employeeMeeting.startDateTime).format('YYYY-MM-DD hh:mm:ss') && moment(new Date()).format('YYYY-MM-DD hh:mm:ss') < moment(employeeMeeting.startDateTime).format('YYYY-MM-DD hh:mm:ss')) {            
            vm.meetings.push(employeeMeeting);
          }
        });
      });
    };

    var getMyTodayReminders = function() {
      var today = new Date();
      var beforeTwentyMinutes = getDateTimeToServer(today.setMinutes(today.getMinutes() + 20))
      vm.originalReminders = angular.copy(vm.reminders);

      var gmtDateTime = {
        userId: Authentication.user._id,
        startDate: getDateTimeToServer(today.setMinutes(today.getMinutes() + 20)),
        endDate: getDateTimeToServer(new Date())
      };
      TodayReminderService.requestFindTodayRemindersByUser(gmtDateTime).then(function(reminders) {        
        reminders = _.reject(reminders, function(reminder) {
          return vm.reminders ? _.includes(_.map(vm.reminders, '_id'), reminder._id) : false;
        });
        angular.forEach(reminders, function(reminder) {            
          if (moment(beforeTwentyMinutes).format('YYYY-MM-DD hh:mm:ss') >= moment(reminder.reminderDateTime).format('YYYY-MM-DD hh:mm:ss') && moment(new Date()).format('YYYY-MM-DD hh:mm:ss') < moment(reminder.reminderDateTime).format('YYYY-MM-DD hh:mm:ss')) {
            vm.reminders.push(reminder);
          }
        });
      });
    };

    $scope.inHour = function(startTime) {
      return moment(startTime).fromNow();
    };

    $scope.reminderViewed = function(reminder) {
      reminder = new RemindersService(reminder);
      reminder.hasReminded = true;
      reminder.$update(successCallback, errorCallback);
      function successCallback(res) {
        var index = CommonService.findIndexByID(vm.reminders, res._id);
        vm.reminders.splice(index, 1);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Thank you !!! "' + res.title + '" reminder is not shown again.'
        });
      }

      function errorCallback(errorResponse) {
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Reminder error!'
        });
      }      
    };
    
    var getMyNotifications = function() {
      NotificationsService.requestFindNotificationByUser({
        userId: Authentication.user._id
      }).then(function(notifications) {
        angular.forEach(notifications, function(notification) {
          if(notifications.length > 1) {
            CommonService.sleep(5000);
          }
          buildNotificationContent(notification);
        });
      });      
    };

    if (Authentication.user) {
      getAttendances();
      getMyTodayMeetings();
      getMyTodayReminders();
      $interval(getAttendances, 5000);
      $interval(getMyTodayMeetings, 5000);
      $interval(getMyNotifications, 10000);
      $interval(getMyTodayReminders, 10000);
    }

    $scope.logout = function(ev) {
      CheckInAttendancesServices.requestFindTodayCheckIn(CommonService.buildArrayToFindTodayCheckIn(Authentication.user._id)).then(function(searchResults) {
        var todayCheckIn = searchResults[0];
        if (vm.checkOutInProgress) {
          return;
        } else {
          vm.checkOutInProgress = true;
        }

        if (todayCheckIn.checkOutTime) {
          confirmBeforeLogout(ev);
        } else {
          checkOut(ev, todayCheckIn);
        }
      });

    };

    $scope.approveLeave = function(event) {
      var oldShow = $mdDialog.show;
      $mdDialog.show = function(options) {
        if (options.hasOwnProperty("skipHide")) {
          options.multiple = options.skipHide;
        }
        return oldShow(options);
      };
      $mdDialog.show({
        controller: 'LeaveOrPermissionController',
        controllerAs: 'vm',
        templateUrl: '/modules/attendances/client/views/leave-attendance.client.view.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: true,
        resolve: {
          selectedDate: function() {
            return new Date(event.start);
          },
          hasApplyLeave: function() {
            return event.category === LEAVE ? true : false;
          },
          selectedData: function() {
            return event;
          },
          createMode: function() {
            return false;
          },
          userId: function() {
            return event.user._id;
          },
          approvedMode: function() {
            return true;
          },
          userResolve: function() {
            return CommonService.getUserResolve;
          }
        },
      })
      .then(function(updatedItem) {
        if (updatedItem.isDelete || updatedItem.isApproved) {  
          var index = CommonService.findIndexByID(vm.events, event._id);        
          vm.events.splice(index, 1);
        }
      }, function() {
        console.log('You cancelled the dialog.');
      });
    };

    $scope.getProfileDetails = function(event) {
      AdminService.get({
        userId: event.user
      }, function(data) {
        event.user = data;
      });
    };

    function checkOut(ev, todayCheckIn) {
      var checkoutConfirm = $mdDialog.confirm()
        .title('Do you want to checkout before logout ?')
        .clickOutsideToClose(false)
        .escapeToClose(false)
        .targetEvent(ev)
        .ok('Yes')
        .cancel('No');

      $mdDialog.show(checkoutConfirm).then(function() {
          var attendance = new AttendancesService(todayCheckIn);
          attendance.checkOutTime = new Date();
          attendance.$update(successCallback, errorCallback);

          function successCallback(res) {
            vm.checkOutInProgress = false;
            Notification.success({
              message: '<i class="glyphicon glyphicon-ok"></i> Your check-out time inserted successfully '
            });
          }

          function errorCallback(errorResponse) {
            vm.checkOutInProgress = false;
            Notification.error({
              message: errorResponse.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> Your check-out time not inserted successfully, Please contact your adminstrator'
            });
          }
          window.location.href = '/api/auth/signout';
        },
        function() {
          confirmBeforeLogout(ev);
        });
    };

    function confirmBeforeLogout(ev) {
      var logoutConfirm = $mdDialog.confirm()
        .title('Do you want to logout ?')
        .clickOutsideToClose(false)
        .escapeToClose(false)
        .targetEvent(ev)
        .ok('Yes')
        .cancel('No');

      vm.checkOutInProgress = false;
      $mdDialog.show(logoutConfirm).then(function() {
        window.location.href = '../api/auth/signout';
      },
      function() {

      });
    };

    function attendancesPermissionPush(attendance) {
      vm.events.push({
        _id: attendance._id,
        user: attendance.user,
        start: new Date(attendance.applyPermission.startTime),
        end: new Date(attendance.applyPermission.endTime),
        timeSince: moment(attendance.created).fromNow(),
        appliedOn: attendance.created,
        reason: attendance.reason,
        category: PERMISSION        
      });
    };

    function attendancesLeavePush(attendance) {
      vm.events.push({
        _id: attendance._id,
        user: attendance.user,
        start: new Date(attendance.applyLeave.startTime),
        end: new Date(attendance.applyLeave.endTime),
        timeSince: moment(attendance.created).fromNow(),
        appliedOn: attendance.created,
        reason: attendance.reason,
        category: LEAVE
      });
    };

    function buildNotificationContent(notification) {
      var headerMsg = notification.type === 'meeting' ? " call for a meeting at, " + moment(notification.meetingScheduleDate).format('MMMM Do YYYY, h:mm:ss a') : " assigned you a new task, " + moment(notification.created).fromNow();
      var notifContent = '<div class="alert alert-dark media fade in bd-0" id="message-alert"><div class="media-left"><img src="/' + notification.user.profileImageURL + '" class="dis-block img-circle"></div><div class="media-body width-100p"><h4 class="alert-title f-14">New message recieved</h4><p class="f-12 alert-message pull-left">' + notification.user.displayName + headerMsg + '.</p></div></div>';
      if (!$('#quickview-sidebar').hasClass('open') && !$('.page-content').hasClass('page-builder') && !$('.morphsearch').hasClass('open')) {
        setTimeout(function() {
          generateNotifDashboard(notifContent);
        }, 4500);
        
        if (notification.notifyTo.length <= 1) {
          notification.$remove();
        } else {
          notification.notifyTo = _.reject(notification.notifyTo, function(notify) {
            return notify === Authentication.user._id;
          });
         notification.$update();
        }
      }
    }
    
    function generateNotifDashboard(content) {
      var position = 'topRight';
      if ($('body').hasClass('rtl')) position = 'topLeft';
      var n = noty({
        text: content,
        type: 'success',
        layout: position,
        theme: 'made',
        animation: {
          open: 'animated bounceIn',
          close: 'animated bounceOut'
        },
        timeout: 4500,
        callback: {
          onShow: function() {
            $('#noty_topRight_layout_container, .noty_container_type_success').css('width', 350).css('bottom', 10);
          },
          onCloseClick: function() {
            setTimeout(function() {
              $('#quickview-sidebar').addClass('open');
            }, 500)
          }
        }
      });
    };

    function getDateTimeToServer(date) {
      var dtGMT = new Date((new Date(date)).toUTCString()).toISOString();
      return dtGMT;
    }

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }
  }
}());