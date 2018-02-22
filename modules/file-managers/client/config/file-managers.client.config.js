(function () {
  'use strict';

  angular
    .module('file-managers')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'File managers',
      state: 'file-managers',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'file-managers', {
      title: 'List File managers',
      state: 'file-managers.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'file-managers', {
      title: 'Create File manager',
      state: 'file-managers.create',
      roles: ['user']
    });
  }
}());
