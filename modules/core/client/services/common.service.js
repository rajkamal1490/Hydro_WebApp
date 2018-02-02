(function() {
    'use strict';
    angular.module('core')

    .factory('CommonService', ['$http', 'USER_GROUPS', function($http, USER_GROUPS) {

        var CommonService = {};       

        CommonService.hasExecutive = function(authentication) {
            return authentication.user ? _.includes(authentication.user.userGroup, USER_GROUPS[0].code) : false;
        };

        CommonService.hasVp = function(authentication) {
            return authentication.user ? _.includes(authentication.user.userGroup, USER_GROUPS[1].code) : false;
        };

        CommonService.hasManager = function(authentication) {
            return authentication.user ? _.includes(authentication.user.userGroup, USER_GROUPS[2].code) : false;
        };

        CommonService.hasTl = function(authentication) {
            return authentication.user ? _.includes(authentication.user.userGroup, USER_GROUPS[3].code) : false;
        };

        CommonService.hasStaff = function(authentication) {
            return authentication.user ? _.includes(authentication.user.userGroup, USER_GROUPS[4].code) : false;
        };

        CommonService.findIndexByID = function(array, id) {
            return _.findIndex(array, function(o) {
                return o._id == id;
            });
        };

        CommonService.getArrayValue = function(array, key) {
            return _.find(array, ['code', key]).name;
        };

        CommonService.getName = function(json_array, user_id) {
            var jsonArray = _.filter(json_array, function(array) {
                return array._id === user_id;
            });
            return jsonArray[0];
        };

        CommonService.getStatusCountFromTasks = function(tasks, status) {
            var statusFromTask = _.filter(tasks, function(task) {
                return task.status === status;
            });

            return statusFromTask.length;
        };

        CommonService.buildArrayToFindTodayCheckIn = function(userId) {
            var checkIn = {
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                date: new Date().getDate(),
                userId: userId
            };

            return checkIn;
        };

        return CommonService;

    }]);

}).call(this);

//# sourceMappingURL=PageCtrl.js.map