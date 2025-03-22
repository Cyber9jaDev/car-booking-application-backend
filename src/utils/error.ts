import { HttpStatus } from '@nestjs/common';

class CustomAPIError extends Error {
  protected statusCode: number;
  protected error: string;
  protected messages: string[];

  constructor(message: string) {
    super(message);
  }
}

export class CustomBadRequestError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.error = 'Bad Request';
    this.messages = [message]
  }
}

export class CustomNotFoundError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.NOT_FOUND;
    this.error = 'Not Found';
    this.messages = [message] as string[];
  }
}

export class CustomUnAuthorizedError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.UNAUTHORIZED;
    this.error = 'UnAuthorized';
    this.messages = [message] as string[];
  }
}

export class CustomForbiddenError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.UNAUTHORIZED;
    this.error = 'Forbidden';
    this.messages = [message] as string[];
  }
}

export class CustomInternalServerError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    this.error = 'Internal Server Error';
    this.messages = [message] as string[];
  }
}
