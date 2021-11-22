import {Container} from 'typescript-ioc';
import {ConverterService} from '../../src/services';
import {ApiServer} from '../../src/server';
import {buildApiServer} from '../helper';

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
    it.each([['MC',1100],['CM',900],['DC',600],['CD',400],['CX',110],['XC',90],['LX',60],['XL',40],['XI',11],['IX',9],
            ['VI',6],['IV',4]])('toNumber(%s) should return %s', async (roman, expectedNumber) => {
        expect(await service.toNumber(roman)).toBe(expectedNumber);
    });
  });

  context('when checking first 21 numbers', () => {
    it.each([['II',2],['III',3],['VII',7],['VIII',8],['XII',12],['XIII',13],['XIV',14],['XV',15],['XVI',16],['XVII',17],['XVIII',18],
    ['XIX',19],['XX',20],['XXI',21]])('toNumber(%s) should return %s', async (roman, expectedNumber) => {
        expect(await service.toNumber(roman)).toBe(expectedNumber);
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

});
