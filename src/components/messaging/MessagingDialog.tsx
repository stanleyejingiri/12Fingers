//src/components/messaging/MessagingDialog.tsx
/*import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { MessageSquare } from "lucide-react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useMessages } from "@/hooks/useMessages";

interface MessagingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workerId: string;
  workerUserId: string;
  workerName: string;
}

export function MessagingDialog({
  isOpen,
  onClose,
  workerId,
  workerUserId,
  workerName,
}: MessagingDialogProps) {
  console.log('🔴 MessagingDialog rendering - isOpen:', isOpen);
  console.log('🔴 MessagingDialog props:', { workerId, workerUserId, workerName });

  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  
  const { messages, isLoading, sendMessage, refreshMessages } = useMessages({
    userId: user?.id || "",
    workerId,
    workerUserId,
    workerName,
  });

  const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log('🔴 Send button clicked');
  console.log('🔴 User:', user?.id);
  console.log('🔴 New message:', newMessage);
  
  if (!user || !newMessage.trim()) {
    console.log('❌ Cannot send - missing user or message');
	// In MessagingDialog.tsx - add this right before the return statement
	console.log('🔴 MessagingDialog - messages:', messages);
	console.log('🔴 MessagingDialog - messages type:', typeof messages);
	console.log('🔴 MessagingDialog - messages length:', messages?.length);
	if (messages && messages.length > 0) {
	  console.log('🔴 First message structure:', messages[0]);
	}
    return;
  }

	console.log('🟢 Attempting to send message...');
	console.log('🟢 Worker User ID:', workerUserId);
	console.log('🟢 Worker ID:', workerId);
	
	

  try {
    await sendMessage(newMessage);
    console.log('✅ Message sent successfully');
    setNewMessage("");
  } catch (error) {
    console.error('❌ Failed to send message:', error);
  }
};
  
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat with {workerName}
          </DialogTitle>
        </DialogHeader>

        <MessageList messages={messages} currentUserId={user?.id} />
        
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSubmit={handleSendMessage}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}*/

//src/components/messaging/MessagingDialog.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { MessageSquare, Users } from "lucide-react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useMessages } from "@/hooks/useMessages";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MessagingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  workerId?: string;
  workerUserId?: string;
  workerName?: string;
}

export function MessagingDialog({
  isOpen,
  onClose,
  workerId,
  workerUserId,
  workerName,
}: MessagingDialogProps) {
  console.log('🔴 MessagingDialog rendering - isOpen:', isOpen);
  console.log('🔴 MessagingDialog props:', { workerId, workerUserId, workerName });

  const [newMessage, setNewMessage] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<{
    id: string;
    userId: string;
    name: string;
  } | null>(null);
  
  const { user } = useAuth();
  
  // Fetch user's bookings to get people they can message
  const [availableRecipients, setAvailableRecipients] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchRecipients = async () => {
      if (!user?.id) return;
      
      try {
        const response = await fetch(`http://localhost:3001/api/bookings/user/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Extract unique workers from bookings
            const workers = data.bookings.reduce((acc: any[], booking: any) => {
              if (booking.worker_id && booking.worker_name) {
                const exists = acc.find(w => w.id === booking.worker_id);
                if (!exists) {
                  acc.push({
                    id: booking.worker_id,
                    name: booking.worker_name,
                    type: 'worker'
                  });
                }
              }
              return acc;
            }, []);
            setAvailableRecipients(workers);
          }
        }
      } catch (error) {
        console.error('Error fetching recipients:', error);
      }
    };
    
    if (isOpen) {
      fetchRecipients();
    }
  }, [isOpen, user?.id]);

  // Set initial recipient if provided
  useEffect(() => {
    if (workerId && workerName) {
      setSelectedRecipient({
        id: workerId,
        userId: workerUserId || '',
        name: workerName
      });
    }
  }, [workerId, workerUserId, workerName]);

  const { messages, isLoading, sendMessage, refreshMessages } = useMessages({
    userId: user?.id || "",
    workerId: selectedRecipient?.id || "",
    workerUserId: selectedRecipient?.userId || "",
    workerName: selectedRecipient?.name || "",
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔴 Send button clicked');
    console.log('🔴 User:', user?.id);
    console.log('🔴 New message:', newMessage);
    console.log('🔴 Selected recipient:', selectedRecipient);
    
    if (!user || !newMessage.trim() || !selectedRecipient) {
      console.log('❌ Cannot send - missing user, message, or recipient');
      return;
    }

    console.log('🟢 Attempting to send message...');
    console.log('🟢 Recipient:', selectedRecipient);
    
    try {
      await sendMessage(newMessage);
      console.log('✅ Message sent successfully');
      setNewMessage("");
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    }
  };
  
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {selectedRecipient ? `Chat with ${selectedRecipient.name}` : "Messages"}
          </DialogTitle>
        </DialogHeader>

        {/* Recipient Selection */}
        {!selectedRecipient && availableRecipients.length > 0 && (
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Select recipient:</label>
            <Select onValueChange={(value) => {
              const recipient = availableRecipients.find(r => r.id === value);
              if (recipient) {
                setSelectedRecipient({
                  id: recipient.id,
                  userId: '',
                  name: recipient.name
                });
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose who to message" />
              </SelectTrigger>
              <SelectContent>
                {availableRecipients.map((recipient) => (
                  <SelectItem key={recipient.id} value={recipient.id}>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {recipient.name} ({recipient.type})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedRecipient ? (
          <>
            <MessageList messages={messages} currentUserId={user?.id} />
            <MessageInput
              value={newMessage}
              onChange={setNewMessage}
              onSubmit={handleSendMessage}
              isLoading={isLoading}
            />
          </>
        ) : (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">No recipient selected</p>
            <p className="text-sm text-gray-500">
              {availableRecipients.length > 0 
                ? "Select someone from the dropdown above to start chatting"
                : "You don't have any active bookings to message yet"}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
