(function() {
  'use strict';

  angular
    .module('reminders')
    .factory('TodayReminderService', TodayReminderService);

  TodayReminderService.$inject = ['$resource'];

  function TodayReminderService($resource) {
    var TodayReminder = $resource('/api/todayreminders/', { reminderId: '@_id' }, {
      update: {
        method: 'PUT'
      },
      getTodayRemindersByUser: {
        method: 'POST',
        isArray: true,
        url: '/api/todayreminders/getreminders'
      },
    });

    angular.extend(TodayReminder, {
      requestFindTodayRemindersByUser: function(content) {
        return this.getTodayRemindersByUser(content).$promise;
      }
    });

    return TodayReminder;
  }

}());