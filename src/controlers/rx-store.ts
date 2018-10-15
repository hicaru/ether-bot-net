
export enum StoreActions {
  SEND_TX = 'SENDTX',
  SET_BD_TX = 'SETBDTX',
  UPDATE_TX = 'UPDATETX'
}

export interface IAction {
  type: StoreActions;
  payload: any;
}

export const botReducer = (state = {}, action: IAction) => {
  switch (action.type) {

    case StoreActions.SEND_TX:
      return action;

    case StoreActions.SET_BD_TX:
      return action;
    
    case StoreActions.UPDATE_TX:
      return action;

    default:
      return state;
  }
};