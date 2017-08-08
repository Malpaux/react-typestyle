/**
 * Styles cache
 * @module react-typestyle/internal/cache
 * @author Paul Brachmann
 * @license Copyright (c) 2017 Malpaux IoT All Rights Reserved.
 */

import { create as createFreeStyle } from 'free-style';

import { ClassNames, DynamicSheet, SheetGenerator, XDynamicSheet } from '../types';
import Registry, { Options as RegistryOptions } from './registry';
import { processSheet, splitSheet } from './utils';

/** The react-typestyle styles cache */
class Cache<P> extends Registry {
  /** Class names of static styles */
  protected classNames: ClassNames = {};
  /** Registry for dynamic styles */
  protected dynamicRegistry: Registry;
  /** Registered dynamic sheets */
  protected dynamicSheets?: SheetGenerator<P>[];
  /** Registered dynamic styles */
  protected dynamicStyles: XDynamicSheet<P> = {};

  constructor(options?: RegistryOptions) {
    super(options);

    this.dynamicRegistry = new Registry(options);
    this.mount(this.dynamicRegistry);
  }

  /** Clear all styles in the current cache */
  public clear() {
    // Clear registered dynamic sheets & styles
    this.dynamicSheets = undefined;
    this.dynamicStyles = {};

    // Clear dynamic registry
    this.dynamicRegistry.off(this.update);
    this.dynamicRegistry.clear();
    this.dynamicRegistry.on(this.update);

    // Clear static class names
    this.classNames = {};

    // Clear main/static registry
    const patch = this.freeStyle;
    this.freeStyle = createFreeStyle(undefined, true);
    return this.publish(patch, true);
  }

  /** Register a dynamic style sheet */
  public register(sheet?: DynamicSheet<P> | SheetGenerator<P>): Cache<P> {
    if (sheet) {
      if (typeof sheet === 'function') {
        if (!this.dynamicSheets) this.dynamicSheets = [];
        this.dynamicSheets.push(sheet);
      } else {
        // Split dynamic/static styles
        const result = splitSheet(sheet);

        // Add dynamic styles
        Object.assign(this.dynamicStyles, result.dynamic);

        // Add static class names
        Object.assign(this.classNames, this.sheet(result.static));
      }
    }

    return this;
  }

  /** Render dynamic styles & get all class names */
  public render(props: P): ClassNames {
    const patch = createFreeStyle(undefined, true);

    // Build dynamic sheet
    const dynamicSheet = this.dynamicSheets ?
      Object.assign(
        {},
        // Evaluate sheet generators
        ...this.dynamicSheets.map((sheet) => sheet(props)),
        // Merge dynamic styles
        this.dynamicStyles,
      )
    : this.dynamicStyles;

    // Evaluate dynamic styles & generate class names
    const classNames = processSheet(
      this.registerStyle.bind(this, patch),
      dynamicSheet,
      props,
      { ...this.classNames },
    );

    // Update styles
    this.dynamicRegistry.clear().update(patch);
    return classNames;
  }
}

export default Cache;
