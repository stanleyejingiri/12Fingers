import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Comment {
  id: string;
  reviewer_id: string;
  comment: string;
  rating: number;
  created_at: string;
}

interface CommentsListProps {
  comments: Comment[];
  isLoading: boolean;
  onCommentDeleted?: () => void;
}

export function CommentsList({ comments, isLoading, onCommentDeleted }: CommentsListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);

  const handleDeleteComment = async () => {
    if (!selectedCommentId) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', selectedCommentId);

      if (error) throw error;

      toast({
        title: "Review Deleted",
        description: "Your review has been successfully deleted.",
      });

      onCommentDeleted?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedCommentId(null);
    }
  };

  if (isLoading) return <div>Loading comments...</div>;
  if (!comments?.length) return <div>No comments yet.</div>;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">{'★'.repeat(comment.rating)}</span>
                <span className="text-gray-400">{'★'.repeat(5 - comment.rating)}</span>
              </div>
              <p className="mt-2">{comment.comment}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
            {user?.id === comment.reviewer_id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCommentId(comment.id);
                  setShowDeleteDialog(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep review</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteComment}>
              Yes, delete review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
