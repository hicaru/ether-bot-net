import 'colors';
import { createConnection } from "typeorm";
import * as readline from 'readline';

import { Web3Control } from './controlers/web3';
import { ConsoleGUI, password } from './controlers/console';

createConnection().then(async connection => {
  const UserInputPassword = await password;

  const console = new ConsoleGUI(UserInputPassword);
  

  // const wallet = new Web3Control('12345678', 100);

  // wallet.onSingleTx({
  //   from: '0x4D89aBeDA15d4bb433D4E3FF06D10845F2783af0',
  //   to: '0xBE32363Fa3C46e43B90CE35ae6d209e2e1ed07C9',
  //   value: 10000000000
  // });

  // wallet.onSingleBalance('0x4D89aBeDA15d4bb433D4E3FF06D10845F2783af0').then(console.log);

  // await wallet.onAllBalance({ take: 100, skip: 0 });

  // wallet.onAccountSync('0xFfe8FdA7Ee1813309Aa10343A6228A8f247fef1d', {
  //   take: 100, skip: 0
  // });

  // const txPool = await wallet.onPoolMapTx({
  //   address: '0xA98060409a31FdF92754ADD44645d273578185C7',
  //   data: { take: 100, skip: 0 },
  //   min: 1 * 1e18,
  //   max: 1 * 1e18,
  //   gas: {
  //     max: 1000000000,
  //     min: 1000000000
  //   },
  //   time: {
  //     max: 1,
  //     min: 100
  //   }
  // });

  // txPool.subscribe(tx => {
  //   // console.log(tx);
  // });

}).catch(error => console.log(error));
