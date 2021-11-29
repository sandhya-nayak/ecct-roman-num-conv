import {GET, Path, QueryParam, PathParam} from 'typescript-rest';
import {Inject} from 'typescript-ioc';
import {ConverterApi} from '../services';
import {LoggerApi} from '../logger';

@Path('/')
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

  @Path('/to-number')
  @GET
  async toNumber(@QueryParam('value') value:string): Promise<object> {
    this.logger.info(`Converting ${value} to number`);
    const resp = await this.service.toNumber(value);
    return { value: resp};
  }
}
