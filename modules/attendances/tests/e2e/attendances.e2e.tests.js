'use strict';

describe('Attendances E2E Tests:', function () {
  describe('Test Attendances page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/attendances');
      expect(element.all(by.repeater('attendance in attendances')).count()).toEqual(0);
    });
  });
});
