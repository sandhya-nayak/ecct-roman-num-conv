export abstract class ConverterApi {
  abstract toNumber(value?: string): Promise<number>;
}
