
// INJECTED
import {  IAction, IState, IApp, utils } from '../../shared';

const COMPONENT_NAME = 'LayoutFooterService';
const actions: any = {};
const reducers: any = {};

/* ACTIONS
***********************************************/

enum ActionType {
  GET_NAME
}

actions.name = utils.createAction(ActionType.GET_NAME);

/* REDUCERS
***********************************************/

const init: IState<IApp> = {};

reducers.main = (state: IState<IApp> = init, action: IAction) => {

  switch (action.type) {
    case ActionType.GET_NAME:
      console.log(`Hello ${COMPONENT_NAME}.`);
  }

  return state;

};

/* EXPORTS
***********************************************/

export {
  actions,
  reducers
}
