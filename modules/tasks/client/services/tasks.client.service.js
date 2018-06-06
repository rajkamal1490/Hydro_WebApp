// Tasks service used to communicate Tasks REST endpoints
(function () {
  'use strict';

  angular
    .module('tasks')
    .factory('TasksService', TasksService);

  TasksService.$inject = ['$resource'];

  function TasksService($resource) {
    var Tasks = $resource('/api/tasks/:taskId', {
      taskId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getTaskByNotifcationID: {
        method: 'POST',
        isArray: false,
        url: '/api/tasks/filter/notification'
      }
    });

    angular.extend(Tasks, {
      getTaskByNotifcationIDFromNotificationClick: function (notifications) {
        return this.getTaskByNotifcationID(notifications).$promise;
      }
    });

    return Tasks;

  }
}());
