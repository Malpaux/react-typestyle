/**
 * The react-typestyle style renderer
 * @module react-typestyle/internal/renderer
 * @author Paul Brachmann
 * @license Copyright (c) 2017 Malpaux IoT All Rights Reserved.
 */

import { StylesTarget } from '../types';
import Registry, { Options as RegistryOptions } from './registry';

export interface Options extends RegistryOptions {
  autoGenerateTag?: boolean;
  tag?: StylesTarget;
}

/** The react-typestyle style renderer */
class Renderer extends Registry {
  public static requestAnimationFrame = typeof requestAnimationFrame === 'undefined' ?
    setTimeout
  : requestAnimationFrame.bind(window);

  /** Should a render tag be automatically generated */
  protected autoGenerateTag: boolean;
  /** The last free style change id */
  protected lastFreeStyleChangeId: number;
  /** Index for pending updates */
  protected pending = 0;
  /** The current render tag */
  protected tag?: StylesTarget;

  constructor({ autoGenerateTag, plugins, tag }: Options = {}) {
    super({ plugins });

    this.lastFreeStyleChangeId = this.freeStyle.changeId;

    this.autoGenerateTag = autoGenerateTag;
    this.tag = tag;

    this.forceRenderStyles = this.forceRenderStyles.bind(this);

    // Register style update / render handler
    this.on(this.styleUpdated.bind(this));
  }

  /** Trigger styles to render */
  public forceRenderStyles(): Renderer {
    const target = this.getTag();
    if (target) target.textContent = this.getStyles();

    return this;
  }

  /** Set the styles target element */
  public setStylesTarget(tag: StylesTarget): Renderer {
    if (this.tag) this.tag.textContent = '';
    this.tag = tag;

    this.forceRenderStyles();

    return this;
  }

  /** Get the styles target element */
  protected getTag(): StylesTarget | void {
    if (this.tag) return this.tag;
    if (this.autoGenerateTag) {
      this.tag = document.createElement('style');
      document.head.appendChild((this.tag as HTMLElement));
      return this.tag;
    }
  }

  /** Checks if the style tag needs updating and if so queues up the change */
  protected styleUpdated(): Renderer {
    const changeId = this.freeStyle.changeId;
    const lastChangeId = this.lastFreeStyleChangeId;

    if (changeId === lastChangeId) return this;
    this.lastFreeStyleChangeId = changeId;

    return this.sync(this.forceRenderStyles);
  }

  /** Only calls callback after all pending operations settle */
  protected sync(callback: () => void): Renderer {
    this.pending += 1;
    const pending = this.pending;

    Renderer.requestAnimationFrame(() => {
      if (pending === this.pending) callback();
    });

    return this;
  }
}

export default Renderer;
