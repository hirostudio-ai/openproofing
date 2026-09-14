import { z } from 'zod/v4';

const envSchema = z.object({
  // Database
  OPENPROOFING_DATABASE_URL: z.url(),

  // Redis
  OPENPROOFING_REDIS_URL: z.string().min(1),

  // Object Storage
  OPENPROOFING_S3_ENDPOINT: z.url(),
  OPENPROOFING_S3_REGION: z.string().default('us-east-1'),
  OPENPROOFING_S3_BUCKET: z.string().min(1),
  OPENPROOFING_S3_ACCESS_KEY: z.string().min(1),
  OPENPROOFING_S3_SECRET_KEY: z.string().min(1),
  OPENPROOFING_S3_FORCE_PATH_STYLE: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),

  // Application
  OPENPROOFING_APP_URL: z.url(),
  OPENPROOFING_LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),

  // Auth.js
  AUTH_SECRET: z.string().min(1),
  AUTH_URL: z.url(),

  // Node
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(z.treeifyError(result.error), null, 2));
    throw new Error('Invalid environment variables');
  }

  return result.data;
}

export const env = validateEnv();
