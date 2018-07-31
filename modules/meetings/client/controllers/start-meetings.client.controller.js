(function() {
  'use strict';

  // Meetings controller
  angular
    .module('meetings')
    .controller('StartMeetingsController', StartMeetingsController);

  StartMeetingsController.$inject = ['EmployeeMeetingsService', '$scope', '$state', '$window', '$interval', 'Authentication', '$mdDialog', '$mdpTimePicker', 'selectedDate', 'selectedEvent', 'StartMeetingsService', 'meetingStartTime', 'Notification', 'NotificationsService', 'userResolve'];

  function StartMeetingsController(EmployeeMeetingsService, $scope, $state, $window, $interval, Authentication, $mdDialog, $mdpTimePicker, selectedDate, selectedEvent, StartMeetingsService, meetingStartTime, Notification, NotificationsService, userResolve) {
    var vm = this;

    vm.authentication = Authentication;
    vm.meeting = selectedEvent;
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.cancel = cancel;
    vm.agendas = selectedEvent.agendas;
    vm.users = userResolve;
    vm.removeLocalStorageMoM = removeLocalStorageMoM;
    vm.showSavingOffline = false;
    vm.showSavedOffline = false;
    var mom = {}

    $scope.eventTime = {
      startTime: moment(new Date(selectedEvent.startDateTime)).format('YYYY/MM/DD')
    };

    $scope.ui = {
      isStartMeetingInProgress: false,
    };

    // set false. this avoids triggering watch during initialiation
    var momfields = {
      'meetingStartTime': false,
      'attendees': false,
      'facilitator': false,
      'location': false,
      'agendas': false
    };

    var temp = {};
    angular.forEach(momfields,function(value,index){
      if(!index.includes("meetingStartTime")){
        temp[index] = selectedEvent[index];
      }
      else{
        temp[index] = meetingStartTime;
      }
    });

    var defaultValues = JSON.stringify(temp);

    var localStorageName;
    localStorageName = Authentication.user._id+'_mom_id_'+selectedEvent._id;

    if(localStorage.getItem(localStorageName)==null){
      mom.meetingStartTime = meetingStartTime;
      localStorage.setItem(localStorageName,JSON.stringify((mom)));
      vm.showSavedOffline = true;
    }
    else{
      var temp = JSON.parse(localStorage.getItem(localStorageName));
      // console.log("localStorage mom: " + localStorage.getItem(localStorageName));
      if(Object.keys(temp).length>0){
        vm.showSavedOffline = true;
        mom = temp;
        if(mom['meetingStartTime'] != undefined){
          meetingStartTime = mom['meetingStartTime'];
          temp['meetingStartTime'] = meetingStartTime;
          // console.log(meetingStartTime);
          // console.log("meetingStartTime - setting value from localStorage");
        }
        if(mom['attendees'] != undefined){
          vm.meeting.attendees = mom['attendees'];
          // console.log("attendees - setting value from localStorage");
        }
        if(mom['facilitator'] != undefined){
          vm.meeting.facilitator = mom['facilitator'];
          // console.log("facilitator - setting value from localStorage");
        }
        if(mom['location'] != undefined){
          vm.meeting.location = mom['location'];
          // console.log("location - setting value from localStorage");
        }
        if(mom['agendas'] != undefined){
          vm.agendas = mom['agendas'];
          // console.log("agendas - setting value from localStorage");
        }
      }
      else{
        mom.meetingStartTime = meetingStartTime;
        localStorage.setItem(localStorageName,JSON.stringify((mom)));
        vm.showSavedOffline = true;
      }
    }

    var clock = function() {
      $scope.clock = moment.utc(moment(new Date(), "HH:mm:ss").diff(moment(new Date(meetingStartTime), "HH:mm:ss"))).format("HH:mm:ss");
      $scope.endDateTime = new Date();
    }
    clock();
    $interval(clock, 1000);

    // using momfields instead of vm.meeting after it stopped working for no reason
    angular.forEach(momfields,function(value,index){
      if(!index.includes("meetingStartTime")&&!index.includes("agendas")){
        $scope.$watch('vm.meeting.'+index, function (newValue, oldValue) {
          if(momfields[index]){
            vm.showSavedOffline = false;
            vm.showSavingOffline = true;
            if( vm.meeting[index]==null || vm.meeting[index].length==0 ){
              delete mom[index];
            }
            else{
              mom[index] = vm.meeting[index];
            }
            // console.log("before waiting and displaying saved offline for field "+ index);
            if(Object.keys(mom).length>0){
              var doShowOfflineInfo = setInterval(function(){
                                    // console.log("end of waiting and displaying saved offline for field "+ index);
                                    vm.showSavingOffline = false;
                                    vm.showSavedOffline = true;
                                    clearInterval(doShowOfflineInfo);
                                  }, 300);
            }
            else{
              var doShowOfflineInfo = setInterval(function(){
                                  // console.log("end of waiting and not displaying saved offline for field "+ index);
                                  vm.showSavingOffline = false;
                                  vm.showSavedOffline = false;
                                  clearInterval(doShowOfflineInfo);
                                }, 300);
            }
            // console.log("continuing without waiting for displaying saved offline for field "+ index);
            localStorage.setItem(localStorageName,JSON.stringify(mom));
            // console.log(localStorage.getItem(localStorageName));
          }
          momfields[index] = true;
        });
      }
      else if(!index.includes("meetingStartTime")){
        $scope.$watch('vm.'+index, function (newValue, oldValue) {
          if(momfields[index]){
            vm.showSavedOffline = false;
            vm.showSavingOffline = true;
            if( newValue==null || newValue.length==0 ){
              delete mom[index];
            }
            else{
              mom[index] = newValue;
            }
            // console.log("before waiting and displaying saved offline for field "+ index);
            if(Object.keys(mom).length>0){
              var doShowOfflineInfo = setInterval(function(){
                                    // console.log("end of waiting and displaying saved offline for field "+ index);
                                    vm.showSavingOffline = false;
                                    vm.showSavedOffline = true;
                                    clearInterval(doShowOfflineInfo);
                                  }, 300);
            }
            else{
              var doShowOfflineInfo = setInterval(function(){
                                  // console.log("end of waiting and not displaying saved offline for field "+ index);
                                  vm.showSavingOffline = false;
                                  vm.showSavedOffline = false;
                                  clearInterval(doShowOfflineInfo);
                                }, 300);
            }
            // console.log("continuing without waiting for displaying saved offline for field "+ index);
            localStorage.setItem(localStorageName,JSON.stringify(mom));
            // console.log(localStorage.getItem(localStorageName));
          }
          momfields[index] = true;
        }, true);
      }
    });


    function removeLocalStorageMoM(){
      localStorage.removeItem(localStorageName);
      mom = {};
      var temp = JSON.parse(defaultValues);
      // console.log(defaultValues);
      angular.forEach(momfields,function(value,index){
        momfields[index] = false;
        if(!index.includes("meetingStartTime")&&!index.includes("agendas")){
          vm.meeting[index] = temp[index];
        }
        else if(!index.includes("meetingStartTime")){
          vm.agendas = temp.agendas;
        }
        else{
          meetingStartTime = new Date();
          mom.meetingStartTime = meetingStartTime;
          localStorage.setItem(localStorageName,JSON.stringify((mom)));          
        }
      });
      vm.showSavedOffline = false;
      vm.showSavingOffline = false;
    }


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

      var mins = moment.utc(moment($scope.endDateTime, "HH:mm:ss").diff(moment(meetingStartTime, "HH:mm:ss"))).format("mm")

      startMeeting.title = selectedEvent.title;
      startMeeting.startDateTime = meetingStartTime;
      startMeeting.startedTime = moment(meetingStartTime).format('MMMM Do YYYY')
      startMeeting.endDateTime = $scope.endDateTime;
      startMeeting.meetingDiff = $scope.clock;
      startMeeting.agendas = vm.agendas;
      startMeeting.location = selectedEvent.location;
      startMeeting.attendees = selectedEvent.attendees;
      startMeeting.facilitator = selectedEvent.facilitator;
      startMeeting.meetingId = selectedEvent._id;
      startMeeting.duration = moment($scope.endDateTime, "hh:mm:ss a").diff(meetingStartTime, 'hours') + " Hrs and " + mins + " Mns";;

      EmployeeMeetingsService.createMinutesOfMeetingDocx({
        minutes: startMeeting
      }).then(function(results) {
        startMeeting.minutesFilePath = results[0].filePath;
        startMeeting.$save(successCallback, errorCallback);
      });

      function successCallback(res) {
        var msg = "Minutes Of Meeting created successfully"
        localStorage.removeItem(localStorageName);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
        });
        setTimeout(function() {
          $window.location.href= '/meetings';
        }, 1000);
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
