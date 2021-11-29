import {GET, Path, QueryParam} from 'typescript-rest';
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

  @Path('/to-roman')
  @GET
  async toRoman(@QueryParam('value') value:number): Promise<object> {
    this.logger.info(`Converting ${value} to roman`);
    const resp = await this.service.toRoman(value);
    return {value: resp};
  }

  @Path('/to-number')
  @GET
  async toNumber(@QueryParam('value') value:string): Promise<object> {
    this.logger.info(`Converting ${value} to number`);
    const resp = await this.service.toNumber(value);
    return {value: resp};
  }
}
