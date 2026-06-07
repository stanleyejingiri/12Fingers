//src/components/messaging/MessageItem.tsx
import { formatDistanceToNow } from "date-fns";

interface MessageItemProps {
  content: string;
  createdAt: string;
  isCurrentUser: boolean;
  isRead?: boolean;
}

export function MessageItem({ content, createdAt, isCurrentUser, isRead }: MessageItemProps) {
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          isCurrentUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary"
        }`}
      >
        <p className="text-sm">{content}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs opacity-70">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
          {isCurrentUser && (
            <span className="text-xs opacity-70">
              {isRead ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}