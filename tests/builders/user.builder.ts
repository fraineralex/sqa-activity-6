import { User, UserRole } from '../../src/types/user.types';

export class UserBuilder {
  private user: Partial<User> = {
    id: 'usr-test-001',
    email: 'test@example.com',
    password: 'Test@123',
    name: 'Test User',
    role: UserRole.CUSTOMER,
    isActive: true,
    createdAt: new Date(),
    failedLoginAttempts: 0,
  };

  withId(id: string): UserBuilder {
    this.user.id = id;
    return this;
  }

  withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  withPassword(password: string): UserBuilder {
    this.user.password = password;
    return this;
  }

  withName(name: string): UserBuilder {
    this.user.name = name;
    return this;
  }

  withRole(role: UserRole): UserBuilder {
    this.user.role = role;
    return this;
  }

  withActiveStatus(isActive: boolean): UserBuilder {
    this.user.isActive = isActive;
    return this;
  }

  withFailedAttempts(attempts: number): UserBuilder {
    this.user.failedLoginAttempts = attempts;
    return this;
  }

  lockedUntil(date: Date): UserBuilder {
    this.user.lockedUntil = date;
    return this;
  }

  withLastLogin(date: Date): UserBuilder {
    this.user.lastLoginAt = date;
    return this;
  }

  build(): User {
    return this.user as User;
  }

  static createDefault(): User {
    return new UserBuilder().build();
  }

  static createAdmin(): User {
    return new UserBuilder()
      .withId('usr-admin-001')
      .withEmail('admin@guru99bank.com')
      .withPassword('Admin@123')
      .withName('Administrator')
      .withRole(UserRole.ADMIN)
      .build();
  }

  static createManager(): User {
    return new UserBuilder()
      .withId('usr-manager-001')
      .withEmail('manager@guru99bank.com')
      .withPassword('Manager@456')
      .withName('Branch Manager')
      .withRole(UserRole.MANAGER)
      .build();
  }

  static createCustomer(): User {
    return new UserBuilder()
      .withId('usr-customer-001')
      .withEmail('customer@guru99bank.com')
      .withPassword('Customer@789')
      .withName('John Customer')
      .withRole(UserRole.CUSTOMER)
      .build();
  }

  static createLockedUser(): User {
    return new UserBuilder()
      .withId('usr-locked-001')
      .withEmail('locked@guru99bank.com')
      .withPassword('Locked@999')
      .withName('Locked User')
      .withFailedAttempts(5)
      .lockedUntil(new Date(Date.now() + 3600000))
      .build();
  }

  static createInactiveUser(): User {
    return new UserBuilder()
      .withId('usr-inactive-001')
      .withEmail('inactive@guru99bank.com')
      .withPassword('Inactive@000')
      .withName('Inactive User')
      .withActiveStatus(false)
      .build();
  }
}