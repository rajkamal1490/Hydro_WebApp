(function () {
  'use strict';

  describe('Tenderprocesses Controller Tests', function () {
    // Initialize global variables
    var TenderprocessesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      TenderprocessesService,
      mockTenderprocess;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _TenderprocessesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      TenderprocessesService = _TenderprocessesService_;

      // create mock Tenderprocess
      mockTenderprocess = new TenderprocessesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Tenderprocess Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Tenderprocesses controller.
      TenderprocessesController = $controller('TenderprocessesController as vm', {
        $scope: $scope,
        tenderprocessResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleTenderprocessPostData;

      beforeEach(function () {
        // Create a sample Tenderprocess object
        sampleTenderprocessPostData = new TenderprocessesService({
          name: 'Tenderprocess Name'
        });

        $scope.vm.tenderprocess = sampleTenderprocessPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (TenderprocessesService) {
        // Set POST response
        $httpBackend.expectPOST('api/tenderprocesses', sampleTenderprocessPostData).respond(mockTenderprocess);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Tenderprocess was created
        expect($state.go).toHaveBeenCalledWith('tenderprocesses.view', {
          tenderprocessId: mockTenderprocess._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/tenderprocesses', sampleTenderprocessPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Tenderprocess in $scope
        $scope.vm.tenderprocess = mockTenderprocess;
      });

      it('should update a valid Tenderprocess', inject(function (TenderprocessesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/tenderprocesses\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('tenderprocesses.view', {
          tenderprocessId: mockTenderprocess._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (TenderprocessesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/tenderprocesses\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Tenderprocesses
        $scope.vm.tenderprocess = mockTenderprocess;
      });

      it('should delete the Tenderprocess and redirect to Tenderprocesses', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/tenderprocesses\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('tenderprocesses.list');
      });

      it('should should not delete the Tenderprocess and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
