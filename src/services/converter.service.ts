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
}
