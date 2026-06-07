//src/types/bookings.ts
/*export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
export interface BookingFormData {
  date: Date;
  startTime: string;
  endTime: string;
  serviceDetails?: string;          // Added for custom requests
  packageId?: string;               // Added for package bookings
  isCustomOffer?: boolean;          // Added to distinguish offer types
  specialRequests?: string;         // Alternative name if preferred
}
export interface Booking {
  id: string;
  worker_id: string;
  client_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  total_amount: number;
  created_at: string;
  service_details?: string;         // Match backend if applicable
  package_id?: string;              // Match backend if applicable
  is_custom_offer?: boolean;        // Match backend if applicable
}*/
// src/types/bookings.ts
export type BookingStatus = 
  | 'pending' 
  | 'offer_pending'
  | 'offer_accepted'
  | 'payment_pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed' 
  | 'rejected' 
  | 'cancelled';

export interface BookingFormData {
  date: Date;
  startTime: string;
  endTime: string;
  serviceDetails?: string;
  packageId?: string;
  isCustomOffer?: boolean;
  specialRequests?: string;
  // Add estimated hours and total amount for custom offers
  estimatedHours?: number;
  totalAmount?: number;
}

export interface Booking {
  id: string;
  worker_id: string;
  client_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  total_amount: number;
  created_at: string;
  service_details?: string;
  package_id?: string;
  is_custom_offer?: boolean;
  payment_method?: string;
  estimated_hours?: number;
  accepted_at?: string;
  started_at?: string;
  completed_at?: string;
  confirmed_at?: string;
  client_confirmed_at?: string;
  payment_released_at?: string;
}

// Optional: Add types for different booking flows
export interface PackageBooking extends Booking {
  package_id: string;
  is_custom_offer: false;
}

export interface CustomBooking extends Booking {
  service_details: string;
  is_custom_offer: true;
}


// Optional: Add types for different booking flows
export interface PackageBooking extends Booking {
  package_id: string;
  is_custom_offer: false;
}

export interface CustomBooking extends Booking {
  service_details: string;
  is_custom_offer: true;
}







/*
export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

export interface BookingFormData {
  date: Date;
  startTime: string;
  endTime: string;
}

export interface Booking {
  id: string;
  worker_id: string;
  client_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  total_amount: number;
  created_at: string;
}
*/