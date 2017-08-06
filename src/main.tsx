import * as React from 'react';
import { render } from 'react-dom';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import { AppComponent } from './app/app';

// Init for touch handlers.
injectTapEventPlugin();

// Render the application.
render(<AppComponent />, document.getElementById('app'));

