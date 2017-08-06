
import * as React from 'react';
import { render } from 'react-dom';
import { Store } from 'redux';


// INJECTED
import { IAppState, IProps, store, utils, styles } from '../../shared';

class LayoutFooterComponent extends React.Component<IProps<any>, any>  {


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
    return (<div>LayoutFooter works!</div>);
  }

}

export { LayoutFooterComponent as Component }