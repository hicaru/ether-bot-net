export namespace Interfaces {
  export interface IEncryptAccaunt {
    version: number;
    id: string;
    address: string;
    crypto: {
      ciphertext: string,
      cipherparams: { iv: string },
      cipher: string;
      kdf: string;
      kdfparams: {
        dklen: number;
        salt: string;
        n: number;
        r: number;
        p: number;
      },
      mac: string;
    }
  }

  export interface ITx {
    hash?: string;
    block?: object;
  }

  export interface ITxData {
    nonce?: number | string;
    from?: string;
    gasPrice?: number | string;
    gasLimit?: number | string;
    to: string;
    value: number | string;
    data?: any;
    gas?: number | string;
  }

  export interface IPaginate {
    take?: number;
    skip?: number;
  }
}

export namespace Config {
  export enum Cnf {
    HttpProvider = 'https://ROPSTEN.infura.io/v3/d9877ecb6cf349baa97ca282de1f2ed4'
  }
}