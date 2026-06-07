import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Booking } from '@/types/booking';
import { useAuth } from './useAuth';

export const useBookings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchBookings = async (): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: true });

    if (error) throw error;
    return data;
  };

  const { data: bookings, isLoading, error, refetch } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: fetchBookings,
    enabled: !!user,
  });

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        (payload) => {
          console.log('Real-time booking update:', payload);
          queryClient.invalidateQueries({ queryKey: ['bookings'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { bookings, isLoading, error, refetch };
};
