import {ConverterApi} from './converter.api';
import {Inject} from 'typescript-ioc';
import {LoggerApi} from '../logger';
import {Errors} from 'typescript-rest';

const numberRomanMap =  new Map<number,string>([
  [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
]);

export class ConverterService implements ConverterApi {
  logger: LoggerApi;
  constructor(
    @Inject
    logger: LoggerApi,
  ) {
    this.logger = logger.child('ConverterService');
  }

  async toNumber(value: string): Promise<number> {
    this.logger.info(`Converting ${value} to number`);
    value = value.toUpperCase();
    if(value == 'NULLA') return 0;
    const validRomanRegex = /^[M]{0,3}?((CM)|(CD)|(D?C{0,3}))?((XC)|(XL)|(L?X{0,3}))?((IX)|(IV)|(V?I{0,3}))?$/;
    if(!value || !validRomanRegex.test(value)) throw new Errors.BadRequestError;
    let output = 0;
    for(const [numValue, romanLetters] of numberRomanMap.entries()) {
      for(;value.startsWith(romanLetters);value=value.substring(romanLetters.length)){
        output+=numValue;
      }
    }
    return output;
  }

  async toRoman(value: number): Promise<string> {
    this.logger.info(`Converting ${value} to roman`);
    if(value == 0) return 'nulla';
    if(value > 0 && value <= 3999 && value%1 == 0){
      let output = '';
      for(const [numValue, romanLetters] of numberRomanMap.entries()) {
        for(;value>=numValue;value-=numValue){
          output+=romanLetters;
        }
      }
      return output;
    }
    throw new Errors.BadRequestError;
  }
}