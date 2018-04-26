(function () {
  'use strict';

  angular
    .module('statuses')
    .controller('StatusesListController', StatusesListController);

  StatusesListController.$inject = ['StatusesService'];

  function StatusesListController(StatusesService) {
    var vm = this;

    vm.statuses = StatusesService.query();
  }
}());
