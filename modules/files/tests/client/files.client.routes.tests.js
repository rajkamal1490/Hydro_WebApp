(function () {
  'use strict';

  describe('Files Route Tests', function () {
    // Initialize global variables
    var $scope,
      FilesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FilesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FilesService = _FilesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('files');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/files');
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
          FilesController,
          mockFile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('files.view');
          $templateCache.put('modules/files/client/views/view-file.client.view.html', '');

          // create mock File
          mockFile = new FilesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'File Name'
          });

          // Initialize Controller
          FilesController = $controller('FilesController as vm', {
            $scope: $scope,
            fileResolve: mockFile
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:fileId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.fileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            fileId: 1
          })).toEqual('/files/1');
        }));

        it('should attach an File to the controller scope', function () {
          expect($scope.vm.file._id).toBe(mockFile._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/files/client/views/view-file.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FilesController,
          mockFile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('files.create');
          $templateCache.put('modules/files/client/views/form-file.client.view.html', '');

          // create mock File
          mockFile = new FilesService();

          // Initialize Controller
          FilesController = $controller('FilesController as vm', {
            $scope: $scope,
            fileResolve: mockFile
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.fileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/files/create');
        }));

        it('should attach an File to the controller scope', function () {
          expect($scope.vm.file._id).toBe(mockFile._id);
          expect($scope.vm.file._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/files/client/views/form-file.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FilesController,
          mockFile;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('files.edit');
          $templateCache.put('modules/files/client/views/form-file.client.view.html', '');

          // create mock File
          mockFile = new FilesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'File Name'
          });

          // Initialize Controller
          FilesController = $controller('FilesController as vm', {
            $scope: $scope,
            fileResolve: mockFile
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:fileId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.fileResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            fileId: 1
          })).toEqual('/files/1/edit');
        }));

        it('should attach an File to the controller scope', function () {
          expect($scope.vm.file._id).toBe(mockFile._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/files/client/views/form-file.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
