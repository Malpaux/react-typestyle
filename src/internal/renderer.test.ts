/**
 * @file Style renderer test suite
 * @author Paul Brachmann
 * @license Copyright (c) 2017 Malpaux IoT All Rights Reserved.
 */

import { StylesTarget } from '../types';
import Registry from './registry';

import Renderer, { getRequestAnimationFrame } from './renderer';

describe('renderer utils', () => {
  it('should bind & get the requestAnimationFrame method or polyfill', () => {
    const initialRequestAnimationFrame = window.requestAnimationFrame;

    expect(getRequestAnimationFrame().toString()).toBe(setTimeout.toString());

    window.requestAnimationFrame = (cb: (time: number) => void) => { cb(0); return 0; };
    expect(getRequestAnimationFrame().toString()).not.toBe(setTimeout.toString());

    window.requestAnimationFrame = initialRequestAnimationFrame;
  });
});

describe('renderer', () => {
  it('should create a new renderer', () => {
    expect(new Renderer()).toBeInstanceOf(Registry);
    expect(new Renderer({})).toBeInstanceOf(Registry);
    expect(new Renderer({
      autoGenerateTag: true,
      plugins: [],
      tag: document.createElement('style'),
    })).toBeInstanceOf(Registry);
  });

  it('should set the styles target & render styles', (done) => {
    const renderer = new Renderer();

    const className = renderer.style({ color: '#fff' });
    const style = `.${className}{color:#fff}`;

    // Nothing happens if no styles target available
    expect(renderer.forceRenderStyles()).toBe(renderer);
    expect(renderer.getStyles()).toBe(style);

    // Set initial styles target
    const target = { textContent: '' };
    expect(renderer.setStylesTarget(target)).toBe(renderer);
    expect(target.textContent).toBe(style);
    expect(renderer.getStyles()).toBe(style);

    // Force render
    const className2 = renderer.style({ color: '#000' });
    const style2 = `${style}.${className2}{color:#000}`;
    expect(renderer.forceRenderStyles()).toBe(renderer);
    expect(target.textContent).toBe(style2);
    expect(renderer.getStyles()).toBe(style2);

    // Override styles target
    const target2 = { textContent: '' };
    expect(renderer.setStylesTarget(target2)).toBe(renderer);
    expect(target.textContent).toBe('');
    expect(target2.textContent).toBe(style2);
    expect(renderer.getStyles()).toBe(style2);

    // Organic render
    const forceRenderStyles = renderer.forceRenderStyles;
    renderer.forceRenderStyles = () => {
      forceRenderStyles();
      expect(target2.textContent).toBe('');
      done();
      return renderer;
    };
    expect(renderer.clear().getStyles()).toBe('');
  });

  it('should automatically create a render tag', () => {
    const renderer = new Renderer({ autoGenerateTag: true });
    const className = renderer.style({ color: '#fff' });
    const style = `.${className}{color:#fff}`;
    renderer.forceRenderStyles();
    expect((renderer.tag as StylesTarget).textContent).toBe(style);

    (window as any).isServer = true;

    const renderer2 = new Renderer({ autoGenerateTag: true });
    const className2 = renderer2.style({ color: '#fff' });
    const style2 = `.${className2}{color:#fff}`;
    renderer2.forceRenderStyles();
    expect((renderer2.tag as StylesTarget).textContent).toBe(style2);

    delete (window as any).isServer;
  });
});
