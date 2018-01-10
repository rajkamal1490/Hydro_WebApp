(function () {
  'use strict';

  // Contacts controller
  angular
    .module('contacts')
    .controller('ContactsController', ContactsController);

  ContactsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'contactResolve'];

  function ContactsController ($scope, $state, $window, Authentication, contact) {
    var vm = this;

    vm.authentication = Authentication;
    vm.contact = contact;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Contact
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.contact.$remove($state.go('contacts.list'));
      }
    }

    // Save Contact
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.contactForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.contact._id) {
        vm.contact.$update(successCallback, errorCallback);
      } else {
        vm.contact.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('contacts.view', {
          contactId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
