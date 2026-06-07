// src/hooks/useServicePackages.ts
import { useQuery } from "@tanstack/react-query";

export interface ServicePackage {
  id: string;
  worker_id: string;
  name: string;
  description: string;
  price: number;
  features: string;
  accepts_custom_offers: boolean;
}

export const useServicePackages = (workerId: string | undefined) => {
  return useQuery({
    queryKey: ["servicePackages", workerId],
    queryFn: async () => {
      if (!workerId) return [];
      const response = await fetch(`https://one2fingers-backend.onrender.com/api/packages/worker/${workerId}`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error);
      return data.packages as ServicePackage[];
    },
    enabled: !!workerId,
  });
};
