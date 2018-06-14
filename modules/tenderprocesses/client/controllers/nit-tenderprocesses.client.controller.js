(function() {
  'use strict';

  // Customers controller
  angular
    .module('tenderprocesses')
    .controller('TenderprocessesNitController', TenderprocessesNitController);

  TenderprocessesNitController.$inject = ['nitResolve', 'nitprocessesResolve', 'tenderprocessesResolve', 'hasCreateNit', 'hasApproval', '$scope', '$state', 'Authentication', '$mdpDatePicker', 'NotificationsService', 'Notification', 'PROFILE_MAX_SIZE', 'TenderprocessesNitService', 'TENDER_TYPES', 'TENDER_ITEMS', 'Upload', '$mdDialog'];

  function TenderprocessesNitController(nitResolve, nitprocessesResolve, tenderprocessesResolve, hasCreateNit, hasApproval, $scope, $state, Authentication, $mdpDatePicker, NotificationsService, Notification, PROFILE_MAX_SIZE, TenderprocessesNitService, TENDER_TYPES, TENDER_ITEMS, Upload, $mdDialog) {
    var vm = this;
    vm.authentication = Authentication;
    vm.nitprocess = new TenderprocessesNitService(nitResolve);
    vm.nitTenderProcesses = nitprocessesResolve;
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.tendertypes = TENDER_TYPES;
    vm.tenderitems = TENDER_ITEMS;
    vm.loadinitial = loadinitial;
    vm.hasCreateNit = hasCreateNit;
    vm.nitDocName = nitResolve ? nitResolve.filename : undefined;
    vm.redirectNitForm = redirectNitForm;
    vm.tenderprocessesResolve = tenderprocessesResolve;
    vm.hasApproval = hasApproval;

    $scope.eventTime = {
      mEndClock: nitResolve ? new Date(nitResolve.dueDateTime) : new Date(),
      mEndToServer: nitResolve ? getTimeToServer(new Date(nitResolve.dueDateTime)) : getTimeToServer(new Date())
    };

    $scope.ui = {
      isNitInProgress: false,
    };

    function loadinitial() {
      vm.nitprocess.dueDateTime = nitResolve ? getTimeToDisplay(new Date(nitResolve.dueDateTime)) : getTimeToDisplay(new Date());
    };

    // Save Nit
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.nitForm');
        return false;
      }
      if (vm.nitDocName === undefined) {
        if (vm.picFile === undefined) {
          Notification.error({
            message: 'Nit document missing'
          });
          return
        } else if (vm.picFile.size > PROFILE_MAX_SIZE) {
          Notification.error({
            message: 'An attachments file size cannot exceed 5MB'
          });
          return
        };
      }


      if ($scope.ui.isNitInProgress) {
        return;
      } else {
        $scope.ui.isNitInProgress = true;
      }

      vm.nitprocess.dueDateTime = $scope.eventTime.mEndToServer;
      // TODO: move create/update logic to service
      if (vm.nitprocess._id) {
        if (hasApproval) {
          vm.nitprocess.offerNo = generateUUID();
        }
        vm.nitprocess.$update(successCallback, errorCallback);
      } else {
        vm.nitprocess.name = 'NIT' + (nitprocessesResolve.length === undefined ? 1 : nitprocessesResolve.length + 1);
        vm.nitprocess.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        if (vm.nitDocName === undefined) {
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
        url: '/api/tenderprocesses/nit/upload/' + res._id,
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
        var message = "You applied " + vm.nitprocess.name + " has been approved";
        var notification = new NotificationsService({
          notifyTo: [vm.nitprocess.user._id],
          user: Authentication.user._id,
          type: 'nitapprovalinfo',
          meetingScheduleDate: new Date(),
          hasPopUped: false,
          isDismissed: false,
          message: message
        });
        notification.$save();
      }
      var msg = vm.hasApproval ? "Nit form approved successfully" : "Nit Form created/updated successfully";
      $scope.ui.isNitInProgress = false;
      Notification.success({
        message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
      });
      redirectNitForm();
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      $scope.ui.isNitInProgress = false;
      Notification.error({
        message: response,
        title: '<i class="glyphicon glyphicon-remove"></i> Nit Form error!'
      });
    }

    $scope.showEndDatePicker = function(ev) {
      $mdpDatePicker($scope.eventTime.mEndClock, {
          targetEvent: ev
        })
        .then(function(dateTime) {
          $scope.eventTime.mEndClock = dateTime;
          vm.nitprocess.dueDateTime = getTimeToDisplay(dateTime);
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

    function generateUUID() {
      return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    $scope.openCommentsDialog = function(hasNeedInfo) {
      $mdDialog.show({
        controller: 'TenderNitCommentsController',
        controllerAs: 'vm',
        templateUrl: '/modules/tenderprocesses/client/views/nit-comments.client.view.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false,
        fullscreen: true,
        resolve: {
          hasNeedInfo: function() {
            return hasNeedInfo;
          },
          nitResolve: function() {
            return nitResolve;
          }
        }
      }).then(function(createdItem) {
        redirectNitForm();
      }, function() {
        console.log('You cancelled the dialog.');
      });

    };

    function redirectNitForm() {
      vm.hasCreateNit = false;
      $state.go('tenderprocesses.nit', { reload: true });
      if (nitResolve === undefined) {
        location.reload();
      }
    }
  }
}());
