export abstract class ConverterApi {
  abstract toNumber(roman?: string): Promise<number>;
}
