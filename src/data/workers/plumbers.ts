import { WorkerProfile } from "@/types/worker";

export const plumbers: WorkerProfile[] = [
  {
    id: "1",
    userId: "user1",
    name: "John Doe",
    category: "Plumber",
    isVerified: true,
    isPremium: true,
    featuredUntil: "2024-12-31",
    yearsOfExperience: 5,
    contactPhone: "+1234567890",
    contactEmail: "john@example.com",
    availability: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "Thursday", startTime: "09:00", endTime: "17:00" },
      { day: "Friday", startTime: "09:00", endTime: "15:00" }
    ],
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      address: "New York, NY"
    },
    profileImageUrl: "/placeholder.svg",
    offersWarranty: true,
    warrantyDetails: "1 year warranty on all work",
    averageRating: 4.5,
    totalRatings: 28,
    hourlyRate: 45,
    description: "Professional plumber with extensive experience",
    servicePackages: [
      {
        id: "sp1",
        worker_id: "1",
        tier: "basic",
        name: "Basic Service",
        description: "Essential plumbing services",
        price: 99,
        features: [
          "Basic inspection",
          "Minor repairs",
          "Up to 2 hours of work"
        ],
        depositRequired: 20
      },
      {
        id: "sp2",
        worker_id: "1",
        tier: "premium",
        name: "Premium Service",
        description: "Comprehensive plumbing solutions",
        price: 199,
        features: [
          "Full system inspection",
          "Major repairs",
          "Up to 4 hours of work",
          "Priority scheduling",
          "90-day service guarantee"
        ],
        depositRequired: 40
      },
      {
        id: "sp3",
        worker_id: "1",
        tier: "premium",
        name: "Emergency Service",
        description: "24/7 emergency plumbing support",
        price: 299,
        features: [
          "Immediate response",
          "Any time service",
          "Emergency repairs",
          "Temporary solutions if needed",
          "Follow-up inspection"
        ],
        depositRequired: 50
      }
    ],
    created_at: new Date().toISOString()
  }
];