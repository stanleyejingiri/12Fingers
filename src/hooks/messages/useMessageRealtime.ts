import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { messageService } from "@/services/messageService";
import { Message } from "@/types/message";

interface UseMessageRealtimeProps {
  userId: string;
  workerId: string;
  workerUserId: string;
  workerName: string;
}

export function useMessageRealtime({
  userId,
  workerId,
  workerUserId,
  workerName,
}: UseMessageRealtimeProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel("messages_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `worker_id=eq.${workerId}`,
        },
        async (payload) => {
          const newMessage = payload.new as Message;
          if (
            newMessage.sender_id === userId ||
            newMessage.sender_id === workerUserId
          ) {
            // Update cache with new message
            queryClient.setQueryData<Message[]>(
              ["messages", workerId],
              (old = []) => [...old, newMessage]
            );
            
            if (newMessage.receiver_id === userId) {
              await messageService.markMessagesAsRead([newMessage.id]);

              if (newMessage.sender_id === workerUserId) {
                toast({
                  title: "New message",
                  description: `${workerName}: ${newMessage.content}`,
                });
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, workerId, workerUserId, workerName, queryClient, toast]);
}
