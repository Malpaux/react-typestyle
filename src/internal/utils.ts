/**
 * react-typestyle utils
 * @module react-typestyle/internal/utils
 * @author Paul Brachmann
 * @license Copyright (c) 2017 Malpaux IoT All Rights Reserved.
 */

import { extend } from 'typestyle/lib/internal/utilities';

import {
  DynamicSheet,
  Plugin,
  StaticSheet,
  StaticStyle,
  StyleGenerator,
  XDynamicSheet,
} from '../types';

/** Shallowly compare two objects */
export const shallowCompare = (
  a: { [key: string]: any },
  b: { [key: string]: any },
): boolean => {
  let i;
  for (i in a) if (!(i in b)) return true;
  for (i in b) if (a[i] !== b[i]) return true;
  return false;
};

/** Dynamically extend dynamic styles */
export const dynamicExtend = <P>(
  ...objects: (StaticStyle | StyleGenerator<P>)[],
): StaticStyle | StyleGenerator<P> => {
  const staticStyles: StaticStyle[] = [];
  let dynamicStyles: StyleGenerator<P>[] | undefined;

  // Split dynamic/static styles
  objects.forEach((style) => {
    if (typeof style === 'function') {
      if (!dynamicStyles) dynamicStyles = [];
      dynamicStyles.push(style);
    } else {
      staticStyles.push(style);
    }
  });

  // Dynamic styles reqire dynamic extend
  if (dynamicStyles) {
    return (props: P) => {
      // Evaluate & merge dynamic w/ static styles
      return extend(
        ...staticStyles,
        ...((dynamicStyles as StyleGenerator<P>[]).map((style) => style(props))),
      );
    };
  }

  // Default static extend
  return extend(...staticStyles);
};

/** Process a style with a number of plugins */
export const processPlugins = <P>(
  plugins: Plugin[] | undefined,
  style: { [property: string]: any },
  props?: P,
) => {
  let result = { ...style };

  if (plugins) {
    plugins.forEach((plugin) => {
      result = plugin(result, 'RULE', undefined, props);
    });
  }

  return result;
};

/** Split a style sheet into its dynamic & static components */
export const splitSheet = <P>(sheet: DynamicSheet<P>): {
  dynamic: XDynamicSheet<P>,
  static: StaticSheet,
} => {
  const dynamicSheet: XDynamicSheet<P> = {};
  const staticSheet: StaticSheet = {};

  // Iterate styled entities
  Object.keys(sheet).forEach((name) => {
    const style = sheet[name];
    if (typeof style === 'function') {
      dynamicSheet[name] = style;
    } else {
      staticSheet[name] = style;
    }
  });

  return { dynamic: dynamicSheet, static: staticSheet };
};
