// Tenderprocesses service used to communicate Tenderprocesses REST endpoints
(function () {
  'use strict';

  angular
    .module('tenderprocesses')
    .factory('TenderprocessesEmdService', TenderprocessesEmdService);

  TenderprocessesEmdService.$inject = ['$resource'];

  function TenderprocessesEmdService($resource) {
    return $resource('/api/tenderprocesses/emd/:emdId', {
      emdId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getAwaitingEmdForms: {
        method: 'POST',
        isArray: true,
        url: '/api/tenderprocesses/emd/awaitingemdforms'
      }
    });

    angular.extend(EmdProcess, {
      getEmdAwaitingList: function(emdevents) {
        return this.getAwaitingEmdForms(emdevents).$promise;
      }
    });
  }
}());
