/**
 * @file Entry point test suite
 * @author Paul Brachmann
 * @license Copyright (c) 2017 Malpaux IoT All Rights Reserved.
 */

/**
 * Important: This test also serves as a point to
 * import the entire lib for coverage reporting
 */

import Renderer from './internal/renderer';

import withStyles, * as lib from './';

describe('entry point', () => {
  it('should have exports', () => {
    expect(lib).toBeTruthy();
    expect(Object.keys(lib).length).not.toBe(0);
  });

  xit('should not have undefined exports', () => {
    Object.keys(lib).forEach((key) => {
      expect((lib as { [key: string]: any })[key]).toBeTruthy();
    });
  });

  it('should replace the default style renderer', () => {
    const className = lib.defaultRenderer.style({ color: '#fff' });
    expect(lib.getStyles()).toBe(`.${className}{color:#fff}`);

    expect(lib.setDefaultRenderer(new Renderer()));
    expect(lib.defaultRenderer.getStyles()).toBe('');
    expect(lib.getStyles()).toBe('');

    const className2 = lib.defaultRenderer.style({ color: '#000' });
    expect(lib.getStyles()).toBe(`.${className2}{color:#000}`);
  });
});

describe('hoc factory', () => {
  it('should work', () => {
    // TODO: Check resulting HoC

    expect(withStyles());
    expect(withStyles({}));
    expect(withStyles({
      plugins: [],
      renderer: new Renderer(),
      shouldStylesUpdate: () => true,
    }));
  });
});
