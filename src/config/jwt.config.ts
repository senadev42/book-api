// src/config/jwt.config.ts
import { registerAs } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export const JWT_CONFIG = 'jwt';

export interface JWTConfiguration {
  privateKey: string;
  publicKey: string;
  expiresIn: string;
}

export default registerAs(
  JWT_CONFIG,
  (): JWTConfiguration => ({
    privateKey:
      process.env.JWT_PRIVATE_KEY ||
      fs.readFileSync(path.join(process.cwd(), 'keys', 'private.key'), 'utf8'),
    publicKey:
      process.env.JWT_PUBLIC_KEY ||
      fs.readFileSync(path.join(process.cwd(), 'keys', 'public.key'), 'utf8'),
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '15m',
  }),
);
