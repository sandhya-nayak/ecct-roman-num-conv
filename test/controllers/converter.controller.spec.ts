import {Application} from 'express';
import {default as request} from 'supertest';
import {Container, Scope} from 'typescript-ioc';

import {ConverterApi} from '../../src/services';
import {buildApiServer} from '../helper';

class MockConverterService implements ConverterApi {
  toNumber = jest.fn().mockName('toNumber');
}

describe('converter.controller', () => {

  let app: Application;
  let mockToNumber: jest.Mock;

  beforeEach(() => {
    const apiServer = buildApiServer();

    app = apiServer.getApp();

    Container.bind(ConverterApi).scope(Scope.Singleton).to(MockConverterService);

    const mockService: ConverterApi = Container.get(ConverterApi);
    mockToNumber = mockService.toNumber as jest.Mock;
  });

  test('canary validates test infrastructure', () => {
    expect(true).toBe(true);
  });

  // describe('Given /hello', () => {
  //   const expectedResponse = 'Hello there!';

  //   beforeEach(() => {
  //     mockToNumber.mockReturnValueOnce(Promise.resolve(expectedResponse));
  //   });

  //   test('should return "Hello, World!"', done => {
  //     request(app).get('/hello').expect(200).expect(expectedResponse, done);
  //   });
  // });

  // describe('Given /hello/Johnny', () => {
  //   const name = 'Johnny';

  //   beforeEach(() => {
  //     mockToNumber.mockImplementation(name => name);
  //   });

  //   test('should return "Hello, Johnny!"', done => {
  //     request(app).get(`/hello/${name}`).expect(200).expect(name, done);
  //   });
  // });

});
