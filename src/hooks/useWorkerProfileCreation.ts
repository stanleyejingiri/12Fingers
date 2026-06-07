import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { RegisterFormValues } from "@/components/auth/types";

export function useWorkerProfileCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createWorkerProfile = async (userId: string, values: RegisterFormValues): Promise<void> => {
    setIsCreating(true);
    console.log('Creating worker profile with data:', { userId, values });
    
    try {
      if (!values.name || !values.category) {
        throw new Error("Name and category are required for worker profile");
      }

      // First, check if a profile already exists
      const { data: existingProfile } = await supabase
        .from('worker_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingProfile) {
        console.log('Profile already exists:', existingProfile);
        return;
      }

      const profileData = {
        user_id: userId,
        name: values.name,
        category: values.category,
        contact_email: values.email,
        is_verified: false,
        years_of_experience: 0,
        hourly_rate: 0,
        average_rating: 0,
        total_ratings: 0,
        description: "",
      };

      console.log('Inserting profile data:', profileData);

      const { data, error: profileError } = await supabase
        .from('worker_profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) {
        console.error('Worker profile creation error:', {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details
        });
        throw new Error(
          profileError.message === 'new row violates row-level security policy' 
            ? 'Authorization error: Unable to create profile. Please ensure you are logged in.'
            : profileError.message
        );
      }

      console.log('Worker profile created successfully:', data);

      toast({
        title: "Success",
        description: "Your worker profile has been created successfully.",
      });
    } catch (error: any) {
      console.error('Worker profile creation error:', error);
      toast({
        variant: "destructive",
        title: "Profile Creation Failed",
        description: error.message || "Failed to create worker profile. Please try again.",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createWorkerProfile,
    isCreating,
  };
}
