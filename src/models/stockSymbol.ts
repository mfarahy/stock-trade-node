export default class StockSymbol {
  public id: string;
  public name: string;
  public lastPrice: number;
  public lastTrade: Date;

  constructor(init: Partial<StockSymbol> | undefined = undefined) {
    this.id = init?.id??'';
    this.name = init?.name??'';
    this.lastPrice = init?.lastPrice ?? 0;
    this.lastTrade = init?.lastTrade ?? new Date();
  }
}
