(function () {
  'use strict';

  angular
    .module('tenderprocesses')
    .controller('TenderprocessesListController', TenderprocessesListController);

  TenderprocessesListController.$inject = ['TenderprocessesService'];

  function TenderprocessesListController(TenderprocessesService) {
    var vm = this;

    vm.tenderprocesses = TenderprocessesService.query();
  }
}());
