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

        return CommonService;

    }]);

}).call(this);

//# sourceMappingURL=PageCtrl.js.map