import { WorkerProfile } from "@/types/worker";

export const landscapers: WorkerProfile[] = [
  {
    id: "5",
    userId: "user5",
    name: "David Chen",
    category: "Landscaper",
    isVerified: true,
    isPremium: true,
    featuredUntil: "2024-12-31",
    yearsOfExperience: 7,
    contactPhone: "+1234567894",
    contactEmail: "david@example.com",
    availability: [
      { day: "Monday", startTime: "08:00", endTime: "18:00" },
      { day: "Tuesday", startTime: "08:00", endTime: "18:00" },
      { day: "Wednesday", startTime: "08:00", endTime: "18:00" }
    ],
    location: {
      latitude: 40.7420,
      longitude: -73.9890,
      address: "Gramercy, NY"
    },
    profileImageUrl: "/placeholder.svg",
    offersWarranty: true,
    warrantyDetails: "30-day plant health guarantee",
    averageRating: 4.8,
    totalRatings: 23,
    hourlyRate: 50,
    description: "Expert landscaper specializing in garden design and maintenance",
    servicePackages: [
      {
        id: "sp10",
        worker_id: "5",
        tier: "basic",
        name: "Basic Garden Service",
        description: "Essential garden maintenance",
        price: 120,
        features: [
          "Lawn mowing",
          "Edge trimming",
          "Debris removal"
        ],
        depositRequired: 20
      },
      {
        id: "sp11",
        worker_id: "5",
        tier: "premium",
        name: "Garden Design Package",
        description: "Custom garden design and implementation",
        price: 450,
        features: [
          "Custom design plan",
          "Plant selection",
          "Installation",
          "Initial maintenance",
          "Care instructions"
        ],
        depositRequired: 100
      },
      {
        id: "sp12",
        worker_id: "5",
        tier: "premium",
        name: "Seasonal Cleanup",
        description: "Comprehensive seasonal maintenance",
        price: 299,
        features: [
          "Leaf removal",
          "Plant pruning",
          "Mulch application",
          "Fertilization",
          "Seasonal plantings"
        ],
        depositRequired: 50
      }
    ],
    created_at: new Date().toISOString()
  }
];