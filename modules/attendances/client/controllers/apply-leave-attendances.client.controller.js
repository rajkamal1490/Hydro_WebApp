(function() {
  'use strict';

  // Attendances controller
  angular
    .module('attendances')
    .controller('LeaveOrPermissionController', LeaveOrPermissionController);

  LeaveOrPermissionController.$inject = ['$scope', '$http', '$state', '$window', 'AttendancesService', 'Authentication', 'CheckInAttendancesServices', 'createMode', 'selectedData', 'hasApplyLeave', 'selectedDate', '$mdDialog', '$mdpTimePicker', '$mdpDatePicker', 'Notification', 'userId'];

  function LeaveOrPermissionController($scope, $http, $state, $window, AttendancesService, Authentication, CheckInAttendancesServices, createMode, selectedData, hasApplyLeave, selectedDate, $mdDialog, $mdpTimePicker, $mdpDatePicker, Notification, userId) {
    var vm = this;

    vm.authentication = Authentication;
    vm.attendances = new AttendancesService(selectedData);
    vm.error = null;
    vm.form = {};
    vm.cancel = cancel;
    vm.save = save;
    vm.hasApplyLeave = hasApplyLeave;
    vm.applyInProgress = false;
    vm.reason = selectedData ? selectedData.reason : undefined;
    vm.createMode = createMode;

    $scope.applyPermission = {
      mStartClock: selectedData ? new Date(selectedData.start) : new Date(selectedDate),
      mEndClock: selectedData ? new Date(selectedData.end) : new Date(selectedDate),
      mStartToServer: selectedData ? getTimeToServer(new Date(selectedData.start)) : getTimeToServer(new Date(selectedDate)),
      mEndToServer: selectedData ? getTimeToServer(new Date(selectedData.end)) : getTimeToServer(new Date(selectedDate).setHours(new Date(selectedDate).getHours() + 1))
    };

    vm.attendances = {
      applyPermission: {
        displayStartTime: selectedData ? getTimeToDisplay(new Date(selectedData.start)) : getTimeToDisplay(new Date(selectedDate)),
        displayEndTime: selectedData ? getTimeToDisplay(new Date(selectedData.end)) : getTimeToDisplay(new Date(selectedDate).setHours(new Date(selectedDate).getHours() + 1)),
      },
      applyLeave: {
        displayStartTime: selectedData ? getDateTimeToDisplay(new Date(selectedData.start)) : getDateTimeToDisplay(new Date(selectedDate)),
        displayEndTime: selectedData ? getDateTimeToDisplay(new Date(selectedData.end)) : getDateTimeToDisplay(new Date(selectedDate)),
      }
    };

    $scope.applyLeave = {
      mStartClock: selectedData ? new Date(selectedData.start) : new Date(selectedDate),
      mEndClock: selectedData ? new Date(selectedData.end) : new Date(selectedDate),
      mStartToServer: selectedData ? getDateTimeToServer(new Date(selectedData.start)) : getDateTimeToServer(new Date(selectedDate).setHours(0, 0, 0, 0)),
      mEndToServer: selectedData ? getDateTimeToServer(new Date(selectedData.end)) : getDateTimeToServer(new Date(selectedDate).setHours(23, 59, 59, 999))
    };

    // Save Attendance
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.attendanceForm');
        return false;
      }

      if (vm.applyInProgress) {
        return;
      } else {
        vm.applyInProgress = true;
      }

      if (hasApplyLeave) {
        vm.attendances = {
          date: new Date($scope.applyLeave.mStartToServer).getDate(),
          month: new Date($scope.applyLeave.mStartToServer).getMonth() + 1,
          year: new Date($scope.applyLeave.mStartToServer).getFullYear(),
          applyLeave: {
            startTime: $scope.applyLeave.mStartToServer,
            endTime: $scope.applyLeave.mEndToServer,
            displayStartTime: getDateTimeToDisplay($scope.applyLeave.mStartToServer),
            displayEndTime: getDateTimeToDisplay($scope.applyLeave.mEndToServer)
          },
          reason: vm.reason,
          user: userId
        }
      } else {
        vm.attendances = {
          date: new Date($scope.applyPermission.mStartToServer).getDate(),
          month: new Date($scope.applyPermission.mStartToServer).getMonth() + 1,
          year: new Date($scope.applyPermission.mStartToServer).getFullYear(),
          applyPermission: {
            startTime: $scope.applyPermission.mStartToServer,
            endTime: $scope.applyPermission.mEndToServer,
            displayStartTime: getTimeToDisplay($scope.applyPermission.mStartToServer),
            displayEndTime: getTimeToDisplay($scope.applyPermission.mEndToServer)
          },
          reason: vm.reason,
          user: userId
        }
      }

      var mStartToServer = hasApplyLeave ? $scope.applyLeave.mStartToServer : $scope.applyPermission.mStartToServer;
      var mEndToServer = hasApplyLeave ? $scope.applyLeave.mEndToServer : $scope.applyPermission.mEndToServer;

      var startOfTheDayInLocal = new Date(mStartToServer);
      startOfTheDayInLocal.setHours(0, 0, 0, 0);
      var endOfTheDayInLocal = new Date(mEndToServer);
      endOfTheDayInLocal.setHours(23, 59, 59, 999);
      var gmtDateTime = {
        startGMT: mStartToServer,
        endGMT: mEndToServer,
        userId: userId,
        hasApplyLeave: hasApplyLeave
      };


      CheckInAttendancesServices.requestValidateOverlap(gmtDateTime).then(function(results) {
        if (results.length > 0 && createMode) {
          vm.applyInProgress = false;
          var msg = hasApplyLeave ? "Leave" : "Permission";
          var startTime = hasApplyLeave ? getDateTimeToDisplay(gmtDateTime.startGMT) : getTimeToDisplay(gmtDateTime.startGMT);
          var endTime = hasApplyLeave ? getDateTimeToDisplay(gmtDateTime.endGMT) : getTimeToDisplay(gmtDateTime.endGMT)
          Notification.error({
            message: "Already applied " + msg + " on the date between " + startTime + " and " + endTime,
            title: '<i class="glyphicon glyphicon-remove"></i>Error: ' + msg + ' Overlap '
          });
        } else {
          // TODO: move create/update logic to service
          if (selectedData) {
            vm.attendances._id = selectedData._id;
            AttendancesService.update(vm.attendances, successCallback, errorCallback);
          } else {
            AttendancesService.save(vm.attendances, successCallback, errorCallback);
          }
        }

      });

      function successCallback(res) {
        vm.applyInProgress = false;
        res.isDelete = false;
        $mdDialog.hide(res);
        var msg = hasApplyLeave ? "Leave " : "Permission"
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + msg + ' request submitted successfully'
        });
      }

      function errorCallback(errorResponse) {
        vm.applyInProgress = false;
        var msg = hasApplyLeave ? "Leave " : "Permission"
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i>' + msg + ' request not submitted successfully, Please contact your adminstrator'
        });
      }
    }

    $scope.showStartTimePicker = function(ev) {
      $mdpTimePicker($scope.applyPermission.mStartClock, {
          targetEvent: ev,
          minDate: new Date()
        })
        .then(function(dateTime) {
          $scope.applyPermission.mStartClock = dateTime;
          vm.attendances.applyPermission.displayStartTime = getTimeToDisplay(dateTime);
          $scope.applyPermission.mStartToServer = getTimeToServer(dateTime);

          validateStartAndEndTime($scope.applyPermission.mStartToServer, $scope.applyPermission.mEndToServer);

        });
    };

    $scope.showEndTimePicker = function(ev) {
      $mdpTimePicker($scope.applyPermission.mEndClock, {
          targetEvent: ev,
          minDate: new Date()
        })
        .then(function(dateTime) {
          $scope.applyPermission.mEndClock = dateTime;
          vm.attendances.applyPermission.displayEndTime = getTimeToDisplay(dateTime);
          $scope.applyPermission.mEndToServer = getTimeToServer(dateTime);

          validateStartAndEndTime($scope.applyPermission.mStartToServer, $scope.applyPermission.mEndToServer);
        });
    };

    $scope.showStartDatePicker = function(ev) {
      $mdpDatePicker($scope.applyLeave.mStartClock, {
          targetEvent: ev,
          minDate: new Date()
        })
        .then(function(dateTime) {
          $scope.applyLeave.mStartClock = dateTime;
          vm.attendances.applyLeave.displayStartTime = getDateTimeToDisplay(dateTime);
          dateTime.setHours(0, 0, 0, 0);
          $scope.applyLeave.mStartToServer = getDateTimeToServer(dateTime);

          validateStartAndEndTime($scope.applyLeave.mStartToServer, $scope.applyLeave.mEndToServer);
        });
    };

    $scope.showEndDatePicker = function(ev) {
      $mdpDatePicker($scope.applyLeave.mEndClock, {
          targetEvent: ev,
          minDate: new Date()
        })
        .then(function(dateTime) {
          $scope.applyLeave.mEndClock = dateTime;
          vm.attendances.applyLeave.displayEndTime = getDateTimeToDisplay(dateTime);
          dateTime.setHours(23, 59, 59, 999);
          $scope.applyLeave.mEndToServer = getDateTimeToServer(dateTime);

          validateStartAndEndTime($scope.applyLeave.mStartToServer, $scope.applyLeave.mEndToServer);
        });
    };

    $scope.deleteLeaveOrPermission = function() {
      var leaveOrPermission = hasApplyLeave ? 'leave' : 'permission';
      var confirm = $mdDialog.confirm().title('Do you want to delete the ' + leaveOrPermission + '?').textContent(_.startCase(_.toLower(leaveOrPermission)) + ' detail will be deleted permanently.').ok('Yes').cancel('No').multiple(true);
      $mdDialog.show(confirm).then(function() {

          if (vm.applyInProgress) {
            return;
          } else {
            vm.applyInProgress = true;
          }

          $http.delete('api/attendances/' + selectedData._id)
            .then(
              function(response) {
                deleteSuccessCallback(response)
              },
              function(response) {
                deleteErrorCallback(response)
              }
            );

          function deleteSuccessCallback(res) {
            res.isDelete = true;
            $mdDialog.hide(res);
            Notification.success({
              message: '<i class="glyphicon glyphicon-ok"></i> ' + _.startCase(_.toLower(leaveOrPermission)) + ' deleted successfully'
            });
          }

          function deleteErrorCallback(res) {
            vm.applyInProgress = false;
            Notification.error({
              message: res.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> Delete ' + _.startCase(_.toLower(leaveOrPermission)) + ' Detail Error'
            });
          }
        },
        function() {
          console.log('no');
        });
    };

    function validateStartAndEndTime(startDate, endDate) {
      if (vm.leaveForm) {
        var bool = (Date.parse(endDate) > Date.parse(startDate));
        vm.leaveForm.end.$setValidity('greater', bool);
        vm.leaveForm.start.$setValidity('lesser', bool);
      }
    }

    function getTimeToDisplay(date) {
      return moment(date).format('hh:mm:a');
    }

    function getDateTimeToDisplay(date) {
      return moment(date).format('YYYY:MM:DD');
    }

    function getTimeToServer(date) {
      // var dt = (new Date(date)).setHours(date.getHours(), date.getMinutes(), 0, 0);
      var dtGMT = new Date((new Date(date)).toUTCString()).toISOString();

      return dtGMT;
    }

    function getDateTimeToServer(date) {
      var dtGMT = new Date((new Date(date)).toUTCString()).toISOString();

      return dtGMT;
    }



    function cancel() {
      $mdDialog.cancel();
    };
  }
}());