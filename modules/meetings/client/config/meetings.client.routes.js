(function () {
  'use strict';

  angular
    .module('meetings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('meetings', {
        abstract: true,
        url: '/meetings',
        template: '<ui-view/>'
      })
      .state('meetings.list', {
        url: '',
        templateUrl: '/modules/meetings/client/views/list-meetings.client.view.html',
        controller: 'MeetingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Meetings List'
        },
        resolve: {
          meetingResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(bookedEventData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          userResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(userData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }]
        },
      })
      .state('meetings.create', {
        url: '/:meetingId/create',
        templateUrl: '/modules/meetings/client/views/form-meeting.client.view.html',
        controller: 'MeetingsController',
        controllerAs: 'vm',
        resolve: {
          selectedDate: ['$stateParams', function($stateParams) {
            return $stateParams.meetingId;
          }],
          selectedEvent: function() {
            return null;
          },
          viewMode: function() {
            return false;
          },
          userResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(userData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }]
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Meetings Create'
        }
      })
      .state('meetings.edit', {
        url: '/:meetingId/edit',
        templateUrl: '/modules/meetings/client/views/form-meeting.client.view.html',
        controller: 'MeetingsController',
        controllerAs: 'vm',
        resolve: {
          selectedEvent: getMeeting,
          selectedDate: function() {
            return undefined;
          },
          viewMode: function() {
            return true;
          },
          userResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(userData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }]
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Meeting {{ selectedEvent.name }}'
        }
      })
      .state('meetings.show', {
        url: '/:meetingId/show',
        templateUrl: '/modules/meetings/client/views/view-meeting.client.view.html',
        controller: 'ShowMeetingsController',
        controllerAs: 'vm',
        resolve: {
          meetingResolve: getMeeting
        },
        data: {
          pageTitle: '{{ meetingResolve.title }}'
        }
      })
      .state('meetings.view', {
        url: '/:meetingId/view',
        templateUrl: '/modules/meetings/client/views/start-meeting.client.view.html',
        controller: 'StartMeetingsController',
        controllerAs: 'vm',
        resolve: {
          selectedEvent: getMeeting,
          selectedDate: function() {
            return undefined;
          },
          meetingStartTime: function() {
            return new Date();;
          },
          userResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(userData).$promise;   // cached, otherwise we would have called IncidentNoteTitle.query().
          }]
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Meeting {{ selectedEvent.name }}'
        }
      });
  }

  getMeeting.$inject = ['$stateParams', 'MeetingsService'];

  function getMeeting($stateParams, MeetingsService) {
    return MeetingsService.get({
      meetingId: $stateParams.meetingId
    }).$promise;
  }

  newMeeting.$inject = ['MeetingsService'];

  function newMeeting(MeetingsService) {
    return new MeetingsService();
  }

  bookedEventData.$inject = ['MeetingsService'];

  function bookedEventData(MeetingsService) {
    return MeetingsService.query();
  }

  userData.$inject = ['AdminService'];

  function userData(AdminService) {
    return AdminService.query();
  }

}());
