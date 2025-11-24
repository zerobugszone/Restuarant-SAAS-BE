/* eslint-disable no-console */
class Logger {
  info(message: string, ...meta: unknown[]) {
    console.log(`[INFO] ${message}`, ...meta);
  }

  warn(message: string, ...meta: unknown[]) {
    console.warn(`[WARN] ${message}`, ...meta);
  }

  error(message: string, ...meta: unknown[]) {
    console.error(`[ERROR] ${message}`, ...meta);
  }

  debug(message: string, ...meta: unknown[]) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, ...meta);
    }
  }
}

export const logger = new Logger();
