//src/services/messageServices.ts
/*import { supabase } from "@/lib/supabase";
import { Message } from "@/types/message";

export const messageService = {
  async fetchMessages(userId: string | undefined, workerId: string): Promise<Message[]> {
    if (!userId) return [];

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("worker_id", workerId)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }

    return data || [];
  },

  async sendMessage(message: {
    content: string;
    sender_id: string;
    receiver_id: string;
    worker_id: string;
    read: boolean;
  }): Promise<Message> {
    const { data, error } = await supabase
      .from("messages")
      .insert([message])
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }

    return data;
  },

  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .in("id", messageIds);

    if (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  }
};
*/

// src/services/messageServices.ts - UPDATED FOR YOUR BACKEND
/*import { Message } from "@/types/message";
import { api } from "@/lib/api"; // We'll create this

export const messageService = {
  async fetchMessages(userId: string, workerUserId: string): Promise<Message[]> {
    if (!userId) return [];

    try {
      const response = await api.get(`/messages?userId=${userId}&workerUserId=${workerUserId}`);
      return response.messages || [];
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },

  async sendMessage(message: {
    sender_id: string;
    receiver_id: string;
    content: string;
    worker_id?: string;
  }): Promise<Message> {
    try {
      const response = await api.post('/messages', {
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        content: message.content,
        worker_id: message.worker_id
      });
      return response.message;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    // We'll implement this later - for now just log
    console.log('Marking messages as read:', messageIds);
  }
};*/

// src/services/messageService.ts - UPDATED WITH DEBUG LOGGING
import { Message } from "@/types/message";
import { api } from "@/lib/api";

export const messageService = {
  async fetchMessages(userId: string, workerUserId: string): Promise<Message[]> {
    if (!userId) return [];

    try {
      console.log('🔴 messageService - fetching messages for:', { userId, workerUserId });
      const response = await api.get(`/messages?userId=${userId}&workerUserId=${workerUserId}`);
      console.log('✅ messageService - fetched messages:', response.messages?.length || 0);
      return response.messages || [];
    } catch (error) {
      console.error("❌ messageService - Error fetching messages:", error);
      throw error;
    }
  },

  async sendMessage(message: {
    sender_id: string;
    receiver_id: string;
    content: string;
    worker_id?: string;
  }): Promise<Message> {
    console.log('🔴 messageService - sending message:', message);
    
    try {
      const response = await api.post('/messages', {
        sender_id: message.sender_id,
        receiver_id: message.receiver_id,
        content: message.content,
        worker_id: message.worker_id
      });
      
      console.log('✅ messageService - API response:', response);
      return response.message;
    } catch (error) {
      console.error('❌ messageService - Error sending message:', error);
      throw error;
    }
  },

  async markMessagesAsRead(messageIds: string[]): Promise<void> {
    console.log('Marking messages as read:', messageIds);
  }
};
