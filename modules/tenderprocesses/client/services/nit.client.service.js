// Tenderprocesses service used to communicate Tenderprocesses REST endpoints
(function() {
  'use strict';

  angular
    .module('tenderprocesses')
    .factory('TenderprocessesNitService', TenderprocessesNitService);

  TenderprocessesNitService.$inject = ['$resource'];

  function TenderprocessesNitService($resource) {
    var NitProcess = $resource('/api/tenderprocesses/nit/:nitId', {
      nitId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getAwaitingNitForms: {
        method: 'POST',
        isArray: true,
        url: '/api/tenderprocesses/nit/awaitingnitforms'
      }
    });

    angular.extend(NitProcess, {
      getNitAwaitingList: function(nitevents) {
        return this.getAwaitingNitForms(nitevents).$promise;
      }
    });

    return NitProcess;
  }
}());