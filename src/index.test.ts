/**
 * Important: This test also serves as a point to
 * import the entire lib for coverage reporting
 */

import * as lib from './';

describe('Entry point', () => {
  it('should have exports', () => {
    expect(lib).toBeTruthy();
    expect(Object.keys(lib).length).not.toBe(0);
  });

  xit('should not have undefined exports', () => {
    Object.keys(lib).forEach((key) => {
      expect((lib as { [key: string]: any })[key]).toBeTruthy();
    });
  });
});
