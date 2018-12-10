import * as Web3 from 'web3';
import { Web3Interfaces } from '../ether/web3-Interface';


const web3Utils: Web3Interfaces.IUtils = Web3.utils;

export class Utils {

  public static onRandom(min: number | string, max: number | string): number | string {
    let rand: number | string = web3Utils.toBN(0);
  
    if (min === max) {
      return web3Utils.toBN(max);
    } else if (max == 0) {
      return 0;
    } else if (min > max) {
      return max;
    }

    const _min = Math.ceil(+min);
    const _max = Math.floor(+max);

    return Math.floor(Math.random() * (_max - _min)) + _min;
  }

}
