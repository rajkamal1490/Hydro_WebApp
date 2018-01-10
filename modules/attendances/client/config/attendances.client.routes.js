(function () {
  'use strict';

  angular
    .module('attendances')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('attendances', {
        abstract: true,
        url: '/attendances',
        template: '<ui-view/>'
      })
      .state('attendances.list', {
        url: '',
        templateUrl: 'modules/attendances/client/views/list-attendances.client.view.html',
        controller: 'AttendancesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Attendances List'
        }
      })
      .state('attendances.create', {
        url: '/create',
        templateUrl: 'modules/attendances/client/views/form-attendance.client.view.html',
        controller: 'AttendancesController',
        controllerAs: 'vm',
        resolve: {
          attendanceResolve: newAttendance
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Attendances Create'
        }
      })
      .state('attendances.edit', {
        url: '/:attendanceId/edit',
        templateUrl: 'modules/attendances/client/views/form-attendance.client.view.html',
        controller: 'AttendancesController',
        controllerAs: 'vm',
        resolve: {
          attendanceResolve: getAttendance
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Attendance {{ attendanceResolve.name }}'
        }
      })
      .state('attendances.view', {
        url: '/:attendanceId',
        templateUrl: 'modules/attendances/client/views/view-attendance.client.view.html',
        controller: 'AttendancesController',
        controllerAs: 'vm',
        resolve: {
          attendanceResolve: getAttendance
        },
        data: {
          pageTitle: 'Attendance {{ attendanceResolve.name }}'
        }
      });
  }

  getAttendance.$inject = ['$stateParams', 'AttendancesService'];

  function getAttendance($stateParams, AttendancesService) {
    return AttendancesService.get({
      attendanceId: $stateParams.attendanceId
    }).$promise;
  }

  newAttendance.$inject = ['AttendancesService'];

  function newAttendance(AttendancesService) {
    return new AttendancesService();
  }
}());
