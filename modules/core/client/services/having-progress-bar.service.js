(function() {
    'use strict';
    angular.module('core')

    .factory('havingProgressBar', ['PROGRESS_BAR_INCREMENT_VALUE', 'PROGRESS_BAR_MAX_ACTUAL_VALUE', 'PROGRESS_BAR_MAX_TEMPORARY_VALUE', 'PROGRESS_BAR_TIMEOUT_VALUE', '$timeout', 
        function(PROGRESS_BAR_INCREMENT_VALUE, PROGRESS_BAR_MAX_ACTUAL_VALUE, PROGRESS_BAR_MAX_TEMPORARY_VALUE, PROGRESS_BAR_TIMEOUT_VALUE, $timeout) {

        var havingProgressBar = {

            progress: undefined,
            timeoutIds: [],

            start: function() {
                havingProgressBar.progress = 0;
                havingProgressBar.timeoutIds = [];
                havingProgressBar.timeoutIds.unshift($timeout(havingProgressBar.update, PROGRESS_BAR_TIMEOUT_VALUE));
            },

            update: function() {
                if (havingProgressBar.progress < PROGRESS_BAR_MAX_TEMPORARY_VALUE) {    // this progress bar is "fake" really, and so stop at 90% so that the user is not confused.
                    havingProgressBar.progress += PROGRESS_BAR_INCREMENT_VALUE;
                }
                havingProgressBar.timeoutIds.unshift($timeout(havingProgressBar.update, PROGRESS_BAR_TIMEOUT_VALUE));
            },

            complete: function() {
                havingProgressBar.progress = PROGRESS_BAR_MAX_ACTUAL_VALUE;
                angular.forEach(havingProgressBar.timeoutIds, function(timeoutId) {
                    $timeout.cancel(timeoutId);
                });
            },

            reset: function() {
                havingProgressBar.progress = undefined;
                havingProgressBar.timeoutIds = [];
            },
            
        };

        return havingProgressBar;

    }]);

}).call(this);

//# sourceMappingURL=PageCtrl.js.map