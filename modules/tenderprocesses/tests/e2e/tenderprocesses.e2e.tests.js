'use strict';

describe('Tenderprocesses E2E Tests:', function () {
  describe('Test Tenderprocesses page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/tenderprocesses');
      expect(element.all(by.repeater('tenderprocess in tenderprocesses')).count()).toEqual(0);
    });
  });
});
