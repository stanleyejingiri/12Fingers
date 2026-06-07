//src/components/subscription/RegistrationForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { WorkerCategory } from "@/types/worker";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RegistrationFormProps {
  onSuccess: () => void;
}

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<WorkerCategory>("Other");
  const { toast } = useToast();

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) throw signUpError;

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.id) throw new Error("User not found after registration");

      const { error: profileError } = await supabase
        .from('worker_profiles')
        .insert([
          {
            user_id: user.id,
            name,
            category,
            is_verified: false,
            years_of_experience: 0,
            hourly_rate: 0,
            average_rating: 0,
            total_ratings: 0,
          }
        ]);

      if (profileError) throw profileError;

      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Card className="p-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Register as a Worker</h2>
      <form onSubmit={handleRegistration} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Select value={category} onValueChange={(value) => setCategory(value as WorkerCategory)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cleaner">Cleaner</SelectItem>
              <SelectItem value="Landscaper">Landscaper</SelectItem>
              <SelectItem value="Electrician">Electrician</SelectItem>
              <SelectItem value="Plumber">Plumber</SelectItem>
              <SelectItem value="Mechanic">Mechanic</SelectItem>
              <SelectItem value="Tiler">Tiler</SelectItem>
              <SelectItem value="Mason">Mason</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">
          Continue to Select Plan
        </Button>
      </form>
    </Card>
  );
}
