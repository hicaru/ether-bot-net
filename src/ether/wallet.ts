import * as Web3 from 'web3';

import { Config } from '../config/base';
import { Interfaces } from '../config/base';
import { Observable } from 'rxjs';

import { Web3Interfaces } from './web3-Interface';


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

  private _web3: Web3Interfaces.IWeb3 = new Web3(Config.Cnf.HttpProvider);
  protected eth = this._web3.eth;
  protected accounts = this._web3.eth.accounts;
  
  public utils: Web3Interfaces.IUtils = this._web3.utils;
  public addresses: string[];

  constructor() { }

  protected onGenWallets(numberof: number = Config.ENV.numberOf): string[] {
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
    return new Observable(ObservableTx => {
      this._web3.eth.sendTransaction(data, (err, hash) => {
        if (err) {
          ObservableTx.error(err);
          ObservableTx.complete();
          ObservableTx.unsubscribe();
        }

        ObservableTx.next({ hash: hash });
      }).then(block => {
        ObservableTx.next({ block: block });
        ObservableTx.complete();
        ObservableTx.unsubscribe();
      }).catch(err => {
        ObservableTx.error(err);
        ObservableTx.complete();
        ObservableTx.unsubscribe();
      });
    });
  }

  public onWalletExport(): Interfaces.IAccaunt[] {
    const keys = Object.keys(this.accounts.wallet);
    const elements: Interfaces.IAccaunt[] = [];

    for (let key = 0; key < keys.length; key++) {
      let accaunt = this.accounts.wallet[key.toString()];
      try {
        elements.push({
          address: accaunt['address'],
          privateKey: accaunt['privateKey']
        });
      } catch (err) {
        break;
      }
    }

    return elements;
  }

  public onAddresses(data: Interfaces.IPaginate): string[] {
    if (data.skip >= data.take) {
      throw new Error(`skip can't be bigger than take`);
    }
    if (data.take <= 0) {
      throw new Error(`take can not be zero`);
    }

    const skip = +data.skip || 0;
    const take = +data.take || Config.ENV.numberOf;
    const wallet = this.onWalletExport();
    const addresses = [];

    for (let i = skip; i <= take; i++) {
      addresses.push(wallet[i].address);
    }

    return addresses;
  }

}
