/**
 * @file Utilities test suite
 * @author Paul Brachmann
 * @license Copyright (c) 2017 Malpaux IoT All Rights Reserved.
 */

import { DynamicSheet, StaticStyle, StyleGenerator } from '../types';
import { dynamicExtend, processPlugins, processSheet, shallowCompare, splitSheet } from './utils';

describe('utilities', () => {
  it('should shallowly compare two object', () => {
    expect(shallowCompare(
      { key1: 1, key2: 'string' },
      { key1: 1, key2: 'string' },
    )).toBe(false);

    expect(shallowCompare(
      { key1: 1, key2: 'string' },
      { key1: 2, key2: 'string' },
    )).toBe(true);

    expect(shallowCompare(
      { key1: 1, key2: 'string' },
      { key2: 'string' },
    )).toBe(true);

    expect(shallowCompare(
      { key1: 1 },
      { key1: 1, key2: 'string' },
    )).toBe(true);
  });

  it('should dynamically extend dynamic styles', () => {
    expect(dynamicExtend()).toEqual({});
    expect(dynamicExtend({})).toEqual({});
    expect(dynamicExtend({}, {}, {})).toEqual({});
    expect((dynamicExtend({}, () => ({}), {}) as StyleGenerator<{}>)({})).toEqual({});

    expect((dynamicExtend({ color: '#fff' }, { background: '#000' }))).toEqual({
      background: '#000',
      color: '#fff',
    });

    expect(((dynamicExtend(
      ({ background }) => ({ background }),
      { color: '#fff' },
      () => ({}),
    )) as StyleGenerator<{ background: string }>)({ background: '#f00' })).toEqual({
      background: '#f00',
      color: '#fff',
    });
  });

  it('should process a style with a number of plugins', () => {
    const inputStyle: StaticStyle = {
      background: '#000',
      color: '#f00',
    };

    const clearPlugin = () => ({});
    const backgroundPlugin = (style: StaticStyle) => {
      style.background = '#fff';
      return style;
    };
    const transitionPlugin = (
      style: StaticStyle,
      _type: string,
      _renderer: any,
      props?: { [key: string]: any },
    ) => {
      if (props) style.transition = `all ${props.duration}ms`;
      return style;
    };

    expect(processPlugins(undefined, inputStyle))
      .toEqual({
        background: '#000',
        color: '#f00',
      });
    expect(processPlugins([], inputStyle))
      .toEqual({
        background: '#000',
        color: '#f00',
      });

    expect(processPlugins([clearPlugin], inputStyle))
      .toEqual({});
    expect(processPlugins([backgroundPlugin], inputStyle))
      .toEqual({
        background: '#fff',
        color: '#f00',
      });
    expect(processPlugins([transitionPlugin], inputStyle, { duration: 200 }))
      .toEqual({
        background: '#000',
        color: '#f00',
        transition: 'all 200ms',
      });
    expect(processPlugins([backgroundPlugin, transitionPlugin], inputStyle, { duration: 200 }))
      .toEqual({
        background: '#fff',
        color: '#f00',
        transition: 'all 200ms',
      });

    expect(processPlugins([transitionPlugin, backgroundPlugin, clearPlugin], inputStyle, {
      duration: 200,
    }))
      .toEqual({});
  });

  it('should split dynamic and static styles', () => {
    interface Props {
      bg: string;
      color: string;
      dimensions: { x: number, y: number };
    }

    const sheet: DynamicSheet<Props> = {
      active: {
        background: 'transparent',
        color: '#f00',
      },
      button: (props) => ({
        background: props.bg,
        color: props.color,
        position: 'relative',
      }),
      disabled: {
        border: 'none',
      },
      div: ({ dimensions }) => ({
        border: undefined,
        boxSizing: 'border-box',
        height: dimensions.y,
        padding: 24,
        position: 'absolute',
        top: 0,
      }),
    };

    expect(splitSheet({})).toEqual({ dynamic: {}, static: {} });

    expect(splitSheet(sheet)).toEqual({
      dynamic: {
        button: sheet.button,
        div: sheet.div,
      },
      static: {
        active: {
          background: 'transparent',
          color: '#f00',
        },
        disabled: {
          border: 'none',
        },
      },
    });
  });

  it('should evaluate & process a style sheet', () => {
    const processor = jest.fn((style: StaticStyle) => style);

    interface Props {
      bg: string;
      color: string;
    }

    const sheet: DynamicSheet<Props> = {
      button: (props) => ({
        background: props.bg,
        color: props.color,
        position: 'relative',
      }),
      disabled: {
        border: 'none',
      },
      div: () => ({
        border: undefined,
        boxSizing: 'border-box',
        padding: 24,
        position: 'absolute',
        top: 0,
      }),
    };

    expect(processSheet(processor, sheet, { bg: '#000', color: '#fff' })).toEqual({
      button: {
        background: '#000',
        color: '#fff',
        position: 'relative',
      },
      disabled: {
        border: 'none',
      },
      div: {
        boxSizing: 'border-box',
        padding: 24,
        position: 'absolute',
        top: 0,
      },
    });
    expect(processor).toHaveBeenCalledTimes(3);

    // TODO: More elaborate test case(s)
  });
});
