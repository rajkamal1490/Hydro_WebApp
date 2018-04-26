(function () {
  'use strict';

  describe('Clearances Controller Tests', function () {
    // Initialize global variables
    var ClearancesController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ClearancesService,
      mockClearance;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ClearancesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ClearancesService = _ClearancesService_;

      // create mock Clearance
      mockClearance = new ClearancesService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Clearance Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Clearances controller.
      ClearancesController = $controller('ClearancesController as vm', {
        $scope: $scope,
        clearanceResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleClearancePostData;

      beforeEach(function () {
        // Create a sample Clearance object
        sampleClearancePostData = new ClearancesService({
          name: 'Clearance Name'
        });

        $scope.vm.clearance = sampleClearancePostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ClearancesService) {
        // Set POST response
        $httpBackend.expectPOST('api/clearances', sampleClearancePostData).respond(mockClearance);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Clearance was created
        expect($state.go).toHaveBeenCalledWith('clearances.view', {
          clearanceId: mockClearance._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/clearances', sampleClearancePostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Clearance in $scope
        $scope.vm.clearance = mockClearance;
      });

      it('should update a valid Clearance', inject(function (ClearancesService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/clearances\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('clearances.view', {
          clearanceId: mockClearance._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (ClearancesService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/clearances\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Clearances
        $scope.vm.clearance = mockClearance;
      });

      it('should delete the Clearance and redirect to Clearances', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/clearances\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('clearances.list');
      });

      it('should should not delete the Clearance and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
