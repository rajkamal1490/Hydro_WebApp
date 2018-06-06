// File managers service used to communicate File managers REST endpoints
(function () {
  'use strict';

  angular
    .module('file-managers')
    .factory('FileManagersService', FileManagersService);

  FileManagersService.$inject = ['$resource'];

  function FileManagersService($resource) {
    return $resource('/api/file-managers/:fileManagerId', {
      fileManagerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
