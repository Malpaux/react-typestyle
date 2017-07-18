/**
 * The react-typestyle higher-order component
 * @file The main entry point
 * @author Paul Brachmann
 * @license Copyright (c) 2017 Malpaux IoT All Rights Reserved.
 */

import * as React from 'react';

import {
  ClassNames,
  DynamicSheet,
  Plugin,
  SheetGenerator,
} from '../types';
import Cache from './cache';
import Registry from './registry';

export type InputSheet<P> = DynamicSheet<P> | SheetGenerator<P>;

export interface InjectedProps {
  classNames: ClassNames;
}

export interface Options {
  plugins?: Plugin[];
  renderer: Registry;
  shouldStylesUpdate<P>(props: P, nextProps: P): boolean;
}

export interface ComponentOptions<P> {
  styles?: InputSheet<P>;
}

export interface StyledStatelessComponent<P = {}> extends React.StatelessComponent<P> {
  styles?: InputSheet<Readonly<P>>;
}

/** Higher-order component */
const hoc = ({ plugins, renderer, shouldStylesUpdate }: Options) =>
  <OriginalProps extends {}>(
    Component: ((React.ComponentClass<OriginalProps & InjectedProps>
      | React.StatelessComponent<OriginalProps & InjectedProps>)
    & { styles?: InputSheet<Readonly<OriginalProps>> }),
    componentOptions: ComponentOptions<Readonly<OriginalProps>> = {},
  ) => {
    type ResultProps = Readonly<OriginalProps>;

    // Get sheet
    const sheet: InputSheet<ResultProps> | undefined = componentOptions.styles || Component.styles;

    return class extends React.Component<ResultProps> {
      public static defaultProps = Component.defaultProps;
      public static propTypes = Component.propTypes;

      public classNames: ClassNames;
      public registry = new Cache<ResultProps>({ plugins }).register(sheet);

      /** Handle style sheet attach */
      public componentWillMount() {
        renderer.mount(this.registry);

        this.updateStyles(this.props);
      }

      /** Handle style sheet updates */
      public componentWillReceiveProps(nextProps: ResultProps) {
        if (shouldStylesUpdate(this.props, nextProps)) this.updateStyles(nextProps);
      }

      /** Handle style sheet detach */
      public componentWillUnmount() {
        renderer.unmount(this.registry);
      }

      /** React render */
      public render() {
        return <Component classNames={this.classNames} {...this.props} />;
      }

      /** Update styles */
      public updateStyles(props: ResultProps) {
        this.classNames = this.registry.render(props);
      }
    };
  };

export default hoc;
