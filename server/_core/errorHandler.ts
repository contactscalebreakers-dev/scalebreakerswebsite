import type { Request, Response, NextFunction } from "express";
import { ENV } from "./env";

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 * Should be registered last in Express middleware chain
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("[Error Handler]", {
    name: err.name,
    message: err.message,
    stack: ENV.isDevelopment ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Handle known AppError instances
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        ...(ENV.isDevelopment && { stack: err.stack }),
      },
    });
    return;
  }

  // Handle unknown errors (don't leak details in production)
  res.status(500).json({
    error: {
      message: ENV.isProduction 
        ? "Internal server error" 
        : err.message || "An unexpected error occurred",
      ...(ENV.isDevelopment && { stack: err.stack }),
    },
  });
}

/**
 * Async handler wrapper to catch promise rejections
 */
export function asyncHandler<T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}
