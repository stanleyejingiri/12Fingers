// src/types/worker.ts
export type WorkerRating = 1 | 2 | 3 | 4 | 5;

export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';

export interface SubscriptionFeature {
  name: string;
  included: boolean;
  description?: string;
}

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: SubscriptionFeature[];
}

// 🔴 Changed from hardcoded union to string (values come from DB)
export type WorkerCategory = string;

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  completedDate: string;
}

export interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  issueDate: string;
  expiryDate?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  country?: string;
}

export type ServiceTier = 'basic' | 'premium' | 'enterprise';

export interface ServicePackage {
  id: string;
  worker_id: string;
  tier: ServiceTier;
  name: string;
  description: string;
  price: number;
  features: string[];
  depositRequired: number;
}

export interface WorkerComment {
  id: string;
  workerId: string;
  userId: string;
  userName: string;
  rating: WorkerRating;
  comment: string;
  created_at: string;
}

export interface WorkerProfile {
  id: string;
  user_id: string;
  userId: string;
  name: string;
  category: WorkerCategory;   // now string
  is_verified: boolean;
  isVerified: boolean;
  is_Premium?: boolean;
  isPremium?: boolean;
  subscription_tier?: SubscriptionTier;
  subscription_expires_at?: string;
  featured_until?: string;
  years_of_experience: number;
  contact_phone: string;
  contact_email: string;
  availability: TimeSlot[];
  profileImageUrl: string;
  offers_warranty: boolean;
  warranty_details?: string;
  average_rating: number;
  total_ratings: number;
  hourly_rate: number;
  description: string;
  portfolio?: PortfolioItem[];
  certifications?: Certification[];
  location?: Location;
  created_at: string;
  servicePackages: ServicePackage[];
}

export type SortOption = "rating" | "price" | "distance";
