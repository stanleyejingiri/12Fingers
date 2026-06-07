import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkerComment, WorkerRating } from "@/types/worker";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useWorkerComments = (workerId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ["worker-comments", workerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("worker_id", workerId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map(review => ({
        id: review.id,
        workerId: review.worker_id,
        userId: review.reviewer_id,
        userName: `User ${review.reviewer_id.slice(0, 6)}`,
        comment: review.comment,
        rating: review.rating,
        created_at: review.created_at
      }));
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (data: { comment: string; rating: WorkerRating; userId: string }) => {
      const { data: newReview, error } = await supabase
        .from("reviews")
        .insert({
          worker_id: workerId,
          reviewer_id: data.userId,
          comment: data.comment,
          rating: data.rating
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: newReview.id,
        workerId: newReview.worker_id,
        userId: newReview.reviewer_id,
        userName: `User ${newReview.reviewer_id.slice(0, 6)}`,
        comment: newReview.comment,
        rating: newReview.rating,
        created_at: newReview.created_at
      };
    },
    onSuccess: (newComment) => {
      queryClient.setQueryData(
        ["worker-comments", workerId],
        (old: WorkerComment[] = []) => [newComment, ...old]
      );
      toast({
        title: "Success!",
        description: "Your comment has been posted.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return {
    comments,
    isLoading,
    addComment: addCommentMutation.mutate,
    isSubmitting: addCommentMutation.isPending
  };
};