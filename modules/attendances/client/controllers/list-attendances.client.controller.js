(function () {
  'use strict';

  angular
    .module('attendances')
    .controller('AttendancesListController', AttendancesListController);

  AttendancesListController.$inject = ['AttendancesService'];

  function AttendancesListController(AttendancesService) {
    var vm = this;

    vm.attendances = AttendancesService.query();
  }
}());
