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
    block?: IBlock;
    error?: string | Error;
    message?: string;
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
    chainId?: number | string;
  }

  export interface IPaginate {
    take?: number | string;
    skip?: number | string;
  }

  export interface ITxFuncInput {
    address: string;
    data: IPaginate;
    min: number | string;
    max: number | string;
    contractCode?: string;
    gas: { min: number | string, max: number | string };
    time: { min: number, max: number };
  }

  export interface IAccaunt {
    address: string;
    privateKey?: string;
  }

  export interface IexportAccaunt {
    elements: IAccaunt[] | IAccaunt;
    count: number;
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
    blockNumber: number;
    transactionHash: string;
    status: boolean;
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
    HttpProvider = 'http://127.0.0.1:8545'
  }

  export enum ENV {
    web = 'WEB',
    numberOf = 100,
    port = 8999
  }

  export enum WSEvent {
    RUN = 'RUN',

    BALANCE = 'BALANCE',
    BALANCE_ALL = 'BALANCEALL',
    BALANCE_INFO = 'BALANCEINFO',
    ADDRESSES_SHOW = 'ADDRESSESSHOW',
    WALLET_INFO = 'WALLETINFO',
    WALLET_EXPORT = 'WALLETEXPORT',
    WALLET_GET_PRIVATE = 'WALLETGETINFO',

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