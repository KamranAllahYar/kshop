enum HttpCodes {
  // 200 Http Request
  SUCCESS = 200,

  // 400 Http Request
  BAD_REQUEST = 200,
  UNAUTHORIZED = 200,
  FORBIDDEN = 200,
  NOT_FOUND = 404,
  NOT_ACCEPTABLE = 406,
  CONFLICTS = 200,
  PRECONDITION_FAILED = 402,

  PRECONDITION_REQUIRED = 428,

  // 500 Http Request
  SERVER_ERROR = 200,
}

export default HttpCodes
