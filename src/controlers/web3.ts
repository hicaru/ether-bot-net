import 'colors';
import { from, Observable, of } from 'rxjs';
import {
  map, mergeMap, toArray,
  catchError, delay, filter
} from 'rxjs/operators';

import { Wallet } from '../ether/wallet';
import { Storage } from './storage';
import { Interfaces } from '../config/base';
import { Utils } from './utils';


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
    this.run(password, numberof);
  }

  private async onCreateWallet(password: string, numberof: number): Promise<string[]> {
    const addresess = this.onGenWallets(numberof);
    const obj = this.onEncrypt(password);

    await this.storage.dependencies(obj);

    return addresess;
  }
  private print(blockOrHash: Interfaces.ITx, data: Interfaces.ITxData): void {
    if (!this.logs) return null;
 
    if (blockOrHash.hash) {
      console.log(
        `[hash]: ${blockOrHash.hash},`.green,
        `[to]: ${data.to},`.blue,
        `[gasPrice]: ${this.utils.fromWei(data.gasPrice, 'gwei')} gwei`.red,
        `[value]: ${this.utils.fromWei(data.value, 'ether')} ETH,`.magenta,
      );
    } else if (blockOrHash.block) {
      console.log(
        `[block number]: ${blockOrHash.block.blockNumber},`.blue,
        '[status]: ' + blockOrHash.block.status ? 'true'.green : 'false'.red,
        `[address]: ${data.from}`.cyan,
        `[tx hash]: ${blockOrHash.block.transactionHash}`.white,
        `[value]: ${this.utils.fromWei(data.value, 'ether')} ETH,`.magenta,
      );
    }

    if (blockOrHash.error) {
      const txFree = (+data.gasPrice * +data.gas).toString();
      console.log(
        `[address]: ${data.from},`.red,
        `[value]: ${this.utils.fromWei(data.value, 'ether')} ETH,`.magenta,
        `[gas price]: ${this.utils.fromWei(data.gasPrice, 'ether')} ETH,`.magenta,
        `[Cost/Fee]: ${this.utils.fromWei(txFree, 'ether')} ETH`.magenta,
        blockOrHash.error
      );
    }

    if (blockOrHash.message) {
      const txFree = (+data.gasPrice * +data.gas).toString();
      console.log(
        `[address]: ${data.from},`.red,
        `[value]: ${this.utils.fromWei(data.value, 'ether')} ETH,`.magenta,
        `[gas price]: ${this.utils.fromWei(data.gasPrice, 'ether')} ETH,`.magenta,
        `[Cost/Fee]: ${this.utils.fromWei(txFree, 'ether')} ETH`.magenta,
        blockOrHash.message
      );
    }
  }
  private async onGas(): Promise<{gasUsed: number | string, gasLimit: number | string}> {
    const blockNumber = await this.eth.getBlockNumber();
    const block: Interfaces.IBlock = await this.eth.getBlock(blockNumber);
    const gasPrice = await this.eth.getGasPrice();

    this.gasLimit = block.gasLimit ? block.gasLimit : 21000;
    this.gasPrice = gasPrice;
    this.gasUsed = block.gasUsed ? block.gasUsed : this.gasLimit;

    console.log('gasLimit: '.gray, `${this.gasLimit}`.gray);
    console.log('gasUsed: '.gray, `${this.gasUsed}`.gray);
    console.log('gasPrice: '.gray, `${this.gasPrice}`.gray);

    return { gasUsed: this.gasUsed, gasLimit: this.gasLimit };
  }

  public async run(password: string, numberof: number) {
    /**
     * @returns: Decrypt wallet.
     */
    let encryptWallet = await this.storage.encryptAccaunt;
    const gas = await this.onGas();

    if (encryptWallet.length <= 0) {
      this.addresses = await this.onCreateWallet(password, numberof);
      encryptWallet = await this.storage.encryptAccaunt;
    } else {
      this.accounts.wallet.decrypt(encryptWallet, password);
      this.addresses = this.onAddresses({ take: 100, skip: 0 });
    }
    
    this.gasLimit = gas.gasLimit;
  }

  public onSingleTx(data: Interfaces.ITxData): Observable<Interfaces.ITx> {
    /**
     * @param data: Transaction data object.
    */
    const warp = async () => {
      return {
        address: data.from,
        chainId: await this.eth.net.getId(),
        balance: await this.onSingleBalance(data.from),
        nonce: data.nonce || await this.eth.getTransactionCount(data.from),
        gasPrice: this.utils.toHex(data.gasPrice || this.gasPrice),
        gasLimit: this.utils.toHex(data.gasLimit || this.gasLimit)
      };
    };
    const newTransaction = from(warp());    

    return newTransaction.pipe(
      mergeMap(object => {
        if (!object.address) {
          throw new Error('address does not exist');
        }

        if (this.utils.toBN(object.balance) <= this.utils.toBN(data.value)) {
          const _gasPrice = this.utils.toBN(object.gasPrice);
          const _gasLimit = this.utils.toBN(object.gasLimit);
          data.value = this.utils.toBN(object.balance).sub(_gasPrice.mul(_gasLimit));
        }

        data.nonce = object.nonce;
        data.gasLimit = object.gasLimit;
        data.gasPrice = object.gasPrice;
        data.chainId = object.chainId;

        return this.sendTransaction(data);
      }),
      catchError(err => of(err)),
      map(blockOrHashOrErr => {
        this.print(blockOrHashOrErr, data);

        return blockOrHashOrErr;
      })
    );
  }

  public async onSingleBalance(address: string): Promise<string | number> {
    /**
     * @param address: Ether address in hex.
     */
    return await this.eth.getBalance(address);
  }

  public onAllBalance(data: Interfaces.IPaginate): Observable<Interfaces.IBalance[]> {
    /**
     * @param data: Type orm object, limit or ofset.
     */
    const addresess = from(this.onAddresses(data)).pipe(
      mergeMap(address => {
        return from(this.onSingleBalance(address)).pipe(
          map(balance => {
            const gwei = this.utils.toBN(this.utils.unitMap.Gwei);
            const unit = balance > gwei ? 'ether' : 'wei';

            return <Interfaces.IBalance>{
              address: address,
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

  public onAccountSync(data: Interfaces.ISyncAccaunt) {
    let nonce: number;
    const addresses = this.onAddresses(data.data);
    const count = this.utils.toBN(addresses.length);
    const toEach = from(this.onSingleBalance(data.address)).pipe(
      map(balance => this.utils.toBN(balance).div(count))
    );
    const manyData = from(this.eth.getTransactionCount(data.address)).pipe(
      mergeMap(startedNonce => {
        nonce = +startedNonce;
        return from(toEach).pipe(
          mergeMap(toEachValue => {
            return from(addresses).pipe(
              filter(address => address !== data.address),
              map(address => {
                const gasPrice = this.utils.toBN(data.gasPrice || this.gasPrice);
                const gasLimit = this.utils.toBN(data.gasLimit || this.gasLimit);
                const valueAmount = toEachValue.sub(gasPrice.mul(gasLimit));
                const transactionData: Interfaces.ITxData = {
                  nonce: nonce.toString(),
                  from: data.address,
                  to: address,
                  value: valueAmount.toString(),
                  gasPrice: gasPrice.toString(),
                  gasLimit: gasLimit.toString()
                };

                nonce++;

                return transactionData;
              })
            );
          })
        );
      })
    );

    return manyData.pipe(
      mergeMap(transactionData => this.onSingleTx(transactionData))
    );
  }

  public onPoolMapTx(inputs: Interfaces.ITxFuncInput) {
    /**
     * @param inputs: Inputs object for Sendig transactionCount.
     */
    const source = from(this.onAddresses(inputs.data)).pipe(
      mergeMap(address => {
        const timer = +Utils.onRandom(inputs.time.min, inputs.time.max);  
        const value = this.utils.toBN(Utils.onRandom(inputs.min, inputs.max));
        const gasPrice = this.utils.toBN(Utils.onRandom(inputs.gas.min, inputs.gas.max));
        const data =  <Interfaces.ITxData>{
          from: address,
          to: inputs.address,
          value: value,
          gasPrice: gasPrice,
          data: inputs.contractCode
        };

        return of(null).pipe(
          delay(timer),
          mergeMap(_ => this.onSingleTx(data))
        );
      })
    );

    return source;
  }

}
