import { WorkerProfile } from "@/types/worker";

export const cleaners: WorkerProfile[] = [
  {
    id: "3",
    userId: "user3",
    name: "Sarah Johnson",
    category: "Cleaner",
    isVerified: true,
    isPremium: true,
    featuredUntil: "2024-12-31",
    yearsOfExperience: 4,
    contactPhone: "+1234567892",
    contactEmail: "sarah@example.com",
    availability: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "Friday", startTime: "09:00", endTime: "17:00" }
    ],
    location: {
      latitude: 40.7829,
      longitude: -73.9654,
      address: "Upper East Side, NY"
    },
    profileImageUrl: "/placeholder.svg",
    offersWarranty: true,
    warrantyDetails: "100% satisfaction guarantee",
    averageRating: 4.9,
    totalRatings: 42,
    hourlyRate: 35,
    description: "Professional house cleaner with eco-friendly products",
    servicePackages: [
      {
        id: "sp6",
        worker_id: "3",
        tier: "basic",
        name: "Basic Clean",
        description: "Essential cleaning service",
        price: 80,
        features: [
          "Dusting",
          "Vacuuming",
          "Bathroom cleaning",
          "Kitchen cleaning"
        ],
        depositRequired: 20
      },
      {
        id: "sp7",
        worker_id: "3",
        tier: "premium",
        name: "Deep Clean",
        description: "Comprehensive cleaning service",
        price: 150,
        features: [
          "All Basic Clean features",
          "Deep carpet cleaning",
          "Window washing",
          "Appliance cleaning",
          "Cabinet organization"
        ],
        depositRequired: 30
      }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: "4",
    userId: "user4",
    name: "Michael Brown",
    category: "Cleaner",
    isVerified: true,
    isPremium: false,
    yearsOfExperience: 6,
    contactPhone: "+1234567893",
    contactEmail: "michael@example.com",
    availability: [
      { day: "Tuesday", startTime: "08:00", endTime: "16:00" },
      { day: "Thursday", startTime: "08:00", endTime: "16:00" },
      { day: "Saturday", startTime: "09:00", endTime: "14:00" }
    ],
    location: {
      latitude: 40.7505,
      longitude: -73.9934,
      address: "Chelsea, NY"
    },
    profileImageUrl: "/placeholder.svg",
    offersWarranty: true,
    warrantyDetails: "Satisfaction guaranteed or free reclean",
    averageRating: 4.7,
    totalRatings: 38,
    hourlyRate: 40,
    description: "Specialized in deep cleaning and organization",
    servicePackages: [
      {
        id: "sp8",
        worker_id: "4",
        tier: "basic",
        name: "Standard Clean",
        description: "Complete home cleaning service",
        price: 90,
        features: [
          "General cleaning",
          "Floor cleaning",
          "Bathroom sanitization",
          "Kitchen deep clean"
        ],
        depositRequired: 25
      },
      {
        id: "sp9",
        worker_id: "4",
        tier: "premium",
        name: "Premium Clean",
        description: "Thorough deep cleaning service",
        price: 160,
        features: [
          "All Standard Clean features",
          "Inside cabinet cleaning",
          "Baseboards and trim",
          "Window cleaning",
          "Appliance cleaning"
        ],
        depositRequired: 40
      },
      {
        id: "sp10",
        worker_id: "4",
        tier: "premium",
        name: "Move-In/Out Clean",
        description: "Comprehensive cleaning for moving",
        price: 200,
        features: [
          "All Premium Clean features",
          "Wall washing",
          "Light fixture cleaning",
          "Inside oven and fridge",
          "Carpet deep cleaning"
        ],
        depositRequired: 50
      }
    ],
    created_at: new Date().toISOString()
  }
];