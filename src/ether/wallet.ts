import * as Web3 from 'web3';

import { Config } from '../config/base';
import { Interfaces } from '../config/base';
import { Observable } from 'rxjs';

export class Wallet {
  /**
   * @param _web3: Web3 Object, for work with ether.
   * @param eth: web3.eth.
   * @param accounts: web3.eth.accounts.
   * @param utils: web3.utils.
   * @param addresses: web3.eth.getAccounts.
   * 
   * @method onGenWallets: Wallet generation.
   * @method onEncrypt: Wallet encrypt.
   * @method sendTransaction: Create and send transaction.
   */

  private _web3 = new Web3(Config.Cnf.HttpProvider);
  protected eth = this._web3.eth;
  protected accounts = this._web3.eth.accounts;
  public utils = this._web3.utils;
  protected addresses = this._web3.eth.getAccounts;

  constructor() { }

  protected onGenWallets(numberof: number = 5): string[] {
    /**
     * @param numberof: Number of accounts.
     */
    const entropy = this.utils.randomHex(32);
    const wallet = this.accounts.wallet.create(numberof ,entropy);
    let addresses = [];

    for (const key of Object.keys(wallet)) {
      if (!wallet[key].address) {
        break;
      } else {
        addresses.push(wallet[key].address);
      }
    }

    return addresses;
  }

  protected onEncrypt(password: string): Interfaces.IEncryptAccaunt[] {
    /**
     * @param passowd: Your password string.
     */
    if (!password || password.length <= 6) {
      throw new Error('min passowd length 7 characters');
    }

    return this.accounts.wallet.encrypt(password);
  }

  protected sendTransaction(data: Interfaces.ITxData): Observable<Interfaces.ITx> {
    return new Observable(obs => {
      this._web3.eth.sendTransaction(data, (err, hash) => {
        if (err) {
          obs.error(err);
        }

        obs.next({ hash: hash });
      }).then(block => {
        obs.next({ block: block });
        obs.complete();
      }).catch(err => {
        obs.error(err);
        obs.complete();
      });
    });
  }

}
