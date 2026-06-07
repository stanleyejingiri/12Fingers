// src/hooks/useWorkerProfile.ts
/*
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { WorkerProfile } from "@/types/worker";

const API_BASE = 'http://localhost:3001/api';

export const useWorkerProfile = (workerId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch all workers first to find the matching profile
  const { data: allWorkers, isLoading: isLoadingAllWorkers } = useQuery({
    queryKey: ["allWorkers"],
    queryFn: async () => {
      try {
        console.log("🔍 Fetching all workers...");
        const response = await fetch(`${API_BASE}/workers`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch workers: ${response.status}`);
        }

        const result = await response.json();
        const workers = result.workers || result.data?.workers || [];
        
        // 🔴 Map worker_profiles.user_id to worker.userId
        const mappedWorkers = workers.map((w: any) => ({
          ...w,
          userId: w.user_id,        // ← add this mapping
        }));
        
        console.log(`✅ Loaded ${mappedWorkers.length} workers`);
        return mappedWorkers;
      } catch (error) {
        console.error("❌ Error fetching workers:", error);
        throw error;
      }
    },
    enabled: !!user?.id,
  });

  // Find the worker ID for the current user
  const findWorkerId = () => {
    if (workerId) return workerId;
    
    if (!user?.id || !allWorkers) return undefined;
    
    console.log("🔍 Finding worker profile for user ID:", user.id);
    
    const workerProfile = allWorkers.find((w: any) => 
      w.user_id === user.id ||  // Match by user_id
      w.id === user.id          // Match by worker profile ID
    );
    
    if (workerProfile) {
      console.log("✅ Found matching worker profile:", {
        workerId: workerProfile.id,
        workerName: workerProfile.name,
        matchedBy: workerProfile.user_id === user.id ? 'user_id' : 'id'
      });
      return workerProfile.id;
    } else {
      console.log("❌ No worker profile found for user");
      console.log("👥 Available workers:", allWorkers.map((w: any) => ({
        id: w.id,
        name: w.name,
        user_id: w.user_id
      })));
      return undefined;
    }
  };

  const effectiveWorkerId = findWorkerId();

  // Fetch the specific worker profile
  const { data: worker, isLoading: isLoadingWorker, error } = useQuery({
    queryKey: ["worker", effectiveWorkerId],
    queryFn: async () => {
      if (!effectiveWorkerId || !allWorkers) return null;

      try {
        console.log("🔍 Fetching specific worker profile for ID:", effectiveWorkerId);
        
        const workerProfile = allWorkers.find((w: any) => w.id === effectiveWorkerId);
        
        if (!workerProfile) {
          throw new Error('Worker profile not found');
        }

        console.log("✅ Worker profile loaded:", workerProfile.name);
        return workerProfile as WorkerProfile;
      } catch (error) {
        console.error("❌ Error loading worker profile:", error);
        throw error;
      }
    },
    enabled: !!effectiveWorkerId && !!allWorkers,
  });

  const updateProfile = useMutation({
    mutationFn: async (profile: Partial<WorkerProfile>) => {
      if (!effectiveWorkerId) {
        throw new Error('No worker profile selected');
      }

      try {
        console.log("🔄 Updating worker profile:", profile);
        
        const response = await fetch(`${API_BASE}/workers/${effectiveWorkerId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update worker profile');
        }
        
        const result = await response.json();
        console.log("✅ Worker profile updated:", result);
        return result.worker;
      } catch (error) {
        console.error("❌ Error updating worker profile:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worker", effectiveWorkerId] });
      queryClient.invalidateQueries({ queryKey: ["allWorkers"] });
    },
  });

  return {
    worker,
    isLoading: isLoadingAllWorkers || isLoadingWorker,
    error,
    updateProfile,
  };
};
*/

