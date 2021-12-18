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
  constructor(
    value: T | null,
    success: boolean,
    message: string,
    errorCode: string | undefined = undefined
  ) {
    super(success, message, errorCode);
    this._value = value;
  }
  private _value: T | null;

  public get value() {
    return this._value;
  }
}

export class QueryResult<T> extends ValueResult<T[]> {
  constructor(
    data: T[],
    elapsedTime: number,
    success: boolean,
    message: string,
    errorCode: string | undefined = undefined
  ) {
    super(data, success, message, errorCode);
    this._elapsedTime = elapsedTime;
  }
  private _elapsedTime: number;
  public get elapsedTime() {
    return this._elapsedTime;
  }
}

const Result = {
  ok(): OperationResult {
    return new OperationResult(true, '');
  },
  error(message: string, errorCode: string | undefined = undefined): OperationResult {
    return new OperationResult(false, message, errorCode);
  },
  exception(error: Error, errorCode: string | undefined = undefined): OperationResult {
    return new OperationResult(false, error.message, errorCode);
  },
  value<T>(value: T): ValueResult<T> {
    return new ValueResult(value, true, '');
  },
  fail<T>(error: Error, errorCode: string | undefined = undefined): ValueResult<T> {
    return new ValueResult<T>(null, false, error.message, errorCode);
  },
  query<T>(data: T[], elapsedTime: number) {
    return new QueryResult(data, elapsedTime, true, '');
  },
  failedQuery<T>(message: string, errorCode: string | undefined = undefined) {
    return new QueryResult<T>([], 0, false, message, errorCode);
  },
  error_value<T>(message: string, errorCode: string | undefined = undefined): ValueResult<T> {
    return new ValueResult<T>(null, false, message, errorCode);
  },
};

export default Result;
