import { createConnection } from 'typeorm';

import { Web3Control } from './controlers/web3';
import { WsServer } from './ws-server/app';
import { Utils } from './controlers/utils';

createConnection().then(async connection => {

  const ws = new WsServer(8999, '12345678');

  // const wallet = new Web3Control('12345678', 100);

  

  // wallet.onAccountSync({
  //   address: '0xff475a95C6cA681C7947FF6Dda91edFc57F79761'
  // }).then(test => test.subscribe(console.log));

  // wallet.onAllBalance({ take: 100, skip: 0 }).subscribe(console.log);

  // wallet.onSingleTx({
  //   from: '0x996Ff7B6E1e9e955d3813b142d1110735C0EC8e6',
  //   to: '0xA98060409a31FdF92754ADD44645d273578185C7',
  //   value: '10000000000'
  // }).subscribe();

  // wallet.onSingleBalance('0x4D89aBeDA15d4bb433D4E3FF06D10845F2783af0').then(console.log);

  // wallet.onAllBalance({ take: 100, skip: 0 }).then(address => {
  //   address.subscribe(console.log);
  // });

  // wallet.onAccountSync('0xFfe8FdA7Ee1813309Aa10343A6228A8f247fef1d', {
  //   take: 100, skip: 0
  // });

  // const txPool = wallet.onPoolMapTx({
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
  // }).subscribe();

  // txPool.subscribe(tx => {
  //   // console.log(tx);
  // });

}).catch(error => console.log(error));
