(function() {
	'use strict';

	angular
		.module('contacts')
		.controller('ContactsListController', ContactsListController);

	ContactsListController.$inject = ['Authentication', 'ContactsService', 'CommonService', '$filter', '$scope', '$mdDialog', 'contactResolve', 'Notification', 'clearanceResolve'];

	function ContactsListController(Authentication, ContactsService, CommonService, $filter, $scope, $mdDialog, contactResolve, Notification, clearanceResolve) {
		var vm = this;
		
		vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
		vm.pageChanged = pageChanged;

		$scope.loadinitial = function() {
			vm.pagedItems = [];
			vm.itemsPerPage = 10;
			vm.currentPage = 1;
			vm.figureOutItemsToDisplay();
		}

		function figureOutItemsToDisplay() {
			vm.filteredItems = $filter('filter')(contactResolve, {
				$: vm.search
			});
			vm.filterLength = vm.filteredItems.length;
			var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
			var end = begin + vm.itemsPerPage;
			vm.pagedItems = vm.filteredItems.slice(begin, end);
		}

		function pageChanged() {
			vm.figureOutItemsToDisplay();
		}

		$scope.addContacts = function(contact, editMode) {
			var oldShow = $mdDialog.show;
			$mdDialog.show = function(options) {
				if (options.hasOwnProperty("skipHide")) {
					options.multiple = options.skipHide;
				}
				return oldShow(options);
			};
			$mdDialog.show({
				controller: 'ContactsController',
				controllerAs: 'vm',
				templateUrl: '/modules/contacts/client/views/form-contact.client.view.html',
				parent: angular.element(document.body),
				clickOutsideToClose: false,
				escapeToClose: false,
				fullscreen: true,
				resolve: {
					contactResolve: function() {
						return contact;
					},
					editMode: function() {
						return editMode;
					},
					clearanceResolve: function() {
						return clearanceResolve;
					}
				}
			}).then(function(createdItem) {

				if (editMode) {
					var contactIndex = CommonService.findIndexByID(vm.pagedItems, contact._id);
					if (createdItem.isDelete) {
						vm.pagedItems.splice(contactIndex, 1);
					} else {
						vm.pagedItems[contactIndex] = createdItem;
					}
				} else {
					vm.pagedItems.push(createdItem);
				}

			}, function() {
				console.log('You cancelled the dialog.');
			});
		}

		$scope.hasShowContact = function(contact) {
			return _.intersection(Authentication.user.userGroup, contact.visible).length > 0;
		};

		$scope.infoMsg = function(contact) {
			Notification.error({
				message: "Editable for only " + _.startCase(contact.visible)
			});
		};
	}
}());