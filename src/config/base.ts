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
    error?: string | Error;
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

  export interface IBalance {
    balance: number | string;
    address: string;
    unit256?: number | string;
  }

  export interface ISyncAccaunt {
    address: string;
    data?: IPaginate;
    gasPrice?: number | string;
    gasLimit?: number | string;
  }

  export interface IBlock {
    author: string;
    difficulty?: string;
    extraData?: string;
    gasLimit?: number;
    gasUsed?: number;
    hash: string;
    logsBloom: string;
    miner: string;
    number: number;
    parentHash?: string;
    receiptsRoot: string;
    sealFields?: string[];
    sha3Uncles?: string;
    signature?: string;
    size: number;
    stateRoot: string;
    step: string;
    timestamp: number | Date;
    totalDifficulty?: string;
    transactions?: string[];
    transactionsRoot?: string;
  }
}

export namespace Config {
  export enum Cnf {
    HttpProvider = 'https://kovan.infura.io/v3/d9877ecb6cf349baa97ca282de1f2ed4'
  }

  export enum ENV {
    web = 'WEB',
    numberOf = 100
  }

  export enum WSEvent {
    RUN = 'RUN',

    BALANCE = 'BALANCE',
    BALANCE_ALL = 'BALANCEALL',
    BALANCE_INFO = 'BALANCEINFO',
    ADDRESSES_SHOW = 'ADDRESSESSHOW',
    WALLET_INFO = 'WALLETINFO',

    SET_GAS_PRICE = 'SETGASPRICE',
    GET_GAS_PRICE = 'GETGASPRICE',
    SET_GAS_LIMIT = 'SETGASLIMIT',
    GET_GAS_LIMIT = 'GETGASLIMIT',
    
    SYNCHRONIZATION = 'SYNCHRONIZATION',
    SEND_A_TRANSACTION = 'SENDATRANSACTION',
    SEND_POOL_TRANSACTION = 'SENDPOOLTRANSACTION',
    ON_HASH = 'ONHASH',
    ON_BLOCK = 'ONBLOCK',

    ERROR = 'ERROR' 
  }
}