'use strict';

describe('File managers E2E Tests:', function () {
  describe('Test File managers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/file-managers');
      expect(element.all(by.repeater('file-manager in file-managers')).count()).toEqual(0);
    });
  });
});
