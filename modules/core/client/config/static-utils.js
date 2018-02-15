(function() {
    'use strict';
    angular
        .module('core.constant', [])
        .constant('CALENDAR_CHANGE_VIEW', ['agendaDay', 'agendaWeek', 'month'])
        .constant('USER_GROUPS', [{
            name: "Executive",
            code: "executive"
        }, {
            name: "Vice President",
            code: "vp"
        }, {
            name: "Manager",
            code: "manager"
        }, {
            name: "Team Lead",
            code: "tl"
        }, {
            name: "Staff",
            code: "staff"
        }])
        .constant('PRIORITIES', [{
            name: "Major",
            code: "major"
        }, {
            name: "Minor",
            code: "minor"
        }, {
            name: "Critical",
            code: "critical"
        }])
        .constant('TASK_STATUSES', [{
            name: "Pending",
            code: "pending"
        }, {
            name: "In Progress",
            code: "inprogress"
        }, {
            name: "Completed",
            code: "completed"
        }, {
            name: "Reopened",
            code: "reopened"
        }])
        .constant('CHART_BACKGROUND_COLOR', ["rgba(54, 173, 199,0.9)",
            "rgba(201, 98, 95,0.9)",
            "rgba(255, 200, 112,0.9)",
            "rgba(100, 200, 112,0.9)"
        ])
        .constant('CHART_HOVER_BACKGROUND_COLOR', ["rgba(54, 173, 199,1)",
            "rgba(201, 98, 95,1)",
            "rgba(255, 200, 112,1)",
            "rgba(100, 200, 112,1)"
        ])
        .constant('ATTENDANCE', 'attendance')
        .constant('PERMISSION', 'permission')
        .constant('LEAVE', 'leave')
        .constant('PROFILE_MAX_SIZE', 2097152)
        .constant('PROGRESS_BAR_TIMEOUT_VALUE', 200)
        .constant('PROGRESS_BAR_MAX_ACTUAL_VALUE', 100)
        .constant('PROGRESS_BAR_MAX_TEMPORARY_VALUE', 90)
        .constant('PROGRESS_BAR_INCREMENT_VALUE', 10)
}).call(this);