//src/hooks/useConversations.ts
import { useQuery } from '@tanstack/react-query';

export const useConversations = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['conversations', userId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3001/api/messages/conversations/${userId}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      return data.conversations;
    },
    enabled: !!userId,
  });
	console.log('🔍 useConversations called with userId:', userId);
	console.log('🔍 useConversations hook running, userId:', userId);
	console.log('🔍 Fetching URL:', `http://localhost:3001/api/messages/conversations/${userId}`);
};
