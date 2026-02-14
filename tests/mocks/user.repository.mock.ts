import { User, UserRepository, UserRole } from '../../src/types/user.types';

export const mockUsers: User[] = [
  {
    id: 'usr-001',
    email: 'admin@guru99bank.com',
    password: 'Admin@123',
    name: 'System Administrator',
    role: UserRole.ADMIN,
    isActive: true,
    createdAt: new Date('2023-01-01'),
    failedLoginAttempts: 0,
    lastLoginAt: new Date('2024-01-10'),
  },
  {
    id: 'usr-002',
    email: 'manager@guru99bank.com',
    password: 'Manager@456',
    name: 'Branch Manager',
    role: UserRole.MANAGER,
    isActive: true,
    createdAt: new Date('2023-02-15'),
    failedLoginAttempts: 0,
  },
  {
    id: 'usr-003',
    email: 'customer@guru99bank.com',
    password: 'Customer@789',
    name: 'John Customer',
    role: UserRole.CUSTOMER,
    isActive: true,
    createdAt: new Date('2023-03-20'),
    failedLoginAttempts: 0,
  },
  {
    id: 'usr-004',
    email: 'locked@guru99bank.com',
    password: 'Locked@999',
    name: 'Locked User',
    role: UserRole.CUSTOMER,
    isActive: true,
    createdAt: new Date('2023-04-10'),
    failedLoginAttempts: 5,
    lockedUntil: new Date(Date.now() + 3600000), // Locked for 1 hour
  },
  {
    id: 'usr-005',
    email: 'inactive@guru99bank.com',
    password: 'Inactive@000',
    name: 'Inactive User',
    role: UserRole.CUSTOMER,
    isActive: false,
    createdAt: new Date('2023-05-01'),
    failedLoginAttempts: 0,
  },
];

export class MockUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();

  constructor() {
    mockUsers.forEach((user) => {
      this.users.set(user.id, { ...user });
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    return user ? { ...user } : null;
  }

  async updateFailedAttempts(userId: string, attempts: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.failedLoginAttempts = attempts;
      this.users.set(userId, user);
    }
  }

  async lockAccount(userId: string, until: Date): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.lockedUntil = until;
      this.users.set(userId, user);
    }
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.failedLoginAttempts = 0;
      user.lockedUntil = undefined;
      this.users.set(userId, user);
    }
  }

  async updateLastLogin(userId: string, timestamp: Date): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.lastLoginAt = timestamp;
      this.users.set(userId, user);
    }
  }

  resetAll(): void {
    this.users.clear();
    mockUsers.forEach((user) => {
      this.users.set(user.id, { ...user });
    });
  }
}