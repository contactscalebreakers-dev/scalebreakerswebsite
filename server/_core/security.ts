import type { Request, Response, NextFunction } from "express";

/**
 * Rate limiting configuration
 * Simple in-memory rate limiter (for production, use Redis)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

/**
 * Rate limiting middleware factory
 */
export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, maxRequests } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    // Use IP address as identifier (in production, consider user ID for authenticated requests)
    const identifier = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    
    // Get or create rate limit entry
    let entry = rateLimitStore.get(identifier);
    
    // Reset if window has passed
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(identifier, entry);
    }
    
    // Increment request count
    entry.count++;
    
    // Check if rate limit exceeded
    if (entry.count > maxRequests) {
      res.status(429).json({
        error: {
          message: "Too many requests, please try again later",
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
        },
      });
      return;
    }
    
    // Add rate limit headers
    res.setHeader("X-RateLimit-Limit", maxRequests.toString());
    res.setHeader("X-RateLimit-Remaining", (maxRequests - entry.count).toString());
    res.setHeader("X-RateLimit-Reset", new Date(entry.resetTime).toISOString());
    
    next();
  };
}

/**
 * Security headers middleware
 */
export function securityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");
  
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  
  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");
  
  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Content Security Policy (adjust based on your needs)
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  
  next();
}

/**
 * Request sanitization middleware
 * Removes potentially dangerous characters from input
 */
export function sanitizeInput(req: Request, res: Response, next: NextFunction): void {
  // Sanitize query parameters
  if (req.query) {
    for (const key in req.query) {
      if (typeof req.query[key] === "string") {
        req.query[key] = sanitizeString(req.query[key] as string);
      }
    }
  }
  
  // Sanitize body (if JSON)
  if (req.body && typeof req.body === "object") {
    sanitizeObject(req.body);
  }
  
  next();
}

function sanitizeString(str: string): string {
  // Remove null bytes
  return str.replace(/\0/g, "");
}

function sanitizeObject(obj: Record<string, unknown>): void {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = sanitizeString(obj[key] as string);
    } else if (obj[key] && typeof obj[key] === "object") {
      sanitizeObject(obj[key] as Record<string, unknown>);
    }
  }
}

/**
 * CORS configuration helper
 */
export function createCorsOptions(allowedOrigins: string[]) {
  return {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }
      
      if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  };
}

/**
 * Clean up rate limit store periodically (prevent memory leak)
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute
