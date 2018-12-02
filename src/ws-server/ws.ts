import * as WebSocket from 'ws';

import { Config, Interfaces } from '../config/base';
import { Web3Control } from '../controlers/web3';

export interface IWs {
  type: string;
  body?: any;
  ws: WebSocket;
  wallet: Web3Control;
}

export const wsforeman = async (data: IWs): Promise<void> => {
  
  function errorHandler(error: Error | string): void {
    let serialization: string;

    if (error && error['message']) {
      serialization = JSON.stringify({
        type: Config.WSEvent.ERROR,
        body: error['message']
      });
    } else {
      serialization = JSON.stringify({
        type: Config.WSEvent.ERROR,
        body: error
      });
    }

    data.ws.send(serialization);
  }

  function transactionHandler(hashOrBlock: Interfaces.ITx): void {
    if (hashOrBlock.hash) {
      data.ws.send(JSON.stringify({
        type: Config.WSEvent.ON_HASH,
        body: hashOrBlock
      }));
    } else if (hashOrBlock.block) {
      data.ws.send(JSON.stringify({
        type: Config.WSEvent.ON_BLOCK,
        body: hashOrBlock
      }));
    } else if (hashOrBlock['error']) {
      errorHandler(hashOrBlock['error']);
    }
  }

  switch (data.type) {

    case Config.WSEvent.BALANCE_ALL:
      const balance = data.wallet.onAllBalance({ take: +Config.ENV.numberOf });
      balance.subscribe(result => {
        data.ws.send(JSON.stringify({
          type: Config.WSEvent.BALANCE_INFO,
          body: result
        }));
      }, errorHandler);
      break;

    case Config.WSEvent.ADDRESSES_SHOW:
      const addresses = await data.wallet.storage.getAddresses({ take: +Config.ENV.numberOf });
      const body = JSON.stringify({ type: Config.WSEvent.WALLET_INFO, body: addresses });
      data.ws.send(body);
      break;

    case Config.WSEvent.WALLET_GET_PRIVATE:
      const wallets = await data.wallet.onWalletExport();
      const walletBody = JSON.stringify({ type: Config.WSEvent.WALLET_EXPORT, body: wallets });
      data.ws.send(walletBody);
      break;

    case Config.WSEvent.SET_GAS_LIMIT:
      if (typeof data.body != 'number') break;
      if (data.body != 1) data.wallet.gasLimit = data.body;
      data.ws.send(JSON.stringify({
        type: Config.WSEvent.GET_GAS_LIMIT,
        body: data.wallet.gasLimit
      }));
      break;

    case Config.WSEvent.SET_GAS_PRICE:
      if (typeof data.body != 'number') break;
      if (data.body != 1) data.wallet.gasPrice = data.body;   
      data.ws.send(JSON.stringify({
        type: Config.WSEvent.GET_GAS_PRICE,
        body: data.wallet.gasPrice
      }));
      break;

    case Config.WSEvent.SYNCHRONIZATION:
      const txSync = await data.wallet.onAccountSync(data.body);
      txSync.subscribe(transactionHandler, errorHandler);
      break;

    case Config.WSEvent.SEND_A_TRANSACTION:
      const txOne = await data.wallet.onSingleTx(data.body);
      txOne.subscribe(transactionHandler, errorHandler);
      break;
    
    case Config.WSEvent.SEND_POOL_TRANSACTION:
      const txPool = await data.wallet.onPoolMapTx(data.body);
      txPool.subscribe(transactionHandler, errorHandler);
      break;

    default: break;
  }

};
