export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message);
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden') {
    super(message);
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Not Found') {
    super(message);
  }
}

export class ConflictError extends Error {
  constructor(message: string = 'Conflict') {
    super(message);
  }
}

export class InternalServerError extends Error {
  constructor(message: string = 'Internal Server Error') {
    super(message);
  }
}