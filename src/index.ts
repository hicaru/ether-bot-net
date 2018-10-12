import { createConnection } from "typeorm";

import { Web3Control } from './controlers/web3';

createConnection().then(async connection => {

  const wallet = new Web3Control('12345678');

  // wallet.onSingleTx({
  //   from: '0x0a2185b293f318be04C012bF92E216Fd248Ba479',
  //   to: '0x68a8191add50d107BB8b25f3Feea172c35Cf2685',
  //   value: 10000000000
  // });

  wallet.onAllBalance({ take: 100, skip: 0 });
}).catch(error => console.log(error));
