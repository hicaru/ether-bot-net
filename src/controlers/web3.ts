import 'colors';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Wallet } from '../ether/wallet';
import { Storage } from './storage';
import { Interfaces, Config } from '../config/base';
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
   * @method onWalletExport: Export all accauntes {address, privateKey}.
   */

  public storage = new Storage();
  public gasPrice = 3000000000;
  public gasLimit = 21000;
  public env = Config.ENV.console;

  constructor(password: string, numberof: number) {
    /**
     * @param password: Password for encrypt accaunt.
     * @param numberof: This number, a number of accounts.
     */
    super();
    this.run(password, numberof);
  }

  private onConsoleTxShow(blockOrHash: Interfaces.ITx, data: Interfaces.ITxData) {
    if (blockOrHash.hash) {
      console.log(
        `tx hash: ${blockOrHash.hash},`.green,
        `to: ${data.to},`.blue,
        `gas price: ${this.utils.fromWei(data.gasPrice, 'gwei')} gwei`.red
      );
    } else if (blockOrHash.block) {
      console.log(
        `block number: ${blockOrHash.block.blockNumber},`.blue,
        'status: ' + blockOrHash.block.status ? 'true'.green : 'false'.red,
        `address: ${data.from}`.cyan,
        `tx hash: ${blockOrHash.block.transactionHash}`.white
      );
    }
  }

  private async onCreateWallet(password: string, numberof: number): Promise<void> {
    const addresess = this.onGenWallets(numberof);
    const obj = this.onEncrypt(password);
  
    await this.storage.dependencies(obj);
    await this.storage.createAddress(addresess);
  }

  public async run(password: string, numberof: number) {
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

  public async onSingleTx(data: Interfaces.ITxData): Promise<Observable<Interfaces.ITx>> {
    /**
     * @param data: Transaction data object.
     */
    const nonce = await this.eth.getTransactionCount(data.from);
    const balance = await this.onSingleBalance(data.from);
    data.gasPrice = data.gasPrice || this.gasPrice;
    data.gasLimit = data.gasLimit || this.gasLimit;
    data.nonce = nonce;

    if (+balance <= +data.value) {
      // If random value > balance this address. //
      // gasPrice * gasLimit = Actual Tx Cost/Fee. //
      data.value = (+balance - (+data.gasPrice * +data.gasLimit));
    }

    return this.sendTransaction(data);
  }

  public async onSingleBalance(address: string): Promise<string | number> {
    /**
     * @param address: Ether address in hex.
     */
    return await this.eth.getBalance(address);
  }

  public async onAllBalance(data: Interfaces.IPaginate): Promise<Observable<Interfaces.IRresultCnr>> {
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

    return new Observable(result => {
      const elements: Interfaces.IBalance[] = [];

      balance.forEach(async (el, index) => {
        const object =  await el;
        elements.push(<Interfaces.IBalance>{
          address: object.address,
          balance: +this.utils.fromWei(object.balance, 'ether'),
          unit256: +object.balance
        });

        if (balance.length === elements.length) {
          result.next({
            result: elements,
            json: JSON.stringify(elements)
          });
          result.complete();
        }
      });
    });
  }

  public async onAccountSync(address: string, data: Interfaces.IPaginate): Promise<Observable<Interfaces.ITx>> {
    /**
     * @param address: Ether address in hex.
     * @param data: Type orm data limit and ofset.
     */
    const count = await this.storage.count();
    const balance = await this.onSingleBalance(address);
    const toEach = (+balance / count).toFixed();
    const addresess = await this.storage.getAddresses(data);
    let nonce = await this.eth.getTransactionCount(address);
    
    const source = from(addresess);
    const txsDataPool = source.pipe(map(storeAddress => {
      // Create pool data tx. //
      const txData = {
        data: <Interfaces.ITxData>{
          nonce: nonce,
          from: address,
          to: storeAddress.address,
          value: toEach,
          gasPrice: this.gasPrice,
          gasLimit: this.gasLimit
        },
        address: storeAddress
      }

      nonce++;
      
      return txData;
    }));

    return new Observable(observer => {
      txsDataPool.forEach(txData => {
        // Each iteration sends a transaction. //
        const data = txData.data;
        const txBlock = this.sendTransaction(data).subscribe(blockOrHash => {
          observer.next(blockOrHash);
          
          if (blockOrHash.hash) {
            this.storage.onSetTx({
              transactionHash: blockOrHash.hash,
              address: txData.address
            });
          }

          if (this.env === Config.ENV.console) {
            this.onConsoleTxShow(blockOrHash, data);
          }

          if (blockOrHash.block) {
            this.storage.onUpdateTx(blockOrHash.block);
            txBlock.unsubscribe();
          }
        }, err => {
          observer.error(err);
        });
      });
    });
  }

  public async onPoolMapTx(inputs: Interfaces.ITxFuncInput): Promise<Observable<Interfaces.ITxPool | any>> {
    /**
     * @param inputs: Inputs object for Sendig transactionCount.
     */
    const addresess = await this.storage.getAddresses(inputs.data);
    const source = from(addresess);
    const txsDataPool = source.pipe(map(storeAddress => {
      return {
        txData: <Interfaces.ITxData>{
          from: storeAddress.address,
          to: inputs.address,
          value: Utils.onRandom(inputs.min, inputs.max).toFixed(),
          gasPrice: Utils.onRandom(inputs.gas.min, inputs.gas.max),
          gasLimit: this.gasLimit,
          data: inputs.contractCode
        },
        address: storeAddress
      };
    }));

    return new Observable(observer => {
      txsDataPool.forEach(async txData => {
        const data = txData.txData;
        const timer = await Utils.onRandom(inputs.time.min, inputs.time.max);

        setTimeout(async () => {
          data.nonce = await this.eth.getTransactionCount(data.from);
          const balance = await this.onSingleBalance(data.from);

          if (+balance <= +data.value) {
            // If random value > balance this address. //
            // gasPrice * gasLimit = Actual Tx Cost/Fee. //
            data.value = (+balance - (+data.gasPrice * +data.gasLimit));
          }

          const txBlock = this.sendTransaction(data).subscribe(blockOrHash => {

            observer.next({ tx: blockOrHash, timer: timer });

            if (blockOrHash.hash) {
              this.storage.onSetTx({
                transactionHash: blockOrHash.hash,
                address: txData.address
              });
            }

            if (this.env === Config.ENV.console) {
              this.onConsoleTxShow(blockOrHash, data);
            }

            if (blockOrHash.block) {
              this.storage.onUpdateTx(blockOrHash.block);
              txBlock.unsubscribe();
            }
          }, err => {
            const txFree = (+data.gasPrice * +data.gasLimit).toString();

            observer.next({
              address: data.from,
              value: this.utils.fromWei(data.value, 'ether'),
              gasPrice: this.utils.fromWei(data.gasPrice, 'ether'),
              balance: this.utils.fromWei(balance, 'ether'),
              costFree: this.utils.fromWei(txFree, 'ether')
            });

            console.log(
              `skip tx address: ${data.from} tx fail,`.red,
              `value: ${this.utils.fromWei(data.value, 'ether')} ETH,`.magenta,
              `gas price: ${this.utils.fromWei(data.gasPrice, 'ether')} ETH,`.magenta,
              `balance: ${this.utils.fromWei(balance, 'ether')} ETH,`.magenta,
              `Cost/Fee: ${this.utils.fromWei(txFree, 'ether')} ETH`.magenta
            );
          });
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
