import * as Web3 from 'web3';
import { Web3Interfaces } from '../ether/web3-Interface';


const web3Utils: Web3Interfaces.IUtils = Web3.utils;

export class Utils {

  public static onRandom(min: number | string, max: number | string): number | string {
    let rand: number;
  
    if (min === max) {
      return web3Utils.toBN(max);
    } else if (max == 0) {
      return 0;
    } else if (min > max) {
      return max;
    }

    try {
      const _min = web3Utils.toBN(min);
      const _max = web3Utils.toBN(max);
      const _randomInt = web3Utils.toBN(web3Utils.randomHex(1));
      
      rand = _randomInt.mul(
        (_max.sub(_min)).add(_min)
      );

      return rand;
    } catch (err) {
      return (+min).toFixed();
    }
  }

}
