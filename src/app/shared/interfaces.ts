
import { Store, Action } from 'redux';
import { RouteComponentProps } from 'react-router-dom';

/* TYPES
***************************************************************************************/

export type CreateAction = (...args: any[]) => IAction;
export type PayloadCreator = (...args: any[]) => any;

/* COMMON
***************************************************************************************/

export interface IState<T> {
  [key: string]: T;
}

export interface IMetatadata {
  [key: string]: any;
}

export interface IAction extends Action {
  type: string | number;
  payload?: any;
  error?: boolean;
  meta?: IMetatadata;
}

export interface IProps<T> extends RouteComponentProps<T> {
  [key: string]: any;
}

/* COMPONENTS
***************************************************************************************/

export interface IApp {
  name: string;
}

export interface IAppState extends Store<IAppState> {
  app: IApp;
}

