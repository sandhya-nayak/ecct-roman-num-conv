import {Application} from 'express';
import {default as request} from 'supertest';
import {Container, Scope} from 'typescript-ioc';

import {ConverterApi} from '../../src/services';
import {buildApiServer} from '../helper';
import { BadRequestError } from 'typescript-rest/dist/server/model/errors';

class MockConverterService implements ConverterApi {
  toNumber = jest.fn().mockName('toNumber');
  toRoman = jest.fn().mockName('toRoman');
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

  describe('Given /to-number', () => {
    const romanInput = 'XI';
    const numericOutput = 11;

    beforeEach(() => {
      mockToNumber.mockImplementation(romanInput => numericOutput);
    });

    test('should return converted value for valid roman input', async() => {
      await request(app)
          .get('/to-number')
          .query({value: romanInput})
          .expect(200)
          .then((response) => {
            expect(response.body["value"]).toBe(numericOutput);
          });
    });
    
  });

  describe('Given /to-number', () => {
    const romanInput = 'XIIII';

    beforeEach(() => {
      mockToNumber.mockImplementation(() => {
        throw new BadRequestError();
      });
    });

    test('should return error for invalid roman input', async() => {
      await request(app)
          .get('/to-number')
          .query({value: romanInput})
          .expect(400);
    });

  });
});
