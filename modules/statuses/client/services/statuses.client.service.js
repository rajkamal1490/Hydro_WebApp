// Statuses service used to communicate Statuses REST endpoints
(function () {
  'use strict';

  angular
    .module('statuses')
    .factory('StatusesService', StatusesService);

  StatusesService.$inject = ['$resource'];

  function StatusesService($resource) {
    return $resource('/api/statuses/:statusId', {
      statusId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
