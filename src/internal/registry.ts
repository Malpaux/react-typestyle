/**
 * The react-typestyle style registry
 * @module react-typestyle/internal/registry
 * @author Paul Brachmann
 * @license Copyright (c) 2017 Malpaux IoT All Rights Reserved.
 */

import { create as createFreeStyle, FreeStyle } from 'free-style';
import { ensureStringObj } from 'typestyle/lib/internal/formatting';

import {
  ClassNames,
  Plugin,
  StaticSheet,
  StaticStyle,
} from '../types';
import { processPlugins } from './utils';

export type updateListener = (patch: FreeStyle, subtractive?: boolean) => void;

export interface Options { plugins?: Plugin[]; }

/** The react-typestyle style registry */
class Registry {
  /** Free style instance */
  protected freeStyle: FreeStyle;
  /** Update listeners */
  protected listeners: updateListener[] = [];
  /** Plugins */
  protected plugins?: Plugin[];

  constructor({ plugins }: Options = {}) {
    this.plugins = plugins;

    // Create free style instance
    this.freeStyle = createFreeStyle(undefined, true);

    this.update = this.update.bind(this);
  }

  /** Clear all styles in the current registry */
  public clear(): Registry {
    const patch = this.freeStyle;
    this.freeStyle = createFreeStyle(undefined, true);
    return this.publish(patch, true);
  }

  /** Get styles as string */
  public getStyles(): string {
    return this.freeStyle.getStyles();
  }

  /** Mount child registry */
  public mount(registry: Registry): Registry {
    // Register update listener
    registry.on(this.update);

    // Merge existing styles
    return this.update(registry.freeStyle);
  }

  /** Remove an update listener */
  public off(listener: updateListener): Registry {
    this.listeners = this.listeners.filter((value) => value !== listener);
    return this;
  }

  /** Register an update listener */
  public on(listener: updateListener): Registry {
    this.listeners.push(listener);
    return this;
  }

  public sheet(object: StaticSheet): ClassNames {
    const patch = createFreeStyle(undefined, true);
    const classNames: ClassNames = {};

    Object.keys(object).forEach((name) => {
      classNames[name] = this.registerStyle(patch, object[name]);
    });

    // Add styles
    this.update(patch);
    return classNames;
  }

  /** Takes CSSProperties and return a generated className you can use on your component */
  public style(object: StaticStyle): string {
    const patch = createFreeStyle(undefined, true);
    const className = this.registerStyle(patch, object);

    // Add style
    this.update(patch);
    return className;
  }

  public toString(): string {
    return this.getStyles();
  }

  /** Unmount child registry */
  public unmount(registry: Registry): Registry {
    // Remove update listener
    registry.off(this.update);

    // Remove styles
    registry.update(this.freeStyle, true);
    return this;
  }

  /** Trigger an update */
  public update(patch: FreeStyle, subtractive?: boolean): Registry {
    // Patch self
    if (subtractive) {
      this.freeStyle.unmerge(patch);
    } else {
      this.freeStyle.merge(patch);
    }

    // Propagate to parents
    return this.publish(patch, subtractive);
  }

  /** Publish a change */
  protected publish(patch: FreeStyle, subtractive?: boolean): Registry {
    // Call listeners
    this.listeners.forEach((listener) => { listener(patch, subtractive); });
    return this;
  }

  /** Process & register a style at the given free style instance  */
  protected registerStyle<P>(freeStyle: FreeStyle, style: StaticStyle, props?: P): string {
    // Normalize typestyle features
    const { result, debugName } = ensureStringObj(style);

    // Process plugins
    const processed = processPlugins(this.plugins, result, props);

    // Register style & return class name
    return debugName ?
      freeStyle.registerStyle(processed, debugName)
    : freeStyle.registerStyle(processed);
  }
}

export default Registry;
