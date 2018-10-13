import { createConnection } from "typeorm";

import { Web3Control } from './controlers/web3';

createConnection().then(async connection => {

  const wallet = new Web3Control('12345678', 100);

  // wallet.onSingleTx({
  //   from: '0x4D89aBeDA15d4bb433D4E3FF06D10845F2783af0',
  //   to: '0xBE32363Fa3C46e43B90CE35ae6d209e2e1ed07C9',
  //   value: 10000000000
  // });

  // wallet.onSingleBalance('0x4D89aBeDA15d4bb433D4E3FF06D10845F2783af0').then(console.log);

  await wallet.onAllBalance({ take: 100, skip: 0 });

  // wallet.onAccountSync('0x4D89aBeDA15d4bb433D4E3FF06D10845F2783af0', {take: 100, skip: 0});
}).catch(error => console.log(error));
