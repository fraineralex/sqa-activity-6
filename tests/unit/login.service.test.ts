import { LoginService } from '../../src/services/login.service';
import { MockUserRepository } from '../mocks/user.repository.mock';
import { LoginCredentials, UserRole } from '../../src/types/user.types';
import {
  InvalidCredentialsError,
  UserNotFoundError,
  ValidationError,
  AccountLockedError,
  InactiveAccountError,
} from '../../src/errors/login.errors';

describe('LoginService', () => {
  let loginService: LoginService;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    loginService = new LoginService(mockRepository);
  });

  afterEach(() => {
    mockRepository.resetAll();
  });

  describe('UC1: Successful Login', () => {
    test('should successfully login with valid admin credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'admin@guru99bank.com',
        password: 'Admin@123',
      };

      const result = await loginService.login(credentials);

      expect(result).toBeDefined();
      expect(result.email).toBe('admin@guru99bank.com');
      expect(result.name).toBe('System Administrator');
      expect(result.role).toBe(UserRole.ADMIN);
      expect(result.id).toBe('usr-001');
    });

    test('should successfully login with valid manager credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'manager@guru99bank.com',
        password: 'Manager@456',
      };

      const result = await loginService.login(credentials);

      expect(result).toBeDefined();
      expect(result.email).toBe('manager@guru99bank.com');
      expect(result.role).toBe(UserRole.MANAGER);
    });

    test('should successfully login with valid customer credentials', async () => {
      const credentials: LoginCredentials = {
        email: 'customer@guru99bank.com',
        password: 'Customer@789',
      };

      const result = await loginService.login(credentials);

      expect(result).toBeDefined();
      expect(result.email).toBe('customer@guru99bank.com');
      expect(result.role).toBe(UserRole.CUSTOMER);
    });

    test.each([
      ['ADMIN@GURU99BANK.COM', 'Admin@123', 'uppercase email'],
      ['Admin@Guru99Bank.com', 'Admin@123', 'mixed case email'],
      ['  admin@guru99bank.com  ', 'Admin@123', 'email with whitespace'],
    ])('should handle email case sensitivity: %s (%s)', async (email, password) => {
      const credentials: LoginCredentials = { email, password };

      const result = await loginService.login(credentials);

      expect(result).toBeDefined();
      expect(result.email).toBe('admin@guru99bank.com');
    });

    test('should reset failed attempts on successful login', async () => {
      await mockRepository.updateFailedAttempts('usr-003', 3);

      const credentials: LoginCredentials = {
        email: 'customer@guru99bank.com',
        password: 'Customer@789',
      };

      await loginService.login(credentials);

      const updatedUser = await mockRepository.findByEmail('customer@guru99bank.com');
      expect(updatedUser?.failedLoginAttempts).toBe(0);
    });

    test('should update last login timestamp on successful login', async () => {
      const beforeLogin = new Date();
      
      const credentials: LoginCredentials = {
        email: 'customer@guru99bank.com',
        password: 'Customer@789',
      };

      await loginService.login(credentials);

      const updatedUser = await mockRepository.findByEmail('customer@guru99bank.com');
      expect(updatedUser?.lastLoginAt).toBeDefined();
      expect(updatedUser?.lastLoginAt?.getTime()).toBeGreaterThanOrEqual(beforeLogin.getTime());
    });
  });

  describe('UC2: Failed Login - Invalid Credentials', () => {
    test('should throw InvalidCredentialsError with wrong password', async () => {
      const credentials: LoginCredentials = {
        email: 'admin@guru99bank.com',
        password: 'WrongPassword@123',
      };

      await expect(loginService.login(credentials)).rejects.toThrow(InvalidCredentialsError);
    });

    test('should throw UserNotFoundError for non-existing user', async () => {
      const credentials: LoginCredentials = {
        email: 'nonexistent@example.com',
        password: 'SomePassword@123',
      };

      await expect(loginService.login(credentials)).rejects.toThrow(UserNotFoundError);
    });

    test('should throw UserNotFoundError with correct error message', async () => {
      const credentials: LoginCredentials = {
        email: 'missing@example.com',
        password: 'Password@123',
      };

      await expect(loginService.login(credentials)).rejects.toThrow(
        'User with email missing@example.com not found'
      );
    });

    test('should increment failed attempts on wrong password', async () => {
      const credentials: LoginCredentials = {
        email: 'customer@guru99bank.com',
        password: 'WrongPassword@123',
      };

      try {
        await loginService.login(credentials);
      } catch (error) {
        // Expected error
      }

      const user = await mockRepository.findByEmail('customer@guru99bank.com');
      expect(user?.failedLoginAttempts).toBe(1);
    });
  });

  describe('UC3: Input Validation', () => {
    test.each([
      ['', 'password@123', 'empty email'],
      ['   ', 'password@123', 'whitespace-only email'],
    ])('should throw ValidationError for %s', async (email, password) => {
      const credentials: LoginCredentials = { email, password };

      await expect(loginService.login(credentials)).rejects.toThrow(ValidationError);
    });

    test.each([
      ['email@test.com', '', 'empty password'],
      ['email@test.com', '   ', 'whitespace-only password'],
    ])('should throw ValidationError for %s', async (email, password) => {
      const credentials: LoginCredentials = { email, password };

      await expect(loginService.login(credentials)).rejects.toThrow(ValidationError);
    });

    test.each([
      [null as any, 'password@123'],
      [undefined as any, 'password@123'],
    ])('should throw ValidationError for null/undefined email', async (email, password) => {
      const credentials = { email, password };

      await expect(loginService.login(credentials)).rejects.toThrow(ValidationError);
    });

    test.each([
      ['email@test.com', null as any],
      ['email@test.com', undefined as any],
    ])('should throw ValidationError for null/undefined password', async (email, password) => {
      const credentials = { email, password };

      await expect(loginService.login(credentials)).rejects.toThrow(ValidationError);
    });

    test('should throw ValidationError when credentials is null', async () => {
      await expect(loginService.login(null as any)).rejects.toThrow(ValidationError);
    });

    test('should throw ValidationError when credentials is undefined', async () => {
      await expect(loginService.login(undefined as any)).rejects.toThrow(ValidationError);
    });

    test.each([
      ['invalidemail', 'password@123'],
      ['test@', 'password@123'],
      ['@example.com', 'password@123'],
      ['test@.com', 'password@123'],
    ])('should throw ValidationError for invalid email format: %s', async (email, password) => {
      const credentials: LoginCredentials = { email, password };

      await expect(loginService.login(credentials)).rejects.toThrow(ValidationError);
      await expect(loginService.login(credentials)).rejects.toThrow('Invalid email format');
    });

    test('should include correct field name in ValidationError', async () => {
      const credentials: LoginCredentials = {
        email: '',
        password: 'Password@123',
      };

      try {
        await loginService.login(credentials);
      } catch (error) {
        if (error instanceof ValidationError) {
          expect(error.field).toBe('email');
        }
      }
    });
  });

  describe('UC4: Account Lock After Multiple Failed Attempts', () => {
    test('should lock account after 5 failed attempts', async () => {
      const credentials: LoginCredentials = {
        email: 'customer@guru99bank.com',
        password: 'WrongPassword@123',
      };

      // Attempt login 5 times with wrong password
      for (let i = 0; i < 5; i++) {
        try {
          await loginService.login(credentials);
        } catch (error) {
          // Expected error
        }
      }

      // Account should be locked now
      await expect(loginService.login(credentials)).rejects.toThrow(AccountLockedError);
    });

    test('should throw AccountLockedError with lock expiration date', async () => {
      const credentials: LoginCredentials = {
        email: 'locked@guru99bank.com',
        password: 'Locked@999',
      };

      try {
        await loginService.login(credentials);
      } catch (error) {
        if (error instanceof AccountLockedError) {
          expect(error.lockedUntil).toBeInstanceOf(Date);
          expect(error.lockedUntil.getTime()).toBeGreaterThan(Date.now());
        }
      }
    });

    test('should not allow login when account is locked', async () => {
      const credentials: LoginCredentials = {
        email: 'locked@guru99bank.com',
        password: 'Locked@999',
      };

      await expect(loginService.login(credentials)).rejects.toThrow(AccountLockedError);
    });

    test('should increment failed attempts correctly', async () => {
      const credentials: LoginCredentials = {
        email: 'customer@guru99bank.com',
        password: 'WrongPassword@123',
      };

      for (let i = 1; i <= 3; i++) {
        try {
          await loginService.login(credentials);
        } catch (error) {
          // Expected
        }

        const user = await mockRepository.findByEmail('customer@guru99bank.com');
        expect(user?.failedLoginAttempts).toBe(i);
      }
    });
  });

  describe('UC5: Inactive Account Handling', () => {
    test('should throw InactiveAccountError for inactive user', async () => {
      const credentials: LoginCredentials = {
        email: 'inactive@guru99bank.com',
        password: 'Inactive@000',
      };

      await expect(loginService.login(credentials)).rejects.toThrow(InactiveAccountError);
    });

    test('should throw InactiveAccountError even with correct password', async () => {
      const credentials: LoginCredentials = {
        email: 'inactive@guru99bank.com',
        password: 'Inactive@000',
      };

      await expect(loginService.login(credentials)).rejects.toThrow(
        'Account is inactive. Please contact support.'
      );
    });
  });

  describe('UC6: Email Format Validation', () => {
    test.each([
      ['user@example.com', true],
      ['user.name@example.com', true],
      ['user+tag@example.com', true],
      ['user@subdomain.example.com', true],
      ['user123@example.co.uk', true],
      ['firstname.lastname@example.com', true],
    ])('validateEmailFormat should return true for valid email: %s', async (email, expected) => {
      const result = await loginService.validateEmailFormat(email);
      expect(result).toBe(expected);
    });

    test.each([
      ['plainaddress', false],
      ['@missingusername.com', false],
      ['username@.com', false],
      ['username@.com.', false],
      ['', false],
      ['   ', false],
    ])('validateEmailFormat should return false for invalid email: %s', async (email, expected) => {
      const result = await loginService.validateEmailFormat(email);
      expect(result).toBe(expected);
    });

    test('validateEmailFormat should handle null input', async () => {
      const result = await loginService.validateEmailFormat(null as any);
      expect(result).toBe(false);
    });

    test('validateEmailFormat should handle undefined input', async () => {
      const result = await loginService.validateEmailFormat(undefined as any);
      expect(result).toBe(false);
    });
  });

  describe('UC7: Account Lock Status Check', () => {
    test('should return locked status for locked account', async () => {
      const result = await loginService.isAccountLocked('locked@guru99bank.com');

      expect(result.locked).toBe(true);
      expect(result.until).toBeDefined();
      expect(result.until).toBeInstanceOf(Date);
    });

    test('should return unlocked status for active account', async () => {
      const result = await loginService.isAccountLocked('customer@guru99bank.com');

      expect(result.locked).toBe(false);
      expect(result.until).toBeUndefined();
    });

    test('should return unlocked status for non-existing user', async () => {
      const result = await loginService.isAccountLocked('nonexistent@example.com');

      expect(result.locked).toBe(false);
      expect(result.until).toBeUndefined();
    });

    test('should handle email case insensitivity in lock check', async () => {
      const result = await loginService.isAccountLocked('LOCKED@GURU99BANK.COM');

      expect(result.locked).toBe(true);
    });
  });

  describe('Edge Cases and Boundary Conditions', () => {
    test('should handle password with special characters', async () => {
      // This test verifies the password comparison logic works correctly
      const credentials: LoginCredentials = {
        email: 'customer@guru99bank.com',
        password: 'Customer@789',
      };

      const result = await loginService.login(credentials);
      expect(result).toBeDefined();
    });

    test('should handle very long email addresses', async () => {
      const longEmail = 'a'.repeat(50) + '@example.com';
      const credentials: LoginCredentials = {
        email: longEmail,
        password: 'Password@123',
      };

      await expect(loginService.login(credentials)).rejects.toThrow(UserNotFoundError);
    });

    test('should handle password with only spaces', async () => {
      const credentials: LoginCredentials = {
        email: 'customer@guru99bank.com',
        password: '     ',
      };

      await expect(loginService.login(credentials)).rejects.toThrow(ValidationError);
    });

    test('should handle email with trailing spaces', async () => {
      const credentials: LoginCredentials = {
        email: '  customer@guru99bank.com  ',
        password: 'Customer@789',
      };

      const result = await loginService.login(credentials);
      expect(result).toBeDefined();
      expect(result.email).toBe('customer@guru99bank.com');
    });

    test('should handle multiple consecutive failed logins from different users independently', async () => {
      const credentials1: LoginCredentials = {
        email: 'customer@guru99bank.com',
        password: 'WrongPassword@123',
      };

      const credentials2: LoginCredentials = {
        email: 'manager@guru99bank.com',
        password: 'WrongPassword@123',
      };

      // Fail 3 times for customer
      for (let i = 0; i < 3; i++) {
        try {
          await loginService.login(credentials1);
        } catch (error) {
          // Expected
        }
      }

      // Fail 2 times for manager
      for (let i = 0; i < 2; i++) {
        try {
          await loginService.login(credentials2);
        } catch (error) {
          // Expected
        }
      }

      const customer = await mockRepository.findByEmail('customer@guru99bank.com');
      const manager = await mockRepository.findByEmail('manager@guru99bank.com');

      expect(customer?.failedLoginAttempts).toBe(3);
      expect(manager?.failedLoginAttempts).toBe(2);
    });

    test('should throw correct error type for each scenario', async () => {
      const testCases = [
        {
          credentials: { email: '', password: 'password' },
          expectedError: ValidationError,
          description: 'empty email',
        },
        {
          credentials: { email: 'test@test.com', password: '' },
          expectedError: ValidationError,
          description: 'empty password',
        },
        {
          credentials: { email: 'nonexistent@test.com', password: 'password' },
          expectedError: UserNotFoundError,
          description: 'non-existing user',
        },
        {
          credentials: { email: 'admin@guru99bank.com', password: 'wrong' },
          expectedError: InvalidCredentialsError,
          description: 'wrong password',
        },
        {
          credentials: { email: 'inactive@guru99bank.com', password: 'Inactive@000' },
          expectedError: InactiveAccountError,
          description: 'inactive account',
        },
        {
          credentials: { email: 'locked@guru99bank.com', password: 'Locked@999' },
          expectedError: AccountLockedError,
          description: 'locked account',
        },
      ];

      for (const testCase of testCases) {
        await expect(
          loginService.login(testCase.credentials as LoginCredentials)
        ).rejects.toBeInstanceOf(testCase.expectedError);
      }
    });
  });
});