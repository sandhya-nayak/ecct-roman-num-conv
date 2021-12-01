import {Container} from 'typescript-ioc';
import {ConverterService} from '../../src/services';
import {ApiServer} from '../../src/server';
import {buildApiServer} from '../helper';
import {BadRequestError} from 'typescript-rest/dist/server/model/errors';

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

    it("should return the correct value for single letter input", () => {
      const testMap=new Map([['M',1000],['D',500],['C',100],['L',50],['X',10],['V',5],['I',1]]);
      testMap.forEach((value:number,key:string) => async() => {
        expect(await service.toNumber(key)).toBe(value);
      });
    });

    it('should return the correct value for valid edge cases', () => {
      const testMap=new Map([['MC',1100],['CM',900],['DC',600],['CD',400],['CX',110],['XC',90],['LX',60],['XL',40],['XI',11],['IX',9],
      ['VI',6],['IV',4]]);
      testMap.forEach((value:number,key:string) => async () => {
        expect(await service.toNumber(key)).toBe(value);
      });
    });

    it('should return the correct value for the first 21 numbers', () => {
      const testMap=new Map([['II',2],['III',3],['VII',7],['VIII',8],['XII',12],['XIII',13],['XIV',14],['XV',15],['XVI',16],['XVII',17],['XVIII',18],
      ['XIX',19],['XX',20],['XXI',21]]);
      testMap.forEach((value:number,key:string) => async () => {
        expect(await service.toNumber(key)).toBe(value);
      });
    });

    it('should return the correct value for valid roman numbers', () => {
      const testMap = new Map([['MCMXCIV',1994],['MMDCCLXVIII',2768],['MMMCMXCIX',3999]]);
      testMap.forEach((value:number,key:string) => async () => {
        expect(await service.toNumber(key)).toBe(value);
      });
    });

    it('should throw Bad Request Error for invalid roman numbers', () => {
      const testValues = ['MMXMCMXCIX','XIIII','MXCXI','IVIII','IXVI','ABCD'];
      testValues.forEach((value) => async () => {
        await expect(service.toNumber(value)).rejects.toThrow(BadRequestError);
      });
    });

  });

  context('toRoman', () => {
    it('should return nulla for 0', async()=> {
      expect(await service.toRoman(0)).toBe('nulla');
    });
  
    it('should return the correct value for the first 21 numbers', () => {
      const testMap=new Map([[1,'I'],[2,'II'],[3,'III'],[4,'IV'],[5,'V'],[6,'VI'],[7,'VII'],[8,'VIII'],[9,'IX'],[10,'X'],
              [11,'XI'],[12,'XII'],[13,'XIII'],[14,'XIV'],[15,'XV'],[16,'XVI'],[17,'XVII'],[18,'XVIII'],[19,'XIX'],
              [20,'XX'],[21,'XXI']]);
      testMap.forEach((value:string,key:number) => async () => {
        expect(await service.toRoman(key)).toBe(value);
      });
    });

    it('should return the correct value for valid numbers', () => {
      const testMap=new Map([[1999,'MCMXCIX'],[2768,'MMDCCLXVIII'],[3999,'MMMCMXCIX']]);
      testMap.forEach((value:string,key:number) => async () => {
        expect(await service.toRoman(key)).toBe(value);
      });
    });

    it('should throw Bad Request Error for out of scope numbers', () => {
      const testArray=[4000,-5,1.35];
      testArray.forEach((value) => async () => {
        expect(await service.toRoman(value)).rejects.toThrow(BadRequestError);
      });
    });

  });
});
