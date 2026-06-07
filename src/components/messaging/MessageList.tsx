//src/components/messaging/MessageList.tsx
/*import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read?: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string | undefined;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  return (
    <ScrollArea className="h-[400px] p-4 border rounded-md">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            content={message.content}
            createdAt={message.created_at}
            isCurrentUser={message.sender_id === currentUserId}
            isRead={message.read}
          />
        ))}
      </div>
    </ScrollArea>
  );
}*/
//src/components/messaging/MessageList.tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";

interface Message {
  id: string;
  message: string; // CHANGED: from 'content' to 'message'
  sender_id: string;
  created_at: string;
  is_read?: boolean; // CHANGED: from 'read' to 'is_read'
  receiver_id?: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string | undefined;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  console.log('🔴 MessageList - messages:', messages);
  console.log('🔴 MessageList - currentUserId:', currentUserId);
  
  if (!messages || messages.length === 0) {
    return (
      <div className="h-[400px] p-4 border rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] p-4 border rounded-md">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            content={message.message} // CHANGED: from message.content to message.message
            createdAt={message.created_at}
            isCurrentUser={message.sender_id === currentUserId}
            isRead={message.is_read} // CHANGED: from message.read to message.is_read
          />
        ))}
      </div>
    </ScrollArea>
  );
}