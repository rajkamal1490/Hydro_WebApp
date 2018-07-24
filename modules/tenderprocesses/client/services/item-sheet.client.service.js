// Tenderprocesses service used to communicate Tenderprocesses REST endpoints
(function () {
  'use strict';

  angular
    .module('tenderprocesses')
    .factory('TenderprocessesItemSheetService', TenderprocessesItemSheetService);

  TenderprocessesItemSheetService.$inject = ['$resource'];

  function TenderprocessesItemSheetService($resource) {
    return $resource('/api/tenderprocesses/itemsheet/:itemSheetId', {
      itemSheetId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
