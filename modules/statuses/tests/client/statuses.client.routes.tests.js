(function () {
  'use strict';

  describe('Statuses Route Tests', function () {
    // Initialize global variables
    var $scope,
      StatusesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _StatusesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      StatusesService = _StatusesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('statuses');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/statuses');
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
          StatusesController,
          mockStatus;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('statuses.view');
          $templateCache.put('modules/statuses/client/views/view-status.client.view.html', '');

          // create mock Status
          mockStatus = new StatusesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Status Name'
          });

          // Initialize Controller
          StatusesController = $controller('StatusesController as vm', {
            $scope: $scope,
            statusResolve: mockStatus
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:statusId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.statusResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            statusId: 1
          })).toEqual('/statuses/1');
        }));

        it('should attach an Status to the controller scope', function () {
          expect($scope.vm.status._id).toBe(mockStatus._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/statuses/client/views/view-status.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          StatusesController,
          mockStatus;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('statuses.create');
          $templateCache.put('modules/statuses/client/views/form-status.client.view.html', '');

          // create mock Status
          mockStatus = new StatusesService();

          // Initialize Controller
          StatusesController = $controller('StatusesController as vm', {
            $scope: $scope,
            statusResolve: mockStatus
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.statusResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/statuses/create');
        }));

        it('should attach an Status to the controller scope', function () {
          expect($scope.vm.status._id).toBe(mockStatus._id);
          expect($scope.vm.status._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/statuses/client/views/form-status.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          StatusesController,
          mockStatus;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('statuses.edit');
          $templateCache.put('modules/statuses/client/views/form-status.client.view.html', '');

          // create mock Status
          mockStatus = new StatusesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Status Name'
          });

          // Initialize Controller
          StatusesController = $controller('StatusesController as vm', {
            $scope: $scope,
            statusResolve: mockStatus
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:statusId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.statusResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            statusId: 1
          })).toEqual('/statuses/1/edit');
        }));

        it('should attach an Status to the controller scope', function () {
          expect($scope.vm.status._id).toBe(mockStatus._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/statuses/client/views/form-status.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
