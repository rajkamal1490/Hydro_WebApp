'use strict';

describe('Statuses E2E Tests:', function () {
  describe('Test Statuses page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/statuses');
      expect(element.all(by.repeater('status in statuses')).count()).toEqual(0);
    });
  });
});
