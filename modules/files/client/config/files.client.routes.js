(function () {
  'use strict';

  angular
    .module('files')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('files', {
        abstract: true,
        url: '/files',
        template: '<ui-view/>'
      })
      .state('files.list', {
        url: '',
        templateUrl: 'modules/files/client/views/list-files.client.view.html',
        controller: 'FilesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Files List'
        }
      })
      .state('files.create', {
        url: '/create',
        templateUrl: 'modules/files/client/views/form-file.client.view.html',
        controller: 'FilesController',
        controllerAs: 'vm',
        resolve: {
          fileResolve: newFile
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Files Create'
        }
      })
      .state('files.edit', {
        url: '/:fileId/edit',
        templateUrl: 'modules/files/client/views/form-file.client.view.html',
        controller: 'FilesController',
        controllerAs: 'vm',
        resolve: {
          fileResolve: getFile
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit File {{ fileResolve.name }}'
        }
      })
      .state('files.view', {
        url: '/:fileId',
        templateUrl: 'modules/files/client/views/view-file.client.view.html',
        controller: 'FilesController',
        controllerAs: 'vm',
        resolve: {
          fileResolve: getFile
        },
        data: {
          pageTitle: 'File {{ fileResolve.name }}'
        }
      });
  }

  getFile.$inject = ['$stateParams', 'FilesService'];

  function getFile($stateParams, FilesService) {
    return FilesService.get({
      fileId: $stateParams.fileId
    }).$promise;
  }

  newFile.$inject = ['FilesService'];

  function newFile(FilesService) {
    return new FilesService();
  }
}());
