import { types } from 'typestyle';

export interface ClassNames { [name: string]: string; }
export interface InlineStyles { [name: string]: any; }

export type StaticStyle = Partial<types.NestedCSSProperties>;
export type StyleGenerator<P> = (props: P) => StaticStyle;
export interface StaticSheet { [name: string]: StaticStyle; }
export interface XDynamicSheet<P> { [name: string]: StyleGenerator<P>; }
export interface DynamicSheet<P> { [name: string]: StyleGenerator<P> | StaticStyle; }
export type SheetGenerator<P> = (props: P) => DynamicSheet<P>;

export type Plugin = (
  style: { [property: string]: any },
  type: string,
  renderer: any,
  props?: { [key: string]: any },
) => { [property: string]: any };

export interface StylesTarget { textContent: string | null; }
