(function() {
  'use strict';

  // Reminders controller
  angular
    .module('reminders')
    .controller('RemindersController', RemindersController);

  RemindersController.$inject = ['$scope', '$state', '$window', 'Authentication', '$mdDialog', 'reminder', 'RemindersService', 'editMode', 'Notification'];

  function RemindersController($scope, $state, $window, Authentication, $mdDialog, reminder, RemindersService, editMode, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.reminder = new RemindersService(reminder);
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.cancel = cancel;
    vm.date = new Date();
    vm.loadinitial = loadinitial;

    $scope.ui = {
      isReminderInProgress: false,
      editMode: editMode
    };

    function loadinitial() {
      vm.reminder.reminderDateTime = reminder ? getTimeToDisplay(new Date(reminder.reminderDateTime)) : getTimeToDisplay(new Date());      
    }

    // Save Reminder
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.reminderForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.reminder._id) {
        vm.reminder.$update(successCallback, errorCallback);
      } else {
        vm.reminder.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var msg = editMode ? "Reminder updated successfully" : "Reminder created successfully"
        $mdDialog.hide(res);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
        });
      }

      function errorCallback(errorResponse) {
        $scope.ui.isReminderInProgress = false;
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Reminder error!'
        });
      }
    }

    function getTimeToDisplay(date) {
      return moment(date).format('YYYY:MM:DD hh:mm:ss');
    }

    function cancel() {
      $mdDialog.cancel();
    };

  }
}());