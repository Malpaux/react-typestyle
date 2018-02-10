# React integration of TypeStyle

[![wercker status](https://app.wercker.com/status/82d78fe58e6950eaf9236372ba412372/s/master "wercker status")](https://app.wercker.com/project/byKey/82d78fe58e6950eaf9236372ba412372)

React-TypeStyle provides a higher-order component to easily use [TypeStyle](http://typestyle.io/#/) to style your React components. It automatically handles dynamic style updates, caching and deduping across all components.


## Install

using [yarn](https://yarnpkg.com/en/)
```shell
yarn add react-typestyle
```

or npm
```shell
npm install --save react-typestyle
```

## Usage
Just add a static ```styles``` field to your React component and wrap it in the ```withStyles``` higher-order component. You can now access generated class names via ```props.classNames```.

### Example
#### TypeScript
```typescript
import withStyles, { InjectedProps, InputSheet } from 'react-typestyle';

interface Props {
  name: string;
  pos: { x: number, y: number };
  theme: { color: string };
}

class Component extends React.PureComponent<Props & InjectedProps> {
  public static styles: InputSheet<Props> = {
    button: {
      background: 'transparent',
      border: 'none',
    },
    root: (props) => ({
      color: props.theme.color,
      position: 'absolute',
      transform: `translate(${props.pos.x}px,${props.pos.y}px)`,
    }),
  };

  public render() {
    const { classNames, name } = this.props;
    return (
      <div className={classNames.root}>
        <button className={classNames.button}>{name}</button>
      </div>
    );
  }
}

export default withStyles()<Props>(Component);
```

#### JavaScript
```javascript
import withStyles from 'react-typestyle';

class Component extends React.PureComponent {
  static styles = {
    button: {
      background: 'transparent',
      border: 'none',
    },
    root: (props) => ({
      color: props.theme.color,
      position: 'absolute',
      transform: `translate(${props.pos.x}px,${props.pos.y}px)`,
    }),
  };

  render() {
    const { classNames, name } = this.props;
    return (
      <div className={classNames.root}>
        <button className={classNames.button}>{name}</button>
      </div>
    );
  }
}

export default withStyles()(Component);
```

### Stateless Components
#### TypeScript
```typescript
import withStyles, { InjectedProps, StyledStatelessComponent } from 'react-typestyle';

interface Props {
  name: string;
  pos: { x: number, y: number };
  theme: { color: string };
}

const Component: StyledStatelessComponent = ({ classNames, name }) => (
  <div className={classNames.root}>
    <button className={classNames.button}>{name}</button>
  </div>
);

Component.styles = {
  button: {
    background: 'transparent',
    border: 'none',
  },
  root: (props) => ({
    color: props.theme.color,
    position: 'absolute',
    transform: `translate(${props.pos.x}px,${props.pos.y}px)`,
  }),
};

export default withStyles()<Props>(Component);
```

#### JavaScript
```javascript
import withStyles from 'react-typestyle';

const Component = ({ classNames, name }) => (
  <div className={classNames.root}>
    <button className={classNames.button}>{name}</button>
  </div>
);

Component.styles = {
  button: {
    background: 'transparent',
    border: 'none',
  },
  root: (props) => ({
    color: props.theme.color,
    position: 'absolute',
    transform: `translate(${props.pos.x}px,${props.pos.y}px)`,
  }),
};

export default withStyles()(Component);
```

### Options
You can pass in general options and options specific to the wrapped component.

```javascript
withStyles(options)(Component, componentOptions)
```

#### ```options```
- ```plugins?: Array<(style: { [property: string]: any }, type: string, renderer: any, props?: { [key: string]: any }) => { [property: string]: any }>```  
Plugins for further style transformations. The plugin API is compatible with most [Fela](http://fela.js.org/#) plugins, e.g. [```fela-plugin-prefixer```](https://github.com/rofrischmann/fela/tree/master/packages/fela-plugin-prefixer)

- ```renderer: Registry```  
A registry instance the component's styles will be mounted to. Defaults to a global ```Renderer``` instance

- ```shouldStylesUpdate: <Props>(props: Props, nextProps: Props) => boolean```  
Used to check whether styles should to be rerendered. Defaults to a shallow comparison of next and current props

#### ```componentOptions```
- ```styles: InputSheet<Props>```  
Alternative style sheet, overwrites ```styles``` field of wrapped component

### Server Side Rendering
Just like TypeStyle itself, React-TypeStyle can easily be used for server side rendering.

```javascript
import { getStyles } from 'react-typestyle';

// Render the react app...

// Render to CSS style tag
const styleTag = `<style>${getStyles()}</style>`
// ^ send this as a part of your HTML response
```

*Note: As React-TypeStyle uses a custom renderer under the hood, you can not use TypeStyle's ```getStyles()``` function.*

### Utilities

#### Dynamic Extend
If you are using dynamic styles (your stylesheet includes functions), TypeStyle's standard ```extend``` won't work for you.  
If you want to compose dynamic styles, use React-TypeStyle's dynamic ```extend``` instead.

```javascript
import { extend } from 'react-typestyle';

// Compose styles
const styles = extend(
  ({ background }) => ({ background }),
  { color: '#fff' },
  () => ({}),
);

// Use them in the higher-order component
class Component extends React.PureComponent {
  static styles = {
    root: styles,
  };

  render() {/* ... */}
}
```

## Developing

This is what you do after you have cloned the repository:

```shell
yarn / npm install
npm run build
```

(Install dependencies & build the project.)

### Linting

Execute TSLint

```shell
npm run lint
```

Try to automatically fix linting errors
```shell
npm run lint:fix
```

### Testing

Execute Jest unit tests using

```shell
npm test

npm run test:coverage
```

Tests are defined in the same directory the module lives in. They are specified in '[module].test.js' files.

### Building

To build the project, execute

```shell
npm run build
```

This saves the production ready code into 'dist/'.
