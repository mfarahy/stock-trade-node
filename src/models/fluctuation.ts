export abstract class FluctuationElement {
  // The stock symbol for the requested stock
  public symbol: string;

  constructor(symbol: string) {
    this.symbol = symbol;
  }
}

export class Fluctuation extends FluctuationElement {
  // This field describes the number of fluctuations, or reversals, in stock
  // price for the given date range.
  // If there are not at least 3 data points, this value is 0
  // A fluctuation is defined as:
  //    ■ There is a daily rise in price followed by a daily fall in price.
  //    ■ There is a daily fall in price followed by a daily rise in price.
  public fluctuations: number;
  // This field is the maximum daily price increase for the period
  public max_rise: number;
  // This field is the maximum daily price decline for the period
  public max_fall: number;

  constructor(init: Partial<Fluctuation> | undefined = undefined) {
    super(init?.symbol ?? '');
    this.fluctuations = 0;
    this.symbol = '';
    this.max_fall = 0;
    this.max_rise = 0;

    if (init) Object.assign(this, init);
  }
}

export class ZeroFluctuation extends FluctuationElement {
  public message: string;

  constructor(symbol: string, message: string) {
    super(symbol);
    this.message = message;
  }
}
