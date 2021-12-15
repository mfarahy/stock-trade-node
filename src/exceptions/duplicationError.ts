export default class DuplicationError extends Error {
  private _duplicateKey: any;
  constructor(duplicateKey: any | undefined, message: string | undefined) {
    super(message);
    this._duplicateKey = duplicateKey;
  }

  public get duplicateKey(): any {
    return this._duplicateKey;
  }
}
