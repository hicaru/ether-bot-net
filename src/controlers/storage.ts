import { getConnection } from 'typeorm';
import { from, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { validate } from 'class-validator';

import { Interfaces } from '../config/base';
import { Account } from '../entity/accaunt';
import { Cipherparams } from '../entity/cipherparams';
import { Kdfparams } from '../entity/kdfparams';
import { Crypto } from '../entity/crypto';
import { Address } from '../entity/address';
import { Tx } from '../entity/tx';


export class Storage {

  private connet = getConnection;

  public encryptAccaunt: Promise<Account[]> = new Promise(async (resolve, reject) => {
    const cursor = await this.connet();
    let accaunts: Promise<Account[]>;

    try {
      accaunts = cursor.manager.find(Account, {
        relations: [
          'crypto',
          'crypto.cipherparams',
          'crypto.kdfparams'
        ]
      });
    } catch (err) {
      reject(err);
    }
    resolve(accaunts);    
  });

  constructor() { }

  public async dependencies(enData: Interfaces.IEncryptAccaunt[]): Promise<void> {
    const cursor = await this.connet();
    const source = from(enData);

    const deps = source.pipe(map(el => {
      return {
        kdfparams: new Kdfparams(el),
        cipherparams: new Cipherparams(el),
        crypto: new Crypto(el),
        account: new Account(el)
      };
    }));

    deps.subscribe(async el => {
      let kdfparams: Kdfparams;
      let cipherparams: Cipherparams;
      let crypto: Crypto;

      const kdfparamsError = await validate(el.kdfparams);
      const cipherparamsError = await validate(el.cipherparams);
      const cryptoError = await validate(el.crypto);
      const accountError = await validate(el.account);

      if (kdfparamsError.length > 0) {
        throw kdfparamsError;
      } else if (cipherparamsError.length > 0) {
        throw cipherparamsError;
      } else if (cryptoError.length > 0) {
        throw cryptoError;
      } else if (accountError.length > 0) {
        throw accountError;
      }

      try {
        kdfparams = await cursor.manager.save(Kdfparams, el.kdfparams);
      } catch (err) {
        kdfparams = await cursor.manager.findOne(Kdfparams, el.kdfparams);
      }
      try {
        cipherparams = await cursor.manager.save(Cipherparams, el.cipherparams);
      } catch (err) {
        cipherparams = await cursor.manager.findOne(Cipherparams, el.cipherparams);
      }

      el.crypto.cipherparams = cipherparams;
      el.crypto.kdfparams = kdfparams;
      
      try {
        crypto = await cursor.manager.save(Crypto, el.crypto);
      } catch (err) {
        crypto = await cursor.manager.findOne(Crypto, el.crypto);
      }

      el.account.crypto = crypto;

      try {
        await cursor.manager.save(Account, el.account);
      } catch (err) {
        console.log('fail');
      }
    }).unsubscribe();
  }

  public async createAddress(addresses: string[]) {
    const cursor = await this.connet();

    const source = from(addresses);

    const deps = source.pipe(map(address => {
      return new Address(address);
    }));

    deps.subscribe(async el => {
      try {
        await cursor.manager.save(Address, el);
      } catch (err) {
        console.log('fail address write');
      }
    });
  }

  public async getAddresses(data: Interfaces.IPaginate): Promise<Address[]> {
    const cursor = await this.connet();
    const addresses = await cursor.manager.find(Address, data);

    return addresses;
  }

  public async onAddress(address: string): Promise<Address> {
    const cursor = await this.connet();

    return await cursor.manager.findOne(Address, {
      where: { address: address }
    });
  }

  public async count(): Promise<number> {
    const cursor = await this.connet();

    return await cursor.manager.count(Address);
  }

  public async onSetTx(data: object): Promise<void> {
    const cursor = await this.connet();
    const tx = new Tx();

    tx.transactionHash = data['transactionHash'];
    tx.address = data['address']['id'];

    try {
      cursor.manager.save(Tx, tx);
    } catch (err) {
      return null;
    }
  }

  public async onUpdateTx(block: Tx): Promise<void> {
    const cursor = await this.connet();
    const tx = new Tx();

    Object.keys(block).forEach(key => {
      tx[key] = block[key];
    });

    try {
      cursor.manager.update(Tx,
        { transactionHash: tx.transactionHash },
        tx
      );
    } catch (err) {
      return null;
    }
  }

}
