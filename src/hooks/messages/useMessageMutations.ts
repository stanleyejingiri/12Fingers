import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "@/services/messageService";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/message";

interface UseMessageMutationsProps {
  userId: string;
  workerId: string;
  workerUserId: string;
}

export function useMessageMutations({
  userId,
  workerId,
  workerUserId,
}: UseMessageMutationsProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (content: string) => {
      return messageService.sendMessage({
        content: content.trim(),
        sender_id: userId,
        receiver_id: workerUserId,
        worker_id: workerId,
        read: false,
      });
    },
    onMutate: async (newContent) => {
      await queryClient.cancelQueries({ queryKey: ["messages", workerId] });
      const previousMessages = queryClient.getQueryData<Message[]>(["messages", workerId]) || [];

      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        content: newContent,
        sender_id: userId,
        receiver_id: workerUserId,
        worker_id: workerId,
        created_at: new Date().toISOString(),
        read: false,
      };

      queryClient.setQueryData<Message[]>(
        ["messages", workerId],
        [...previousMessages, optimisticMessage]
      );

      return { previousMessages };
    },
    onError: (err, newContent, context) => {
      queryClient.setQueryData(["messages", workerId], context?.previousMessages);
      toast({
        variant: "destructive",
        title: "Error sending message",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", workerId] });
    },
  });
}