(function() {
  'use strict';
  angular.module('core')

    .provider('cacheManager', function() {

      var exposedCache = {};

      function resolveImpl($cacheFactory, path, queryFn, parameters) {
        var cache = $cacheFactory(path);
        var retVal = cache.get(path);
        exposedCache[path] = retVal ? retVal : cache.put(path, queryFn(parameters));
        return exposedCache[path];
      };

      return {
        /* Without the following, when configuring $routeProvider, we would have called
         *
         *    user: ['AdminService', function(AdminService) {
         *      return AdminService.query();
         *    }],
         *
         */
        usersResolve: ['AdminService', '$cacheFactory', function(AdminService, $cacheFactory) {
          return exposedCache['/api/users'] || resolveImpl($cacheFactory, '/api/users', AdminService.query, {start: 0, size: 1000});
        }],

        // The service itself, which is created in this $get(), doesn't have access to the provider-level methods, 
        // but often we want to access the cache on the service itself, and so we're now supporting that ability.
        $get: ['$cacheFactory', 'AdminService', function($cacheFactory, AdminService) {
            var service = {
              getUsers: function() {
                return exposedCache['/api/users'] || resolveImpl($cacheFactory, '/api/users', AdminService.query, {
                  start: 0,
                  size: 1000
                });
              },
            };
            return service;
          }
        ],

      }
    });

}).call(this);

//# sourceMappingURL=PageCtrl.js.map