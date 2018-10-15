import { Tx } from "../entity/tx";

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
    block?: Tx;
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

  export interface ITxFuncInput {
    address: string;
    data: IPaginate;
    min: number;
    max: number;
    gas: { min: number, max: number },
    time: { min: number, max: number }
  }
}

export namespace Config {
  export enum Cnf {
    HttpProvider = 'https://kovan.infura.io/v3/d9877ecb6cf349baa97ca282de1f2ed4'
  }
}