(function() {
  'use strict';

  // Tenderprocesses controller
  angular
    .module('tenderprocesses')
    .controller('TenderprocessesController', TenderprocessesController);

  TenderprocessesController.$inject = ['$scope', '$state', '$window', 'Authentication'];

  function TenderprocessesController($scope, $state, $window, Authentication) {
    var vm = this;

    vm.authentication = Authentication;
    vm.loadinitial = loadinitial;
    vm.myTabIndex = 0;

    function loadinitial() {
        switch (window.location.pathname.split("/").pop()) {
          case 'nit':
            vm.myTabIndex = 1;
            break;
          case 'checklist':
            vm.myTabIndex = 2;
            break;
          case 'emd':
            vm.myTabIndex = 3;
            break;
          case 'itemsheet':
            vm.myTabIndex = 4;
            break;
          case 'boq':
            vm.myTabIndex = 5;
            break;
          case 'enquiry':
            vm.myTabIndex = 6;
            break;
          case 'quoteform':
            vm.myTabIndex = 7;
            break;
          case 'estimation':
            vm.myTabIndex = 8;
            break;
          default:
            vm.myTabIndex = 0;
            break;
        }
    }


  }
}());
