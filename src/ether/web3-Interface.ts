export namespace Web3Interfaces {
  interface IModules {
    Bzz(t: any): any;
    Eth(): any;
    Net(): any;
    Personal(): any;
    Shh(): any;
  }
  interface IGivenProvider {
    selectedAddress: string;
    networkVersion: string;
    _events: object | any;
    _eventsCount: number;
    _maxListeners: number;
  }
  interface IProviders {
    HttpProvider(e: any, t?: any): any;
    IpcProvider(e: any, t?: any): any;
    WebsocketProvider(e: any, t?: any): any;
  }
  interface IUnitMap {
    noether:    string;
    wei:        string;
    kwei:       string;
    Kwei:       string;
    babbage:    string;
    femtoether: string;
    mwei:       string;
    Mwei:       string;
    lovelace:   string;
    picoether:  string;
    gwei:       string;
    Gwei:       string;
    shannon:    string;
    nanoether:  string;
    nano:       string;
    szabo:      string;
    microether: string;
    micro:      string;
    finney:     string;
    milliether: string;
    milli:      string;
    ether:      string;
    kether:     string;
    grand:      string;
    mether:     string;
    gether:     string;
    tether:     string;
  }

  export interface IBN {
    abs(e: IBN): number | IBN;
    add(e: IBN): number | IBN;
    div(e: IBN): number | IBN;
    mul(e: IBN): number | IBN;
    sub(e: IBN): number | IBN;
    divmod(e: IBN): number | IBN;
  }
  export interface IUtils {
    randomHex(e: number, r?: any): string;
    BN(e: number, t?: any, r?: any): number | IBN;
    isBN(e: number): boolean;
    isBigNumber(e: number): boolean;
    isHexStrict(e: string | number): boolean;
    sha3(e: string): string;
    soliditySha3(...argv): any;
    isAddress(e: string | number): boolean;
    checkAddressChecksum(e: string | number): boolean;
    toChecksumAddress(e: string): string;
    toHex(e: string | number): string;
    toBN(e: string | number): IBN | number | any;
    bytesToHex(e: string | number): string;
    hexToBytes(e: string | number): string;
    hexToNumberString(e: string | number): string;
    hexToNumber(e: string): string;
    toDecimal(e: string): string;
    numberToHex(e: string | number): string;
    fromDecimal(e: number | string): string;
    hexToUtf8(e: string): string;
    hexToString(e: string): string;
    toUtf8(e: string): string;
    utf8ToHex(e: string): string;
    stringToHex(e: string): string;
    fromUtf8(e: string): string;
    hexToAscii(e: string): string;
    toAscii(e: string): string;
    asciiToHex(e: string): string;
    fromAscii(e: string): string;
    // tslint:disable-next-line:member-ordering
    unitMap: IUnitMap;
    toWei(e: string | any | IBN, t?: string): string;
    fromWei(e: string | any | IBN, t?: string): string;
    padLeft(e: string | any, t?: number): string;
    leftPad(e: string | any, t?: number): string;
    padRight(e: string | any, t?: number): string;
    rightPad(e: string | any, t?: number): string;
    toTwosComplement(e: number): string;
  }
  export interface IWeb3 {
    version: string;
    utils: IUtils;
    modules: IModules;
    givenProvider: IGivenProvider;
    providers: IProviders;
    eth: any;
  }
}
