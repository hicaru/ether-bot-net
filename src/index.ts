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

  // await wallet.onAllBalance({ take: 100, skip: 0 });

  // wallet.onAccountSync('0xD40b30dE24dEe4Cd97E635D6AAB7b5720Bd24DA0', {take: 100, skip: 0});
  const txPool = await wallet.onPoolMapTx({
    address: '0x28FfB706c433b3F868219c78a2372e8dC3cc2c8F',
    data: { take: 100, skip: 0 },
    min: 100000000,
    max: 1000000000000,
    gas: {
      max: 3100000000,
      min: 3100000000
    },
    time: {
      max: 1,
      min: 10000
    }
  });

  txPool.subscribe(tx => {
    console.log(tx);
  });



}).catch(error => console.log(error));
