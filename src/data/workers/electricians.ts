import { WorkerProfile } from "@/types/worker";

export const electricians: WorkerProfile[] = [
  {
    id: "2",
    userId: "user2",
    name: "Jane Smith",
    category: "Electrician",
    isVerified: true,
    isPremium: false,
    yearsOfExperience: 8,
    contactPhone: "+1234567891",
    contactEmail: "jane@example.com",
    availability: [
      { day: "Tuesday", startTime: "08:00", endTime: "16:00" }
    ],
    location: {
      latitude: 40.7614,
      longitude: -73.9776,
      address: "Manhattan, NY"
    },
    profileImageUrl: "/placeholder.svg",
    offersWarranty: true,
    warrantyDetails: "2 years warranty on installations",
    averageRating: 4.8,
    totalRatings: 35,
    hourlyRate: 55,
    description: "Licensed electrician specializing in residential work",
    servicePackages: [
      {
        id: "sp4",
        worker_id: "2",
        tier: "basic",
        name: "Basic Electrical",
        description: "Essential electrical services",
        price: 129,
        features: [
          "Safety inspection",
          "Minor repairs",
          "Up to 2 hours of work"
        ],
        depositRequired: 20
      },
      {
        id: "sp5",
        worker_id: "2",
        tier: "premium",
        name: "Full Home Inspection",
        description: "Comprehensive electrical system check",
        price: 249,
        features: [
          "Complete system inspection",
          "Circuit testing",
          "Safety upgrades",
          "Written report",
          "Recommendations"
        ],
        depositRequired: 40
      }
    ],
    created_at: new Date().toISOString()
  }
];
