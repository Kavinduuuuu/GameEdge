// ============================================================================
// Auth Service
// ============================================================================

import { hash, compare } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { db } from '../db/database';
import { config } from '../config/index';
import { UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors';
import { logger } from '../utils/logger';
import type { User } from '@gameedge/shared';

interface AuthResult {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

export function generateToken(user: User): string {
  return jwt.sign(
    { userId: user.id, role: user.role },
    config.jwtSecret as jwt.Secret,
    { expiresIn: config.jwtExpiresIn as StringValue }
  );
}

export async function stripPassword(user: User): Promise<Omit<User, 'passwordHash'>> {
  const { passwordHash: _, ...safe } = user;
  return safe;
}

export async function registerUser(data: { name: string; email: string; phone: string; password: string }): Promise<AuthResult> {
  const allUsers = await db.users.getAll();
  const existing = allUsers.find(u => u.email === data.email);
  if (existing) {
    throw new ConflictError('Email already registered');
  }

  const passwordHash = await hash(data.password, 10);
  const now = new Date().toISOString();

  const user: User = {
    id: crypto.randomUUID(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: 'customer',
    passwordHash,
    createdAt: now,
  };

  await db.users.add(user);
  logger.audit('User registered', { userId: user.id, email: user.email });

  const token = generateToken(user);
  return { user: await stripPassword(user), token };
}

export async function loginUser(data: { email: string; password: string }): Promise<AuthResult> {
  const allUsers = await db.users.getAll();
  const user = allUsers.find(u => u.email === data.email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const valid = await compare(data.password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  logger.audit('User logged in', { userId: user.id });

  const token = generateToken(user);
  return { user: await stripPassword(user), token };
}

export async function getUserProfile(userId: string): Promise<Omit<User, 'passwordHash'>> {
  const user = await db.users.get(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  return stripPassword(user);
}