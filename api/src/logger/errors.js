export class AuthenticationError extends Error {
  code = 401
  message = 'Not Authenticated - you have to be authenticated to perform this action'
}

export class DatabaseError extends Error {
  code = 404
  message = 'Resource not found : ' + this.message
}

export class WrongArgumentsError extends Error {
  code = 400
  message = 'Wrong arguments : ' + this.message
}

export class ServiceUnavailableError extends Error {
  code = 503
  message = 'At least one service is unresponding ' + this.message
}
