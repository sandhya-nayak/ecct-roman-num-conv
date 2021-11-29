export abstract class ConverterApi {
  abstract toNumber(value: string): Promise<number>;
  abstract toRoman(value?: number): Promise<string>;
}
