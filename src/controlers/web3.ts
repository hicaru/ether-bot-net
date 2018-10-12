import { Wallet } from '../ether/wallet';
import { Storage } from './storage';
import { Interfaces } from '../config/base';


export class Web3Control extends Wallet {

  private storage = new Storage();

  constructor(password: string) {
    super();
    this.preStart(password);
  }

  private async preStart(password: string) {
    let encryptWallet = await this.storage.encryptAccaunt;

    if (!encryptWallet) {
      await this.onCreateWallet(password);
      encryptWallet = await this.storage.encryptAccaunt;
    }

    this.accounts.wallet.decrypt(encryptWallet, password);
  }

  private async onCreateWallet(password: string): Promise<void> {
    const addresess = this.onGenWallets();

    const obj = this.onEncrypt(password);
  
    await this.storage.dependencies(obj);
    await this.storage.createAddress(addresess);
  }

  public async onSingleTx(data: Interfaces.ITxData) {
    const nonce = await this.eth.getTransactionCount(data.from);
    
    data.gasPrice = data.gasPrice || 3000000000;
    data.gasLimit = data.gasLimit || 210000;
    data.nonce = nonce;

    this.sendTransaction(data).subscribe(console.log);
  }

}
