import { z } from "zod";
import { WorkerCategory } from "@/types/worker";

export const workerProfileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.enum(["Cleaner", "Landscaper", "Electrician", "Plumber", "Mechanic", "Tiler", "Mason", "Other"] as const),
  yearsOfExperience: z.number().min(0, "Years of experience must be positive"),
  hourlyRate: z.number().min(0, "Hourly rate must be positive"),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email("Invalid email address").optional(),
  description: z.string().optional(),
  offersWarranty: z.boolean(),
  warrantyDetails: z.string().optional(),
});

export type WorkerProfileFormValues = z.infer<typeof workerProfileFormSchema>;
