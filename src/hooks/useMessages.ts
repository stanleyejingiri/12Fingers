//src/hooks/useMessages.ts
/*import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Message } from "@/types/message";

interface UseMessagesProps {
  userId: string;
  workerId: string;
  workerUserId: string;
  workerName: string;
}

export const useMessages = ({
  userId,
  workerId,
  workerUserId,
  workerName,
}: UseMessagesProps) => {
  const queryClient = useQueryClient();

  // Fetch messages
  const {
    data: messages = [],
    isLoading,
    refetch: refreshMessages,
  } = useQuery({
    queryKey: ["messages", userId, workerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${userId},receiver_id.eq.${workerUserId}),and(sender_id.eq.${workerUserId},receiver_id.eq.${userId})`
        )
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: !!userId && !!workerId,
  });

  // Send message mutation
  const { mutateAsync: sendMessage } = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            sender_id: userId,
            receiver_id: workerUserId,
            content,
            worker_id: workerId,
          },
        ])
        .select();

      if (error) throw error;
      return data[0] as Message;
    },
    onSuccess: () => {
      // Invalidate messages query to trigger refetch
      queryClient.invalidateQueries({
        queryKey: ["messages", userId, workerId],
      });
    },
  });

  return {
    messages,
    isLoading,
    sendMessage,
    refreshMessages, // Expose the refetch function
  };
};
*/

/*
import { useMessageCore } from "./messages/useMessageCore";
import { useMessageRealtime } from "./messages/useMessageRealtime";
import { useMessageMutations } from "./messages/useMessageMutations";

interface UseMessagesProps {
  userId: string | undefined;
  workerId: string;
  workerUserId: string;
  workerName: string;
}

export function useMessages({
  userId,
  workerId,
  workerUserId,
  workerName,
}: UseMessagesProps) {
  const { data: messages = [], isLoading } = useMessageCore({ userId, workerId });
  
  useMessageRealtime({ userId, workerId, workerUserId, workerName });
  
  const { mutate: sendMessage } = useMessageMutations({
    userId,
    workerId,
    workerUserId,
  });

  return {
    messages,
    isLoading,
    sendMessage: (content: string) => sendMessage(content),
  };
}
*/

// src/hooks/useMessages.ts - UPDATED FOR YOUR BACKEND
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types/message";
import { messageService } from "@/services/messageService";

interface UseMessagesProps {
  userId: string;
  workerId: string;
  workerUserId: string;
  workerName: string;
}

export const useMessages = ({
  userId,
  workerId,
  workerUserId,
  workerName,
}: UseMessagesProps) => {
  const queryClient = useQueryClient();

  // Fetch messages
  const {
    data: messages = [],
    isLoading,
    refetch: refreshMessages,
  } = useQuery({
    queryKey: ["messages", userId, workerUserId],
    queryFn: async () => {
      return await messageService.fetchMessages(userId, workerUserId);
    },
    enabled: !!userId && !!workerUserId,
  });

  // Send message mutation
  /*const { mutateAsync: sendMessage } = useMutation({
    mutationFn: async (content: string) => {
      return await messageService.sendMessage({
        sender_id: userId,
        receiver_id: workerUserId,
        content,
        worker_id: workerId
      });
    },
    onSuccess: () => {
      // Invalidate messages query to trigger refetch
      queryClient.invalidateQueries({
        queryKey: ["messages", userId, workerUserId],
      });
    },
  });*/
// In useMessages.ts - update the sendMessage mutation
const { mutateAsync: sendMessage } = useMutation({
  mutationFn: async (content: string) => {
    console.log('🔴 useMessages - sending message:', content);
    console.log('🔴 useMessages - userId:', userId);
    console.log('🔴 useMessages - workerUserId:', workerUserId);
    
    const result = await messageService.sendMessage({
      sender_id: userId,
      receiver_id: workerUserId,
      content,
      worker_id: workerId
    });
    
    console.log('✅ useMessages - message sent successfully:', result);
    return result;
  },
  onSuccess: () => {
    console.log('🟢 useMessages - invalidating queries');
    queryClient.invalidateQueries({
      queryKey: ["messages", userId, workerUserId],
    });
  },
  onError: (error) => {
    console.error('❌ useMessages - mutation error:', error);
  }
});

  return {
    messages,
    isLoading,
    sendMessage,
    refreshMessages,
  };
};
