import {Container} from 'typescript-ioc';
import {ConverterService} from '../../src/services';
import {ApiServer} from '../../src/server';
import {buildApiServer} from '../helper';
import {BadRequestError, NotImplementedError} from 'typescript-rest/dist/server/model/errors';

describe('Converter service', () =>{
  let app: ApiServer;
  let service: ConverterService;
  beforeAll(() => {
    app = buildApiServer();
    service = Container.get(ConverterService);
  });

  it('should exist', () => {
    expect(service).not.toBeUndefined();
  });

  context('toNumber', () => {
    it('should return 0 for nulla', async()=> {
      expect(await service.toNumber('nulla')).toBe(0);
    });

    describe("should return the correct value for single letter input", () => {
      it.each([['M',1000],['D',500],['C',100],['L',50],['X',10],['V',5],['I',1]])('toNumber(%s) should return %s', async (roman, expectedNumber) => {
        expect(await service.toNumber(roman)).toBe(expectedNumber);
      });
    });

    describe('should return the correct value for valid edge cases', () => {
      it.each([['MC',1100],['CM',900],['DC',600],['CD',400],['CX',110],['XC',90],['LX',60],['XL',40],['XI',11],['IX',9],
      ['VI',6],['IV',4]])('toNumber(%s) should return %s', async (roman, expectedNumber) => {
        expect(await service.toNumber(roman)).toBe(expectedNumber);
      });
    });

    describe('should return the correct value for the first 21 numbers', () => {
      it.each([['II',2],['III',3],['VII',7],['VIII',8],['XII',12],['XIII',13],['XIV',14],['XV',15],['XVI',16],['XVII',17],['XVIII',18],
      ['XIX',19],['XX',20],['XXI',21]])('toNumber(%s) should return %s', async (roman, expectedNumber) => {
        expect(await service.toNumber(roman)).toBe(expectedNumber);
      });
    });

    describe('should return the correct value for valid roman numbers', () => {
      it.each([['MCMXCIV',1994],['MMDCCLXVIII',2768],['MMMCMXCIX',3999]])('toNumber(%s) should return %s', async (roman, expectedNumber) => {
        expect(await service.toNumber(roman)).toBe(expectedNumber);
      });
    });

    describe('should return correct value for valid roman numbers irrespective of case', () => {
      it.each([['MCmxCIV',1994],['mmdcclxviii',2768],['mMmCmXcIx',3999],['nULLa',0]])('toNumber(%s) should return %s', async (roman, expectedNumber) => {
        expect(await service.toNumber(roman)).toBe(expectedNumber);
      });
    });

    describe('should throw Bad Request Error for invalid roman numbers', () => {
      it.each(['MMXMCMXCIX','XIIII','MXCXI','IVIII','IXVI','ABCD',''])('toNumber(%s) should throw Bad Request Error', async (roman) => {
        await expect(service.toNumber(roman)).rejects.toThrow(BadRequestError);
      });
    });
  });

  context('toRoman', () => {
    it('should return nulla for 0', async()=> {
      expect(await service.toRoman(0)).toBe('nulla');
    });
  
    describe('should return the correct value for the first 21 numbers', () => {
      it.each([[1,'I'],[2,'II'],[3,'III'],[4,'IV'],[5,'V'],[6,'VI'],[7,'VII'],[8,'VIII'],[9,'IX'],[10,'X'],[11,'XI'],[12,'XII'],[13,'XIII'],[14,'XIV'],[15,'XV'],[16,'XVI'],
      [17,'XVII'],[18,'XVIII'],[19,'XIX'],[20,'XX'],[21,'XXI']])('toRoman(%s) should return %s', async (numInput, expectedRoman) => {
        expect(await service.toRoman(numInput)).toBe(expectedRoman);
      });
    });

    describe('should return the correct value for valid numbers', () => {
      it.each([[1999,'MCMXCIX'],[2768,'MMDCCLXVIII'],[3999,'MMMCMXCIX']])('toRoman(%s) should return %s', async (numInput, expectedRoman) => {
        expect(await service.toRoman(numInput)).toBe(expectedRoman);
      });
    });

    describe('should throw Bad Request Error for out of scope numbers', () => {
      it.each([4000,-5,1.35])('toRoman(%s) should throw Bad Request Error', async (numInput) => {
        await expect(service.toRoman(numInput)).rejects.toThrow(BadRequestError);
      });
    });
  });
});
