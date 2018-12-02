export class Utils {
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
}
