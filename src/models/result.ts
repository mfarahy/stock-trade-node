export class OperationResult {
  constructor(success: boolean, message: string) {
    this._success = success;
    this._message = message;
  }
  private _success: boolean;
  private _message: string;

  public get isSuccess() {
    return this._success;
  }

  public get message() {
    return this._message;
  }
}

export class OperationResultValue<T> extends OperationResult {
  constructor(value: T, success: boolean, message: string) {
    super(success, message);
    this._value = value;
  }
  private _value: T;

  public get value() {
    return this._value;
  }
}

const Result = {
  OK(): OperationResult {
    return new OperationResult(true, '');
  },
  Fail(error: string): OperationResult {
    return new OperationResult(false, error);
  },
  Error(error: Error): OperationResult {
    return new OperationResult(false, error.message);
  },
  Value<T>(value: T) {
    return new OperationResultValue(value, true, '');
  },
  OperationResultValue<T>(value: T, success: boolean, message: string) {
    return new OperationResultValue(value, success, message);
  },
};

export default Result;
