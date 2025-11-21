import { ENV } from "./env";

/**
 * Logging levels
 */
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

/**
 * Log entry structure
 */
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Logger class for structured logging
 */
class Logger {
  private context: Record<string, unknown> = {};

  constructor(private namespace: string = "APP") {}

  /**
   * Set context that will be included in all logs
   */
  setContext(context: Record<string, unknown>): void {
    this.context = { ...this.context, ...context };
  }

  /**
   * Clear logging context
   */
  clearContext(): void {
    this.context = {};
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, data?: Record<string, unknown> | Error): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message: `[${this.namespace}] ${message}`,
      context: { ...this.context },
    };

    // Handle error objects
    if (data instanceof Error) {
      entry.error = {
        name: data.name,
        message: data.message,
        stack: data.stack,
      } as Error;
    } else if (data) {
      entry.context = { ...entry.context, ...data };
    }

    // Format output
    const output = this.formatLogEntry(entry);

    // Output based on level
    switch (level) {
      case LogLevel.DEBUG:
        if (ENV.isDevelopment) {
          console.debug(output);
        }
        break;
      case LogLevel.INFO:
        console.info(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.ERROR:
        console.error(output);
        break;
    }
  }

  /**
   * Format log entry for output
   */
  private formatLogEntry(entry: LogEntry): string {
    if (ENV.isDevelopment) {
      // Pretty print in development
      return JSON.stringify(entry, null, 2);
    } else {
      // Single line JSON in production for log aggregation
      return JSON.stringify(entry);
    }
  }

  /**
   * Debug level logging (development only)
   */
  debug(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  /**
   * Info level logging
   */
  info(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, data);
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, data);
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error | Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, error);
  }

  /**
   * Create a child logger with additional namespace
   */
  child(namespace: string): Logger {
    return new Logger(`${this.namespace}:${namespace}`);
  }
}

/**
 * Create a logger instance
 */
export function createLogger(namespace: string): Logger {
  return new Logger(namespace);
}

/**
 * Default logger instance
 */
export const logger = createLogger("SERVER");

/**
 * HTTP request logging middleware helper
 */
export function logRequest(method: string, path: string, statusCode: number, duration: number): void {
  const level = statusCode >= 500 ? LogLevel.ERROR : statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
  
  logger.log(level, `${method} ${path} - ${statusCode}`, {
    method,
    path,
    statusCode,
    duration,
  });
}

/**
 * Performance measurement utility
 */
export class PerformanceTimer {
  private startTime: number;

  constructor(private label: string) {
    this.startTime = Date.now();
  }

  /**
   * End timer and log duration
   */
  end(): number {
    const duration = Date.now() - this.startTime;
    logger.debug(`${this.label} took ${duration}ms`, { duration });
    return duration;
  }
}

/**
 * Create performance timer
 */
export function startTimer(label: string): PerformanceTimer {
  return new PerformanceTimer(label);
}
