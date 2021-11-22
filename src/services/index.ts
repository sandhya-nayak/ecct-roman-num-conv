import { Container } from "typescript-ioc";

export * from './converter.api';
export * from './converter.service';

import config from './ioc.config';

Container.configure(...config);