(function () {
  'use strict';

  angular
    .module('core.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider', '$urlRouterProvider', 'cacheManagerProvider'];

  function routeConfig($stateProvider, $urlRouterProvider, cacheManagerProvider) {
    $urlRouterProvider.rule(function ($injector, $location) {
      var path = $location.path();
      var hasTrailingSlash = path.length > 1 && path[path.length - 1] === '/';

      if (hasTrailingSlash) {
        // if last character is a slash, return the same url without the slash
        var newPath = path.substr(0, path.length - 1);
        $location.replace().path(newPath);
      }
    });

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/modules/core/client/views/home.client.view.html',
        controller: 'HomeController',
        controllerAs: 'vm',
        resolve: {
          taskResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(taskData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          userResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(cacheManagerProvider.usersResolve).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          statusResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(statusData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }]
        },
      })
      .state('my-calendar', {
        url: '/my-calendar',
        templateUrl: '/modules/reminders/client/views/my-calendar.client.view.html',
        controller: 'MyCalendarController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'My Calendar List'
        },
        resolve: {
          reminderResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(reminderData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }]
        },
      })
      .state('all-my-notifications', {
        url: '/all-my-notifications',
        templateUrl: '/modules/meetings/client/views/all-my-notification.client.view.html',
        controller: 'AllMyNotificationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'All my notifications'
        }
      })
      .state('not-found', {
        url: '/not-found',
        templateUrl: '/modules/core/client/views/404.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function ($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true
        }
      })
      .state('bad-request', {
        url: '/bad-request',
        templateUrl: '/modules/core/client/views/400.client.view.html',
        controller: 'ErrorController',
        controllerAs: 'vm',
        params: {
          message: function ($stateParams) {
            return $stateParams.message;
          }
        },
        data: {
          ignoreState: true
        }
      })
      .state('forbidden', {
        url: '/forbidden',
        templateUrl: '/modules/core/client/views/403.client.view.html',
        data: {
          ignoreState: true
        }
      });
  }

  taskData.$inject = ['TasksService'];

  function taskData(TasksService) {
    return TasksService.query();
  }

  reminderData.$inject = ['RemindersService'];

  function reminderData(RemindersService) {
    return RemindersService.query();
  }

  statusData.$inject = ['StatusesService'];

  function statusData(StatusesService) {
    return StatusesService.query();
  }

}());
