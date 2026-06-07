import { Button } from "./ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { useState } from "react";

export function TestAccountsCreator() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createTestUser = async () => {
    if (isCreating) return;
    setIsCreating(true);
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: 'testuser@example.com',
        password: 'testuser123',
      });
      
      if (signUpError) {
        console.error('Test user signup error:', signUpError);
        throw signUpError;
      }

      if (data.user) {
        // Auto-confirm the email for test accounts
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: 'testuser@example.com',
          password: 'testuser123',
        });

        if (signInError) {
          console.error('Test user signin error:', signInError);
          throw signInError;
        }

        toast({
          title: "Test User Created",
          description: "Email: testuser@example.com\nPassword: testuser123",
        });
      }
    } catch (error: any) {
      console.error('Test user creation error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create test user. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const createTestWorker = async () => {
    if (isCreating) return;
    setIsCreating(true);
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: 'testworker@example.com',
        password: 'testworker123',
      });
      
      if (signUpError) {
        console.error('Test worker signup error:', signUpError);
        throw signUpError;
      }

      if (!data.user?.id) throw new Error("User not found after registration");

      // Auto-confirm the email for test accounts
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'testworker@example.com',
        password: 'testworker123',
      });

      if (signInError) {
        console.error('Test worker signin error:', signInError);
        throw signInError;
      }

      const { error: profileError } = await supabase
        .from('worker_profiles')
        .insert([
          {
            user_id: data.user.id,
            name: 'Test Worker',
            category: 'Plumber',
            is_verified: true,
            years_of_experience: 5,
            hourly_rate: 45,
            average_rating: 4.5,
            total_ratings: 10,
          }
        ]);

      if (profileError) {
        console.error('Worker profile creation error:', profileError);
        throw profileError;
      }

      toast({
        title: "Test Worker Created",
        description: "Email: testworker@example.com\nPassword: testworker123",
      });
    } catch (error: any) {
      console.error('Test worker creation error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create test worker. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-x-2">
      <Button onClick={createTestUser} variant="outline" disabled={isCreating}>
        {isCreating ? "Creating..." : "Create Test User"}
      </Button>
      <Button onClick={createTestWorker} variant="outline" disabled={isCreating}>
        {isCreating ? "Creating..." : "Create Test Worker"}
      </Button>
    </div>
  );
}