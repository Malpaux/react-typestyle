/**
 * @file Styles cache test suite
 * @author Paul Brachmann
 * @license Copyright (c) 2017 Malpaux IoT All Rights Reserved.
 */

import Registry from './registry';

import Cache from './cache';

describe('cache', () => {
  it('should create a new cache', () => {
    expect(new Cache()).toBeInstanceOf(Registry);
    expect(new Cache({})).toBeInstanceOf(Registry);
    expect(new Cache({ plugins: [] })).toBeInstanceOf(Registry);
  });

  it('should register, render, and clear sheets', () => {
    interface Props {
      background?: string;
    }

    const cache = new Cache<Props>();

    // Static sheet (w/ dynamic styles)
    expect(cache.register({
      button: ({ background }) => ({
        background: background || 'transparent',
      }),
      root: {
        background: '#000',
        color: '#fff',
      },
    })).toBe(cache);
    expect(cache.register({})).toBe(cache);

    // Dynamic sheet
    expect(cache.register(({ background }) => ({
      text: {
        background,
      },
    }))).toBe(cache);
    expect(cache.register(() => ({}))).toBe(cache);

    const classNames = cache.render({});
    expect(cache.getStyles()).toBe(`.${classNames.root}{background:#000;color:#fff}.${
      classNames.button}{background:transparent}`);

    const classNames2 = cache.render({ background: '#000' });
    expect(cache.getStyles()).toBe(`.${classNames2.root}{background:#000;color:#fff}.${
      classNames2.button}{background:#000}`);
    expect(classNames2.text).toBe(classNames2.button);
    expect(classNames2.root).toBe(classNames.root);

    expect(cache.clear()).toBe(cache);
    expect(cache.getStyles()).toBe('');
    expect(cache.render({ background: '#fff' })).toEqual({});
  });
});
