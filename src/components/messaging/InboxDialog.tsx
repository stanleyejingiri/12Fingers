//src/components/messaging/inboxDialog.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useConversations } from '@/hooks/useConversations';
import { MessagingDialog } from './MessagingDialog';
import { formatDistanceToNow } from 'date-fns';

interface InboxDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workerId: string;
  workerUserId: string;
  workerName: string;
}

export const InboxDialog = ({ isOpen, onClose, workerId, workerUserId, workerName }: InboxDialogProps) => {
  const { data: conversations, isLoading } = useConversations(workerUserId);
  console.log('🔍 InboxDialog - conversations:', conversations);
  console.log('🔍 InboxDialog - isLoading:', isLoading);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  
  if (selectedConversation) {
    return (
      <MessagingDialog
        isOpen={true}
        onClose={() => {
          setSelectedConversation(null);
          onClose();
        }}
        workerId={workerId}
        workerUserId={selectedConversation.userId}
        workerName={selectedConversation.name}
      />
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Messages</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          {isLoading && <div className="text-center py-4">Loading...</div>}
          {!isLoading && conversations?.length === 0 && (
            <div className="text-center py-8 text-gray-500">No messages yet</div>
          )}
          {conversations?.map((conv: any) => (
            <div
              key={conv.userId}
              className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 border ${conv.unread ? 'bg-blue-50 border-blue-200' : ''}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="flex justify-between items-start">
                <p className={`font-medium ${conv.unread ? 'font-semibold' : ''}`}>{conv.name}</p>
                <span className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(conv.lastMessageTime), { addSuffix: true })}
                </span>
              </div>
              <p className={`text-sm ${conv.unread ? 'text-gray-800 font-medium' : 'text-gray-500'} truncate`}>
                {conv.lastMessage}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};