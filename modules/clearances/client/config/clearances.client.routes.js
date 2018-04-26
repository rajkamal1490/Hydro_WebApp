(function () {
  'use strict';

  angular
    .module('clearances')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('clearances', {
        abstract: true,
        url: '/clearances',
        template: '<ui-view/>'
      })
      .state('clearances.list', {
        url: '',
        templateUrl: 'modules/clearances/client/views/list-clearances.client.view.html',
        controller: 'ClearancesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Clearances List'
        },
        resolve: {
          clearanceResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(clearanceData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }]
        }
      })
      .state('clearances.create', {
        url: '/create',
        templateUrl: 'modules/clearances/client/views/form-clearance.client.view.html',
        controller: 'ClearancesController',
        controllerAs: 'vm',
        resolve: {
          clearanceResolve: newClearance
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Clearances Create'
        }
      })
      .state('clearances.edit', {
        url: '/:clearanceId/edit',
        templateUrl: 'modules/clearances/client/views/form-clearance.client.view.html',
        controller: 'ClearancesController',
        controllerAs: 'vm',
        resolve: {
          clearanceResolve: getClearance
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Clearance {{ clearanceResolve.name }}'
        }
      })
      .state('clearances.view', {
        url: '/:clearanceId',
        templateUrl: 'modules/clearances/client/views/view-clearance.client.view.html',
        controller: 'ClearancesController',
        controllerAs: 'vm',
        resolve: {
          clearanceResolve: getClearance
        },
        data: {
          pageTitle: 'Clearance {{ clearanceResolve.name }}'
        }
      });
  }

  getClearance.$inject = ['$stateParams', 'ClearancesService'];

  function getClearance($stateParams, ClearancesService) {
    return ClearancesService.get({
      clearanceId: $stateParams.clearanceId
    }).$promise;
  }

  newClearance.$inject = ['ClearancesService'];

  function newClearance(ClearancesService) {
    return new ClearancesService();
  }

  clearanceData.$inject = ['ClearancesService'];

  function clearanceData(ClearancesService) {
    return ClearancesService.query();
  }

  
}());
