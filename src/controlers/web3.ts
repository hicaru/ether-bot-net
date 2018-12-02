import 'colors';
import { from, Observable, of, merge } from 'rxjs';
import { map, mergeAll, mergeMap, concatMap, groupBy, toArray, mapTo } from 'rxjs/operators';

import { Wallet } from '../ether/wallet';
import { Storage } from './storage';
import { Interfaces } from '../config/base';
import { Utils } from './utils';
import { Address } from '../entity/address';
import { Web3Interfaces } from '../ether/web3-Interface';


export class Web3Control extends Wallet {
  /**
   * @param storage: Вatabase instance controller.
   * @param gasPrice: Default gas value.
   * @param gasLimit: Default gas limit value.
   * @param gasUsed: Gas used from last block.

   * @method run: Run wallet.
   * @method onCreateWallet: Create wallet.
   * @method onSingleTx: Create one transaction.
   * @method onSingleBalance: Get one address balance.
   * @method onAllBalance: Get all accaunts balance.
   * @method onAccountSync: Account balance synchronization.
   * @method onPoolMapTx: Create pool transactions with interval.
   * @method onWalletExport: Export all accauntes {address, privateKey}.
   * @method onGas: Get gas limit and gasUserd from last block.
   * @method print: Console write controll.
   */

  public storage = new Storage();
  public gasPrice: number | string;
  public gasLimit: number | string;
  public gasUsed: number | string;
  public logs: boolean = true;

  constructor(password: string, numberof: number) {
    /**
     * @param password: Password for encrypt accaunt.
     * @param numberof: This number, a number of accounts.
     */
    super();
    this.onGas();
    this.run(password, numberof);
  }

  private async onCreateWallet(password: string, numberof: number): Promise<void> {
    const addresess = this.onGenWallets(numberof);
    const obj = this.onEncrypt(password);
  
    await this.storage.dependencies(obj);
    await this.storage.createAddress(addresess);
  }
  private print(blockOrHash: Interfaces.ITx, data: Interfaces.ITxData): void {
    if (!this.logs) return null;
 
    if (blockOrHash.hash) {
      console.log(
        `[tx hash]: ${blockOrHash.hash},`.green,
        `[to]: ${data.to},`.blue,
        `[gas price]: ${this.utils.fromWei(data.gasPrice, 'gwei')} gwei`.red
      );
    } else if (blockOrHash.block) {
      console.log(
        `[block number]: ${blockOrHash.block.blockNumber},`.blue,
        '[status]: ' + blockOrHash.block.status ? 'true'.green : 'false'.red,
        `[address]: ${data.from}`.cyan,
        `[tx hash]: ${blockOrHash.block.transactionHash}`.white
      );
    }

    if (blockOrHash.error) {
      const txFree = (+data.gasPrice * +data.gas).toString();
      console.log(
        `[skip tx address]: ${data.from} tx fail,`.red,
        `[value]: ${this.utils.fromWei(data.value, 'ether')} ETH,`.magenta,
        `[gas price]: ${this.utils.fromWei(data.gasPrice, 'ether')} ETH,`.magenta,
        `[Cost/Fee]: ${this.utils.fromWei(txFree, 'ether')} ETH`.magenta,
        blockOrHash.error['message']
      );
    }
  }
  private async onGas(): Promise<{gasUsed: number | string, gasLimit: number | string}> {
    const blockNumber = await this.eth.getBlockNumber();
    const block: Interfaces.IBlock = await this.eth.getBlock(blockNumber);

    this.gasLimit = block.gasLimit || 21000;
    this.gasPrice = 3000000000;
    this.gasUsed = block.gasUsed || this.gasLimit;

    return { gasUsed: this.gasUsed, gasLimit: this.gasLimit };
  }

  public async run(password: string, numberof: number) {
    /**
     * @returns: Decrypt wallet.
     */
    let encryptWallet = await this.storage.encryptAccaunt;
    const gas = await this.onGas();

    if (encryptWallet.length <= 0) {
      await this.onCreateWallet(password, numberof);
      encryptWallet = await this.storage.encryptAccaunt;
    }
    
    this.accounts.wallet.decrypt(encryptWallet, password);

    this.gasLimit = gas.gasLimit;
  }

