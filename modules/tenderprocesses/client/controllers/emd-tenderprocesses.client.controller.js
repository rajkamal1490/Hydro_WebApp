(function() {
  'use strict';

  // Customers controller
  angular
    .module('tenderprocesses')
    .controller('TenderprocessesEmdController', TenderprocessesEmdController);

  TenderprocessesEmdController.$inject = ['emdResolve', 'emdprocessesResolve', 'hasApproval', 'hasCreateEmd', '$scope', '$state', 'Authentication', '$mdpDatePicker', '$mdDialog', 'NotificationsService', 'Notification', 'PROFILE_MAX_SIZE', 'TenderprocessesEmdService', 'Upload'];

  function TenderprocessesEmdController(emdResolve, emdprocessesResolve, hasApproval, hasCreateEmd, $scope, $state, Authentication, $mdpDatePicker, $mdDialog, NotificationsService, Notification, PROFILE_MAX_SIZE, TenderprocessesEmdService, Upload) {
    var vm = this;
    vm.authentication = Authentication;
    vm.emdprocess = new TenderprocessesEmdService(emdResolve);
    vm.emdTenderProcesses = emdprocessesResolve;
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.loadinitial = loadinitial;
    vm.hasCreateEmd = hasCreateEmd;
    vm.emdDocName = emdResolve ? emdResolve.filename : undefined;
    vm.redirectEmdForm = redirectEmdForm;
    vm.hasApproval = hasApproval;

    $scope.eventTime = {
      mEndClock: emdResolve ? new Date(emdResolve.dueDateTime) : new Date(),
      mEndToServer: emdResolve ? getTimeToServer(new Date(emdResolve.dueDateTime)) : getTimeToServer(new Date())
    };

    $scope.ui = {
      isEmdInProgress: false,
    };

    function loadinitial() {
      vm.emdprocess.dueDateTime = emdResolve ? getTimeToDisplay(new Date(emdResolve.dueDateTime)) : getTimeToDisplay(new Date());
    };

    // Save Emd
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.emdForm');
        return false;
      }
      if (vm.emdDocName === undefined) {
        if (vm.picFile === undefined) {
          Notification.error({
            message: 'Emd document missing'
          });
          return;
        } else if (vm.picFile.size > PROFILE_MAX_SIZE) {
          Notification.error({
            message: 'An attachments file size cannot exceed 5MB'
          });
          return;
        };
      }


      if ($scope.ui.isEmdInProgress) {
        return;
      } else {
        $scope.ui.isEmdInProgress = true;
      }

      vm.emdprocess.dueDateTime = $scope.eventTime.mEndToServer;
      // TODO: move create/update logic to service
      if (vm.emdprocess._id) {
        vm.emdprocess.$update(successCallback, errorCallback);
      } else {
        vm.emdprocess.name = 'EMD' + (emdprocessesResolve.length === undefined ? 1 : emdprocessesResolve.length + 1);
        vm.emdprocess.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        if (vm.emdDocName === undefined) {
          uploadFile(res);
        } else {
          onSuccessItem(res.data);
        }
      }

      function errorCallback(errorResponse) {
        onErrorItem(errorResponse.data);
      }
    }

    function uploadFile(res) {
      Upload.upload({
        url: '/api/tenderprocesses/emd/upload/' + res._id,
        data: {
          newProfilePicture: vm.picFile
        }
      }).then(function(response) {
        onSuccessItem(response.data);
      }, function(response) {
        if (response.status > 0) onErrorItem(response.data);
      });
    }

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      if (vm.hasApproval) {
        var message = "You applied " + vm.emdprocess.name + " has been approved";
        var notification = new NotificationsService({
          notifyTo: [vm.emdprocess.user._id],
          user: Authentication.user._id,
          type: 'emdapprovalinfo',
          meetingScheduleDate: new Date(),
          hasPopUped: false,
          isDismissed: false,
          message: message
        });
        notification.$save();
      }
      var msg = vm.hasApproval ? "Emd form approved successfully" : "Emd Form created/updated successfully";
      $scope.ui.isEmdInProgress = false;
      Notification.success({
        message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
      });      
      redirectEmdForm();
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      $scope.ui.isEmdInProgress = false;
      Notification.error({
        message: response,
        title: '<i class="glyphicon glyphicon-remove"></i> Emd Form error!'
      });
    }

    $scope.showEndDatePicker = function(ev) {
      $mdpDatePicker($scope.eventTime.mEndClock, {
          targetEvent: ev
        })
        .then(function(dateTime) {
          $scope.eventTime.mEndClock = dateTime;
          vm.emdprocess.dueDateTime = getTimeToDisplay(dateTime);
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

     $scope.openCommentsDialog = function(hasNeedInfo) {
      $mdDialog.show({
        controller: 'TenderEmdCommentsController',
        controllerAs: 'vm',
        templateUrl: '/modules/tenderprocesses/client/views/emd-comments.client.view.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: true,
        resolve: {
          hasNeedInfo: function() {
            return hasNeedInfo;
          },
          emdResolve: function() {
            return emdResolve;
          }
        }
      }).then(function(createdItem) {
        redirectEmdForm();
      }, function() {
        console.log('You cancelled the dialog.');
      });

    };

    function redirectEmdForm() {
      vm.hasCreateEmd = false;
      $state.go('tenderprocesses.emd', {reload: true});
      if (emdResolve === undefined) {
        location.reload();
      }
    }
  }
}());
