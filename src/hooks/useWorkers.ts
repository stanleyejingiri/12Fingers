//src/hooks/useWorkers.ts - UPDATED
import { useQuery } from "@tanstack/react-query";
import { mockWorkers } from "@/data/workers";

const API_BASE = 'https://one2fingers-backend.onrender.com/api';

export const useWorkers = () => {
  return useQuery({
    queryKey: ["workers"],
    queryFn: async () => {
      try {
        console.log("🔄 [useWorkers] Fetching from backend API...");
        
        const response = await fetch(`${API_BASE}/workers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // FIX: Parse the full response
        
        console.log("✅ [useWorkers] BACKEND API RESPONSE:", data);
        
        if (!data.success) {
          throw new Error(data.error || 'API returned unsuccessful');
        }
        
        const backendWorkers = data.workers || []; // FIX: Get workers array from response
        console.log(`👥 [useWorkers] Loaded ${backendWorkers.length} workers from database`);
        
        // If no workers from backend, use mock data
        if (backendWorkers.length === 0) {
          console.log("⚠️ [useWorkers] No workers from backend, using mock data");
          return mockWorkers;
        }
        
        // TRANSFORM DATA to match frontend component expectations
        const transformedWorkers = backendWorkers.map((worker: any) => ({
          // Map backend fields to frontend expected fields
          id: worker.id,
          name: worker.name,
          category: worker.category,
          description: worker.description,
          
          // Ratings - transform to expected field names
          rating: parseFloat(worker.average_rating) || 0,
          totalRatings: parseInt(worker.total_ratings) || 0,
          
          // Pricing
          hourlyRate: parseFloat(worker.hourly_rate) || 0,
          
          // Status flags
          isVerified: Boolean(worker.is_verified),
          isPremium: Boolean(worker.is_premium),
          
          // Images
          profileImageUrl: worker.profile_image_url || '/default-avatar.png',
          
          // Contact info
          contactEmail: worker.contact_email,
          contactPhone: worker.contact_phone,
          
          // Additional fields with defaults
          yearsOfExperience: parseInt(worker.years_of_experience) || 0,
          offersWarranty: Boolean(worker.offers_warranty),
          warrantyDetails: worker.warranty_details || '',
          
          // Location data
          city: worker.city,
          state: worker.state,
          country: worker.country,
          
          // SERVICE PACKAGES
          servicePackages: worker.servicePackages || [],
          
          // Keep original fields as fallback
          ...worker
        }));
        
        console.log("📝 [useWorkers] Transformed workers:", transformedWorkers.map((w: any) => ({
          name: w.name,
          city: w.city,
          state: w.state,
          country: w.country
        })));
        
        return transformedWorkers;

      } catch (error) {
        console.error('❌ [useWorkers] Backend API error:', error);
        console.log("🔄 [useWorkers] Falling back to mock data");
        return mockWorkers;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  });
};
