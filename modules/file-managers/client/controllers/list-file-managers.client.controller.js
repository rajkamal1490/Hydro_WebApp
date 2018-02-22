(function () {
  'use strict';

  angular
    .module('file-managers')
    .controller('FileManagersListController', FileManagersListController);

  FileManagersListController.$inject = ['FileManagersService'];

  function FileManagersListController(FileManagersService) {
    var vm = this;

    vm.fileManagers = FileManagersService.query();
  }
}());
