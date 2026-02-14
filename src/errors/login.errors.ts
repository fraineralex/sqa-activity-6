export class InvalidCredentialsError extends Error {
  constructor(message: string = 'Invalid email or password') {
    super(message);
    this.name = 'InvalidCredentialsError';
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}

export class UserNotFoundError extends Error {
  constructor(email: string) {
    super(`User with email ${email} not found`);
    this.name = 'UserNotFoundError';
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

export class ValidationError extends Error {
  public readonly field: string;

  constructor(field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AccountLockedError extends Error {
  public readonly lockedUntil: Date;

  constructor(lockedUntil: Date) {
    super(`Account is locked until ${lockedUntil.toISOString()}`);
    this.name = 'AccountLockedError';
    this.lockedUntil = lockedUntil;
    Object.setPrototypeOf(this, AccountLockedError.prototype);
  }
}

export class InactiveAccountError extends Error {
  constructor() {
    super('Account is inactive. Please contact support.');
    this.name = 'InactiveAccountError';
    Object.setPrototypeOf(this, InactiveAccountError.prototype);
  }
}