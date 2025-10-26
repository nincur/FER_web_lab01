import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url(),

  AUTH0_SECRET: z.string().min(32),
  AUTH0_BASE_URL: z.string().url(),
  AUTH0_CLIENT_ID: z.string(),
  AUTH0_ISSUER_BASE_URL: z.string().url(),

  AUTH0_M2M_DOMAIN: z.string(),
  AUTH0_M2M_AUDIENCE: z.string(),

  APP_URL: z.string().url(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
