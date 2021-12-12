import { injectable } from 'inversify';
import { FluctuationElement } from '../models/fluctuation';
import Result, { ValueResult } from '../models/result';
import SymbolRange from '../models/symbolRange';

export interface IStockController {}

@injectable()
export default class StockController implements IStockController {
  // Returning the fluctuations count, maximum daily rise and maximum daily fall for each
  // stock symbol for the period in the given date range: The service returns
  // the fluctuations count, maximum daily rise and maximum daily fall for each stock symbol
  // for the period in the given date range inclusive.
  getStates = async (start: Date, end: Date): Promise<ValueResult<FluctuationElement[]>> => {
    return Result.value<FluctuationElement[]>([]);
  };

  // Returning the highest and lowest price for the stock symbol in the given date range.
  // The service returns the JSON object describing the information of highest
  // and lowest price in the given date range specified by start date and end date inclusive
  getPrice = async (symbol: string, start: Date, end: Date): Promise<ValueResult<SymbolRange>> => {
    return Result.value<SymbolRange>(new SymbolRange());
  };
}
