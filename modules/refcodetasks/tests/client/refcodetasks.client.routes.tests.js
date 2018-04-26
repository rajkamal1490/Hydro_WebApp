(function () {
  'use strict';

  describe('Refcodetasks Route Tests', function () {
    // Initialize global variables
    var $scope,
      RefcodetasksService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _RefcodetasksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      RefcodetasksService = _RefcodetasksService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('refcodetasks');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/refcodetasks');
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
          RefcodetasksController,
          mockRefcodetask;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('refcodetasks.view');
          $templateCache.put('modules/refcodetasks/client/views/view-refcodetask.client.view.html', '');

          // create mock Refcodetask
          mockRefcodetask = new RefcodetasksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Refcodetask Name'
          });

          // Initialize Controller
          RefcodetasksController = $controller('RefcodetasksController as vm', {
            $scope: $scope,
            refcodetaskResolve: mockRefcodetask
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:refcodetaskId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.refcodetaskResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            refcodetaskId: 1
          })).toEqual('/refcodetasks/1');
        }));

        it('should attach an Refcodetask to the controller scope', function () {
          expect($scope.vm.refcodetask._id).toBe(mockRefcodetask._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/refcodetasks/client/views/view-refcodetask.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          RefcodetasksController,
          mockRefcodetask;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('refcodetasks.create');
          $templateCache.put('modules/refcodetasks/client/views/form-refcodetask.client.view.html', '');

          // create mock Refcodetask
          mockRefcodetask = new RefcodetasksService();

          // Initialize Controller
          RefcodetasksController = $controller('RefcodetasksController as vm', {
            $scope: $scope,
            refcodetaskResolve: mockRefcodetask
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.refcodetaskResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/refcodetasks/create');
        }));

        it('should attach an Refcodetask to the controller scope', function () {
          expect($scope.vm.refcodetask._id).toBe(mockRefcodetask._id);
          expect($scope.vm.refcodetask._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/refcodetasks/client/views/form-refcodetask.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          RefcodetasksController,
          mockRefcodetask;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('refcodetasks.edit');
          $templateCache.put('modules/refcodetasks/client/views/form-refcodetask.client.view.html', '');

          // create mock Refcodetask
          mockRefcodetask = new RefcodetasksService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Refcodetask Name'
          });

          // Initialize Controller
          RefcodetasksController = $controller('RefcodetasksController as vm', {
            $scope: $scope,
            refcodetaskResolve: mockRefcodetask
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:refcodetaskId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.refcodetaskResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            refcodetaskId: 1
          })).toEqual('/refcodetasks/1/edit');
        }));

        it('should attach an Refcodetask to the controller scope', function () {
          expect($scope.vm.refcodetask._id).toBe(mockRefcodetask._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/refcodetasks/client/views/form-refcodetask.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
