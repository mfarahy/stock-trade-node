import { injectable } from 'inversify';
import { OperationResult, ValueResult } from '../models/result';
import Trade from '../models/trade';

export interface ITradeService {
  add(trade: Trade): Promise<OperationResult>;
  eraseAll(): Promise<OperationResult>;
  getAll(trade: Trade): Promise<ValueResult<Trade[]>>;
  findById(userId: number): Promise<ValueResult<Trade[]>>;
}

@injectable()
export default class TradeService implements ITradeService {
  async add(trade: Trade): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
  async eraseAll(): Promise<OperationResult> {
    throw new Error('Method not implemented.');
  }
  async getAll(trade: Trade): Promise<ValueResult<Trade[]>> {
    throw new Error('Method not implemented.');
  }
  async findById(userId: number): Promise<ValueResult<Trade[]>> {
    throw new Error('Method not implemented.');
  }
}
