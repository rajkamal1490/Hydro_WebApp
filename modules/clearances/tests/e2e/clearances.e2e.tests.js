'use strict';

describe('Clearances E2E Tests:', function () {
  describe('Test Clearances page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/clearances');
      expect(element.all(by.repeater('clearance in clearances')).count()).toEqual(0);
    });
  });
});
