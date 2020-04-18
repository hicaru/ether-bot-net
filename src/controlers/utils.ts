export class Utils {

  public static onRandom(min: number | string, max: number | string): number | string {
    let rand: number | string;
  
    if (min == max) {
      return max;
    } else if (min > max) {
      return max;
    }

    const _min = Math.ceil(+min);
    const _max = Math.floor(+max);

    rand = Math.floor(Math.random() * (_max - _min)) + _min;

    return rand;
  }

}
