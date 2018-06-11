(function () {
  'use strict';

  angular
    .module('tasks')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tasks', {
        abstract: true,
        url: '/tasks',
        template: '<ui-view/>'
      })
      .state('tasks.list', {
        url: '',
        templateUrl: '/modules/tasks/client/views/list-tasks.client.view.html',
        controller: 'TasksListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Tasks List'
        },
        resolve: {
          taskResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(taskData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          userResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(userData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          refCodeResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(refCodeData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          projectResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(projectData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          statusResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(statusData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }]
        },
      })
      .state('tasks.create', {
        url: '/create',
        templateUrl: '/modules/tasks/client/views/form-task.client.view.html',
        controller: 'TasksController',
        controllerAs: 'vm',
        resolve: {
          task: function() {
            return undefined;
          },
          editMode: function() {
            return false;
          },
          taskResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(taskData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          userResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(userData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          refCodes: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(refCodeData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          projects: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(projectData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }]
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Create New Task'
        }
      })
      .state('tasks.edit', {
        url: '/:taskId/edit',
        templateUrl: '/modules/tasks/client/views/form-task.client.view.html',
        controller: 'TasksController',
        controllerAs: 'vm',
        resolve: {
          taskResolve: getTask
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Task {{ taskResolve.name }}'
        }
      })
      .state('tasks.view', {
        url: '/:taskId',
        templateUrl: '/modules/tasks/client/views/view-task.client.view.html',
        controller: 'TasksEditController',
        controllerAs: 'vm',
        resolve: {
          taskResolve: getTask,
          userResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(userData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          statusResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(statusData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          projectResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(projectData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
        },
        data: {
          pageTitle: 'Task {{ taskResolve.name }}'
        }
      });
  }

  getTask.$inject = ['$stateParams', 'TasksService'];

  function getTask($stateParams, TasksService) {
    return TasksService.get({
      taskId: $stateParams.taskId
    }).$promise;
  }

  newTask.$inject = ['TasksService'];

  function newTask(TasksService) {
    return new TasksService();
  }

  taskData.$inject = ['TasksService'];

  function taskData(TasksService) {
    return TasksService.query();
  }

  userData.$inject = ['AdminService'];

  function userData(AdminService) {
    return AdminService.query();
  }

  refCodeData.$inject = ['RefcodetasksService'];

  function refCodeData(RefcodetasksService) {
    return RefcodetasksService.query();
  }

  projectData.$inject = ['ProjectsService'];

  function projectData(ProjectsService) {
    return ProjectsService.query();
  }

  statusData.$inject = ['StatusesService'];

  function statusData(StatusesService) {
    return StatusesService.query();
  }


}());
