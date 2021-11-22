import {ContainerConfiguration, Scope} from 'typescript-ioc';
import {ConverterApi} from './converter.api';
import {ConverterService} from './converter.service';

const config: ContainerConfiguration[] = [
  {
    bind: ConverterApi,
    to: ConverterService,
    scope: Scope.Singleton
  }
];

export default config;