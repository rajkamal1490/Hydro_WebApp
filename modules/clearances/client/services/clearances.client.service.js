// Clearances service used to communicate Clearances REST endpoints
(function () {
  'use strict';

  angular
    .module('clearances')
    .factory('ClearancesService', ClearancesService);

  ClearancesService.$inject = ['$resource'];

  function ClearancesService($resource) {
    return $resource('/api/clearances/:clearanceId', {
      clearanceId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
