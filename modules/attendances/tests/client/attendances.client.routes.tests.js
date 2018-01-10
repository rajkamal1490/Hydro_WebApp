(function () {
  'use strict';

  describe('Attendances Route Tests', function () {
    // Initialize global variables
    var $scope,
      AttendancesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _AttendancesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      AttendancesService = _AttendancesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('attendances');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/attendances');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          AttendancesController,
          mockAttendance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('attendances.view');
          $templateCache.put('modules/attendances/client/views/view-attendance.client.view.html', '');

          // create mock Attendance
          mockAttendance = new AttendancesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Attendance Name'
          });

          // Initialize Controller
          AttendancesController = $controller('AttendancesController as vm', {
            $scope: $scope,
            attendanceResolve: mockAttendance
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:attendanceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.attendanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            attendanceId: 1
          })).toEqual('/attendances/1');
        }));

        it('should attach an Attendance to the controller scope', function () {
          expect($scope.vm.attendance._id).toBe(mockAttendance._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/attendances/client/views/view-attendance.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          AttendancesController,
          mockAttendance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('attendances.create');
          $templateCache.put('modules/attendances/client/views/form-attendance.client.view.html', '');

          // create mock Attendance
          mockAttendance = new AttendancesService();

          // Initialize Controller
          AttendancesController = $controller('AttendancesController as vm', {
            $scope: $scope,
            attendanceResolve: mockAttendance
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.attendanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/attendances/create');
        }));

        it('should attach an Attendance to the controller scope', function () {
          expect($scope.vm.attendance._id).toBe(mockAttendance._id);
          expect($scope.vm.attendance._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/attendances/client/views/form-attendance.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          AttendancesController,
          mockAttendance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('attendances.edit');
          $templateCache.put('modules/attendances/client/views/form-attendance.client.view.html', '');

          // create mock Attendance
          mockAttendance = new AttendancesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Attendance Name'
          });

          // Initialize Controller
          AttendancesController = $controller('AttendancesController as vm', {
            $scope: $scope,
            attendanceResolve: mockAttendance
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:attendanceId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.attendanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            attendanceId: 1
          })).toEqual('/attendances/1/edit');
        }));

        it('should attach an Attendance to the controller scope', function () {
          expect($scope.vm.attendance._id).toBe(mockAttendance._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/attendances/client/views/form-attendance.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
