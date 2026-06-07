import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function MessageInput({ value, onChange, onSubmit, isLoading }: MessageInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        className="flex-1"
      />
      <Button type="submit" disabled={isLoading}>
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}
