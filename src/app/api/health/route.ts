import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { logger } from '@/lib/logger';

interface HealthCheck {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  version: string;
  checks: {
    database: ComponentHealth;
  };
}

interface ComponentHealth {
  status: 'ok' | 'error';
  latencyMs?: number;
  error?: string;
}

async function checkDatabase(): Promise<ComponentHealth> {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'ok',
      latencyMs: Date.now() - start,
    };
  } catch (error) {
    logger.error({ error }, 'Database health check failed');
    return {
      status: 'error',
      latencyMs: Date.now() - start,
      error: 'Connection failed',
    };
  }
}

export async function GET() {
  const checks = {
    database: await checkDatabase(),
  };

  const allOk = Object.values(checks).every((c) => c.status === 'ok');
  const anyError = Object.values(checks).some((c) => c.status === 'error');

  const health: HealthCheck = {
    status: allOk ? 'ok' : anyError ? 'error' : 'degraded',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '0.1.0',
    checks,
  };

  return NextResponse.json(health, {
    status: health.status === 'ok' ? 200 : 503,
  });
}
