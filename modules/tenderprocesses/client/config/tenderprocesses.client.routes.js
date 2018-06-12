(function () {
  'use strict';

  angular
    .module('tenderprocesses')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tenderprocesses', {
        abstract: true,
        url: '/tenderprocesses',
        template: '<ui-view/>'
      })
      .state('tenderprocesses.list', {
        url: '',
        templateUrl: 'modules/tenderprocesses/client/views/list-tenderprocesses.client.view.html',
        controller: 'TenderprocessesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tenderprocesses List'
        }
      })
      .state('tenderprocesses.create', {
        url: '/create',
        templateUrl: 'modules/tenderprocesses/client/views/form-tenderprocess.client.view.html',
        controller: 'TenderprocessesController',
        controllerAs: 'vm',
        resolve: {
          tenderprocessResolve: newTenderprocess
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Tenderprocesses Create'
        }
      })
      .state('tenderprocesses.edit', {
        url: '/:tenderprocessId/edit',
        templateUrl: 'modules/tenderprocesses/client/views/form-tenderprocess.client.view.html',
        controller: 'TenderprocessesController',
        controllerAs: 'vm',
        resolve: {
          tenderprocessResolve: getTenderprocess
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Tenderprocess {{ tenderprocessResolve.name }}'
        }
      })
      .state('tenderprocesses.view', {
        url: '/:tenderprocessId',
        templateUrl: 'modules/tenderprocesses/client/views/view-tenderprocess.client.view.html',
        controller: 'TenderprocessesController',
        controllerAs: 'vm',
        resolve: {
          tenderprocessResolve: getTenderprocess
        },
        data: {
          pageTitle: 'Tenderprocess {{ tenderprocessResolve.name }}'
        }
      });
  }

  getTenderprocess.$inject = ['$stateParams', 'TenderprocessesService'];

  function getTenderprocess($stateParams, TenderprocessesService) {
    return TenderprocessesService.get({
      tenderprocessId: $stateParams.tenderprocessId
    }).$promise;
  }

  newTenderprocess.$inject = ['TenderprocessesService'];

  function newTenderprocess(TenderprocessesService) {
    return new TenderprocessesService();
  }
}());
