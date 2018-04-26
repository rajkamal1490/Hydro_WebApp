(function () {
  'use strict';

  angular
    .module('clearances')
    .controller('ClearancesListController', ClearancesListController);

  ClearancesListController.$inject = ['ClearancesService'];

  function ClearancesListController(ClearancesService) {
    var vm = this;

    vm.clearances = ClearancesService.query();
  }
}());
