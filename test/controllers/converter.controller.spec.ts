import {Application} from 'express';
import {default as request} from 'supertest';
import {Container, Scope} from 'typescript-ioc';

import {ConverterApi} from '../../src/services';
import {buildApiServer} from '../helper';
import {BadRequestError} from 'typescript-rest/dist/server/model/errors';

class MockConverterService implements ConverterApi {
  toNumber = jest.fn().mockName('toNumber');
  toRoman = jest.fn().mockName('toRoman');
}

describe('converter.controller', () => {

  let app: Application;
  let mockToNumber: jest.Mock;
  let mockToRoman: jest.Mock;

  beforeEach(() => {
    const apiServer = buildApiServer();
    app = apiServer.getApp();
    Container.bind(ConverterApi).scope(Scope.Singleton).to(MockConverterService);

    const mockService: ConverterApi = Container.get(ConverterApi);
    mockToNumber = mockService.toNumber as jest.Mock;
    mockToRoman = mockService.toRoman as jest.Mock;
  });

  test('canary validates test infrastructure', () => {
    expect(true).toBe(true);
  });

  describe('Given /to-number', () => {
    describe('When checking for valid roman number input', () => {
      const romanInput = 'XI';
      const numericOutput = 11;

      beforeEach(() => {
        mockToNumber.mockImplementation(romanInput => numericOutput);
      });

      test(`${romanInput} should return correct converted value ${numericOutput}`, async() => {
        await request(app)
            .get('/to-number')
            .query({value: romanInput})
            .expect(200)
            .then((response) => {
              expect(parseInt(response.text)).toBe(numericOutput);
              expect(response.headers["content-type"]).toMatch(/text\/.*/);
            });
      });
    });

    describe('When checking for invalid roman number input', () => {
      const romanInput = 'XIIII';

      beforeEach(() => {
        mockToNumber.mockImplementation(() => {
          throw new BadRequestError();
        });
      });

      test(`${romanInput} should throw Bad Request Error`, async() => {
        await request(app)
            .get('/to-number')
            .query({value: romanInput})
            .expect(400);
      });
    });
  });

  describe('Given /to-roman', () => {
    describe('When checking for valid numeric input', () => {
      const numericInput = 97;
      const romanOutput = 'XCVII';

      beforeEach(() => {
        mockToRoman.mockImplementation(numericInput => romanOutput);
      });

      test(`${numericInput} should return correct converted value ${romanOutput}`, async() => {
        await request(app)
            .get('/to-roman')
            .query({value: numericInput})
            .expect(200)
            .then((response) => {
              expect(response.text).toBe(romanOutput);
              expect(response.headers["content-type"]).toMatch(/text\/.*/);
            });
      });
    });

    describe('When checking for invalid numeric input', () => {
      const numericInputs = [-1,4000,1.53];

      beforeEach(() => {
        mockToRoman.mockImplementation(() => {
          throw new BadRequestError();
        });
      });

      test.each(numericInputs)('%s should throw Bad Request Error', async(input) => {
        await request(app)
            .get('/to-roman')
            .query({value: input})
            .expect(400);
      });
    });

    describe('When checking for non-numeric input', () => {
      const input = "MMXI";

      beforeEach(() => {
        mockToRoman.mockImplementation(() => {
          throw new BadRequestError();
        });
      });

      test(`${input} should throw Bad Request Error`, async() => {
        await request(app)
            .get('/to-roman')
            .query({value: input})
            .expect(400);
      });
    });
  });
});
