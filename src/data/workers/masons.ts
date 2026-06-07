import { WorkerProfile } from "@/types/worker";

export const masons: WorkerProfile[] = [
  {
    id: "6",
    userId: "user6",
    name: "Lisa Martinez",
    category: "Mason",
    isVerified: true,
    isPremium: false,
    yearsOfExperience: 12,
    contactPhone: "+1234567895",
    contactEmail: "lisa@example.com",
    availability: [
      { day: "Monday", startTime: "07:00", endTime: "15:00" },
      { day: "Tuesday", startTime: "07:00", endTime: "15:00" },
      { day: "Wednesday", startTime: "07:00", endTime: "15:00" },
      { day: "Thursday", startTime: "07:00", endTime: "15:00" }
    ],
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: "Midtown, NY"
    },
    profileImageUrl: "/placeholder.svg",
    offersWarranty: true,
    warrantyDetails: "5-year warranty on all masonry work",
    averageRating: 4.9,
    totalRatings: 31,
    hourlyRate: 75,
    description: "Expert mason with experience in both traditional and modern techniques",
    servicePackages: [
      {
        id: "sp13",
        worker_id: "6",
        tier: "basic",
        name: "Basic Masonry Repair",
        description: "Essential masonry maintenance",
        price: 200,
        features: [
          "Crack repair",
          "Mortar joint repair",
          "Small patch work"
        ],
        depositRequired: 40
      },
      {
        id: "sp14",
        worker_id: "6",
        tier: "premium",
        name: "Custom Stone Installation",
        description: "Custom stonework and installation",
        price: 1500,
        features: [
          "Custom design",
          "Material selection",
          "Professional installation",
          "Sealing",
          "Detailed finishing"
        ],
        depositRequired: 300
      },
      {
        id: "sp15",
        worker_id: "6",
        tier: "premium",
        name: "Restoration Service",
        description: "Historic masonry restoration",
        price: 2500,
        features: [
          "Historical assessment",
          "Material matching",
          "Careful restoration",
          "Documentation",
          "Preservation techniques"
        ],
        depositRequired: 500
      }
    ],
    created_at: new Date().toISOString()
  }
];
