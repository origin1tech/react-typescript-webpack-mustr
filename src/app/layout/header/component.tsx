
import * as React from 'react';
import { render } from 'react-dom';
import { Store } from 'redux';
import { IAppState, IProps, store, utils, styles } from '../../shared';

// INJECT //

class LayoutHeaderComponent extends React.Component<IProps<any>, any>  {


  constructor(props: any, context: any) {
    super(props, context)
  }

  /* LIFECYCLE EVENTS
  *****************************************************************/

  // componentWillMount?() { }

  // componentDidMount?() { }

  // componentWillUpdate?(nextProps, nextState, nextContext) { }

  // componentDidUpdate?(prevProps, prevState, prevContext) { }

  // componentWillUnmount?() { }

  /* METHODS
  *****************************************************************/


  /* RENDERING
  *******************************************************************/

  render(): JSX.Element {
    return (<div>LayoutHeader works!</div>);
  }

}

export { LayoutHeaderComponent as Component }
