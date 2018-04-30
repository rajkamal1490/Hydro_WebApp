// File managers service used to communicate File managers REST endpoints
(function () {
  'use strict';

  angular
    .module('file-managers')
    .factory('FolderManagersService', FolderManagersService);

  FolderManagersService.$inject = ['$resource'];

  function FolderManagersService($resource) {
    return $resource('api/folder-managers/:folderManagerId', {
      folderManagerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
