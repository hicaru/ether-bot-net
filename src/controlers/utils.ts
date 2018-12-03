import * as crypto from 'crypto';

export class Utils {

  private readonly algorithm: string = 'aes-256-ctr';

  public static onRandom(min: number, max: number): number | string {
    let rand: number;

    if (min === max) {
      return max.toFixed();
    } else if (max == 0) {
      return 0;
    }

    try {
      rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand).toFixed();
    } catch (err) {
      return min.toFixed();
    }    
  }

  public encrypt(text: string, password: string) {
    let cipher = crypto.createCipher(this.algorithm, password);
    let crypted = cipher.update(text,'utf8','hex');
    
    crypted += cipher.final('hex');

    return crypted;
  }
   
  public decrypt(text: string, password: string) {
    let decipher = crypto.createDecipher(this.algorithm, password);
    let dec = decipher.update(text,'hex','utf8');

    dec += decipher.final('utf8');

    return dec;
  }

}
