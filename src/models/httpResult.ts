export class HttpResult {
  statusCode: number;

  constructor(statusCode: number) {
    this.statusCode = statusCode;
  }
}

export const HttpResults = {
  ok: () => {
    return new HttpResult(200);
  },
  bad_request: () => {
    return new HttpResult(400);
  },
  created: () => {
    // The request succeeded, and a new resource was created as a result.
    // This is typically the response sent after POST requests, or some PUT requests.
    return new HttpResult(201);
  },
};
