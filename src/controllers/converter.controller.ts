import {GET, Path, PathParam} from 'typescript-rest';
import {Inject} from 'typescript-ioc';
import {ConverterApi} from '../services';
import {LoggerApi} from '../logger';

//@Path('/hello')
export class ConverterController {

  @Inject
  service: ConverterApi;
  @Inject
  _baseLogger: LoggerApi;

  get logger() {
    return this._baseLogger.child('ConverterController');
  }

  @Path('/toRoman:value')
  @GET
  async toRoman(@PathParam('value') value:number): Promise<string> {
    this.logger.info(`Converting ${value} to roman`);
    return this.service.toRoman(value);
  }

  @Path('/toNumber:value')
  @GET
  async toNumber(@PathParam('value') value:string): Promise<number> {
    this.logger.info(`Converting ${value} to number`);
    return this.service.toNumber(value);
  }

  // @Path(':name')
  // @GET
  // async sayHello(@PathParam('name') name: string): Promise<string> {
  //   this.logger.info(`Saying hello to ${name}`);
  //   return this.service.greeting(name);
  // }
}
