// Refcodetasks service used to communicate Refcodetasks REST endpoints
(function () {
  'use strict';

  angular
    .module('refcodetasks')
    .factory('RefcodetasksService', RefcodetasksService);

  RefcodetasksService.$inject = ['$resource'];

  function RefcodetasksService($resource) {
    return $resource('/api/refcodetasks/:refcodetaskId', {
      refcodetaskId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
