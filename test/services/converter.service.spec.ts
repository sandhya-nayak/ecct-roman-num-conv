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
    it('toNumber(nulla) should return 0', async()=> {
      expect(await service.toNumber('nulla')).toBe(0);
    });

    it("should return the correct value when single letter input is provided", () => {
      const testMap=new Map([['M',1000],['D',500],['C',100],['L',50],['X',10],['V',5],['I',1]]);
      testMap.forEach((value:number,key:string) => async() => {
        expect(await service.toNumber(key)).toBe(value);
      });
    });

    context('when checking valid edge cases', () => {
      const testMap=new Map([['MC',1100],['CM',900],['DC',600],['CD',400],['CX',110],['XC',90],['LX',60],['XL',40],['XI',11],['IX',9],
      ['VI',6],['IV',4]]);
      testMap.forEach((value:number,key:string) => async () => {
        expect(await service.toNumber(key)).toBe(value);
      });
    });

    context('when checking first 21 numbers', () => {
      const testMap=new Map([['II',2],['III',3],['VII',7],['VIII',8],['XII',12],['XIII',13],['XIV',14],['XV',15],['XVI',16],['XVII',17],['XVIII',18],
      ['XIX',19],['XX',20],['XXI',21]]);
      testMap.forEach((value:number,key:string) => async () => {
        expect(await service.toNumber(key)).toBe(value);
      });
    });

    it('toNumber(MCMXCIV) should return 1994', async()=> {
      expect(await service.toNumber('MCMXCIV')).toBe(1994);
    });
    
    it('toNumber(MMDCCLXVIII) should return 2768', async()=> {
      expect(await service.toNumber('MMDCCLXVIII')).toBe(2768);
    });
    
    it('toNumber(MMMCMXCIX) should return 3999', async()=> {
      expect(await service.toNumber('MMMCMXCIX')).toBe(3999);
    });

    it('toNumber(MMXMCMXCIX) should throw Bad Request Error', async()=> {
      await expect(service.toNumber("MMXMCMXCIX")).rejects.toThrow(BadRequestError);
    });

    it('toNumber(XIIII) should throw Bad Request Error', async()=> {
      await expect(service.toNumber("XIIII")).rejects.toThrow(BadRequestError);
    });

    it('toNumber(MXCXI) should throw Bad Request Error', async()=> {
      await expect(service.toNumber("MXCXI")).rejects.toThrow(BadRequestError);
    });

    it('toNumber(IVIII) should throw Bad Request Error', async()=> {
      await expect(service.toNumber("IVIII")).rejects.toThrow(BadRequestError);
    });

    it('toNumber(IXVI) should throw Bad Request Error', async()=> {
      await expect(service.toNumber("IXVI")).rejects.toThrow(BadRequestError);
    });

  });

  context('toRoman', () => {
    it('toRoman(0) should return nulla', async()=> {
      expect(await service.toRoman(0)).toBe('nulla');
    });
  
    context('when checking first 21 numbers', () => {
      const testMap=new Map([[1,'I'],[2,'II'],[3,'III'],[4,'IV'],[5,'V'],[6,'VI'],[7,'VII'],[8,'VIII'],[9,'IX'],[10,'X'],
              [11,'XI'],[12,'XII'],[13,'XIII'],[14,'XIV'],[15,'XV'],[16,'XVI'],[17,'XVII'],[18,'XVIII'],[19,'XIX'],
              [20,'XX'],[21,'XXI']]);
      testMap.forEach((value:string,key:number) => async () => {
        expect(await service.toRoman(key)).toBe(value);
      });
    });
  
    it('toRoman(1999) should return MCMXCIX', async()=> {
      expect(await service.toRoman(1999)).toBe('MCMXCIX');
    });
    
    it('toRoman(2768) should return MMDCCLXVIII', async()=> {
      expect(await service.toRoman(2768)).toBe('MMDCCLXVIII');
    });
    
    it('toRoman(3999) should return MMMCMXCIX', async()=> {
      expect(await service.toRoman(3999)).toBe('MMMCMXCIX');
    });

    it('toRoman(4000) should throw Bad Request Error', async()=> {
      await expect(service.toRoman(4000)).rejects.toThrow(BadRequestError);
    });
    
    it('toRoman(-5) should throw Bad Request Error', async()=> {
      await expect(service.toRoman(-5)).rejects.toThrow(BadRequestError);
    });
    
    it('toRoman(1.35) should throw Bad Request Error', async()=> {
      await expect(service.toRoman(1.35)).rejects.toThrow(BadRequestError);
    });

  });
});
