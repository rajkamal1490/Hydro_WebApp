'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.css',
        'public/lib/angular-material/angular-material.css',
        'public/lib/angular-bootstrap/ui-bootstrap-csp.css',
        'public/css/mdPickers.css',
        'public/lib/perfect-scrollbar/css/perfect-scrollbar.min.css',
        'public/lib/sweetalert/dist/sweetalert.css',
        'public/lib/ng-cropper/dist/ngCropper.all.min.css',
        'public/css/material-datepicker.css',
        'public/assets/global/plugins/input-text/style.min.css'
        // endbower
      ],
      js: [
        // bower:js        
        'public/lib/angular/angular.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-aria/angular-aria.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/ng-file-upload/ng-file-upload.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-material/angular-material.js',
        'public/lib/angular-cookies/angular-cookies.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/assets/global/plugins/jquery/jquery-3.1.0.min.js',
        'public/assets/global/plugins/jquery/jquery-migrate-3.0.0.min.js',
        'public/assets/global/plugins/jquery-ui/jquery-ui.min.js',
        // 'public/assets/global/plugins/gsap/main-gsap.min.js',
        'public/lib/ng-cropper/dist/ngCropper.all.js',
        'public/lib/ng-cropper/dist/ngCropper.js',

        'public/assets/global/plugins/tether/js/tether.min.js',
        'public/assets/global/plugins/bootstrap/js/bootstrap.min.js',
        'public/assets/global/plugins/appear/jquery.appear.js',
        'public/assets/global/plugins/jquery-cookies/jquery.cookies.min.js',

        'public/assets/global/plugins/jquery-block-ui/jquery.blockUI.min.js',
        'public/assets/global/plugins/bootbox/bootbox.min.js',
        'public/assets/global/plugins/mcustom-scrollbar/jquery.mCustomScrollbar.concat.min.js',
        'public/assets/global/plugins/bootstrap-dropdown/bootstrap-hover-dropdown.min.js',
        'public/assets/global/js/pages/form_icheck.js',
        'public/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',

        'public/assets/global/plugins/charts-sparkline/sparkline.min.js',
        'public/assets/global/plugins/retina/retina.min.js',
        'public/assets/global/plugins/select2/dist/js/select2.full.min.js',
        'public/assets/global/plugins/icheck/icheck.min.js',

        'public/assets/global/plugins/backstretch/backstretch.min.js',
        'public/assets/global/plugins/bootstrap-progressbar/bootstrap-progressbar.min.js',
        // 'public/assets/global/js/builder.js',
        // 'public/assets/global/js/sidebar_hover.js',

        'public/assets/global/plugins/bootstrap-loading/lada.min.js',
        'public/assets/global/js/pages/login-v1.js',
        // 'public/assets/global/plugins/bootstrap-progressbar/bootstrap-progressbar.min.js',
        // 'public/assets/global/js/builder.js',
        // 'public/assets/global/js/sidebar_hover.js',

        'public/assets/global/js/application.js',
        'public/assets/global/js/plugins.js',
        'public/assets/global/js/widgets/notes.js',
        'public/assets/global/js/quickview.js',

        'public/assets/global/js/pages/search.js',
        'public/assets/global/plugins/metrojs/metrojs.min.js',
        'public/assets/global/plugins/noty/jquery.noty.packaged.min.js',
        'public/assets/global/plugins/bootstrap-editable/js/bootstrap-editable.min.js',

        'public/assets/global/plugins/bootstrap-context-menu/bootstrap-contextmenu.min.js',
        'public/assets/global/plugins/multidatepicker/multidatespicker.min.js',
        'public/assets/global/plugins/charts-chartjs/Chart.min.js',
        'public/assets/global/plugins/charts-highstock/js/highstock.js',

        'public/assets/global/plugins/charts-highstock/js/modules/exporting.js',
        'public/assets/global/plugins/maps-amcharts/ammap/ammap.js',
        'public/assets/global/plugins/maps-amcharts/ammap/maps/js/worldLow.js',
        'public/assets/global/plugins/maps-amcharts/ammap/themes/black.js',

        'public/assets/global/plugins/skycons/skycons.min.js',
        'public/assets/global/plugins/simple-weather/jquery.simpleWeather.js',
        'public/assets/global/js/widgets/todo_list.js',
        'public/assets/global/js/widgets/widget_weather.js',
        
        'public/assets/global/plugins/fullcalendar/lib/moment.min.js',
        'public/assets/global/plugins/fullcalendar/fullcalendar.min.js',
        'public/assets/admin/layout1/js/layout.js',
        'public/assets/admin/md-layout1/material-design/js/material.js',
        'public/assets/global/plugins/bootstrap/js/jasny-bootstrap.min.js',        
        'public/lib/lodash/lodash.js',
        // 'public/lib/moment/min/moment.min.js',
        // 'public/lib/angular-ui-calendar/src/calendar.js',
        // 'public/lib/fullcalendar/dist/fullcalendar.min.js',
        // 'public/lib/fullcalendar/dist/gcal.js',
        // 'public/lib/chart.js/dist/Chart.min.js',
        // 'public/lib/angular-chart.js/dist/angular-chart.min.js',
        'public/js/mdPickers.js',
        // 'public/lib/perfect-scrollbar/js/perfect-scrollbar.jquery.min.js',
        // 'public/lib/angular-perfect-scrollbar/src/angular-perfect-scrollbar.js',
        // 'public/lib/sweetalert/dist/sweetalert.min.js',
        // 'public/js/material-datepicker.min.js',
        'public/lib/ngstorage/ngStorage.min.js',
        'public/lib/md-collection-pagination/dist/md-collection-pagination.min.js',
        'public/lib/json-export-excel/dest/json-export-excel.min.js',
        'public/lib/file-saver/FileSaver.min.js'
        // endbower
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/{css,less,scss}/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    img: [
      'modules/**/*/img/**/*.jpg',
      'modules/**/*/img/**/*.png',
      'modules/**/*/img/**/*.gif',
      'modules/**/*/img/**/*.svg'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gulpConfig: ['gulpfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: ['modules/*/server/config/*.js'],
    policies: 'modules/*/server/policies/*.js',
    views: ['modules/*/server/views/*.html']
  }
};
