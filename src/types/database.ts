// src/types/database.ts
export type WorkerCategory = 
  | 'Cleaner' | 'Landscaper' | 'Electrician' | 'Plumber' 
  | 'Mechanic' | 'Tiler' | 'Mason' | 'Other';

export interface WorkerProfile {
  id: string;
  user_id: string;
  name: string;
  category: WorkerCategory;
  is_verified: boolean;
  years_of_experience: number;  // Match Supabase column names
  hourly_rate: number;
  contact_phone: string;
  contact_email: string;
  offers_warranty: boolean;
  warranty_details?: string;
  availability: DayAvailability[]; // Mapped from JSONB
  // Add all other fields from your schema
}



export interface Certification {
  id: string;
  worker_id: string;
  name: string;
  issued_by: string;
  issue_date: Date;
}

// Add interfaces for PortfolioItem, ServicePackage, etc.