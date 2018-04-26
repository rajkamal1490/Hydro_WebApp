(function () {
  'use strict';

  angular
    .module('refcodetasks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('refcodetasks', {
        abstract: true,
        url: '/refcodetasks',
        template: '<ui-view/>'
      })
      .state('refcodetasks.list', {
        url: '',
        templateUrl: 'modules/refcodetasks/client/views/list-refcodetasks.client.view.html',
        controller: 'RefcodetasksListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Refcodetasks List'
        },
        resolve: {
          refcodetasksResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(refcodetasksData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }]
        }
      })
      .state('refcodetasks.create', {
        url: '/create',
        templateUrl: 'modules/refcodetasks/client/views/form-refcodetask.client.view.html',
        controller: 'RefcodetasksController',
        controllerAs: 'vm',
        resolve: {
          refcodetaskResolve: newRefcodetask
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Refcodetasks Create'
        }
      })
      .state('refcodetasks.edit', {
        url: '/:refcodetaskId/edit',
        templateUrl: 'modules/refcodetasks/client/views/form-refcodetask.client.view.html',
        controller: 'RefcodetasksController',
        controllerAs: 'vm',
        resolve: {
          refcodetaskResolve: getRefcodetask
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Refcodetask {{ refcodetaskResolve.name }}'
        }
      })
      .state('refcodetasks.view', {
        url: '/:refcodetaskId',
        templateUrl: 'modules/refcodetasks/client/views/view-refcodetask.client.view.html',
        controller: 'RefcodetasksController',
        controllerAs: 'vm',
        resolve: {
          refcodetaskResolve: getRefcodetask
        },
        data: {
          pageTitle: 'Refcodetask {{ refcodetaskResolve.name }}'
        }
      });
  }

  getRefcodetask.$inject = ['$stateParams', 'RefcodetasksService'];

  function getRefcodetask($stateParams, RefcodetasksService) {
    return RefcodetasksService.get({
      refcodetaskId: $stateParams.refcodetaskId
    }).$promise;
  }

  newRefcodetask.$inject = ['RefcodetasksService'];

  function newRefcodetask(RefcodetasksService) {
    return new RefcodetasksService();
  }

  refcodetasksData.$inject = ['RefcodetasksService'];

  function refcodetasksData(RefcodetasksService) {
    return RefcodetasksService.query();
  }

}());
