import {GET, Path, PathParam} from 'typescript-rest';
import {Inject} from 'typescript-ioc';
import {ConverterApi} from '../services';
import {LoggerApi} from '../logger';

@Path('/hello')
export class ConverterController {

  @Inject
  service: ConverterApi;
  @Inject
  _baseLogger: LoggerApi;

  get logger() {
    return this._baseLogger.child('ConverterController');
  }

  // @GET
  // async sayHelloToUnknownUser(): Promise<string> {
  //   this.logger.info('Saying hello to someone');
  //   return this.service.greeting();
  // }

  // @Path(':name')
  // @GET
  // async sayHello(@PathParam('name') name: string): Promise<string> {
  //   this.logger.info(`Saying hello to ${name}`);
  //   return this.service.greeting(name);
  // }
}
