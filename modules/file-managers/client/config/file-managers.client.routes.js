(function () {
  'use strict';

  angular
    .module('file-managers')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('file-managers', {
        abstract: true,
        url: '/file-managers',
        template: '<ui-view/>'
      })
      .state('file-managers.list', {
        url: '',
        templateUrl: 'modules/file-managers/client/views/list-file-managers.client.view.html',
        controller: 'FileManagersListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'File managers List'
        },
        resolve: {
          fileManagerResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(fileManagerData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          MinutesOfMeetingResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(minutesOfMeetingData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }]
        },
      })
      .state('file-managers.create', {
        url: '/create',
        templateUrl: 'modules/file-managers/client/views/form-file-manager.client.view.html',
        controller: 'FileManagersController',
        controllerAs: 'vm',
        resolve: {
          fileManagerResolve: newFileManager
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'File managers Create'
        }
      })
      .state('file-managers.edit', {
        url: '/:fileManagerId/edit',
        templateUrl: 'modules/file-managers/client/views/form-file-manager.client.view.html',
        controller: 'FileManagersController',
        controllerAs: 'vm',
        resolve: {
          fileManagerResolve: getFileManager
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit File manager {{ file-managerResolve.name }}'
        }
      })
      .state('file-managers.view', {
        url: '/:fileManagerId',
        templateUrl: 'modules/file-managers/client/views/view-file-manager.client.view.html',
        controller: 'FileManagersController',
        controllerAs: 'vm',
        resolve: {
          fileManagerResolve: getFileManager
        },
        data: {
          pageTitle: 'File manager {{ file-managerResolve.name }}'
        }
      });
  }

  getFileManager.$inject = ['$stateParams', 'FileManagersService'];

  function getFileManager($stateParams, FileManagersService) {
    return FileManagersService.get({
      fileManagerId: $stateParams.fileManagerId
    }).$promise;
  }

  newFileManager.$inject = ['FileManagersService'];

  function newFileManager(FileManagersService) {
    return new FileManagersService();
  }

  fileManagerData.$inject = ['FileManagersService'];

  function fileManagerData(FileManagersService) {
    return FileManagersService.query();
  }

  minutesOfMeetingData.$inject = ['StartMeetingsService'];

  function minutesOfMeetingData(StartMeetingsService) {
    return StartMeetingsService.query();
  }


}());
