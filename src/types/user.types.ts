export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CUSTOMER = 'customer',
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  message: string;
  token?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginAttempt {
  email: string;
  timestamp: Date;
  success: boolean;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  updateFailedAttempts(userId: string, attempts: number): Promise<void>;
  lockAccount(userId: string, until: Date): Promise<void>;
  resetFailedAttempts(userId: string): Promise<void>;
  updateLastLogin(userId: string, timestamp: Date): Promise<void>;
}