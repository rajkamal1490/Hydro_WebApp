(function() {
  'use strict';

  // Customers controller
  angular
    .module('tenderprocesses')
    .controller('TenderprocessesItemSheetController', TenderprocessesItemSheetController);

  TenderprocessesItemSheetController.$inject = ['CommonService', 'itemSheetResolve', 'itemSheetsResolve', 'hasCreatedItemSheet', '$scope', '$state', '$mdDialog', 'Authentication', 'Notification', 'TenderprocessesItemSheetService'];

  function TenderprocessesItemSheetController(CommonService, itemSheetResolve, itemSheetsResolve, hasCreatedItemSheet, $scope, $state, $mdDialog, Authentication, Notification, TenderprocessesItemSheetService) {
    var vm = this;
    vm.authentication = Authentication;
    vm.itemsheetprocess = new TenderprocessesItemSheetService(itemSheetResolve);
    vm.error = null;
    vm.form = {};
    vm.save = save;
    vm.remove = remove;
    vm.hasCreatedItemSheet = hasCreatedItemSheet;
    vm.redirectItemSheet = redirectItemSheet;
    vm.itemSheets = itemSheetsResolve;
    vm.edit = edit;

    $scope.ui = {
      isItemSheetInProgress: false,
    };

    // Save Emd
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.itemSheetForm');
        return false;
      }


      if ($scope.ui.isItemSheetInProgress) {
        return;
      } else {
        $scope.ui.isItemSheetInProgress = true;
      }
      // TODO: move create/update logic to service
      if (vm.itemsheetprocess._id) {
        vm.itemsheetprocess.$update(successCallback, errorCallback);
      } else {
        vm.itemsheetprocess.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        onSuccessItem(res.data);
      }

      function errorCallback(errorResponse) {
        onErrorItem(errorResponse.data);
      }
    }
    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      var msg = "Item Sheet created/updated successfully";
      $scope.ui.isItemSheetInProgress = false;
      Notification.success({
        message: '<i class="glyphicon glyphicon-ok"></i> ' + msg
      });
      redirectItemSheet();
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      $scope.ui.isItemSheetInProgress = false;
      Notification.error({
        message: response,
        title: '<i class="glyphicon glyphicon-remove"></i> ItemSheet error!'
      });
    }

    function remove(itemSheet, index) {
      var confirm = $mdDialog.confirm().title('Do you want to delete the Item Sheet?').textContent('Item Sheet detail will be deleted permanently.').ok('Yes').cancel('No').multiple(true);
      $mdDialog.show(confirm).then(function() {
          itemSheet.$remove(deleteSuccessCallback, deleteErrorCallback);

          function deleteSuccessCallback(res) {
            var itemSheetIndex = CommonService.findIndexByID(vm.itemSheets, itemSheet._id);
            vm.itemSheets.splice(itemSheetIndex, 1);
            Notification.success({
              message: '<i class="glyphicon glyphicon-ok"></i>' + itemSheet.name + ' deleted successfully'
            });
          }

          function deleteErrorCallback(res) {
            Notification.error({
              message: res.data.message,
              title: '<i class="glyphicon glyphicon-remove"></i> Delete Item Sheet Error'
            });
          }
        },
        function() {
          console.log('no');
        });
    };

    function edit(itemSheet) {
      $state.go('tenderprocesses.itemsheetedit', {
        itemSheetId: itemSheet._id
      });
    }

    function redirectItemSheet() {
      vm.hasCreatedItemSheet = false;
      $state.go('tenderprocesses.itemsheet', { reload: true });
      if (itemSheetResolve === undefined) {
        location.reload();
      }
    }
  }
}());
