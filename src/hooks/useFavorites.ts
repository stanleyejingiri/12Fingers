//src/hooks/useFavorites.ts
import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface FavoriteResponse {
  success: boolean;
  action: string;
  is_favorite: boolean;
}

interface CheckFavoriteResponse {
  success: boolean;
  is_favorite: boolean;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const toggleFavorite = useCallback(async (workerId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add workers to favorites.",
        variant: "destructive"
      });
      return { success: false };
    }

    setLoading(prev => ({ ...prev, [workerId]: true }));

    try {
      const response = await fetch('http://localhost:3001/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          worker_id: workerId
        }),
      });

      const data: FavoriteResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to toggle favorite');
      }

      toast({
        title: data.action === 'added' ? "Added to favorites" : "Removed from favorites",
        description: data.action === 'added' 
          ? "Worker has been added to your favorites."
          : "Worker has been removed from your favorites."
      });

      return data;

    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive"
      });
      return { success: false, action: 'error' };
    } finally {
      setLoading(prev => ({ ...prev, [workerId]: false }));
    }
  }, [user, toast]);

  const checkFavorite = useCallback(async (workerId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const response = await fetch(
        `http://localhost:3001/api/favorites/check?user_id=${user.id}&worker_id=${workerId}`
      );

      const data: CheckFavoriteResponse = await response.json();

      if (data.success) {
        return data.is_favorite;
      }

      return false;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  }, [user]);

  const getUserFavorites = useCallback(async () => {
    if (!user) return [];

    try {
      const response = await fetch(
        `http://localhost:3001/api/favorites/user/${user.id}`
      );

      const data = await response.json();

      if (data.success) {
        return data.favorites;
      }

      return [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }, [user]);

  return {
    toggleFavorite,
    checkFavorite,
    getUserFavorites,
    loading
  };
};