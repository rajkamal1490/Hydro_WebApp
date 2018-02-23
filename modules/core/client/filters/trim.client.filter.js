(function() {
	'use strict';

	angular.module('core')


		.constant('ELLIPSIS', '\u2026')
		.constant('PATTERN_SPACES', /^\s*$/)
		.constant('PATTERN_LINE_BREAK', /\r\n|\n|\r/gm)

		/**
		 * Trims a text based on the passed-in length limit, and then adds '...' to the text.
		 */
		.filter('trim', ['ELLIPSIS', 'limitToFilter', 'PATTERN_LINE_BREAK', function(ELLIPSIS, limitToFilter, PATTERN_LINE_BREAK) {
			return function(text, limit, middle) {
				if (text == null || text.length <= limit) {
					return text;
				}
				if (middle) {
					var halfLength = (limit - 1) / 2;
					var head = text.substring(0, Math.ceil(halfLength));
					var tail = text.substring(text.length - Math.floor(halfLength, text.length));
					return head + ELLIPSIS + tail;
				} else {
					return limitToFilter(text.replace(PATTERN_LINE_BREAK, ' '), limit - 3) + ELLIPSIS;
				}
			};
		}]);

}());