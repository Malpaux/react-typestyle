/**
 * @file Higher-order component test suite
 * @author Paul Brachmann
 * @license Copyright (c) 2017 Malpaux IoT All Rights Reserved.
 */

import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

import * as React from 'react';

import withStyles, { StyledStatelessComponent } from './hoc';
import Renderer from './renderer';

describe('withStyles higher-order component', () => {
  const renderer = new Renderer();
  const BaseComponent = (() => <div />) as StyledStatelessComponent<any>;

  beforeEach(() => {
    delete BaseComponent.styles;
    renderer.clear();
  });

  it('should pass in an empty classNames map for a component w/o styles field', () => {
    const WrappedComponent = withStyles({
      renderer,
      shouldStylesUpdate: () => true,
    })(BaseComponent);

    const classNames = Enzyme.shallow(<WrappedComponent />).prop('classNames');
    expect(classNames).toEqual({});
    expect(renderer.getStyles()).toBe('');
  });

  it('should render static styles', () => {
    BaseComponent.styles = {
      div: {
        position: 'relative',
      },
      root: {
        background: '#000',
        color: '#fff',
      },
    };

    const WrappedComponent = withStyles({
      renderer,
      shouldStylesUpdate: () => true,
    })(BaseComponent);

    const component = Enzyme.shallow(<WrappedComponent />);
    const classNames = component.prop('classNames');
    expect(classNames).toHaveProperty('div');
    expect(classNames).toHaveProperty('root');
    expect(renderer.getStyles()).toBe(`.${classNames.div}{position:relative}.${
      classNames.root}{background:#000;color:#fff}`);

    component.unmount();
    expect(renderer.getStyles()).toBe('');
  });

  it('should render dynamic styles', () => {
    interface Props {
      color: string;
      pos: {
        x: number,
        y: number,
      };
    }

    BaseComponent.styles = {
      div: ({ color, pos }: Props) => ({
        color,
        position: 'absolute',
        transform: pos && `translate(${pos.x}px,${pos.y}px)`,
      }),
      root: {
        background: '#000',
      },
    };

    const WrappedComponent = withStyles({
      renderer,
      shouldStylesUpdate: () => true,
    })(BaseComponent);

    const component = Enzyme.shallow(<WrappedComponent />);
    const classNames = component.prop('classNames');
    expect(classNames).toHaveProperty('div');
    expect(classNames).toHaveProperty('root');
    expect(renderer.getStyles()).toBe(`.${classNames.root}{background:#000}.${
      classNames.div}{position:absolute}`);

    const classNames2 = component.setProps({
      color: '#ff0000', pos: { x: 128, y: 0 },
    }).prop('classNames');
    expect(component.prop('color')).toBe('#ff0000');
    expect(component.prop('pos')).toEqual({ x: 128, y: 0 });
    expect(classNames2).toHaveProperty('div');
    expect(classNames2).toHaveProperty('root');
    expect(classNames2.root).toBe(classNames.root);
    expect(renderer.getStyles()).toBe(`.${classNames2.root}{background:#000}.${
      classNames2.div}{color:#ff0000;position:absolute;transform:translate(128px,0px)}`);

    component.unmount();
    expect(renderer.getStyles()).toBe('');
  });

  it('should overwrite the input styles', () => {
    BaseComponent.styles = {
      div: {
        position: 'relative',
      },
      root: {
        background: '#000',
        color: '#fff',
      },
    };

    const WrappedComponent = withStyles({
      renderer,
      shouldStylesUpdate: () => true,
    })(BaseComponent, { styles: {} });

    const component = Enzyme.shallow(<WrappedComponent />);
    expect(component.prop('classNames')).toEqual({});
    expect(renderer.getStyles()).toBe('');

    component.unmount();
    expect(renderer.getStyles()).toBe('');
  });

  it('should use a custom shouldStylesUpdate function', () => {
    interface Props {
      color: string;
      pos: {
        x: number,
        y: number,
      };
    }

    BaseComponent.styles = {
      div: ({ color, pos }: Props) => ({
        color,
        position: 'absolute',
        transform: pos && `translate(${pos.x}px,${pos.y}px)`,
      }),
      root: {
        background: '#000',
      },
    };

    const WrappedComponent = withStyles({
      renderer,
      shouldStylesUpdate: () => false,
    })(BaseComponent);

    const component = Enzyme.shallow(<WrappedComponent />);
    const classNames = component.prop('classNames');
    expect(classNames).toHaveProperty('div');
    expect(classNames).toHaveProperty('root');
    expect(renderer.getStyles()).toBe(`.${classNames.root}{background:#000}.${
      classNames.div}{position:absolute}`);

    const classNames2 = component.setProps({
      color: '#ff0000', pos: { x: 128, y: 0 },
    }).prop('classNames');
    expect(component.prop('color')).toBe('#ff0000');
    expect(component.prop('pos')).toEqual({ x: 128, y: 0 });
    expect(classNames2).toHaveProperty('div');
    expect(classNames2).toHaveProperty('root');
    expect(classNames2.root).toBe(classNames.root);
    expect(classNames2.div).toBe(classNames.div);
    expect(renderer.getStyles()).toBe(`.${classNames.root}{background:#000}.${
      classNames.div}{position:absolute}`);

    component.unmount();
    expect(renderer.getStyles()).toBe('');
  });

  // TODO: Test custom plugins
});
