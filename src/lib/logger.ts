import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development';
const level = process.env.OPENPROOFING_LOG_LEVEL || (isDev ? 'debug' : 'info');

export const logger = pino({
  level,
  ...(isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }
    : {}),
  // Include request correlation ID when available
  mixin() {
    return {};
  },
});

/**
 * Create a child logger with a request correlation ID.
 * Use this in API routes and server actions.
 */
export function createRequestLogger(requestId: string) {
  return logger.child({ requestId });
}

export type Logger = typeof logger;
