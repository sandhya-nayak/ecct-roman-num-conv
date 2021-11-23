import {ConverterApi} from './converter.api';
import {Inject} from 'typescript-ioc';
import {LoggerApi} from '../logger';
import { conditionalExpression, isBreakStatement } from '@babel/types';

const romanNumberMap =  new Map<string,number>([
  ['M',1000],
  ['D',500],
  ['C',100],
  ['L',50],
  ['X',10],
  ['V',5],
  ['I',1]
]);

const numberRomanMap =  new Map<number,string>([
  [1000,'M'],
  [1100,'MC'],
  [900,'CM'],
  [500,'D'],
  [600,'DC'],
  [400,'CD'],
  [100,'C'],
  [110,'CX'],
  [90,'XC'],
  [50,'L'],
  [60,'LX'],
  [40,'XL'],
  [10,'X'],
  [11,'XI'],
  [9,'IX'],
  [5,'V'],
  [6,'VI'],
  [4,'IV'],
  [1,'I']
]);

export class ConverterService implements ConverterApi {
  logger: LoggerApi;

  constructor(
    @Inject
    logger: LoggerApi,
  ) {
    this.logger = logger.child('ConverterService');
  }

  getNumberFromMap(roman: string) {
    let index = 0;
    for(const [key, value] of romanNumberMap.entries()) {
      if (key == roman){
        return [value,index];
      }
      index++;
    }
    return null;
  }
  
  isEven(n) {
    return n%2 == 0;
  }

  async toNumber(value: string): Promise<number> {
    this.logger.info(`Converting ${value} to number`);
    let numericalValue = 0;
    if(value == 'nulla'){
      return 0;
    }
    for(let i = 0; i<value.length; i++){
      let [currentVal,currentIndex] = this.getNumberFromMap(value.charAt(i));
      if(i+1 < value.length){
        let [nextVal,nextIndex] = this.getNumberFromMap(value.charAt(i+1));
        if((!this.isEven(nextIndex) && currentIndex == nextIndex+1) || 
          (this.isEven(nextIndex) && currentIndex == nextIndex+2)){
          numericalValue = numericalValue + nextVal - currentVal;
          i++;
        }
        else{
          numericalValue = numericalValue + currentVal;
        }
      }
      else{
        numericalValue = numericalValue + currentVal;
      }
    }
    return numericalValue;
  }

  async toRoman(value: number): Promise<string> {
    this.logger.info(`Converting ${value} to roman`);
    if(value == 0){
      return 'nulla';
    }
    let roman = '';
    for(const [key, val] of numberRomanMap.entries()) {
      let exit = false;
      while(!exit){
        if (value >= key){
          roman+=val;
          value-=key;
        }
        else{
          exit = true;
        }
      }
    }
    return roman;
  }
}
