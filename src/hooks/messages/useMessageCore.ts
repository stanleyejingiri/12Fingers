import { useQuery } from "@tanstack/react-query";
import { messageService } from "@/services/messageService";

interface UseMessageCoreProps {
  userId: string | undefined;
  workerId: string;
}

export function useMessageCore({ userId, workerId }: UseMessageCoreProps) {
  return useQuery({
    queryKey: ["messages", workerId, userId],
    queryFn: () => messageService.fetchMessages(userId, workerId),
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    enabled: !!workerId // Only run query if workerId is provided
  });
}
