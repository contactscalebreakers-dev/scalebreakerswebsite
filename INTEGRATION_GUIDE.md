# Security Improvements Integration Guide

This guide explains how to integrate the new security features into your existing application.

## Quick Start

The security improvements are **ready to use** but need to be integrated into your main server file.

## Step 1: Update `server/_core/index.ts`

Add the new middleware and error handlers to your Express app:

```typescript
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

// Import new security features
import { errorHandler, notFoundHandler, asyncHandler } from "./errorHandler";
import { securityHeaders, createRateLimiter, sanitizeInput } from "./security";
import { logger } from "./logger";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, "0.0.0.0", () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // 1. Security headers (first middleware)
  app.use(securityHeaders);

  // 2. Body parser
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // 3. Input sanitization
  app.use(sanitizeInput);

  // 4. Rate limiting
  // Adjust windowMs and maxRequests based on your needs
  app.use(createRateLimiter({ 
    windowMs: 60000,      // 1 minute window
    maxRequests: 100      // 100 requests per minute per IP
  }));

  // OAuth callback (no rate limit on this specific route)
  registerOAuthRoutes(app);

  // tRPC API with stricter rate limit
  app.use(
    "/api/trpc",
    createRateLimiter({
      windowMs: 60000,    // 1 minute
      maxRequests: 60     // 60 requests per minute
    }),
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Serve static files or Vite dev server
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // 5. 404 handler (before error handler)
  app.use(notFoundHandler);

  // 6. Global error handler (must be last)
  app.use(errorHandler);

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    logger.warn(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, "0.0.0.0", () => {
    logger.info(`Server running on http://localhost:${port}/`, {
      environment: process.env.NODE_ENV,
      port,
    });
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    logger.info("SIGTERM received, shutting down gracefully");
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });
  });
}

startServer().catch((error) => {
  logger.error("Failed to start server", error);
  process.exit(1);
});
```

## Step 2: Replace Console Statements

Replace `console.log`, `console.error`, etc. with the structured logger:

### Before:
```typescript
console.log("User logged in:", userId);
console.error("Database connection failed:", error);
```

### After:
```typescript
import { logger } from "./_core/logger";

logger.info("User logged in", { userId });
logger.error("Database connection failed", error);
```

## Step 3: Use Validation Schemas

Replace manual validation with the new validation utilities:

### Before:
```typescript
if (!email || !email.includes("@")) {
  throw new Error("Invalid email");
}
```

### After:
```typescript
import { emailSchema } from "./_core/validation";

const result = emailSchema.safeParse(email);
if (!result.success) {
  throw new AppError(400, "Invalid email format");
}
```

## Step 4: Wrap Async Route Handlers

For any custom Express routes (not tRPC), wrap async handlers:

### Before:
```typescript
app.get("/api/custom", async (req, res) => {
  const data = await fetchData();
  res.json(data);
});
```

### After:
```typescript
import { asyncHandler } from "./_core/errorHandler";

app.get("/api/custom", asyncHandler(async (req, res) => {
  const data = await fetchData();
  res.json(data);
}));
```

## Step 5: Add Health Check Endpoint

Add a health check for monitoring:

```typescript
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});
```

## Configuration Options

### Rate Limiting

Adjust rate limits based on your needs:

```typescript
// Strict rate limit for auth endpoints
app.use("/api/auth", createRateLimiter({ 
  windowMs: 300000,     // 5 minutes
  maxRequests: 5        // 5 attempts per 5 minutes
}));

// Lenient rate limit for public API
app.use("/api/public", createRateLimiter({ 
  windowMs: 60000,      // 1 minute
  maxRequests: 200      // 200 requests per minute
}));
```

### Security Headers

Customize CSP based on your external resources:

```typescript
// In security.ts, modify the CSP header:
res.setHeader(
  "Content-Security-Policy",
  "default-src 'self'; " +
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
  "style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' data: https:; " +
  "font-src 'self' data:; " +
  "connect-src 'self' https://yourdomain.com;"
);
```

### Logger Context

Set request context for better log correlation:

```typescript
app.use((req, res, next) => {
  const requestId = nanoid();
  const requestLogger = logger.child("REQUEST");
  requestLogger.setContext({
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  
  req.logger = requestLogger; // Attach to request
  next();
});
```

## Testing the Integration

### 1. Test Rate Limiting

```bash
# Should return 429 after exceeding limit
for i in {1..120}; do
  curl http://localhost:3000/api/trpc/auth.me
done
```

### 2. Test Security Headers

```bash
curl -I http://localhost:3000/
# Check for X-Frame-Options, X-Content-Type-Options, etc.
```

### 3. Test Error Handling

```bash
# 404 error
curl http://localhost:3000/nonexistent

# Should return formatted error response
```

### 4. Check Logs

Start the server and check for structured log output:
- Development: Pretty-printed JSON
- Production: Single-line JSON (easy for log aggregators)

## Rollback Plan

If you encounter issues, you can disable features one at a time:

```typescript
// Comment out specific middleware
// app.use(securityHeaders);
// app.use(sanitizeInput);
// app.use(createRateLimiter({ ... }));
```

## Production Deployment

### Environment Variables

Ensure these are set in Railway:

```env
NODE_ENV=production
JWT_SECRET=<your-32-char-secret>
DATABASE_URL=<your-mysql-url>
OAUTH_SERVER_URL=<your-oauth-url>
VITE_APP_ID=<your-app-id>
PORT=3000
```

### Monitoring

1. **Check Railway Logs** for structured log output
2. **Set up Alerts** for error-level logs
3. **Monitor Rate Limit** headers in responses
4. **Test Health Check** endpoint from monitoring service

## Support

If you encounter issues:

1. Check the `AUDIT_REPORT.md` for detailed explanations
2. Review error logs (now structured and easy to read)
3. Ensure all environment variables are set correctly
4. Test locally with `NODE_ENV=production pnpm start`

## Next Steps

1. ✅ Integrate security middleware (this guide)
2. [ ] Write unit tests for new utilities
3. [ ] Set up error monitoring (Sentry, etc.)
4. [ ] Add Redis for distributed rate limiting (if scaling)
5. [ ] Fine-tune CSP based on actual usage
6. [ ] Implement admin action audit logging

---

**Last Updated**: November 21, 2025
