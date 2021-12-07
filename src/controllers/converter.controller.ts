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
  async toRoman(@QueryParam('value') value:number): Promise<string> {
    this.logger.info(`Converting ${value} to roman`);
    return await this.service.toRoman(value);
  }

  @Path('/to-number')
  @GET
  async toNumber(@QueryParam('value') value:string): Promise<number> {
    this.logger.info(`Converting ${value} to number`);
    return await this.service.toNumber(value);

  }
}
