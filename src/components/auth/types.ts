// src/components/auth/types.ts
import { z } from "zod";

// SIMPLIFIED LOGIN SCHEMA (no complex password rules)
export const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
});

// REGISTRATION SCHEMA (with strong password rules for new users)
export const registerSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address. Example: user@example.com"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password cannot exceed 50 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  userType: z.enum(["user", "worker"], {
    required_error: "Please select your account type",
  }),
  name: z.string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .optional(),
  category: z.string().optional(),   // 🔴 FIXED – now accepts any string
  country: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;



// src/components/auth/types.ts
/*
import { z } from "zod";

// SIMPLIFIED LOGIN SCHEMA (no complex password rules)
export const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required")
});

// REGISTRATION SCHEMA (with strong password rules for new users)
export const registerSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address. Example: user@example.com"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password cannot exceed 50 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  userType: z.enum(["user", "worker"], {
    required_error: "Please select your account type",
  }),
  name: z.string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .optional(),
  category: z.enum(["Cleaner", "Landscaper", "Electrician", "Plumber", "Mechanic", "Tiler", "Mason", "Other"] as const)
    .optional(),
  country: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
*/

/*
import { z } from "zod";

export const registerSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address. Example: user@example.com"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(50, "Password cannot exceed 50 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  userType: z.enum(["user", "worker"], {
    required_error: "Please select your account type",
  }),
  name: z.string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .optional(),
  category: z.enum(["Cleaner", "Landscaper", "Electrician", "Plumber", "Mechanic", "Tiler", "Mason", "Other"] as const)
    .optional(),
  country: z.string().optional(),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
*/