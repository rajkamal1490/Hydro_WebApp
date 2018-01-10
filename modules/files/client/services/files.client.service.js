// Files service used to communicate Files REST endpoints
(function () {
  'use strict';

  angular
    .module('files')
    .factory('FilesService', FilesService);

  FilesService.$inject = ['$resource'];

  function FilesService($resource) {
    return $resource('api/files/:fileId', {
      fileId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
