/**
 * @file Registry test suite
 * @author Paul Brachmann
 * @license Copyright (c) 2017 Malpaux IoT All Rights Reserved.
 */

import Registry from './registry';

describe('registry', () => {
  it('should create a new registry', () => {
    expect(new Registry());
    expect(new Registry({}));
    expect(new Registry({ plugins: [] }));
  });

  it('should get an empty registry\'s styles', () => {
    expect(new Registry().getStyles()).toBe('');
    expect(new Registry().toString()).toBe('');
  });

  it('should add, get, and clear styles and sheets', () => {
    const registry = new Registry();

    const className = registry.style({ color: '#fff' });
    const style = `.${className}{color:#fff}`;
    expect(registry.getStyles()).toBe(style);
    expect(registry.toString()).toBe(style);

    registry.style({});
    expect(registry.getStyles()).toBe(style);
    expect(registry.toString()).toBe(style);

    const classNames2 = registry.sheet({ button: { background: 'transparent', border: 'none' } });
    expect(Object.keys(classNames2).length).toBe(1);
    expect(Object.keys(classNames2)[0]).toBe('button');
    const style2 = `${style}.${classNames2.button}{background:transparent;border:none}`;
    expect(registry.getStyles()).toBe(style2);
    expect(registry.toString()).toBe(style2);

    const className3 = registry.style({ background: '#000', transition: 'all 200ms' });
    const style3 = `${style2}.${className3}{background:#000;transition:all 200ms}`;
    expect(registry.getStyles()).toBe(style3);
    expect(registry.toString()).toBe(style3);

    const classNames4 = registry.sheet({
      button: { borderRadius: 8 }, div: { position: 'absolute' },
    });
    expect(Object.keys(classNames4).length).toBe(2);
    expect(Object.keys(classNames4)[0]).toBe('button');
    expect(Object.keys(classNames4)[1]).toBe('div');
    const style4 = `${style3}.${
      classNames4.button}{border-radius:8px}.${classNames4.div}{position:absolute}`;
    expect(registry.getStyles()).toBe(style4);
    expect(registry.toString()).toBe(style4);

    expect(registry.clear().getStyles()).toBe('');
    expect(registry.toString()).toBe('');

    const className5 = registry.style({ $debugName: 'name', padding: 12 });
    const style5 = `.${className5}{padding:12px}`;
    expect(registry.getStyles()).toBe(style5);
    expect(registry.toString()).toBe(style5);
  });

  it('should register and remove update listeners', () => {
    const updateListener = jest.fn();
    const updateListener2 = jest.fn();

    const registry = new Registry().on(updateListener).on(updateListener2);

    const className = registry.style({ border: 'none' });
    const style = `.${className}{border:none}`;
    expect(updateListener).toHaveBeenCalledTimes(1);
    expect(updateListener.mock.calls[0][0].getStyles()).toBe(style);
    expect(updateListener2).toHaveBeenCalledTimes(1);
    expect(updateListener2.mock.calls[0][0].getStyles()).toBe(style);

    registry.off(updateListener2);

    const className2 = registry.style({ margin: 24 });
    const style2 = `.${className2}{margin:24px}`;
    expect(updateListener).toHaveBeenCalledTimes(2);
    expect(updateListener.mock.calls[1][0].getStyles()).toBe(style2);
    expect(updateListener2).toHaveBeenCalledTimes(1);

    registry.style({});
    expect(updateListener).toHaveBeenCalledTimes(3);
    expect(updateListener.mock.calls[2][0].getStyles()).toBe('');
    expect(updateListener2).toHaveBeenCalledTimes(1);

    registry.off(updateListener);

    registry.style({ padding: 12 });
    expect(updateListener).toHaveBeenCalledTimes(3);
    expect(updateListener2).toHaveBeenCalledTimes(1);
  });

  // TODO: Test update()

  // TODO: Test mount()/unmount()

  // TODO: Test plugin processing
});
