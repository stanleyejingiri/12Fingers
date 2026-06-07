import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { WorkerRating } from "@/types/worker";

interface CommentFormProps {
  onSubmit: (comment: string, rating: WorkerRating) => void;
  isSubmitting: boolean;
}

export const CommentForm = ({ onSubmit, isSubmitting }: CommentFormProps) => {
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState<WorkerRating>(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onSubmit(newComment, rating);
      setNewComment("");
      setRating(5);
    }
  };

  const handleRatingClick = (value: number) => {
    // Ensure the value is within the WorkerRating type constraints
    if (value >= 1 && value <= 5) {
      setRating(value as WorkerRating);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <Textarea
        placeholder="Write your comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="min-h-[100px]"
      />
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
            onClick={() => handleRatingClick(star)}
          />
        ))}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Comment"}
      </Button>
    </form>
  );
};
