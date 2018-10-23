import 'colors';
import * as readline from 'readline';
import { from, Observable } from 'rxjs';

import { Web3Control } from '../controlers/web3';
import { Interfaces, Config } from '../config/base';


enum EventsId {
  SEND_A_TRANSACTION = 1,
  SEND_POOL_TRANSACTION = 2,
  SYNCHRONIZATION = 3,
  BALANCE = 4,
  BALANCE_ALL = 5,
  ADDRESSES_SHOW = 6,
  EXIT = 9,
  SET_GAS_PRICE = 7,
  SET_GAS_LIMIT = 8,
  DEFAULT = 8
}

interface IEvent {
  type: number;
  body?: any;
  msg?: string;
}

export class ConsoleGUI {

  private wallet: Web3Control;
  private onInputEvents: Observable<IEvent> = new Observable(dispatch => {

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.options();
  
    rl.on('line', (input: string | number) => {
      switch (+input) {
        
        case EventsId.SEND_A_TRANSACTION:
          dispatch.next({
            type: EventsId.SEND_A_TRANSACTION,
            msg: 'Enter the address from which you are sending'.green
          });
          break;
        
        case EventsId.SET_GAS_PRICE:
          dispatch.next({
            type: EventsId.SET_GAS_PRICE,
            msg: 'Enter the address from which you are sending'.green
          });
          break;

        case EventsId.EXIT:
          dispatch.next({
            type: EventsId.EXIT,
            msg: 'Exit.'.red
          });
          rl.close();
          dispatch.unsubscribe();
          break;

        default:
          dispatch.next({
            type: EventsId.DEFAULT,
            msg: 'Wrong input data.'.yellow
          });
          break;
      }
    });
  });

  constructor(password: string) {
    this.preRun(password);
    this.onInputEvents.subscribe(event => console.log(event.msg));
  }

  private preRun(password: string): boolean {
    try {
      this.wallet = new Web3Control(password, Config.ENV.numberOf);
      return true;
    } catch (err) {
      return false;
    }
  }

  private options(): void {
    console.log('\n');
    console.log('\t[1] Send a transaction.'.bgBlack.cyan);
    console.log('\t[2] Wallet synchronization.'.bgBlack.cyan);
    console.log('\t[3] Send pool transaction.'.bgBlack.cyan);
    console.log('\t[4] Get address balance.'.bgBlack.cyan);
    console.log('\t[5] Get wallet balance.'.bgBlack.cyan);
    console.log('\t[6] Show my address.'.bgBlack.cyan);
    console.log(`\t[7] gas price ${this.wallet.gasPrice / 10e8}gwei`.bgBlack.cyan);
    console.log(`\t[8] gas limit ${this.wallet.gasLimit}`.bgBlack.cyan);
    console.log('\t[9] Exit.'.bgBlack.red);
  }

}


export const password: Promise<string> = new Promise((resolve, reject) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Password: '.cyan, (password: string) => {
    if (password) {
      resolve(password);
    } else {
      reject('Password cannot be empty');
    }

    rl.close();
  });
});