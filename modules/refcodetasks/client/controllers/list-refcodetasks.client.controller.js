(function () {
  'use strict';

  angular
    .module('refcodetasks')
    .controller('RefcodetasksListController', RefcodetasksListController);

  RefcodetasksListController.$inject = ['RefcodetasksService'];

  function RefcodetasksListController(RefcodetasksService) {
    var vm = this;

    vm.refcodetasks = RefcodetasksService.query();
  }
}());
