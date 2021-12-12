export default class SymbolRange {
  public symbol: string;
  public highest?: number;
  public lowest?: number;
  public start?: Date;
  public end?: Date;

  constructor(init: Partial<SymbolRange> | undefined = undefined) {
    this.symbol = '';
    if (init) Object.assign(this, init);
  }
}
