// src/components/booking/WorkerBookings.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  User,
  Calendar,
  Clock,
  DollarSign,
  PlayCircle 
} from "lucide-react";


interface WorkerBookingsProps {
  statusFilter: 'offer_pending' | 'offer_accepted' | 'active' | 'all';
  workerId: string;
  onMessageClick?: (clientId: string, clientName: string) => void;   // 🔴 add this
}

interface Booking {
  id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  worker_id: string;
  worker_name: string;
  worker_category: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_amount: number | string; // Can be number or string from API
  service_details: string;
  special_instructions: string;
  status: string;
  payment_method: string;
  is_custom_offer: boolean;
  created_at: string;
  accepted_at?: string;
  confirmed_at?: string;
}

export function WorkerBookings({ statusFilter, workerId, onMessageClick }: WorkerBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchWorkerBookings();
  }, [workerId, statusFilter]);

  const fetchWorkerBookings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`https://one2fingers-backend.onrender.com/api/bookings/worker/${workerId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Filter bookings based on statusFilter
        let filteredBookings = result.bookings;
        
        if (statusFilter === 'offer_pending') {
          filteredBookings = result.bookings.filter((b: Booking) => b.status === 'offer_pending');
        } else if (statusFilter === 'offer_accepted') {
          filteredBookings = result.bookings.filter((b: Booking) => b.status === 'offer_accepted');
        } else if (statusFilter === 'active') {
          filteredBookings = result.bookings.filter((b: Booking) => 
            ['confirmed', 'in_progress'].includes(b.status)
          );
        }
        // 'all' shows everything
        
        // Ensure total_amount is converted to number
        const processedBookings = filteredBookings.map((booking: Booking) => ({
          ...booking,
          total_amount: typeof booking.total_amount === 'string' 
            ? parseFloat(booking.total_amount) 
            : booking.total_amount
        }));
        
        setBookings(processedBookings);
      } else {
        throw new Error(result.error || "Failed to fetch bookings");
      }
    } catch (err: any) {
      setError(err.message);
      console.error("❌ Error fetching worker bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOffer = async (bookingId: string) => {
    try {
      const response = await fetch(`https://one2fingers-backend.onrender.com/api/bookings/${bookingId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worker_id: workerId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to accept offer');
      }

      toast({
        title: "Offer Accepted!",
        description: "The offer has been accepted. Waiting for client payment.",
        variant: "default",
      });

      // Refresh bookings
      fetchWorkerBookings();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRejectOffer = async (bookingId: string) => {
    try {
      const response = await fetch(`https://one2fingers-backend.onrender.com/api/bookings/${bookingId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worker_id: workerId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject offer');
      }

      toast({
        title: "Offer Rejected",
        description: "The offer has been rejected.",
        variant: "default",
      });

      // Refresh bookings
      fetchWorkerBookings();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStartJob = async (bookingId: string) => {
    try {
      const response = await fetch(`https://one2fingers-backend.onrender.com/api/bookings/${bookingId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worker_id: workerId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start job');
      }

      toast({
        title: "Job Started!",
        description: "You have started the job.",
        variant: "default",
      });

      fetchWorkerBookings();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCompleteJob = async (bookingId: string) => {
    try {
      const response = await fetch(`https://one2fingers-backend.onrender.com/api/bookings/${bookingId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ worker_id: workerId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete job');
      }

      toast({
        title: "Job Completed!",
        description: "Job marked as completed. Waiting for client confirmation.",
        variant: "default",
      });

      fetchWorkerBookings();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Helper function to safely format currency
  const formatCurrency = (amount: number | string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(numAmount) ? '0.00' : numAmount.toFixed(2);
  };

  if (isLoading) return <div>Loading bookings...</div>;
  if (error) return <div>Error loading bookings: {error}</div>;
  if (bookings.length === 0) return <div>No bookings found.</div>;

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="border rounded-lg p-4 space-y-3">
          {/* Booking Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{booking.client_name}</span>
                <span className="text-sm text-gray-500">({booking.client_email})</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                {format(new Date(booking.booking_date), "PPP")}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                {booking.start_time} - {booking.end_time}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <BookingStatusBadge status={booking.status} />
              </div>
              <div className="text-lg font-bold flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {formatCurrency(booking.total_amount)} {/* FIXED LINE */}
              </div>
              {booking.payment_method && (
                <div className="text-sm text-gray-500">
                  Payment: {booking.payment_method}
                </div>
              )}
            </div>
          </div>

          {/* Service Details */}
          {booking.service_details && (
            <div className="text-sm">
              <p className="font-medium">Service Details:</p>
              <p className="text-gray-600">{booking.service_details}</p>
            </div>
          )}

          {booking.special_instructions && (
            <div className="text-sm">
              <p className="font-medium">Special Instructions:</p>
              <p className="text-gray-600">{booking.special_instructions}</p>
            </div>
          )}

         		
			{/* Action Buttons based on status */}
			<div className="flex gap-2 pt-2">
			  {booking.status === 'offer_pending' && (
				<>
				  <Button 
					onClick={() => handleAcceptOffer(booking.id)}
					className="flex-1 gap-2"
					variant="default"
				  >
					<CheckCircle className="h-4 w-4" />
					Accept Offer
				  </Button>
				  <Button 
					onClick={() => handleRejectOffer(booking.id)}
					className="flex-1 gap-2"
					variant="destructive"
				  >
					<XCircle className="h-4 w-4" />
					Reject Offer
				  </Button>
				</>
			  )}

			  {booking.status === 'offer_accepted' && (
				<div className="text-sm text-blue-600">
				  ✅ Offer accepted. Waiting for client payment.
				</div>
			  )}

			  {booking.status === 'confirmed' && (
				<Button 
				  onClick={() => handleStartJob(booking.id)}
				  className="gap-2"
				  variant="default"
				>
				  <PlayCircle className="h-4 w-4" />
				  Start Job
				</Button>
			  )}

			  {booking.status === 'in_progress' && (
				<Button 
				  onClick={() => handleCompleteJob(booking.id)}
				  className="gap-2"
				  variant="default"
				>
				  <CheckCircle className="h-4 w-4" />
				  Mark as Complete
				</Button>
			  )}

			  {/* 🔴 NEW: Awaiting Client Confirmation Status */}
			  {booking.status === 'awaiting_confirmation' && (
				<div className="flex flex-col gap-2 w-full">
				  <div className="text-sm text-yellow-600 flex items-center gap-2">
					<Clock className="h-4 w-4 animate-pulse" />
					Job completed - waiting for client confirmation
				  </div>
				  {booking.auto_release_at && (
					<div className="text-xs text-gray-500">
					  Auto-releases on {new Date(booking.auto_release_at).toLocaleDateString()} if not confirmed
					</div>
				  )}
				</div>
			  )}

			  {booking.status === 'completed' && (
				<div className="text-sm text-green-600 flex items-center gap-2">
				  <CheckCircle className="h-4 w-4" />
				  Payment released - job completed
				</div>
			  )}

			  {/* Message button for all statuses */}
			 <Button
				  variant="outline"
				  size="sm"
				  className="gap-2"
				  onClick={() => {
					console.log('🔴 Message button clicked in WorkerBookings', {
					  clientId: booking.client_id,
					  clientName: booking.client_name,
					  hasOnMessageClick: typeof onMessageClick === 'function'
					});
					if (onMessageClick) {
					  onMessageClick(booking.client_id, booking.client_name);
					} else {
					  console.error('❌ onMessageClick is undefined in WorkerBookings');
					}
				  }}
				>
				  <MessageSquare className="h-4 w-4" />
				  Message
				</Button>
			</div>

          {/* Created at */}
          <div className="text-xs text-gray-400 pt-2 border-t">
            Created: {format(new Date(booking.created_at), "PPp")}
          </div>
        </div>
      ))}
    </div>
  );
}
