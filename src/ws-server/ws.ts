import * as WebSocket from 'ws';

import { Config, Interfaces } from '../config/base';
import { Web3Control } from '../controlers/web3';
import { ISoketEvent, WsConfig } from './config';

export interface IWs {
  type: string;
  body?: any;
  ws: WebSocket;
  wallet: Web3Control;
}

export const wsforeman = async (data: IWs): Promise<void> => {

  switch (data.type) {

    case Config.WSEvent.BALANCE_ALL:
      const balance = await data.wallet.onAllBalance({ take: 100, skip: 0 });

      balance.subscribe(result => {
        data.ws.send(result.json);
      }, err => {
        data.ws.send(JSON.stringify({ error: err.message }));
      });
      break;

    default: break;
  }

};
