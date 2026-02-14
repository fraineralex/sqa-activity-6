import {
  User,
  UserRepository,
  LoginCredentials,
  AuthenticatedUser,
} from '../types/user.types';
import {
  InvalidCredentialsError,
  UserNotFoundError,
  ValidationError,
  AccountLockedError,
  InactiveAccountError,
} from '../errors/login.errors';

export class LoginService {
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly LOCK_DURATION_MS = 3600000; // 1 hour in milliseconds
  private readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(private readonly userRepository: UserRepository) {}

  async login(credentials: LoginCredentials): Promise<AuthenticatedUser> {
    this.validateCredentials(credentials);

    const normalizedEmail = credentials.email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new UserNotFoundError(credentials.email);
    }

    this.checkAccountStatus(user);
    this.checkAccountLock(user);

    if (user.password !== credentials.password) {
      await this.handleFailedLogin(user);
      throw new InvalidCredentialsError();
    }

    await this.handleSuccessfulLogin(user);

    return this.mapToAuthenticatedUser(user);
  }

  private validateCredentials(credentials: LoginCredentials): void {
    if (!credentials) {
      throw new ValidationError('credentials', 'Credentials are required');
    }

    if (credentials.email === null || credentials.email === undefined) {
      throw new ValidationError('email', 'Email is required');
    }

    if (credentials.password === null || credentials.password === undefined) {
      throw new ValidationError('password', 'Password is required');
    }

    const trimmedEmail = credentials.email.trim();
    const trimmedPassword = credentials.password.trim();

    if (trimmedEmail === '') {
      throw new ValidationError('email', 'Email cannot be empty');
    }

    if (trimmedPassword === '') {
      throw new ValidationError('password', 'Password cannot be empty');
    }

    if (!this.EMAIL_REGEX.test(trimmedEmail)) {
      throw new ValidationError('email', 'Invalid email format');
    }
  }

  private checkAccountStatus(user: User): void {
    if (!user.isActive) {
      throw new InactiveAccountError();
    }
  }

  private checkAccountLock(user: User): void {
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new AccountLockedError(user.lockedUntil);
    }
  }

  private async handleFailedLogin(user: User): Promise<void> {
    const newAttempts = user.failedLoginAttempts + 1;
    await this.userRepository.updateFailedAttempts(user.id, newAttempts);

    if (newAttempts >= this.MAX_FAILED_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + this.LOCK_DURATION_MS);
      await this.userRepository.lockAccount(user.id, lockUntil);
    }
  }

  private async handleSuccessfulLogin(user: User): Promise<void> {
    await this.userRepository.resetFailedAttempts(user.id);
    await this.userRepository.updateLastLogin(user.id, new Date());
  }

  private mapToAuthenticatedUser(user: User): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async validateEmailFormat(email: string): Promise<boolean> {
    if (!email) return false;
    return this.EMAIL_REGEX.test(email.trim());
  }

  async isAccountLocked(email: string): Promise<{ locked: boolean; until?: Date }> {
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    
    if (!user) {
      return { locked: false };
    }

    const isLocked = user.lockedUntil !== undefined && user.lockedUntil > new Date();
    
    return {
      locked: isLocked,
      until: isLocked ? user.lockedUntil : undefined,
    };
  }
}