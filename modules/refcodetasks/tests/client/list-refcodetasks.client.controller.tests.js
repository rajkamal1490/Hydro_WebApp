(function () {
  'use strict';

  describe('Refcodetasks List Controller Tests', function () {
    // Initialize global variables
    var RefcodetasksListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      RefcodetasksService,
      mockRefcodetask;

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
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _RefcodetasksService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      RefcodetasksService = _RefcodetasksService_;

      // create mock article
      mockRefcodetask = new RefcodetasksService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Refcodetask Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Refcodetasks List controller.
      RefcodetasksListController = $controller('RefcodetasksListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockRefcodetaskList;

      beforeEach(function () {
        mockRefcodetaskList = [mockRefcodetask, mockRefcodetask];
      });

      it('should send a GET request and return all Refcodetasks', inject(function (RefcodetasksService) {
        // Set POST response
        $httpBackend.expectGET('api/refcodetasks').respond(mockRefcodetaskList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.refcodetasks.length).toEqual(2);
        expect($scope.vm.refcodetasks[0]).toEqual(mockRefcodetask);
        expect($scope.vm.refcodetasks[1]).toEqual(mockRefcodetask);

      }));
    });
  });
}());
