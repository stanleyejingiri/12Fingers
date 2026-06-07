export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  worker_id: string;
  created_at: string;
  read: boolean;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  worker_id: string;
  content: string;
  created_at: string;
}