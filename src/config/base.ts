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
    contractCode?: string;
    gas: { min: number, max: number };
    time: { min: number, max: number };
  }

  export interface IexportAccaunt {
    address: string;
    privateKey: string;
  }
}

export namespace Config {
  export enum Cnf {
    HttpProvider = 'https://kovan.infura.io/v3/d9877ecb6cf349baa97ca282de1f2ed4'
  }

  export enum ENV {
    console = 'CONSOLE',
    web = 'WEB',
    numberOf = 100
  }

  export enum WSEvent {
    RUN = 0,
    SEND_A_TRANSACTION = 1,
    SEND_POOL_TRANSACTION = 2,
    SYNCHRONIZATION = 3,
    BALANCE = 4,
    BALANCE_ALL = 5,
    ADDRESSES_SHOW = 6,
    SET_GAS_PRICE = 7,
    SET_GAS_LIMIT = 8,
    WALLET_INFO = 9
  }
}