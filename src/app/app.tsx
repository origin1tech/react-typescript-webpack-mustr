
// Framework Imports
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';

// Local Imports
import { utils, styles, store } from './shared';

// INJECTED
import * as footer from './layout/footer';
import * as header from './layout/header';
import * as about from './about';
import * as home from './home';

export class AppComponent extends React.Component<{}, {}> {

  constructor(props: any, context: any) {
    super(props, context);
  }

  render(): JSX.Element {

    return (
      <Provider store={store}>
        <Router>
          <div>
            <header>
              <div className={styles.logo}>
                React App
                </div>
              <nav>
                <ul>
                  <li><NavLink to='/' exact activeClassName={styles.active}>Home<span></span></NavLink></li>
                  <li><NavLink to='/about' activeClassName={styles.active}>About<span></span></NavLink></li>
                </ul>
              </nav>
            </header>
            <Route exact path='/' component={home.Component} />
            <Route path='/about' component={about.Component} />
          </div>
        </Router>
      </Provider>
    );

  }

}