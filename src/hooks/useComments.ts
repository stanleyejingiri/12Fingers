//src/hooks/useComments.ts
/*import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkerComment, WorkerRating } from "@/types/worker";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

// Mock comments for development
const mockComments: WorkerComment[] = [
  {
    id: "1",
    workerId: "123e4567-e89b-12d3-a456-426614174000",
    userId: "user1",
    userName: "John Smith",
    rating: 5,
    comment: "Excellent service! Very professional and thorough.",
    created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: "2",
    workerId: "123e4567-e89b-12d3-a456-426614174000",
    userId: "user2",
    userName: "Sarah Johnson",
    rating: 4,
    comment: "Great work, would recommend!",
    created_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  },
  {
    id: "3",
    workerId: "123e4567-e89b-12d3-a456-426614174002",
    userId: "user3",
    userName: "Mike Wilson",
    rating: 5,
    comment: "Very knowledgeable and efficient.",
    created_at: new Date(Date.now() - 259200000).toISOString() // 3 days ago
  }
];

export const useComments = (workerId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ["worker-comments", workerId],
    queryFn: async () => {
      // For development, return mock comments filtered by workerId
      return mockComments.filter(comment => comment.workerId === workerId);
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (data: { comment: string; rating: WorkerRating; userId: string }) => {
      const newComment: WorkerComment = {
        id: `temp-${Date.now()}`,
        workerId,
        userId: data.userId,
        userName: `User ${data.userId.slice(0, 6)}`,
        comment: data.comment,
        rating: data.rating,
        created_at: new Date().toISOString()
      };
      
      // In development, we'll just return the mock comment
      return newComment;
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
};*/
//src/hooks/useComments.ts - UPDATED FOR YOUR BACKEND
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkerComment, WorkerRating } from "@/types/worker";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export const useComments = (workerId: string) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch comments from backend
  const { data: comments, isLoading } = useQuery({
    queryKey: ["worker-comments", workerId],
    queryFn: async () => {
      console.log('🔴 Fetching comments for worker:', workerId);
      try {
        const response = await api.get(`/comments/worker/${workerId}`);
        console.log('✅ Comments fetched:', response.comments?.length || 0);
        
        // Map backend response to WorkerComment type
        return (response.comments || []).map((comment: any) => ({
          id: comment.id,
          workerId: comment.worker_id,
          userId: comment.user_id,
          userName: comment.user_name || `User ${comment.user_id?.slice(0, 6) || 'Anonymous'}`,
          comment: comment.comment,
          rating: comment.rating,
          created_at: comment.created_at
        })) as WorkerComment[];
      } catch (error) {
        console.error('❌ Error fetching comments:', error);
        return [];
      }
    },
    enabled: !!workerId,
  });

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (data: { comment: string; rating: WorkerRating; userId: string }) => {
      console.log('🔴 Adding comment:', data);
      
      const response = await api.post('/comments', {
        worker_id: workerId,
        user_id: data.userId,
        comment: data.comment,
        rating: data.rating
      });
      
      console.log('✅ Comment added:', response.comment);
      return response.comment;
    },
    onSuccess: (newComment) => {
      // Update cache with new comment
      queryClient.setQueryData(
        ["worker-comments", workerId],
        (old: WorkerComment[] = []) => {
          const mappedComment: WorkerComment = {
            id: newComment.id,
            workerId: newComment.worker_id,
            userId: newComment.user_id,
            userName: newComment.user_name || `User ${newComment.user_id?.slice(0, 6) || 'Anonymous'}`,
            comment: newComment.comment,
            rating: newComment.rating,
            created_at: newComment.created_at
          };
          return [mappedComment, ...old];
        }
      );
      
      toast({
        title: "Success!",
        description: "Your comment has been posted.",
      });
    },
    onError: (error: Error) => {
      console.error('❌ Error adding comment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add comment",
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