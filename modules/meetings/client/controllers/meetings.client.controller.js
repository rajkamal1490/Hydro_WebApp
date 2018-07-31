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
    vm.originalMeeting = angular.copy(selectedEvent);
    vm.selectedDate = selectedDate;
    vm.removeLocalStorageNewMeeting = removeLocalStorageNewMeeting;
    vm.showSavingOffline = false;
    vm.showSavedOffline = false;
    var new_meeting = {}

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

    // set false. this avoids triggering watch during initialiation
    var meetingfields = {
      'title': false,
      'startTime': false,
      'endTime': false,
      'location': false,
      'facilitator': false,
      'attendees': false,
      'unconfirmedAgenda.agendaTitle': false,
      'unconfirmedAgenda.agendaDescription': false,
      'unconfirmedAgenda.agendaResponsiblePerson': false,
      'agendas': false
    };

    var temp = {};
    angular.forEach(meetingfields,function(value,index){
      temp[index] = vm.meeting[index];
    });

    var defaultValues = JSON.stringify(temp);

    var localStorageName;
    if(vm.meeting._id){
      localStorageName = Authentication.user._id+'_meeting_id_'+vm.meeting._id;

    }
    else{
      localStorageName = Authentication.user._id+'_new_meeting';
    }

    if(localStorage.getItem(localStorageName)==null){
      // new_meeting['createdID'] = Authentication.user._id;
      localStorage.setItem(localStorageName,JSON.stringify((new_meeting)));
      vm.showSavedOffline = false;
    }
    else{
      var temp = JSON.parse(localStorage.getItem(localStorageName));
      // console.log("localStorage new_meeting: " + localStorage.getItem(localStorageName));
      if(Object.keys(temp).length>0){
        vm.showSavedOffline = true;
        new_meeting = temp;
        if(new_meeting['title'] != undefined){
          vm.meeting.title = new_meeting['title'];
          // console.log("title - setting value from localStorage");
        }
        if(new_meeting['startTime'] != undefined){
          vm.meeting.startTime = new_meeting['startTime'];
          // console.log("startTime - setting value from localStorage");
        }
        if(new_meeting['endTime'] != undefined){
          vm.meeting.endTime = new_meeting['endTime'];
          // console.log("endTime - setting value from localStorage");
        }
        if(new_meeting['location'] != undefined){
          vm.meeting.location = new_meeting['location'];
          // console.log("location - setting value from localStorage");
        }
        if(new_meeting['facilitator'] != undefined){
          vm.meeting.facilitator = new_meeting['facilitator'];
          // console.log("facilitator - setting value from localStorage");
        }
        if(new_meeting['attendees'] != undefined){
          vm.meeting.attendees = new_meeting['attendees'];
          // console.log("attendees - setting value from localStorage");
        }
        if(new_meeting['unconfirmedAgenda.agendaTitle'] != undefined){
          $scope.unconfirmedAgenda.agendaTitle = new_meeting['unconfirmedAgenda.agendaTitle'];
          // console.log("unconfirmedAgenda.agendaTitle - setting value from localStorage");
        }
        if(new_meeting['unconfirmedAgenda.agendaDescription'] != undefined){
          $scope.unconfirmedAgenda.agendaDescription = new_meeting['unconfirmedAgenda.agendaDescription'];
          // console.log("unconfirmedAgenda.agendaDescription - setting value from localStorage");
        }
        if(new_meeting['unconfirmedAgenda.agendaResponsiblePerson'] != undefined){
          $scope.unconfirmedAgenda.agendaResponsiblePerson = new_meeting['unconfirmedAgenda.agendaResponsiblePerson'];
          // console.log("unconfirmedAgenda.agendaResponsiblePerson - setting value from localStorage");
        }
        if(new_meeting['agendas'] != undefined){
          vm.agendas = new_meeting['agendas'];
          // console.log("agendas - setting value from localStorage");
        }
      }
    }

    // using meetingfields instead of vm.meeting after it stopped working for no reason
    angular.forEach(meetingfields,function(value,index){
      if(!index.includes("unconfirmedAgenda")&&!index.includes("agendas")){
        $scope.$watch('vm.meeting.'+index, function (newValue, oldValue) {
          if(meetingfields[index]){
            vm.showSavedOffline = false;
            vm.showSavingOffline = true;
            if( vm.meeting[index]==null || vm.meeting[index].length==0 ){
              delete new_meeting[index];
            }
            else{
              new_meeting[index] = vm.meeting[index];
            }
            // console.log("before waiting and displaying saved offline for field "+ index);
            if(Object.keys(new_meeting).length>0){
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
            localStorage.setItem(localStorageName,JSON.stringify(new_meeting));
            // console.log(localStorage.getItem(localStorageName));
          }
          meetingfields[index] = true;
        });
      }
      else if(index.includes("unconfirmedAgenda")){
        $scope.$watch(''+index, function (newValue, oldValue) {
          if(meetingfields[index]){
            vm.showSavedOffline = false;
            vm.showSavingOffline = true;
            if( newValue==null || newValue.length==0 ){
              delete new_meeting[index];
            }
            else{
              new_meeting[index] = newValue;
            }
            // console.log("before waiting and displaying saved offline for field "+ index);
            if(Object.keys(new_meeting).length>0){
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
            localStorage.setItem(localStorageName,JSON.stringify(new_meeting));
            // console.log(localStorage.getItem(localStorageName));
          }
          meetingfields[index] = true;
        });
      }
      else{
        $scope.$watch('vm.'+index, function (newValue, oldValue) {
          if(meetingfields[index]){
            vm.showSavedOffline = false;
            vm.showSavingOffline = true;
            if( newValue==null || newValue.length==0 ){
              delete new_meeting[index];
            }
            else{
              new_meeting[index] = newValue;
            }
            // console.log("before waiting and displaying saved offline for field "+ index);
            if(Object.keys(new_meeting).length>0){
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
            localStorage.setItem(localStorageName,JSON.stringify(new_meeting));
            // console.log(localStorage.getItem(localStorageName));
          }
          meetingfields[index] = true;
        }, true);
      }
    });

    function removeLocalStorageNewMeeting(){
      localStorage.removeItem(localStorageName);
      new_meeting = {};
      var temp = JSON.parse(defaultValues);
      // console.log(defaultValues);
      angular.forEach(meetingfields,function(value,index){
        meetingfields[index] = false;
        if(!index.includes("unconfirmedAgenda")&&!index.includes("agendas")){
          // console.log("clearing field "+index);
          vm.meeting[index] = temp[index];
        }
        else if(index.includes("unconfirmedAgenda")){
          // console.log("clearing field "+index);
          clearUnconfirmed();
        }
        else{
          vm.agendas = temp.agendas;
        }
      });
      vm.showSavedOffline = false;
      vm.showSavingOffline = false;
    }


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
      vm.meeting.createdID = Authentication.user._id;

      var notification = new NotificationsService({
        notifyTo: _.map(vm.meeting.attendees, '_id'),
        user: vm.meeting.facilitator,
        type: 'meeting',
        meetingScheduleDate: $scope.eventTime.mStartToServer,
        hasPopUped: false,
        isDismissed: false
      });

      if (vm.meeting._id) {
        new NotificationsService({_id: vm.meeting.notificationId}).$remove();
      }

      notification.$save(notifySuccessCallback, notifyErrorCallback);

      function notifySuccessCallback(res) {
        vm.meeting.notificationId = res._id;
        // TODO: move create/update logic to service
        if (vm.meeting._id) {
          vm.meeting.$update(successCallback(res), errorCallback);
        } else {
          vm.meeting.$save(successCallback(res), errorCallback);
        }
      }

      function notifyErrorCallback(res) {
        // TODO
      }

      function successCallback(res) {
        var msg = viewMode ? "Meeting updated successfully" : "Meeting created successfully"
        localStorage.removeItem(localStorageName);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
        });
         setTimeout(function() {
          $window.location.href= '/meetings';
        }, 1000);
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
            Notification.success({
              message: '<i class="glyphicon glyphicon-ok"></i> Meeting deleted successfully'
            });
            setTimeout(function() {
              $window.location.href = '/meetings';
            }, 1000);
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
      var selectedDate = vm.selectedDate ? vm.selectedDate : selectedEvent.startDateTime;
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
