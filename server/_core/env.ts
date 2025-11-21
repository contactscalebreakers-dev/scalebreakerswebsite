/**
 * Environment variable validation and configuration
 * Validates critical env vars at startup to fail fast
 */

function getEnvVar(key: string, required: boolean = false, defaultValue: string = ""): string {
  const value = process.env[key];
  
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  
  return value ?? defaultValue;
}

function validateEnv() {
  const errors: string[] = [];
  
  // Critical variables for production
  if (process.env.NODE_ENV === "production") {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      errors.push("JWT_SECRET must be set and at least 32 characters in production");
    }
    if (!process.env.DATABASE_URL) {
      errors.push("DATABASE_URL must be set in production");
    }
    if (!process.env.OAUTH_SERVER_URL) {
      errors.push("OAUTH_SERVER_URL must be set in production");
    }
    if (!process.env.VITE_APP_ID) {
      errors.push("VITE_APP_ID must be set in production");
    }
  }
  
  if (errors.length > 0) {
    console.error("[ENV] Configuration errors:");
    errors.forEach(error => console.error(`  - ${error}`));
    throw new Error("Environment validation failed. Check logs above.");
  }
  
  console.log("[ENV] Environment variables validated successfully");
}

// Validate on module load
validateEnv();

export const ENV = {
  appId: getEnvVar("VITE_APP_ID", false, ""),
  cookieSecret: getEnvVar("JWT_SECRET", false, ""),
  databaseUrl: getEnvVar("DATABASE_URL", false, ""),
  oAuthServerUrl: getEnvVar("OAUTH_SERVER_URL", false, ""),
  ownerId: getEnvVar("OWNER_OPEN_ID", false, ""),
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  forgeApiUrl: getEnvVar("BUILT_IN_FORGE_API_URL", false, ""),
  forgeApiKey: getEnvVar("BUILT_IN_FORGE_API_KEY", false, ""),
  port: parseInt(getEnvVar("PORT", false, "3000"), 10),
} as const;