//src/components/WorkerComments.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ReportDialog } from "@/components/reports/ReportDialog";
import { useComments } from "@/hooks/useComments";
import { Flag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CommentFormSection } from "./comments/CommentFormSection";
import { CommentsList } from "./comments/CommentsList";
import { useAuth } from "@/hooks/useAuth";
import { WorkerRating, WorkerComment } from "@/types/worker";

interface WorkerCommentsProps {
  workerId: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function WorkerComments({ workerId, isOpen = false, onClose }: WorkerCommentsProps) {
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const { comments, isLoading, addComment, isSubmitting } = useComments(workerId);
  const { user } = useAuth();

  const handleCommentSubmit = async (comment: string, rating: WorkerRating) => {
    if (!user) return;
	console.log('🔍 USER OBJECT:', user);
	console.log('🔍 USER ID:', user?.id);
    await addComment({ comment, rating, userId: user.id });
  };

  const mappedComments = comments?.map(comment => ({
    ...comment,
    reviewer_id: comment.userId,
    userName: comment.userName || 'Anonymous'
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comments & Reviews</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {user && (
            <CommentFormSection
              onSubmit={handleCommentSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          <CommentsList
            comments={mappedComments}
            isLoading={isLoading}
          />
        </div>

        <ReportDialog
          isOpen={showReportDialog}
          onClose={() => {
            setShowReportDialog(false);
            setSelectedReviewId(null);
          }}
          reviewId={selectedReviewId || undefined}
        />
      </DialogContent>
    </Dialog>
  );
}