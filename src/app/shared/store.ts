
// Framework Imports
import { createStore, combineReducers, Action, Store, ReducersMapObject, Reducer, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';

// Local Imports
import { PayloadCreator, IMetatadata, CreateAction, IState, IAppState, IAction } from './interfaces';
import * as utils from './utils';

// INJECTED
import * as footer from '../layout/footer';
import * as header from '../layout/header';
import * as about from '../about';
import * as home from '../home';

/* Reducers
***********************************************/

const tmpReducers: any = {
  // REDUCERS
  footer: footer.reducers,
  header: header.reducers,
  about: about.reducers,
  home: home.reducers
};

// Reducers Map
const reducersMap: ReducersMapObject = {};

// Iterate temp reducers and build map.
utils.keys(tmpReducers).forEach((k) => {

  let key = `${k}.`;
  const reducers = tmpReducers[k];

  utils.keys(reducers).forEach((id) => {
    key += id;
    reducersMap[key] = reducers[id];
  });

});

// Combine Reducers
const reducers = combineReducers<IAppState>(reducersMap);


/* Middleware
***********************************************/

// Create Redux Logger
const logger = createLogger({});

// Apply Middleware
const middleware = applyMiddleware(logger);


/* Create & Export Store
************************************************/

// Create the Store.
export const store: Store<IAppState> =
  createStore(reducers, composeWithDevTools(middleware));