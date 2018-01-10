(function () {
  'use strict';

  angular
    .module('files')
    .controller('FilesListController', FilesListController);

  FilesListController.$inject = ['FilesService'];

  function FilesListController(FilesService) {
    var vm = this;

    vm.files = FilesService.query();
  }
}());
