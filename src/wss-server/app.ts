import 'colors';
import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';
import { Observable } from 'rxjs';

import { Config, Interfaces } from '../config/base';
import { Web3Control } from '../controlers/web3';
import { ISoketEvent, WsConfig } from './config';

const app = express();
const server = http.createServer(app);

export class WsServer {

  private ws: WebSocket.Server;
  private port: number;
  private wallet: Web3Control;

  public soket: Observable<ISoketEvent> = new Observable(soketEvent => {
    this.ws.on(WsConfig.CONNECTION, (ws: WebSocket) => {
      // Create soket connecting. //
      ws.on(WsConfig.MESSAGE, (message: string) => {
        let emitObjec: object;

        try {
          emitObjec = JSON.parse(message);
        } catch (err) {
          console.log(err.massage);
          return soketEvent.error(err.massage);
        }

        soketEvent.next({
          type: emitObjec['type'],
          body: emitObjec['body'],
          ws: ws
        });

      });
    });
  });

  constructor(port: number = 8999, password: string) {
    this.wallet = new Web3Control(password, Config.ENV.numberOf);
    this.wallet.env = Config.ENV.web;
    this.port = port;
    this.ws = new WebSocket.Server({ server });
    this.httpRun();
    this.eventListen();
  }

  private httpRun(): void {
    server.listen(process.env.PORT || this.port, () => {
      console.log(`Http server started on port ${server.address()['port']}`.green);
      console.log(`ws server is started on port ${this.port}`.cyan);
    });
  }

  private eventListen() {
    this.soket.subscribe(async event => {
      if (!event) {
        return null;
      }

      switch (event.type) {

        case Config.WSEvent.WALLET_INFO:
          try {
            const wallet: Interfaces.IexportAccaunt[] = this.wallet.onWalletExport();
            event.ws.send(JSON.stringify(wallet));
          } catch (err) {
            event.ws.send(JSON.stringify({
              error: err.message
            }));
          }
          break;

        case Config.WSEvent.SET_GAS_LIMIT:
          if (typeof event.body === 'number') {
            this.wallet.gasLimit = <number>+event.body;
            event.ws.send(JSON.stringify({
              type: Config.WSEvent.SET_GAS_LIMIT,
              code: 'done'
            }));
          } else {
            event.ws.send(JSON.stringify({
              type: Config.WSEvent.SET_GAS_LIMIT,
              error: 'value must be a number'
            }));
          }
          break;

        case Config.WSEvent.SET_GAS_PRICE:
          if (typeof event.body === 'number') {
            this.wallet.gasPrice = <number>+event.body;
            event.ws.send(JSON.stringify({
              type: Config.WSEvent.SET_GAS_PRICE,
              code: 'done'
            }));
          } else {
            event.ws.send(JSON.stringify({
              type: Config.WSEvent.SET_GAS_PRICE,
              error: 'value must be a number'
            }));
          }
          break;

        case Config.WSEvent.SEND_POOL_TRANSACTION:
          try {
            const txPool = await this.wallet.onPoolMapTx(<Interfaces.ITxFuncInput>event.body);
            txPool.subscribe(hashOrBlock => {
              event.ws.send(JSON.stringify({
                type: Config.WSEvent.SEND_POOL_TRANSACTION,
                body: hashOrBlock
              }));
            }, err => {
              event.ws.send(JSON.stringify({
                error: err
              }));
            });
          } catch (err) {
            event.ws.send(JSON.stringify({
              error: err.message
            }));
          }

        case Config.WSEvent.SYNCHRONIZATION:
          try {
            const tx = await this.wallet.onAccountSync(event.body['address'], <Interfaces.IPaginate>event.body['data']);
            tx.subscribe(hashOrBlock => {
              event.ws.send(JSON.stringify({
                type: Config.WSEvent.SEND_A_TRANSACTION,
                body: hashOrBlock
              }));
            }, err => {
              event.ws.send(JSON.stringify({
                error: err.message
              }));
            });
          } catch (err) {
            event.ws.send(JSON.stringify({
              error: err.message
            }));
          }
          break;

        case Config.WSEvent.SEND_A_TRANSACTION:
          try {
            const tx = await this.wallet.onSingleTx(<Interfaces.ITxData>event.body);
            tx.subscribe(hashOrBlock => {
              event.ws.send(JSON.stringify({
                type: Config.WSEvent.SEND_A_TRANSACTION,
                body: hashOrBlock
              }));
            }, err => {
              event.ws.send(JSON.stringify({
                error: err.message
              }));
            });
          } catch (err) {
            event.ws.send(JSON.stringify({
              error: err.message
            }));
          }
          break;

        case Config.WSEvent.BALANCE:
          // event.body = {"type": 4, "body": "ether addres in hex string"}; //
          try {
            const singleBalance = await this.wallet.onSingleBalance(event.body);
            event.ws.send(JSON.stringify(<ISoketEvent>{
              type: Config.WSEvent.BALANCE,
              body: {
                address: event.body,
                ether: this.wallet.utils.fromWei(singleBalance, 'ether'),
                unit256: singleBalance
              }
            }));
          } catch (err) {
            event.ws.send(JSON.stringify({
              error: err.message
            }));
          }
          break;

        case Config.WSEvent.BALANCE_ALL:
          // event.body = {"type": 5, "body": {"take": 100, "skip": 0}}; //
          try {
            const balance = await this.wallet.onAllBalance(event.body);

            balance.forEach(async el => {
              const balance = await el;
  
              event.ws.send(JSON.stringify(<ISoketEvent>{
                type: Config.WSEvent.BALANCE_ALL,
                body: {
                  address: balance.address,
                  ether: this.wallet.utils.fromWei(balance.balance, 'ether'),
                  unit256: balance.balance
                }
              }));
            });
          } catch (err) {
            event.ws.send(JSON.stringify({
              error: err.message
            }));
          }
          break;

        default:
          break;
      }
    });
  }

}
