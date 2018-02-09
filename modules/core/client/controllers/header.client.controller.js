(function() {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', '$http', 'AdminService', 'AttendancesService', 'Authentication', 'CheckInAttendancesServices', 'CommonService', 'EmployeeMeetingsService', 'menuService', '$mdDialog', '$interval', 'Notification', 'PERMISSION', 'LEAVE'];

  function HeaderController($scope, $state, $http, AdminService, AttendancesService, Authentication, CheckInAttendancesServices, CommonService, EmployeeMeetingsService, menuService, $mdDialog, $interval, Notification, PERMISSION, LEAVE) {
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
      // AttendancesService.query(function(attendances) {
      //   var today = new Date();
      //   angular.forEach(attendances, function(attendance) {
      //     if (attendance.applyPermission) {
      //       if (moment(today).format('YYYY-MM-DD') >= moment(attendance.applyPermission.startTime).format('YYYY-MM-DD') && moment(today).format('YYYY-MM-DD') <= moment(attendance.applyPermission.endTime).format('YYYY-MM-DD')) {
      //         attendancesPermissionPush(attendance);
      //       }
      //     }
      //     if (attendance.applyLeave) {
      //       if (moment(today).format('YYYY-MM-DD') >= moment(attendance.applyLeave.startTime).format('YYYY-MM-DD') && moment(today).format('YYYY-MM-DD') <= moment(attendance.applyLeave.endTime).format('YYYY-MM-DD')) {
      //         attendancesLeavePush(attendance);
      //       }
      //     }
      //   });
      // });
    }

    var getMyTodayMeetings = function() {
      var today = new Date();
      var minusTwoHours = getDateTimeToServer(today.setHours(today.getHours() + 2))

      var gmtDateTime = {
        userId: Authentication.user._id,
        startDate: getDateTimeToServer(today.setHours(today.getHours() + 2)),
        endDate: getDateTimeToServer(new Date())
      };
      EmployeeMeetingsService.requestFindTodayMeetingsByUser(gmtDateTime).then(function(employeeMeetings) {
        // vm.meetings = _.reject(vm.meetings, function(meeting) {
        //   return meeting._id === CommonService.getAttendanceId;
        // });
        //alert(employeeMeetings.length)
        employeeMeetings = _.reject(employeeMeetings, function(employeeMeeting) {
          return vm.meetings ? _.includes(_.map(vm.meetings, '_id'), employeeMeeting._id) : false;
        });
        angular.forEach(employeeMeetings, function(employeeMeeting) {      
          // alert(moment(employeeMeeting.endDateTime).format('YYYY-MM-DD hh:mm:ss'))   
          // alert(moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))   
          var haveMeetingToday = _.includes(_.map(employeeMeeting.attendees, '_id'), Authentication.user._id);          
          if (moment(minusTwoHours).format('YYYY-MM-DD hh:mm:ss') >= moment(employeeMeeting.startDateTime).format('YYYY-MM-DD hh:mm:ss') && moment(new Date()).format('YYYY-MM-DD hh:mm:ss') < moment(employeeMeeting.startDateTime).format('YYYY-MM-DD hh:mm:ss')) {
            vm.meetings.push(employeeMeeting);
          }
        });
      });
    };

    $scope.inHour = function(startTime) {
      return moment(startTime).fromNow();
    };

    var getTasksAssignedByMe = function() {
      var now = new Date();
      now.setSeconds(now.getSeconds() - 10);
      $http({
        method: 'GET',
        url: 'api/tasks/assignee/' + vm.authentication.user._id
      }).then(function(tasks) {
        angular.forEach(tasks.data, function(task) {
          if (moment(now).format('YYYY-MM-DD hh:mm:ss') <= moment(task.created).format('YYYY-MM-DD hh:mm:ss')) {
            var notifContent = '<div class="alert alert-dark media fade in bd-0" id="message-alert"><div class="media-left"><img src="/'+task.createdProfileImage+'" class="dis-block img-circle"></div><div class="media-body width-100p"><h4 class="alert-title f-14">New message recieved</h4><p class="f-12 alert-message pull-left">' + task.createdBy + ' assigned you a new task 10 seconds ago.</p></div></div>';
            if (!$('#quickview-sidebar').hasClass('open') && !$('.page-content').hasClass('page-builder') && !$('.morphsearch').hasClass('open')) generateNotifDashboard(notifContent);
          }
        });

      });
    };

    if (Authentication.user) {
      getAttendances();
      getMyTodayMeetings();
      $interval(getAttendances, 5000);
      $interval(getMyTodayMeetings, 5000);
      // $interval(getTasksAssignedByMe, 10000);
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
        window.location.href = '/api/auth/signout';
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