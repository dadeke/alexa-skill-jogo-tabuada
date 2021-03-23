const Util = require('../lambda/util');

describe('Test Util', () => {
  it('should be able call getNumberRand with success', () => {
    const number = Util.getNumberRand();

    expect(number >= 0 && number <= 10).toBe(true);
  });
});
