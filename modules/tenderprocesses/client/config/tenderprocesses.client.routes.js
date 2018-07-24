(function() {
  'use strict';

  angular
    .module('tenderprocesses')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tenderprocesses', {
        abstract: true,
        url: '/tenderprocesses',
        templateUrl: '/modules/tenderprocesses/client/views/form-tenderprocess.client.view.html',
        controller: 'TenderprocessesController',
        controllerAs: 'vm',
        data: {
          roles: ['user']
        }
      })
      .state('tenderprocesses.list', {
        url: '',
        templateUrl: '/modules/tenderprocesses/client/views/list-tenderprocesses.client.view.html',
        controller: 'TenderprocessesListController',
        controllerAs: 'vm',
        resolve: {
          tenderResolve: function() {
            return undefined;
          },
          hasCreateTender: function() {
            return false;
          },
          tenderprocessesResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(tenderProcessData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
        },
        data: {
          pageTitle: 'Tenderprocesses List'
        }
      })
      .state('tenderprocesses.create', {
        url: '/create',
        templateUrl: '/modules/tenderprocesses/client/views/form-tenderprocess.client.view.html',
        controller: 'TenderprocessesController',
        controllerAs: 'vm',
        resolve: {
          tenderprocessResolve: newTenderprocess
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Tenderprocesses Create'
        }
      })
      .state('tenderprocesses.edit', {
        url: '/:tenderprocessId/edit',
        templateUrl: '/modules/tenderprocesses/client/views/list-tenderprocesses.client.view.html',
        controller: 'TenderprocessesListController',
        controllerAs: 'vm',
        resolve: {
          tenderResolve: getTenderprocess,
          hasCreateTender: function() {
            return true;
          },
          tenderprocessesResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(tenderProcessData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Tenderprocess {{ tenderprocessResolve.name }}'
        }
      })
      .state('tenderprocesses.nit', {
        url: '/nit',
        templateUrl: '/modules/tenderprocesses/client/views/nit-tenderprocess.client.view.html',
        controller: 'TenderprocessesNitController',
        controllerAs: 'vm',
        resolve: {
          nitResolve: function() {
            return undefined;
          },
          hasCreateNit: function() {
            return false;
          },
          hasApproval: function() {
            return false;
          },
          nitprocessesResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(nitProcessData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          tenderprocessesResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(tenderProcessData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
        },
        data: {
          pageTitle: 'NIT Page'
        }
      })
      .state('tenderprocesses.nitedit', {
        url: '/:nitId/nit',
        templateUrl: '/modules/tenderprocesses/client/views/nit-tenderprocess.client.view.html',
        controller: 'TenderprocessesNitController',
        controllerAs: 'vm',
        resolve: {
          nitResolve: getNitprocess,
          hasCreateNit: function() {
            return true;
          },
          hasApproval: function() {
            return false;
          },
          nitprocessesResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(nitProcessData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          tenderprocessesResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(tenderProcessData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
        },
        data: {
          pageTitle: 'NIT Edit Page'
        }
      })
      .state('tenderprocesses.nitapproval', {
        url: '/:nitId/approval/nit',
        templateUrl: '/modules/tenderprocesses/client/views/nit-tenderprocess.client.view.html',
        controller: 'TenderprocessesNitController',
        controllerAs: 'vm',
        resolve: {
          nitResolve: getNitprocess,
          hasCreateNit: function() {
            return true;
          },
          hasApproval: function() {
            return true;
          },
          nitprocessesResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(nitProcessData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
          tenderprocessesResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(tenderProcessData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
        },
        data: {
          pageTitle: 'NIT Edit Page'
        }
      })
      .state('tenderprocesses.emd', {
        url: '/emd',
        templateUrl: '/modules/tenderprocesses/client/views/emd-tenderprocess.client.view.html',
        controller: 'TenderprocessesEmdController',
        controllerAs: 'vm',
        resolve: {
          emdResolve: function() {
            return undefined;
          },
          hasCreateEmd: function() {
            return false;
          },
          hasApproval: function() {
            return false;
          },
          emdprocessesResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(emdProcessData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
        },
        data: {
          pageTitle: 'EMD Page'
        }
      })
      .state('tenderprocesses.emdedit', {
        url: '/:emdId/emd',
        templateUrl: '/modules/tenderprocesses/client/views/emd-tenderprocess.client.view.html',
        controller: 'TenderprocessesEmdController',
        controllerAs: 'vm',
        resolve: {
          emdResolve: getEmdprocess,
          hasCreateEmd: function() {
            return true;
          },
          hasApproval: function() {
            return false;
          },
          emdprocessesResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(emdProcessData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
        },
        data: {
          pageTitle: 'NIT Edit Page'
        }
      })
      .state('tenderprocesses.emdapproval', {
        url: '/:emdId/approval/emd',
        templateUrl: '/modules/tenderprocesses/client/views/emd-tenderprocess.client.view.html',
        controller: 'TenderprocessesEmdController',
        controllerAs: 'vm',
        resolve: {
          emdResolve: getEmdprocess,
          hasCreateEmd: function() {
            return true;
          },
          hasApproval: function() {
            return true;
          },
          emdprocessesResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(emdProcessData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
        },
        data: {
          pageTitle: 'NIT Edit Page'
        }
      })
      .state('tenderprocesses.itemsheet', {
        url: '/itemsheet',
        templateUrl: '/modules/tenderprocesses/client/views/item-sheet-tenderprocess.client.view.html',
        controller: 'TenderprocessesItemSheetController',
        controllerAs: 'vm',
        resolve: {
          itemSheetResolve: function() {
            return undefined;
          },
          hasCreatedItemSheet: function() {
            return false;
          },
          itemSheetsResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(itemSheetsData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
        },
        data: {
          pageTitle: 'Item Sheet Page'
        }
      })
      .state('tenderprocesses.itemsheetedit', {
        url: '/:itemSheetId/itemsheet',
        templateUrl: '/modules/tenderprocesses/client/views/item-sheet-tenderprocess.client.view.html',
        controller: 'TenderprocessesItemSheetController',
        controllerAs: 'vm',
        resolve: {
          itemSheetResolve: getItemSheetProcess,
          hasCreatedItemSheet: function() {
            return true;
          },
          itemSheetsResolve: ['$injector', '$q', function($injector, $q) {
            return $injector.invoke(itemSheetsData).$promise; // cached, otherwise we would have called IncidentNoteTitle.query().
          }],
        },
        data: {
          pageTitle: 'Item Sheet Edit Page'
        }
      })
      .state('tenderprocesses.view', {
        url: '/:tenderprocessId',
        templateUrl: '/modules/tenderprocesses/client/views/view-tenderprocess.client.view.html',
        controller: 'TenderprocessesController',
        controllerAs: 'vm',
        resolve: {
          tenderprocessResolve: getTenderprocess
        },
        data: {
          pageTitle: 'Tenderprocess {{ tenderprocessResolve.name }}'
        }
      });
  }

  getTenderprocess.$inject = ['$stateParams', 'TenderprocessesService'];

  function getTenderprocess($stateParams, TenderprocessesService) {
    return TenderprocessesService.get({
      tenderprocessId: $stateParams.tenderprocessId
    }).$promise;
  }

  getNitprocess.$inject = ['$stateParams', 'TenderprocessesNitService'];

  function getNitprocess($stateParams, TenderprocessesNitService) {
    return TenderprocessesNitService.get({
      nitId: $stateParams.nitId
    }).$promise;
  }

  getEmdprocess.$inject = ['$stateParams', 'TenderprocessesEmdService'];

  function getEmdprocess($stateParams, TenderprocessesEmdService) {
    return TenderprocessesEmdService.get({
      emdId: $stateParams.emdId
    }).$promise;
  }

  getItemSheetProcess.$inject = ['$stateParams', 'TenderprocessesItemSheetService'];

  function getItemSheetProcess($stateParams, TenderprocessesItemSheetService) {
    return TenderprocessesItemSheetService.get({
      itemSheetId: $stateParams.itemSheetId
    }).$promise;
  }

  newTenderprocess.$inject = ['TenderprocessesService'];

  function newTenderprocess(TenderprocessesService) {
    return new TenderprocessesService();
  }

  tenderProcessData.$inject = ['TenderprocessesService'];

  function tenderProcessData(TenderprocessesService) {
    return TenderprocessesService.query();
  }

  nitProcessData.$inject = ['TenderprocessesNitService'];

  function nitProcessData(TenderprocessesNitService) {
    return TenderprocessesNitService.query();
  }

  emdProcessData.$inject = ['TenderprocessesEmdService'];

  function emdProcessData(TenderprocessesEmdService) {
    return TenderprocessesEmdService.query();
  }

  itemSheetsData.$inject = ['TenderprocessesItemSheetService'];

  function itemSheetsData(TenderprocessesItemSheetService) {
    return TenderprocessesItemSheetService.query();
  }


}());
