/**
 * @file The main entry point
 * @author Paul Brachmann
 * @license Copyright (c) 2017 Malpaux IoT All Rights Reserved.
 */

 /**
  * TypeStyle higher-order component for React
  * @module react-typestyle
  * @author Paul Brachmann
  * @license Copyright (c) 2017 Malpaux IoT All Rights Reserved.
  */

import * as React from 'react';
export { React as _react };

import Cache from './internal/cache';
import hoc, { ComponentOptions, InjectedProps, InputSheet, Options } from './internal/hoc';
import Registry from './internal/registry';
import Renderer from './internal/renderer';
import { dynamicExtend, shallowCompare } from './internal/utils';

export { Cache, dynamicExtend as extend, Registry, Renderer, shallowCompare };

import * as types from './types';
export { ComponentOptions, InjectedProps, InputSheet, Options, types };

/** The default style renderer */
export let defaultRenderer = new Renderer({ autoGenerateTag: true });
/** Get styles export */
export let getStyles = defaultRenderer.getStyles.bind(defaultRenderer);

/** Replace the default style renderer */
export const setDefaultRenderer = (renderer: Renderer): Renderer => {
  defaultRenderer = renderer;
  getStyles = defaultRenderer.getStyles.bind(defaultRenderer);
  return defaultRenderer;
};

/** Higher-order component */
const withStyles = (options?: Partial<Options>) =>
  options ?
    hoc({
      plugins: options.plugins || undefined,
      renderer: options.renderer || defaultRenderer,
      shouldStylesUpdate: options.shouldStylesUpdate || shallowCompare,
    })
  : hoc({
    renderer: defaultRenderer,
    shouldStylesUpdate: shallowCompare,
  });

export default withStyles;
