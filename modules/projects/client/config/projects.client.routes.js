(function () {
  'use strict';

  angular
    .module('projects')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', 'cacheManagerProvider'];

  function routeConfig($stateProvider, cacheManagerProvider) {
    $stateProvider
      .state('projects', {
        abstract: true,
        url: '/projects',
        template: '<ui-view/>'
      })
      .state('projects.list', {
        url: '',
        templateUrl: 'modules/projects/client/views/list-projects.client.view.html',
        controller: 'ProjectsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Projects List'
        },
        resolve: {
          projectResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(projectData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          userResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(cacheManagerProvider.usersResolve).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }]
        }
      })
      .state('projects.create', {
        url: '/create',
        templateUrl: 'modules/projects/client/views/form-project.client.view.html',
        controller: 'ProjectsController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: newProject
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Projects Create'
        }
      })
      .state('projects.edit', {
        url: '/:projectId/edit',
        templateUrl: 'modules/projects/client/views/form-project.client.view.html',
        controller: 'ProjectsController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: getProject
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Project {{ projectResolve.name }}'
        }
      })
      .state('projects.view', {
        url: '/:projectId',
        templateUrl: 'modules/projects/client/views/view-project.client.view.html',
        controller: 'ProjectsController',
        controllerAs: 'vm',
        resolve: {
          projectResolve: getProject
        },
        data: {
          pageTitle: 'Project {{ projectResolve.name }}'
        }
      });
  }

  getProject.$inject = ['$stateParams', 'ProjectsService'];

  function getProject($stateParams, ProjectsService) {
    return ProjectsService.get({
      projectId: $stateParams.projectId
    }).$promise;
  }

  newProject.$inject = ['ProjectsService'];

  function newProject(ProjectsService) {
    return new ProjectsService();
  }

  projectData.$inject = ['ProjectsService'];

  function projectData(ProjectsService) {
    return ProjectsService.query();
  }

}());
