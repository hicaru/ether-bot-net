import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Wallet } from '../ether/wallet';
import { Storage } from './storage';
import { Interfaces } from '../config/base';


export class Web3Control extends Wallet {

  private storage = new Storage();

  constructor(password: string, numberof: number = 5) {
    super();
    this.preStart(password, numberof);
  }

  private async preStart(password: string, numberof: number) {
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
    return await this.eth.getBalance(address);
  }

  public async onAllBalance(data: Interfaces.IPaginate) {
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
    const count = await this.storage.count();
    const balance = await this.onSingleBalance(address);
    const toEach = +balance / count;
    const addresess = await this.storage.getAddresses(data);
    let nonce = await this.eth.getTransactionCount(address);
    const source = from(addresess);

    source.pipe(map(storeAddress => {
      const txData = <Interfaces.ITxData>{
        nonce: nonce,
        from: address,
        to: storeAddress.address,
        value: toEach,
        gasPrice: 3000000000,
        gasLimit: 210000
      };

      nonce++;
      
      return txData;
    })).forEach(txData => {
      this.sendTransaction(txData).toPromise().then(console.log);
    });
  }

}
