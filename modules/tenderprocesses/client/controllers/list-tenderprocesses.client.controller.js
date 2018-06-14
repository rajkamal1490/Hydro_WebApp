(function() {
  'use strict';

  // Customers controller
  angular
    .module('tenderprocesses')
    .controller('TenderprocessesListController', TenderprocessesListController);

  TenderprocessesListController.$inject = ['tenderResolve', 'tenderprocessesResolve', 'hasCreateTender', '$scope', '$state', 'Authentication', '$mdpDatePicker', 'Notification', 'TenderprocessesService'];

  function TenderprocessesListController(tenderResolve, tenderprocessesResolve, hasCreateTender, $scope, $state, Authentication, $mdpDatePicker, Notification, TenderprocessesService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.tenderprocess = new TenderprocessesService(tenderResolve);
    vm.tenderprocesses = tenderprocessesResolve;
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.loadinitial = loadinitial;
    vm.hasCreateTender = hasCreateTender;
    vm.redirectNitForm = redirectNitForm;

    $scope.eventTime = {
      mEndClock: tenderResolve ? new Date(tenderResolve.dueDateTime) : new Date(),
      mEndToServer: tenderResolve ? getTimeToServer(new Date(tenderResolve.dueDateTime)) : getTimeToServer(new Date())
    };

    $scope.ui = {
      isTenderInProgress: false,
    };

    function loadinitial() {
      vm.tenderprocess.dueDateTime = tenderResolve ? getTimeToDisplay(new Date(tenderResolve.dueDateTime)) : getTimeToDisplay(new Date());
    };

    // Save Nit
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tenderForm');
        return false;
      }
      if ($scope.ui.isTenderInProgress) {
        return;
      } else {
        $scope.ui.isTenderInProgress = true;
      }

      vm.tenderprocess.dueDateTime = $scope.eventTime.mEndToServer;

      // TODO: move create/update logic to service
      if (vm.tenderprocess._id) {
        vm.tenderprocess.$update(successCallback, errorCallback);
      } else {
        vm.tenderprocess.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var msg = "Tender created/updated successfully";
        $scope.ui.isTenderInProgress = false;
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
        });
        redirectNitForm();
      }

      function errorCallback(errorResponse) {
        $scope.ui.isTenderInProgress = false;
        Notification.error({
          message: response.data,
          title: '<i class="glyphicon glyphicon-remove"></i> Nit Form error!'
        });
      }
    }

    $scope.showEndDatePicker = function(ev) {
      $mdpDatePicker($scope.eventTime.mEndClock, {
          targetEvent: ev
        })
        .then(function(dateTime) {
          $scope.eventTime.mEndClock = dateTime;
          vm.tenderprocess.dueDateTime = getTimeToDisplay(dateTime);
          $scope.eventTime.mEndToServer = getTimeToServer(dateTime);
        });
    };

    function getTimeToDisplay(date) {
      return moment(date).format('YYYY:MM:DD');
    };

    function getTimeToServer(date) {
      var dt = new Date(date);
      var dtGMT = new Date((new Date(dt)).toUTCString()).toISOString();

      return dtGMT;
    };

    function redirectNitForm() {
      vm.hasCreateTender = false;
      $state.go('tenderprocesses.list', { reload: true });
      if (tenderResolve === undefined) {
         location.reload();
      }
    }
  }
}());
