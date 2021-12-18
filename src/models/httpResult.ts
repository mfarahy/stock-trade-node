import { StatusCodes } from 'http-status-codes';

export class HttpResult {
  constructor(public readonly statusCode: number) {}
}

export class HttpValueResult<T> extends HttpResult {
  constructor(statusCode: number, public readonly value: T | null) {
    super(statusCode);
  }
}

export const HttpResults = {
  ok_value: <T>(value: T | null) => {
    return new HttpValueResult(StatusCodes.OK, value);
  },
  ok: () => {
    return new HttpResult(StatusCodes.OK);
  },
  bad_request: () => {
    return new HttpResult(StatusCodes.BAD_REQUEST);
  },
  created: () => {
    // The request succeeded, and a new resource was created as a result.
    // This is typically the response sent after POST requests, or some PUT requests.
    return new HttpResult(StatusCodes.CREATED);
  },
  internal_server_error: () => {
    return new HttpResult(StatusCodes.INTERNAL_SERVER_ERROR);
  },
  not_found: () => {
    return new HttpResult(StatusCodes.NOT_FOUND);
  },
  internal_server_error_value: <T>(value: T | null) => {
    return new HttpValueResult<T>(StatusCodes.INTERNAL_SERVER_ERROR, value);
  },
  not_found_value: <T>(value: T | null) => {
    return new HttpValueResult<T>(StatusCodes.NOT_FOUND, value);
  },
};
