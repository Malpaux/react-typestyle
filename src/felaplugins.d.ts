declare module 'fela-plugin-dynamic-prefixer' {
  type Plugin = (style: { [key: string]: any }) => ({ [key: string]: any });
  const creator: () => Plugin;
  export default creator;
}

declare module 'fela-plugin-extend' {
  type Plugin = (style: { [key: string]: any }) => ({ [key: string]: any });
  const creator: () => Plugin;
  export default creator;
}

declare module 'fela-plugin-fallback-value' {
  type Plugin = (style: { [key: string]: any }) => ({ [key: string]: any });
  const creator: () => Plugin;
  export default creator;
}

declare module 'fela-plugin-prefixer' {
  type Plugin = (style: { [key: string]: any }) => ({ [key: string]: any });
  const creator: () => Plugin;
  export default creator;
}

declare module 'fela-plugin-remove-undefined' {
  type Plugin = (style: { [key: string]: any }) => ({ [key: string]: any });
  const creator: () => Plugin;
  export default creator;
}

declare module 'fela-plugin-validator' {
  type Plugin = (style: { [key: string]: any }, type: string) => ({ [key: string]: any });
  const creator: () => Plugin;
  export default creator;
}
