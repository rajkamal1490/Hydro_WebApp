(function () {
  'use strict';

  describe('Clearances Route Tests', function () {
    // Initialize global variables
    var $scope,
      ClearancesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ClearancesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ClearancesService = _ClearancesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('clearances');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/clearances');
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
          ClearancesController,
          mockClearance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('clearances.view');
          $templateCache.put('modules/clearances/client/views/view-clearance.client.view.html', '');

          // create mock Clearance
          mockClearance = new ClearancesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Clearance Name'
          });

          // Initialize Controller
          ClearancesController = $controller('ClearancesController as vm', {
            $scope: $scope,
            clearanceResolve: mockClearance
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:clearanceId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.clearanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            clearanceId: 1
          })).toEqual('/clearances/1');
        }));

        it('should attach an Clearance to the controller scope', function () {
          expect($scope.vm.clearance._id).toBe(mockClearance._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/clearances/client/views/view-clearance.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ClearancesController,
          mockClearance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('clearances.create');
          $templateCache.put('modules/clearances/client/views/form-clearance.client.view.html', '');

          // create mock Clearance
          mockClearance = new ClearancesService();

          // Initialize Controller
          ClearancesController = $controller('ClearancesController as vm', {
            $scope: $scope,
            clearanceResolve: mockClearance
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.clearanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/clearances/create');
        }));

        it('should attach an Clearance to the controller scope', function () {
          expect($scope.vm.clearance._id).toBe(mockClearance._id);
          expect($scope.vm.clearance._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/clearances/client/views/form-clearance.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ClearancesController,
          mockClearance;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('clearances.edit');
          $templateCache.put('modules/clearances/client/views/form-clearance.client.view.html', '');

          // create mock Clearance
          mockClearance = new ClearancesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Clearance Name'
          });

          // Initialize Controller
          ClearancesController = $controller('ClearancesController as vm', {
            $scope: $scope,
            clearanceResolve: mockClearance
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:clearanceId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.clearanceResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            clearanceId: 1
          })).toEqual('/clearances/1/edit');
        }));

        it('should attach an Clearance to the controller scope', function () {
          expect($scope.vm.clearance._id).toBe(mockClearance._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/clearances/client/views/form-clearance.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
