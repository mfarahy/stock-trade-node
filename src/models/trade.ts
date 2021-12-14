import _ from 'lodash';
import User from './user';
export interface ITrade {
  id: number;
  type: 'buy' | 'sell';
  user: User | null;
  symbol: string;
  shares: number;
  price: number;
  timestamp: Date;
}

export default class Trade implements ITrade {
  // The unique ID of the trade
  public id: number;
  // The trade type, either buy or sell .
  public type: 'buy' | 'sell';
  // The user responsible for the trade
  public user: User | null;
  // The stock symbol
  public symbol: string;
  // The total number of shares traded.
  // The traded shares value is between 10 and 30 shares, inclusive.
  public shares: number;
  // The price of one share of stock at the time of the trade (up to two places of the decimal).
  // The stock price is between 130.42 and 195.65 inclusive
  public price: number;
  // The timestamp for the trade creation given in the format yyyy-MM-dd HH:mm:ss .
  // The timezone is EST(UTC - 4).
  public timestamp: Date;

  constructor(init: Partial<Trade> | undefined = undefined) {
    this.id = init?.id ?? 0;
    this.type = init?.type ?? 'buy';
    this.user = init?.user ?? null;
    this.symbol = init?.symbol ?? '';
    this.shares = init?.shares ?? 0;
    this.price = init?.price ?? 0;
    this.timestamp = init?.timestamp ?? new Date();
  }
}
