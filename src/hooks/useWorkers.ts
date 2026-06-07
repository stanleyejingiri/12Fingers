/*import { useQuery } from "@tanstack/react-query";
import { mockWorkers } from "@/data/workers";

const API_BASE = 'http://localhost:3001/api';

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

        const workers = await response.json();
        
        console.log("✅ [useWorkers] BACKEND API SUCCESS!");
        console.log(`👥 [useWorkers] Loaded ${workers.length} REAL workers from database`);
        
        // TRANSFORM DATA to match frontend component expectations
        const transformedWorkers = workers.map((worker: any) => ({
          // Map backend fields to frontend expected fields
          id: worker.id,
          name: worker.name,
          category: worker.category,
          description: worker.description,
          
          // Ratings - transform to expected field names
          rating: parseFloat(worker.average_rating) || 0, // Frontend expects 'rating'
          totalRatings: parseInt(worker.total_ratings) || 0, // Frontend expects 'totalRatings'
          
          // Pricing
          hourlyRate: parseFloat(worker.hourly_rate) || 0, // Frontend expects 'hourlyRate'
          
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
          
          // Keep original fields as fallback
          ...worker
        }));
        
        console.log("📝 [useWorkers] Transformed worker names:", transformedWorkers.map((w: any) => w.name));
        console.log("⭐ [useWorkers] Worker ratings:", transformedWorkers.map((w: any) => w.rating));
        
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
*/

/*
import { useQuery } from "@tanstack/react-query";
import { query } from "@/lib/database";
import { mockWorkers } from "@/data/workers";

export const useWorkers = () => {
  return useQuery({
    queryKey: ["workers"],
    queryFn: async () => {
      try {
        console.log("🔄 [useWorkers] Fetching workers via direct PostgreSQL...");
        
        const result = await query(`
          SELECT 
            wp.*,
            COALESCE(
              json_agg(DISTINCT sp.*) FILTER (WHERE sp.id IS NOT NULL),
              '[]'
            ) as service_packages,
            COALESCE(
              json_agg(DISTINCT c.*) FILTER (WHERE c.id IS NOT NULL),
              '[]'
            ) as certifications,
            COALESCE(
              json_agg(DISTINCT pi.*) FILTER (WHERE pi.id IS NOT NULL),
              '[]'
            ) as portfolio_items
          FROM worker_profiles wp
          LEFT JOIN service_packages sp ON sp.worker_id = wp.id
          LEFT JOIN certifications c ON c.worker_id = wp.id
          LEFT JOIN portfolio_items pi ON pi.worker_id = wp.id
          GROUP BY wp.id
          ORDER BY wp.created_at DESC
        `);

        console.log("✅ [useWorkers] Direct query successful!");
        console.log("👥 [useWorkers] Worker count:", result.rows.length);
        
        if (result.rows.length > 0) {
          console.log("📝 [useWorkers] Worker names:", result.rows.map((w: any) => w.name));
          return result.rows;
        } else {
          console.log("⚠️ [useWorkers] No workers in database, using mock data");
          return mockWorkers;
        }

      } catch (error) {
        console.error('❌ [useWorkers] Database error:', error);
        console.log("🔄 [useWorkers] Using mock data as fallback");
        return mockWorkers;
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1
  });
};
*/

//src/hooks/useWorkers.ts
/*import { useQuery } from "@tanstack/react-query";
import { mockWorkers } from "@/data/workers";

const API_BASE = 'http://localhost:3001/api';

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

        const workers = await response.json();
        
        console.log("✅ [useWorkers] BACKEND API SUCCESS!");
        console.log(`👥 [useWorkers] Loaded ${workers.length} REAL workers from database`);
        
        // TRANSFORM DATA to match frontend component expectations
        const transformedWorkers = workers.map((worker: any) => ({
          // Map backend fields to frontend expected fields
          id: worker.id,
          name: worker.name,
          category: worker.category,
          description: worker.description,
          
          // Ratings - transform to expected field names
          rating: parseFloat(worker.average_rating) || 0, // Frontend expects 'rating'
          totalRatings: parseInt(worker.total_ratings) || 0, // Frontend expects 'totalRatings'
          
          // Pricing
          hourlyRate: parseFloat(worker.hourly_rate) || 0, // Frontend expects 'hourlyRate'
          
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
          
          // SERVICE PACKAGES - ADD THIS LINE (keep the packages from backend)
          servicePackages: worker.servicePackages || [],
          
          // Keep original fields as fallback
          ...worker
        }));
        
        console.log("📝 [useWorkers] Transformed worker names:", transformedWorkers.map((w: any) => w.name));
        console.log("⭐ [useWorkers] Worker ratings:", transformedWorkers.map((w: any) => w.rating));
        console.log("📦 [useWorkers] Service packages:", transformedWorkers.map((w: any) => ({
          name: w.name,
          packageCount: w.servicePackages?.length || 0
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
*/

//src/hooks/useWorkers.ts - UPDATED
import { useQuery } from "@tanstack/react-query";
import { mockWorkers } from "@/data/workers";

const API_BASE = 'http://localhost:3001/api';

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