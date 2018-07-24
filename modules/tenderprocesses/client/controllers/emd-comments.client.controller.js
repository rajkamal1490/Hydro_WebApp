(function() {
  'use strict';

  // Tenderprocesses controller
  angular
    .module('tenderprocesses')
    .controller('TenderEmdCommentsController', TenderEmdCommentsController);

  TenderEmdCommentsController.$inject = ['$scope', '$state', '$window', '$mdDialog', 'Authentication', 'hasNeedInfo', 'emdResolve', 'Notification', 'NotificationsService', 'TenderprocessesEmdService'];

  function TenderEmdCommentsController($scope, $state, $window, $mdDialog, Authentication, hasNeedInfo, emdResolve, Notification, NotificationsService, TenderprocessesEmdService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.emdprocess = new TenderprocessesEmdService(emdResolve);
    vm.save = save;
    vm.hasNeedInfo = hasNeedInfo;
    vm.comments = [];
    vm.cancel = cancel;

    $scope.unconfirmedComments = {
      comment: undefined
    };

    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.nitCommentForm');
        return false;
      };
      $scope.addComment();
      vm.emdprocess.comments = vm.comments;
      vm.emdprocess.hasApproved = hasNeedInfo ? 2 : 3;
      vm.emdprocess.$update(successCallback, errorCallback);

      function successCallback(res) {
        var message = hasNeedInfo ? "You applied " + vm.emdprocess.name + " need more info" : "You applied " + vm.emdprocess.name + " has been rejected";
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
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> Added comments successfully'
        });
        $mdDialog.hide(res);
      }

      function errorCallback(errorResponse) {
        Notification.error({
          message: errorResponse.data,
          title: '<i class="glyphicon glyphicon-remove"></i> Nit comment form error!'
        });
      }
    };

    $scope.isEdit = function(comment) {
      comment.isEdit = true;
    }

    $scope.removeComment = function(index) {
      vm.comments.splice(index, 1);
    };

    $scope.addComment = function() {
      if ($scope.unconfirmedComments.comment) {
        vm.comments.push($scope.unconfirmedComments);
        clearUnconfirmed();
      }
    };

    function clearUnconfirmed() {
      $scope.unconfirmedComments = {
        comment: undefined
      };
    }

    function cancel() {
      $mdDialog.cancel();
    };


  }
}());
