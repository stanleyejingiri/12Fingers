import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { CommentForm } from "./CommentForm";
import { WorkerRating } from "@/types/worker";

interface CommentFormSectionProps {
  onSubmit: (comment: string, rating: WorkerRating) => void;
  isSubmitting: boolean;
}

export const CommentFormSection = ({ onSubmit, isSubmitting }: CommentFormSectionProps) => {
  const [showCommentForm, setShowCommentForm] = useState(false);

  if (!showCommentForm) {
    return (
      <Button
        onClick={() => setShowCommentForm(true)}
        className="w-full mb-4"
        variant="outline"
      >
        <MessageSquarePlus className="mr-2" />
        Add Comment
      </Button>
    );
  }

  return (
    <div className="space-y-4 mb-4">
      <CommentForm
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
      <Button 
        variant="outline" 
        onClick={() => setShowCommentForm(false)}
      >
        Cancel
      </Button>
    </div>
  );
};