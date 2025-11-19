export class BaseException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundException extends BaseException {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
  }
}

export class UnauthorizedException extends BaseException {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class BadRequestException extends BaseException {
  constructor(message: string = 'Bad request') {
    super(message, 'BAD_REQUEST', 400);
  }
}

export class ConflictException extends BaseException {
  constructor(message: string = 'Conflict') {
    super(message, 'CONFLICT', 409);
  }
}
