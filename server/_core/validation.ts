import { z } from "zod";

/**
 * Common validation schemas for reuse across the application
 */

// Email validation with proper format checking
export const emailSchema = z
  .string()
  .email("Invalid email format")
  .min(3, "Email must be at least 3 characters")
  .max(320, "Email must not exceed 320 characters")
  .toLowerCase()
  .trim();

// Strong password validation
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must not exceed 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// UUID validation
export const uuidSchema = z
  .string()
  .uuid("Invalid UUID format");

// Phone number validation (international format)
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
  .optional();

// URL validation
export const urlSchema = z
  .string()
  .url("Invalid URL format")
  .max(2048, "URL must not exceed 2048 characters");

// Name validation (allows letters, spaces, hyphens, apostrophes)
export const nameSchema = z
  .string()
  .min(1, "Name is required")
  .max(255, "Name must not exceed 255 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
  .trim();

// Generic text field validation
export const textSchema = (minLength = 1, maxLength = 5000) =>
  z
    .string()
    .min(minLength, `Text must be at least ${minLength} characters`)
    .max(maxLength, `Text must not exceed ${maxLength} characters`)
    .trim();

// Positive number validation
export const positiveNumberSchema = z
  .number()
  .positive("Number must be positive")
  .finite("Number must be finite");

// Non-negative integer validation
export const nonNegativeIntegerSchema = z
  .number()
  .int("Must be an integer")
  .nonnegative("Must be non-negative");

// Date validation (future dates only)
export const futureDateSchema = z
  .date()
  .refine((date) => date > new Date(), {
    message: "Date must be in the future",
  });

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

/**
 * Sanitization utilities
 */

// Remove HTML tags from string (prevent XSS)
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}

// Escape HTML special characters
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  
  return str.replace(/[&<>"'/]/g, (char) => htmlEscapes[char] || char);
}

// Validate and sanitize user input
export function sanitizeUserInput(input: string, maxLength = 5000): string {
  return stripHtml(input).trim().slice(0, maxLength);
}

/**
 * Database query validation helpers
 */

// Validate ID parameter for database queries
export function validateId(id: unknown): string {
  const result = z.string().min(1).max(64).safeParse(id);
  if (!result.success) {
    throw new Error("Invalid ID format");
  }
  return result.data;
}

// Validate email for database queries
export function validateEmail(email: unknown): string {
  const result = emailSchema.safeParse(email);
  if (!result.success) {
    throw new Error("Invalid email format");
  }
  return result.data;
}

/**
 * Type guards
 */

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.length > 0;
}

export function isValidEmail(value: unknown): value is string {
  return isString(value) && emailSchema.safeParse(value).success;
}

export function isValidUrl(value: unknown): value is string {
  return isString(value) && urlSchema.safeParse(value).success;
}
