// Tenderprocesses service used to communicate Tenderprocesses REST endpoints
(function () {
  'use strict';

  angular
    .module('tenderprocesses')
    .factory('TenderprocessesService', TenderprocessesService);

  TenderprocessesService.$inject = ['$resource'];

  function TenderprocessesService($resource) {
    return $resource('api/tenderprocesses/:tenderprocessId', {
      tenderprocessId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
