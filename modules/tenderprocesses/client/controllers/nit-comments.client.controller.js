(function() {
  'use strict';

  // Tenderprocesses controller
  angular
    .module('tenderprocesses')
    .controller('TenderNitCommentsController', TenderNitCommentsController);

  TenderNitCommentsController.$inject = ['$scope', '$state', '$window', '$mdDialog', 'Authentication', 'hasNeedInfo', 'nitResolve', 'Notification', 'NotificationsService', 'TenderprocessesNitService'];

  function TenderNitCommentsController($scope, $state, $window, $mdDialog, Authentication, hasNeedInfo, nitResolve, Notification, NotificationsService, TenderprocessesNitService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.nitprocess = new TenderprocessesNitService(nitResolve);
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
      vm.nitprocess.comments = vm.comments;
      vm.nitprocess.hasApproved = hasNeedInfo ? 2 : 3;
      vm.nitprocess.$update(successCallback, errorCallback);

      function successCallback(res) {
        var message = hasNeedInfo ? "You applied " + vm.nitprocess.name + " need more info" : "You applied " + vm.nitprocess.name + " has been rejected";
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
