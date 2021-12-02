import {ConverterApi} from './converter.api';
import {Inject} from 'typescript-ioc';
import {LoggerApi} from '../logger';
import { Errors } from 'typescript-rest';

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
    this.logger.info(`Getting the numeric value of ${roman}`);
    let index = 0;
    for(const [key, value] of romanNumberMap.entries()) {
      if (key == roman){
        return [value,index];
      }
      index++;
    }
    throw new Errors.BadRequestError;
  }
  
  isEven(n: number) {
    return n%2 == 0;
  }

  async hasFourConsecutiveSameLetters(value: string): Promise<boolean>{
    this.logger.info(`Checking if ${value} has four same consecutive letters - which would mean it is an invalid roman number`);
    let consecutiveSameLetterCount = 1;
    for(let i = 0; i<value.length; i++){
      let [currentVal] = this.getNumberFromMap(value.charAt(i));
      if(i+1 < value.length){
        let [nextVal] = this.getNumberFromMap(value.charAt(i+1));
        if(currentVal == nextVal){
          consecutiveSameLetterCount++;
        }
        else{
          consecutiveSameLetterCount = 1;
        }
      }
      if(consecutiveSameLetterCount == 4){
        return true;
      }
    }
    return false;
  }

  async toNumber(value: string): Promise<number> {
    let lastBorderCharacter = "";
    this.logger.info(`Converting ${value} to number`);
    if(value == 'nulla'){
      return 0;
    }
    value = value.toUpperCase();
    if(!await this.hasFourConsecutiveSameLetters(value)){
      let numericalValue = 0;
      for(let i = 0; i<value.length; i++){
        let [currentVal,currentIndex] = this.getNumberFromMap(value.charAt(i));
        if(i+1 < value.length){
          let [nextVal,nextIndex] = this.getNumberFromMap(value.charAt(i+1));
          if((!this.isEven(nextIndex) && currentIndex == nextIndex+1) || 
            (this.isEven(nextIndex) && currentIndex == nextIndex+2)){
            numericalValue = numericalValue + nextVal - currentVal;
            lastBorderCharacter = value.charAt(i);
            i++;
          }
          else if(currentIndex > nextIndex){
            throw new Errors.BadRequestError;
          }
          else{
            if (value.charAt(i) == lastBorderCharacter){
              throw new Errors.BadRequestError;
            }
            numericalValue = numericalValue + currentVal;
          }
        }
        else{
          if (value.charAt(i) == lastBorderCharacter){
            throw new Errors.BadRequestError;
          }
          numericalValue = numericalValue + currentVal;
        }
      }
      return numericalValue;
    }
    else{
      throw new Errors.BadRequestError;
    }
  }

  async toRoman(value: number): Promise<string> {
    this.logger.info(`Converting ${value} to roman`);
    if(value == 0){
      return 'nulla';
    }
    if(value >= 0 && value <= 3999 && value%1 == 0){
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
    else{
      throw new Errors.BadRequestError;
    }
  }
}
