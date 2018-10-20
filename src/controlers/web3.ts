import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Wallet } from '../ether/wallet';
import { Storage } from './storage';
import { Interfaces } from '../config/base';
import { Utils } from './utils';


export class Web3Control extends Wallet {
  /**
   * @param storage: Вatabase instance controller.
   * @param gasPrice: Default gas value.
   * @param gasLimit: Default gas limit value.

   * @method preStart: For encrypt or create wallet.
   * @method onCreateWallet: Create wallet.
   * @method onSingleTx: Create one transaction.
   * @method onSingleBalance: Get one address balance.
   * @method onAllBalance: Get all accaunts balance.
   * @method onAccountSync: Account balance synchronization.
   * @method onPoolMapTx: Create pool transactions with interval.
   */

  private storage = new Storage();
  
  public gasPrice = 3000000000;
  public gasLimit = 210000;

  constructor(password: string, numberof: number = 5) {
    /**
     * @param password: Password for encrypt accaunt.
     * @param numberof: This number, a number of accounts.
     */
    super();
    this.preStart(password, numberof);
  }

  private async preStart(password: string, numberof: number) {
    /**
     * @returns: Decrypt wallet.
     */
    let encryptWallet = await this.storage.encryptAccaunt;

    if (encryptWallet.length <= 0) {
      await this.onCreateWallet(password, numberof);
      encryptWallet = await this.storage.encryptAccaunt;
    }

    this.accounts.wallet.decrypt(encryptWallet, password);
  }

  private async onCreateWallet(password: string, numberof: number): Promise<void> {
    const addresess = this.onGenWallets(numberof);
    const obj = this.onEncrypt(password);
  
    await this.storage.dependencies(obj);
    await this.storage.createAddress(addresess);
  }

  public async onSingleTx(data: Interfaces.ITxData) {
    /**
     * @param data: Transaction data object.
     */
    const nonce = await this.eth.getTransactionCount(data.from);
    
    data.gasPrice = data.gasPrice || 3000000000;
    data.gasLimit = data.gasLimit || 210000;
    data.nonce = nonce;

    const block = this.sendTransaction(data).subscribe(blockOrHash => {
      console.log(blockOrHash);
    }, err => {
      console.log(err); 
    }, () => {
      console.log('done');
      block.unsubscribe();
    });
  }

  public async onSingleBalance(address: string): Promise<string | number> {
    /**
     * @param address: Ether address in hex.
     */
    return await this.eth.getBalance(address);
  }

  public async onAllBalance(data: Interfaces.IPaginate) {
    /**
     * @param data: Type orm object, limit or ofset.
     */
    const addresess = await this.storage.getAddresses(data);

    const balance = addresess.map(async address => {
      return {
        balance: await this.onSingleBalance(address.address),
        address: address.address
      }
    });

    balance.forEach(async el => {
      console.log(await el);
    });

    return balance;
  }

  public async onAccountSync(address: string, data: Interfaces.IPaginate) {
    /**
     * @param address: Ether address in hex.
     * @param data: Type orm data limit and ofset.
     */
    const count = await this.storage.count();
    const balance = await this.onSingleBalance(address);
    const toEach = +balance / count;
    const addresess = await this.storage.getAddresses(data);
    let nonce = await this.eth.getTransactionCount(address);
    const source = from(addresess);

    source.pipe(map(storeAddress => {
      // Sorting. //
      const txData = <Interfaces.ITxData>{
        nonce: nonce,
        from: address,
        to: storeAddress.address,
        value: toEach,
        gasPrice: this.gasPrice,
        gasLimit: this.gasLimit
      };

      nonce++;
      
      return txData;
    })).forEach(txData => {
      // Sending transaction.
      this.sendTransaction(txData).subscribe(console.log);
    });
  }

  public async onPoolMapTx(inputs: Interfaces.ITxFuncInput): Promise<Observable<any>> {
    /**
     * @param inputs: Inputs object for Sendig transactionCount.
     */
    const addresess = await this.storage.getAddresses(inputs.data);
    const source = from(addresess);

    return new Observable(observable => {
      source.pipe(map(storeAddress => {
        return {
          txData: <Interfaces.ITxData>{
            from: storeAddress.address,
            to: inputs.address,
            value: Utils.onRandom(inputs.min, inputs.max),
            gasPrice: Utils.onRandom(inputs.gas.min, inputs.gas.max),
            gasLimit: this.gasLimit
          },
          address: storeAddress
        };
      })).forEach(async txData => {
        const data = txData.txData;
        const timer = await Utils.onRandom(inputs.time.min, inputs.time.max);

        setTimeout(async () => {
          data.nonce = await this.eth.getTransactionCount(data.from);
          const txBlock = this.sendTransaction(data).subscribe(blockOrHash => {

            observable.next({ tx: blockOrHash, timer: timer });

            if (blockOrHash.hash) {
              this.storage.onSetTx({
                transactionHash: blockOrHash.hash,
                address: txData.address
              });
            }

            if (blockOrHash.block) {
              this.storage.onUpdateTx(blockOrHash.block);
              txBlock.unsubscribe();
            }
          });
        }, timer);
      });
    });    
  }

}
