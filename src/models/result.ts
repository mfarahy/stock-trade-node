export class OperationResult {
  constructor(success: boolean, message: string, errorCode: string | undefined = undefined) {
    this._success = success;
    this._message = message;
    this._errorCode = errorCode ?? '';
  }
  private _success: boolean;
  private _message: string;
  private _errorCode: string;

  public get isSuccess() {
    return this._success;
  }

  public get message() {
    return this._message;
  }

  public get errorCode() {
    return this._errorCode;
  }
}

export class ValueResult<T> extends OperationResult {
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
  ok(): OperationResult {
    return new OperationResult(true, '');
  },
  fail(errorCode: string, message: string): OperationResult {
    return new OperationResult(false, message, errorCode);
  },
  error(errorCode: string, error: Error): OperationResult {
    return new OperationResult(false, error.message, errorCode);
  },
  value<T>(value: T) {
    return new ValueResult(value, true, '');
  },
};

export default Result;
