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
        }, {
            name: "Admin",
            code: "admin"
        }])
        .constant('COLORS', [{
            name: 'Black',
            code: '#000000'
        }, {
            name: 'Blue',
            code: '#0000FF'
        }, {
            name: 'Brown',
            code: '#A52A2A'
        }, {
            name: 'Gold',
            code: '#FFD700'
        }, {
            name: 'Gray',
            code: '#999999'
        }, {
            name: 'Green',
            code: '#4caf50'
        }, {
            name: 'Lime',
            code: '#00FF00'
        }, {
            name: 'Orange',
            code: '#ff9800'
        }, {
            name: 'Pink',
            code: '#e91e63'
        }, {
            name: 'Purple',
            code: '#800080'
        }, {
            name: 'Red',
            code: '#f44336'
        }, {
            name: 'Silver',
            code: '#C0C0C0'
        }, {
            name: 'Violet',
            code: '#EE82EE'
        }, {
            name: 'White',
            code: '#FFFFFF'
        }, {
            name: 'Yellow',
            code: '#FFFF00'
        }, {
            name: 'Azure',
            code: '#00bcd4'
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
            "rgba(100, 200, 112,0.9)",
            "rgba(100, 200, 112,0.9)"
        ])
        .constant('CHART_HOVER_BACKGROUND_COLOR', ["rgba(54, 173, 199,1)",
            "rgba(201, 98, 95,1)",
            "rgba(255, 200, 112,1)",
            "rgba(100, 200, 112,1)",
            "rgba(100, 200, 112,1)"
        ])
        .constant('TENDER_TYPES', [{
            name: "Supply",
            code: "supply"
        }])
        .constant('TENDER_ITEMS', [{
            name: "Starters",
            code: "starters"
        }])
        .constant('ATTENDANCE', 'attendance')
        .constant('PERMISSION', 'permission')
        .constant('LEAVE', 'leave')
        .constant('REMINDER', 'reminder')
        .constant('MEETING', 'meeting')
        .constant('PROFILE_MAX_SIZE', 5242880)
        .constant('PROGRESS_BAR_TIMEOUT_VALUE', 200)
        .constant('PROGRESS_BAR_MAX_ACTUAL_VALUE', 100)
        .constant('PROGRESS_BAR_MAX_TEMPORARY_VALUE', 90)
        .constant('PROGRESS_BAR_INCREMENT_VALUE', 10)
        .constant('VALID_IMAGE_TYPES', ['png', 'jpg', 'jpeg'])
        .constant('DEFAULT_ROWS_DISPLAYED_COUNT', 20)
}).call(this);