  public async onSingleTx(data: Interfaces.ITxData): Promise<Observable<Interfaces.ITx>> {
    /**
     * @param data: Transaction data object.
     */
    const address = await this.storage.onAddress(data.from);
    const balance = await this.onSingleBalance(data.from);

    if (!address) {
      throw new Error('address does not exist');
    }

    if (!data.nonce) {
      const nonce = await this.eth.getTransactionCount(data.from);
      data.nonce = this.utils.toHex(nonce);
    }

    if (!data.gasPrice) {
      data.gasPrice = this.utils.toHex(data.gasPrice || this.gasPrice);
    }

    if (!data.gasLimit) {
      data.gasLimit = this.utils.toHex(data.gasLimit || this.gasLimit);
    }

    if (this.utils.toBN(balance) <= this.utils.toBN(data.value)) {
      const _gasPrice = this.utils.toBN(data.gasPrice);
      const _gasLimit = this.utils.toBN(data.gasLimit);
      data.value = this.utils.toBN(balance).sub(_gasPrice.mul(_gasLimit));
    }

    return this.sendTransaction(data).pipe(
      map(blockOrHash => {

        if (blockOrHash.hash) {
          this.storage.onSetTx({
            transactionHash: blockOrHash.hash,
            address: address
          });
        }

        this.print(blockOrHash, data);

        if (blockOrHash.block) {
          this.storage.onUpdateTx(blockOrHash.block);
        }

        return blockOrHash;
      })
    );
  }

  public _onSingleTx(data: Interfaces.ITxData) {
    const address = from(this.storage.onAddress(data.from));
    const balance = from(this.onSingleBalance(data.from));
    const newTransaction = merge(address, balance);

    return newTransaction.pipe(
      toArray(),
      map(el => {

      })
    );
  }

  public async onSingleBalance(address: string): Promise<string | number> {
    /**
     * @param address: Ether address in hex.
     */
    return await this.eth.getBalance(address);
  }

  public onAllBalance(data: Interfaces.IPaginate) {
    /**
     * @param data: Type orm object, limit or ofset.
     */
    const addresess = from(this.storage.getAddresses(data)).pipe(
      mergeMap(address => from(address)),
      mergeMap(address => {
        return from(this.onSingleBalance(address.address)).pipe(
          map(balance => {
            const gwei = this.utils.toBN(this.utils.unitMap.Gwei);
            const unit = balance > gwei ? 'ether' : 'wei';

            return <Interfaces.IBalance>{
              address: address.address,
              balance: `${this.utils.fromWei(balance, unit)}${unit}`,
              unit256: balance
            }
          })
        );
      }),
      toArray()
    );

    return addresess;
  }

  public async onAccountSync(data: Interfaces.ISyncAccaunt) {
    /**
     * @param address: Ether address in hex.
     * @param data: Type orm data limit and ofset.
     */
    const count = this.utils.toBN(await this.storage.count());
    const balance = this.utils.toBN(await this.onSingleBalance(data.address));
    const toEach = balance.div(count);
    const addresess = await this.storage.getAddresses(data.data);
    const source = from(addresess);

    let nonce = await this.eth.getTransactionCount(data.address);
    
    const txsDataPool = source.pipe(
      map(storeAddress => {
        // Create pool data tx. //
        const forTxData: Interfaces.ITxData = {
          nonce: nonce,
          from: data.address,
          to: storeAddress.address,
          value: toEach,
          gasPrice: this.utils.toBN(data.gasPrice || this.gasPrice)
        };

        nonce++;
        
        return forTxData;
      })
    );

    return new Observable(observer => {
      let k: number = 0;

      txsDataPool.forEach(async dataPromise => {
        const data = await dataPromise;
        const tx = await this.onSingleTx(data);

        tx.subscribe(block => {
          observer.next(block);
        }, err => {
          observer.next({ error: err})
          k++;
        }, () => k++);

        if (k >= addresess.length) return observer.unsubscribe();
      });
    });
  }

  public async onPoolMapTx(inputs: Interfaces.ITxFuncInput): Promise<Observable<Interfaces.ITx>> {
    /**
     * @param inputs: Inputs object for Sendig transactionCount.
     */
    const addresess = await this.storage.getAddresses(inputs.data);
    const source = from(addresess);
    
    const txsDataPool = source.pipe(map((storeAddress: Address) => {
      /**
       * @method: Data preparation for transaction creation.
       * @returns: interval transaction promise.
       */
      const data: Interfaces.ITxData = {
        from: storeAddress.address,
        to: inputs.address,
        value: this.utils.toHex(Utils.onRandom(inputs.min, inputs.max).toFixed()),
        gasPrice: this.utils.toHex(Utils.onRandom(inputs.gas.min, inputs.gas.max).toFixed()),
        data: inputs.contractCode
      };

      return data;
    }));

    return new Observable(observer => {
      let k: number = 0;

      txsDataPool.forEach(async dataPromise => {
        const timer = Utils.onRandom(inputs.time.min, inputs.time.max);
        setTimeout(async () => {
          const data = await dataPromise;
          const tx = await this.onSingleTx(data);

          tx.subscribe(block => {
            observer.next(block);
          }, err => {
            observer.next({ error: err});
            k++;
          }, () => k++);

          if (k >= addresess.length) return observer.unsubscribe();
        }, timer);
      });
    });
  }

  public onWalletExport(): Interfaces.IexportAccaunt[] {
    const keys = Object.keys(this.accounts.wallet);
    const elements = [];

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

}
