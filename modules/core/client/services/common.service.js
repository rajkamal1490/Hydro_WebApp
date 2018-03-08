(function() {
    'use strict';
    angular.module('core')

    .factory('CommonService', ['$http', 'USER_GROUPS', function($http, USER_GROUPS) {

        var CommonService = {};

        CommonService.getIsAllowToClick = false;

        CommonService.getAttendanceId = undefined;

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

        CommonService.setIsAllowToClick = function(isAllow) {
            CommonService.getIsAllowToClick = isAllow;
        };

         CommonService.setAttendanceId = function(id) {
            CommonService.getAttendanceId = id;
        };

        CommonService.sleep = function(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds) {
                    break;
                }
            }
        }

        return CommonService;

    }]);

}).call(this);

//# sourceMappingURL=PageCtrl.js.map