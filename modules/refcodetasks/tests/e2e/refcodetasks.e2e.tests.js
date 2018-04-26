'use strict';

describe('Refcodetasks E2E Tests:', function () {
  describe('Test Refcodetasks page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/refcodetasks');
      expect(element.all(by.repeater('refcodetask in refcodetasks')).count()).toEqual(0);
    });
  });
});
