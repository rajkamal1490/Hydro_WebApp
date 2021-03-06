(function () {
  'use strict';

  // Tasks controller
  angular
    .module('tasks')
    .controller('TasksController', TasksController);

  TasksController.$inject = ['$scope', '$state', '$window', '$filter', '$q', '$timeout', 'Authentication', 'editMode', 'PRIORITIES', '$mdDialog', '$mdpDatePicker', 'Notification', 'NotificationsService', 'task', 'taskResolve', 'TasksService', 'TASK_STATUSES', 'userResolve', 'refCodes', 'projects'];

  function TasksController ($scope, $state, $window, $filter, $q, $timeout,  Authentication, editMode, PRIORITIES, $mdDialog, $mdpDatePicker, Notification, NotificationsService, task, taskResolve, TasksService, TASK_STATUSES, userResolve, refCodes, projects) {
    var vm = this;

    vm.authentication = Authentication;
    vm.task = new TasksService(task);
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.cancel = cancel;
    vm.priorities = PRIORITIES;
    vm.statuses = TASK_STATUSES;
    vm.loadinitial = loadinitial;
    vm.hasIndividual = '0';
    vm.refcodetasks = refCodes;
    vm.projects = projects;
    vm.getMatches = getMatches;
    vm.removeLocalStorageNewTask = removeLocalStorageNewTask;
    vm.showSavingOffline = false;
    vm.showSavedOffline = false;
    var new_task = {}

    $scope.eventTime = {
      mStartClock: task ? new Date(task.startDateTime) : new Date(),
      mEndClock: task ? new Date(task.dueDateTime) : new Date(),
      mStartToServer: task ? getTimeToServer(new Date(task.startDateTime)) : getTimeToServer(new Date()),
      mEndToServer: task ? getTimeToServer(new Date(task.dueDateTime)) : getTimeToServer(new Date())
    };

    $scope.model = {
      users: userResolve,
      original: angular.copy(task)
    };

    $scope.ui = {
      isTaskInProgress: false,
      editMode: editMode,
    };

    // set false. this avoids triggering watch during initialiation
    var taskfileds = {
      'title': false,
      'description': false,
      'startDateTime': false,
      'dueDateTime': false,
      'priority': false,
      'assignee': false,
      'hasIndividual': false,
      'projectCode': false,
      'orderCode': false,
      'stateCode': false,
      'workCode': false,
      'comment': false
    };
    var proceedAssigneeAfterAutoCompleteInit = false;

    var localStorageName;
    if(vm.task._id){
      localStorageName = Authentication.user._id+'_task_id_'+vm.task._id;
    }
    else{
      localStorageName = Authentication.user._id+'_new_task';
    }

    if(localStorage.getItem(localStorageName)==null){
      // new_task['createdID'] = Authentication.user._id;
      localStorage.setItem(localStorageName,JSON.stringify((new_task)));
      vm.showSavedOffline = false;
    }
    else{
      var temp = JSON.parse(localStorage.getItem(localStorageName));
      // console.log("localStorage new_task: " + localStorage.getItem(localStorageName));
      if(Object.keys(temp).length>0){
        vm.showSavedOffline = true;
        new_task = temp;
        if(new_task['title'] != undefined){
          vm.task.title = new_task['title'];
          // console.log("title - setting value from localStorage");
        }
        if(new_task['description'] != undefined){
          vm.task.description = new_task['description'];
          // console.log("description - setting value from localStorage");
        }
        var d = new Date();
        if(new_task['startDateTime'] != undefined){
          vm.task.startDateTime = new_task['startDateTime'];
          // console.log("startDateTime - setting value from localStorage");
          var startDateTime = new_task['startDateTime'].split(":");
          d.setYear(startDateTime[0]);
          d.setMonth(startDateTime[1]);
          d.setDate(startDateTime[2]);
          $scope.eventTime.mStartClock = d;
        }
        if(new_task['dueDateTime'] != undefined){
          vm.task.dueDateTime = new_task['dueDateTime'];
          // console.log("dueDateTime - setting value from localStorage");
          var dueDateTime = new_task['dueDateTime'].split(":");
          d.setYear(dueDateTime[0]);
          d.setMonth(dueDateTime[1]);
          d.setDate(dueDateTime[2]);
          $scope.eventTime.mEndClock = d;
        }
        if(new_task['priority'] != undefined){
          vm.task.priority = new_task['priority'];
          // console.log("priority - setting value from localStorage");
        }
        if(new_task['assignee'] != undefined){
          vm.task.assignee = new_task['assignee'];
          // console.log("assignee - setting value from localStorage");
        }
        if(new_task['hasIndividual'] != undefined){
          vm.hasIndividual = new_task['hasIndividual'];
          // console.log("hasIndividual - setting value from localStorage");
          // // console.log(vm.hasIndividual);
          if(vm.hasIndividual == 1){
            if(new_task['projectCode'] != undefined){
              vm.task.projectCode = new_task['projectCode'];
              // console.log("projectCode - setting value from localStorage");
            }
            if(new_task['orderCode'] != undefined){
              vm.task.orderCode = new_task['orderCode'];
              // console.log("orderCode - setting value from localStorage");
            }
            if(new_task['stateCode'] != undefined){
              vm.task.stateCode = new_task['stateCode'];
              // console.log("stateCode - setting value from localStorage");
            }
            if(new_task['workCode'] != undefined){
              vm.task.workCode = new_task['workCode'];
              // console.log("workCode - setting value from localStorage");
            }
          }
        }
        if(new_task['comment'] != undefined){
          vm.task.comment = new_task['comment'];
          // console.log("comment - setting value from localStorage");
        }
      }
    }

    // using taskfileds instead of vm.task after it stopped working for no reason
    angular.forEach(taskfileds,function(value,index){
      if(index=="hasIndividual"){
        $scope.$watch('vm.'+index, function (newValue, oldValue) {
          if(taskfileds[index]){
            vm.showSavedOffline = false;
            vm.showSavingOffline = true;
            if( vm.hasIndividual==null || vm.hasIndividual.length==0 ){
              delete new_task[index];
            }
            else{
              new_task[index] = vm.hasIndividual;
            }
            // console.log("before waiting and displaying saved offline for field "+ index);
            if(Object.keys(new_task).length>0){
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
            localStorage.setItem(localStorageName,JSON.stringify(new_task));
            // console.log(localStorage.getItem(localStorageName));
          }
          taskfileds[index] = true;
        });
      }
      else if(index=="assignee"){
        $scope.$watch('vm.task.'+index, function (newValue, oldValue) {
          if(taskfileds[index]){
            if(proceedAssigneeAfterAutoCompleteInit){
              vm.showSavedOffline = false;
              vm.showSavingOffline = true;
              if( vm.task[index]==null || vm.task[index].length==0 ){
                delete new_task[index];
              }
              else{
                new_task[index] = vm.task[index];
              }
              // console.log("before waiting and displaying saved offline for field "+ index);
              if(Object.keys(new_task).length>0){
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
              localStorage.setItem(localStorageName,JSON.stringify(new_task));
              // console.log(localStorage.getItem(localStorageName));
            }
            proceedAssigneeAfterAutoCompleteInit = true;
          }
          taskfileds[index] = true;
        });
      }
      else{
        $scope.$watch('vm.task.'+index, function (newValue, oldValue) {
          if(taskfileds[index]){
            vm.showSavedOffline = false;
            vm.showSavingOffline = true;
            if( vm.task[index]==null || vm.task[index].length==0 ){
              delete new_task[index];
            }
            else{
              new_task[index] = vm.task[index];
            }
            // console.log("before waiting and displaying saved offline for field "+ index);
            if(Object.keys(new_task).length>0){
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
            localStorage.setItem(localStorageName,JSON.stringify(new_task));
            // console.log(localStorage.getItem(localStorageName));
          }
          taskfileds[index] = true;
        });
      }
    });

    function removeLocalStorageNewTask(){
      localStorage.removeItem(localStorageName);
      new_task = {};
      angular.forEach(taskfileds,function(value,index){
        taskfileds[index] = false;
        // console.log("clearing field "+index);
        vm.task[index] = undefined;
      });
      vm.showSavedOffline = false;
      vm.showSavingOffline = false;
    }


    function loadinitial() {
      vm.task.startDateTime = task ? getTimeToDisplay(new Date(task.startDateTime)) : getTimeToDisplay(new Date());
      vm.task.dueDateTime = task ? getTimeToDisplay(new Date(task.dueDateTime)) : getTimeToDisplay(new Date());
    };

    function getMatches(query) {
      var results = $filter('filter')(userResolve, {displayName:query});
      var deferred = $q.defer();
      $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
      return deferred.promise;
    };

    // Remove existing Task
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.task.$remove($state.go('tasks.list'));
      }
    }

    // Save Task
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.taskForm');
        return false;
      }

      if ($scope.ui.isTaskInProgress) {
        return;
      } else {
        $scope.ui.isTaskInProgress = true;
      }

      vm.task.createdBy = Authentication.user.displayName;
      vm.task.createdProfileImage = Authentication.user.profileImageURL;
      vm.task.createdID = Authentication.user._id;
      vm.task.startDateTime = $scope.eventTime.mStartToServer;
      vm.task.dueDateTime = $scope.eventTime.mEndToServer;
      vm.task.hasAssignee = true;
      vm.task.hasCommets = false;
      vm.task.hasStatus = false;

      var notification = new NotificationsService({
        notifyTo: [vm.task.assignee._id],
        user: Authentication.user,
        type: 'task',
        hasPopUped: false,
        isDismissed: false
      });

      if (vm.task._id) {
        if(!angular.equals($scope.model.original.assignee, vm.task.assignee._id)) {
          new NotificationsService({_id: vm.task.notificationId}).$remove();
        }
      }

      // TODO: move create/update logic to service
      if (vm.task._id) {
        if (!angular.equals($scope.model.original.assignee, vm.task.assignee._id)) {
          notification.$save().then(function(res) {
            vm.task.notificationId = res._id;
            vm.task.hasSendMail = true;
            vm.task.createdBy = $scope.model.original.createdBy;
            vm.task.$update(successCallback, errorCallback);
          });
        } else {
          vm.task.$update(successCallback, errorCallback);
        }
      } else {
        var filterTasksByCode = _.filter(taskResolve, function(filterTask) {
          return filterTask.projectCode === vm.task.projectCode && filterTask.orderCode === vm.task.orderCode && filterTask.stateCode === vm.task.stateCode && filterTask.workCode === vm.task.workCode;
        });
        if (filterTasksByCode.length > 0) {
          var taskIDs = _.map(filterTasksByCode, 'taskID');
          var latestTaskID = _.max(taskIDs);
          vm.task.taskID = latestTaskID + 1;
        } else {
          vm.task.taskID = 1;
        }
        notification.$save().then(function(res) {
          vm.task.notificationId = res._id;
          var comments = [{
            name: Authentication.user.displayName,
            comments: vm.task.comment,
            createdDate: new Date(),
            flag: 0,
          }];
          vm.task.projectType = vm.hasIndividual;
          if(vm.task.comment) {
            vm.task.comments = comments;
          } else {
            vm.task.comments = [];
          }
          vm.task.taskCode = vm.hasIndividual === '0' ? 'HEST-' + vm.task.taskID : _.upperCase(vm.task.projectCode) + _.upperCase(vm.task.orderCode) + _.upperCase(vm.task.stateCode) + _.upperCase(vm.task.workCode) + '-' + vm.task.taskID;
          vm.task.$save(successCallback, errorCallback);
        });
      }

      function successCallback(res) {
        var msg = editMode ? "Task updated successfully" : "Task created successfully"
        localStorage.removeItem(localStorageName);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
        });
        setTimeout(function() {
          $window.location.href= '/tasks';
        }, 1000);
      }

      function errorCallback(errorResponse) {
        $scope.ui.isTaskInProgress = false;
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Task error!'
        });
      }
    }

    $scope.showStartDatePicker = function(ev) {
      $mdpDatePicker($scope.eventTime.mStartClock, {
          targetEvent: ev
        })
        .then(function(dateTime) {
          $scope.eventTime.mStartClock = dateTime;
          vm.task.startDateTime = getTimeToDisplay(dateTime);
          $scope.eventTime.mStartToServer = getTimeToServer(dateTime);

          validateStartAndEndDate();
        });
    };

    $scope.showEndDatePicker = function(ev) {
      $mdpDatePicker($scope.eventTime.mEndClock, {
          targetEvent: ev
        })
        .then(function(dateTime) {
          $scope.eventTime.mEndClock = dateTime;
          vm.task.dueDateTime = getTimeToDisplay(dateTime);
          $scope.eventTime.mEndToServer = getTimeToServer(dateTime);

          validateStartAndEndDate();
        });
    };

    function validateStartAndEndDate() {
      if (vm.taskForm) {
        var bool = (Date.parse($scope.eventTime.mEndToServer) > Date.parse($scope.eventTime.mStartToServer));
        vm.taskForm.end.$setValidity('greater', bool);
        vm.taskForm.start.$setValidity('lesser', bool);
      }
    }

    function getTimeToDisplay(date) {
      return moment(date).format('YYYY:MM:DD');
    }

    function getTimeToServer(date) {
      var dt = new Date(date);
      var dtGMT = new Date((new Date(dt)).toUTCString()).toISOString();

      return dtGMT;
    }

    function cancel() {
      $mdDialog.cancel();
    };

  }
}());