// src/hooks/useWorkerProfile.ts
/*
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { WorkerProfile } from "@/types/worker";
import { useState } from "react";  // ← add this import

const API_BASE = 'http://localhost:3001/api';

export const useWorkerProfile = (workerId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [localWorker, setLocalWorker] = useState<WorkerProfile | null>(null);

  // Fetch all workers first to find the matching profile
  const { data: allWorkers, isLoading: isLoadingAllWorkers } = useQuery({
    queryKey: ["allWorkers"],
    queryFn: async () => {
      try {
        console.log("🔍 Fetching all workers...");
        const response = await fetch(`${API_BASE}/workers`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch workers: ${response.status}`);
        }

        const result = await response.json();
        const workers = result.workers || result.data?.workers || [];
        
        const mappedWorkers = workers.map((w: any) => ({
          ...w,
          userId: w.user_id,
        }));
        
        console.log(`✅ Loaded ${mappedWorkers.length} workers`);
        return mappedWorkers;
      } catch (error) {
        console.error("❌ Error fetching workers:", error);
        throw error;
      }
    },
    enabled: !!user?.id,
  });

  const findWorkerId = () => {
    if (workerId) return workerId;
    
    if (!user?.id || !allWorkers) return undefined;
    
    console.log("🔍 Finding worker profile for user ID:", user.id);
    
    const workerProfile = allWorkers.find((w: any) => 
      w.user_id === user.id ||
      w.id === user.id
    );
    
    if (workerProfile) {
      console.log("✅ Found matching worker profile:", {
        workerId: workerProfile.id,
        workerName: workerProfile.name,
        matchedBy: workerProfile.user_id === user.id ? 'user_id' : 'id'
      });
      return workerProfile.id;
    } else {
      console.log("❌ No worker profile found for user");
      return undefined;
    }
  };

  const effectiveWorkerId = findWorkerId();

  const { data: worker, isLoading: isLoadingWorker, error } = useQuery({
    queryKey: ["worker", effectiveWorkerId],
    queryFn: async () => {
      if (!effectiveWorkerId || !allWorkers) return null;

      try {
        console.log("🔍 Fetching specific worker profile for ID:", effectiveWorkerId);
        
        const workerProfile = allWorkers.find((w: any) => w.id === effectiveWorkerId);
        
        if (!workerProfile) {
          throw new Error('Worker profile not found');
        }

        console.log("✅ Worker profile loaded:", workerProfile.name);
        setLocalWorker(workerProfile);  // ← store in local state
        return workerProfile as WorkerProfile;
      } catch (error) {
        console.error("❌ Error loading worker profile:", error);
        throw error;
      }
    },
    enabled: !!effectiveWorkerId && !!allWorkers,
  });

  const updateProfile = useMutation({
    mutationFn: async (profile: Partial<WorkerProfile>) => {
      if (!effectiveWorkerId) {
        throw new Error('No worker profile selected');
      }

      try {
        console.log("🔄 Updating worker profile:", profile);
        
        const response = await fetch(`${API_BASE}/workers/${effectiveWorkerId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update worker profile');
        }
        
        const result = await response.json();
        console.log("✅ Worker profile updated:", result);
        
        // Update local state immediately
        setLocalWorker((prev) => ({ ...prev, ...profile } as WorkerProfile));
        
        return result.worker;
      } catch (error) {
        console.error("❌ Error updating worker profile:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worker", effectiveWorkerId] });
      queryClient.invalidateQueries({ queryKey: ["allWorkers"] });
    },
  });

  // Return the local worker if available, otherwise the query worker
  const currentWorker = localWorker || worker;

  return {
    worker: currentWorker,
    isLoading: isLoadingAllWorkers || isLoadingWorker,
    error,
    updateProfile,
  };
};
*/
// src/hooks/useWorkerProfile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { WorkerProfile } from "@/types/worker";
import { useState } from "react";  // ← add this import

const API_BASE = 'http://localhost:3001/api';

export const useWorkerProfile = (workerId?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [localWorker, setLocalWorker] = useState<WorkerProfile | null>(null);

  // Fetch all workers first to find the matching profile
  const { data: allWorkers, isLoading: isLoadingAllWorkers } = useQuery({
    queryKey: ["allWorkers"],
    queryFn: async () => {
      try {
        console.log("🔍 Fetching all workers...");
        const response = await fetch(`${API_BASE}/workers`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch workers: ${response.status}`);
        }

        const result = await response.json();
        const workers = result.workers || result.data?.workers || [];
        
        const mappedWorkers = workers.map((w: any) => ({
          ...w,
          userId: w.user_id,
        }));
        
        console.log(`✅ Loaded ${mappedWorkers.length} workers`);
        return mappedWorkers;
      } catch (error) {
        console.error("❌ Error fetching workers:", error);
        throw error;
      }
    },
    enabled: !!user?.id,
  });

  const findWorkerId = () => {
    if (workerId) return workerId;
    
    if (!user?.id || !allWorkers) return undefined;
    
    console.log("🔍 Finding worker profile for user ID:", user.id);
    
    const workerProfile = allWorkers.find((w: any) => 
      w.user_id === user.id ||
      w.id === user.id
    );
    
    if (workerProfile) {
      console.log("✅ Found matching worker profile:", {
        workerId: workerProfile.id,
        workerName: workerProfile.name,
        matchedBy: workerProfile.user_id === user.id ? 'user_id' : 'id'
      });
      return workerProfile.id;
    } else {
      console.log("❌ No worker profile found for user");
      return undefined;
    }
  };

  const effectiveWorkerId = findWorkerId();

  const { data: worker, isLoading: isLoadingWorker, error } = useQuery({
    queryKey: ["worker", effectiveWorkerId],
    queryFn: async () => {
      if (!effectiveWorkerId || !allWorkers) return null;

      try {
        console.log("🔍 Fetching specific worker profile for ID:", effectiveWorkerId);
        
        const workerProfile = allWorkers.find((w: any) => w.id === effectiveWorkerId);
        
        if (!workerProfile) {
          throw new Error('Worker profile not found');
        }

        console.log("✅ Worker profile loaded:", workerProfile.name);
        setLocalWorker(workerProfile);  // ← store in local state
        return workerProfile as WorkerProfile;
      } catch (error) {
        console.error("❌ Error loading worker profile:", error);
        throw error;
      }
    },
    enabled: !!effectiveWorkerId && !!allWorkers,
  });

  const updateProfile = useMutation({
    mutationFn: async (profile: Partial<WorkerProfile>) => {
      if (!effectiveWorkerId) {
        throw new Error('No worker profile selected');
      }

      try {
        console.log("🔄 Updating worker profile:", profile);
        
        const response = await fetch(`${API_BASE}/workers/${effectiveWorkerId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update worker profile');
        }
        
        const result = await response.json();
        console.log("✅ Worker profile updated:", result);
        
        // Update local state immediately
        setLocalWorker((prev) => ({ ...prev, ...profile } as WorkerProfile));
        
        return result.worker;
      } catch (error) {
        console.error("❌ Error updating worker profile:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["worker", effectiveWorkerId] });
      queryClient.invalidateQueries({ queryKey: ["allWorkers"] });
    },
  });

  // Return the local worker if available, otherwise the query worker
  const currentWorker = localWorker || worker;

  return {
    worker: currentWorker,
    isLoading: isLoadingAllWorkers || isLoadingWorker,
    error,
    updateProfile,
  };
};