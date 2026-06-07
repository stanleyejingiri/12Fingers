//src/components/booking/BookingHistory.tsx
import { useState } from "react";
import { useBookings } from "@/hooks/useBookings";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { Button } from "../ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function BookingHistory() {
  const { bookings, isLoading, error, refetch } = useBookings();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCancelBooking = async () => {
    if (!selectedBookingId) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', selectedBookingId);

      if (error) throw error;

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setShowCancelDialog(false);
      setSelectedBookingId(null);
    }
  };

  if (isLoading) return <div>Loading bookings...</div>;
  if (error) return <div>Error loading bookings: {error.message}</div>;
  if (!bookings?.length) return <div>No bookings found.</div>;

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="p-4 border rounded-lg shadow-sm space-y-2"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Booking on {booking.booking_date}</h3>
              <p className="text-sm text-gray-600">
                {booking.start_time} - {booking.end_time}
              </p>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>
          {booking.status === 'pending' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setSelectedBookingId(booking.id);
                setShowCancelDialog(true);
              }}
            >
              Cancel Booking
            </Button>
          )}
        </div>
      ))}

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep booking</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelBooking}>
              Yes, cancel booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}