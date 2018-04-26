(function() {
  'use strict';

  // Refcodetasks controller
  angular
    .module('refcodetasks')
    .controller('RefcodetasksController', RefcodetasksController);

  RefcodetasksController.$inject = ['$scope', '$state', '$window', 'Authentication', '$mdDialog', 'refcodetask', 'RefcodetasksService', 'editMode', 'Notification'];

  function RefcodetasksController($scope, $state, $window, Authentication, $mdDialog, refcodetask, RefcodetasksService, editMode, Notification) {
    var vm = this;

    vm.authentication = Authentication;
    vm.refcodetask = new RefcodetasksService(refcodetask);
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.cancel = cancel;
    vm.date = new Date();
    vm.orders = refcodetask ? refcodetask.orderCodes : [];
    vm.states = refcodetask ? refcodetask.stateCodes : [];
    vm.works = refcodetask ? refcodetask.workCodes : [];

    $scope.ui = {
      isRefcodetaskInProgress: false,
      editMode: editMode
    };

    $scope.unconfirmedOrdercode = {     
      orderCode: undefined
    };

    $scope.unconfirmedStatecode = { 
      stateCode: undefined
    };

    $scope.unconfirmedWorkcode = { 
      workCode: undefined
    };

    // Save refcodetask
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.refcodetaskForm');
        return false;
      }
      $scope.addOrderCode();
      $scope.addStateCode();
      $scope.addWorkCode(); 

      vm.refcodetask.orderCodes = vm.orders;
      vm.refcodetask.stateCodes = vm.states;
      vm.refcodetask.workCodes = vm.works;

      // TODO: move create/update logic to service
      if (vm.refcodetask._id) {
        vm.refcodetask.$update(successCallback, errorCallback);
      } else {
        vm.refcodetask.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        var msg = editMode ? "Reference Code updated successfully" : "Reference Code created successfully"
        $mdDialog.hide(res);
        Notification.success({
          message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
        });
      }

      function errorCallback(errorResponse) {
        $scope.ui.isRefcodetaskInProgress = false;
        Notification.error({
          message: errorResponse.data.message,
          title: '<i class="glyphicon glyphicon-remove"></i> Reference Code error!'
        });
      }
    }

    function cancel() {
      $mdDialog.cancel();
    };

    // Ref Code
    $scope.isEditOrderCode = function(order) {
      order.isEditOrderCode = true;
    }

    $scope.addIsEditOrderCode = function(order) {
      order.isEditOrderCode = false;
    };

    $scope.removeOrderCode = function(index) {
      vm.orders.splice(index, 1);
    };

    $scope.addOrderCode = function() {
      if ($scope.unconfirmedOrdercode.orderCode) {
        vm.orders.push($scope.unconfirmedOrdercode);
        clearUnconfirmedRefCode();
      }
    };

    // State Code
    $scope.isEditStateCode = function(state) {
      state.isEditStateCode = true;
    }

    $scope.addIsEditStateCode = function(state) {
      state.isEditStateCode = false;
    };

    $scope.removeStateCode = function(index) {
      vm.states.splice(index, 1);
    };

    $scope.addStateCode = function() {
      if ($scope.unconfirmedStatecode.stateCode) {
        vm.states.push($scope.unconfirmedStatecode);
        clearUnconfirmedStateCode();
      }
    };

    // Work Code
    $scope.isEditWorkCode = function(work) {
      work.isEditWorkCode = true;
    }

    $scope.addIsEditWorkCode = function(work) {
      work.isEditWorkCode = false;
    };

    $scope.removeWorkCode = function(index) {
      vm.works.splice(index, 1);
    };

    $scope.addWorkCode = function() {
      if ($scope.unconfirmedWorkcode.workCode) {
        vm.works.push($scope.unconfirmedWorkcode);
        clearUnconfirmedWorkCode();
      }
    };


    function clearUnconfirmedRefCode() {
      $scope.unconfirmedOrdercode = {
        orderCode: undefined
      };
    }

    function clearUnconfirmedStateCode() {
      $scope.unconfirmedStatecode = {
        stateCode: undefined
      };
    }

    function clearUnconfirmedWorkCode() {
      $scope.unconfirmedWorkcode = {
        workCode: undefined
      };
    }
  }

}());