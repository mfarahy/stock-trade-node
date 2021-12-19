export default class StockSymbol {
  public id: string;
  public name: string;

  constructor(init: Partial<StockSymbol> | undefined = undefined) {
    this.id = init?.id ?? '';
    this.name = init?.name ?? '';
  }
}
