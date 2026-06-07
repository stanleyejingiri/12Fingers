// src/pages/UserDashboard.tsx
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessagingDialog } from "@/components/messaging/MessagingDialog";
import { useState } from "react";
import { BookingStatusBadge } from "@/components/booking/BookingStatusBadge";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Clock, CheckCircle, DollarSign, AlertCircle, Bell, X } from "lucide-react";
import { WalletBalance } from "@/components/dashboard/WalletBalance";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";
import { ClientProfileModal } from "@/components/client-profile/ClientProfileModal";

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedWorker, setSelectedWorker] = useState<{
    id: string;
    userId: string;
    name: string;
  } | null>(null);
  
  const [showEditProfile, setShowEditProfile] = useState(false);/*just added*/
  
  // Fetch user bookings
  const { data: bookingsData, isLoading: bookingsLoading, refetch } = useQuery({
    queryKey: ["userBookings", user?.id],
    queryFn: async () => {
      if (!user?.id) return { bookings: [] };

      try {
        console.log("📋 Fetching user bookings from local API...");
        
        const response = await fetch(`https://one2fingers-backend.onrender.com/api/bookings/user/${user.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          console.log(`✅ Found ${result.bookings?.length || 0} bookings for user`);
          return { bookings: result.bookings || [] };
        } else {
          throw new Error(result.error || "Failed to fetch bookings");
        }
      } catch (error) {
        console.error("❌ Error fetching bookings:", error);
        try {
          const allResponse = await fetch(`https://one2fingers-backend.onrender.com/api/bookings`);
          const allResult = await allResponse.json();
          if (allResult.success) {
            const userBookings = allResult.bookings.filter((booking: any) => 
              booking.client_id === user.id
            );
            console.log(`✅ Found ${userBookings.length} bookings for user (filtered)`);
            return { bookings: userBookings };
          }
        } catch (fallbackError) {
          return { bookings: [], error: error.message };
        }
        return { bookings: [], error: error.message };
      }
    },
    enabled: !!user,
  });

  // Fetch user notifications
  const { data: notificationsData, refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user?.id) return { notifications: [] };

      try {
        console.log("🔔 Fetching user notifications...");
        const response = await fetch(`https://one2fingers-backend.onrender.com/api/notifications/${user?.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch notifications: ${response.status}`);
        }

        const result = await response.json();
        console.log(`✅ Found ${result.notifications?.length || 0} notifications`);
        return result;
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        return { notifications: [], error: error.message };
      }
    },
    enabled: !!user?.id,
  });

  const bookings = bookingsData?.bookings || [];
  const notifications = notificationsData?.notifications || [];

  const markNotificationAsRead = async (notificationId: string) => {
    console.log('🔘 Close button clicked for notification:', notificationId);
    
    try {
      const response = await fetch(`https://one2fingers-backend.onrender.com/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to mark notification as read');
      }
      
      // Refetch notifications to update the list
      refetchNotifications();
      
      toast({
        title: "Notification dismissed",
        description: "Notification marked as read",
        variant: "default",
      });
      
    } catch (error) {
      console.error('❌ Error:', error);
      toast({
        title: "Error",
        description: "Failed to dismiss notification",
        variant: "destructive",
      });
    }
  };

  const calculateStats = () => {
    const pendingOffers = bookings.filter((b: any) => b.status === 'offer_pending').length;
    const acceptedOffers = bookings.filter((b: any) => b.status === 'offer_accepted').length;
    const pendingPayment = bookings.filter((b: any) => b.status === 'offer_accepted').length;
    const activeJobs = bookings.filter((b: any) => ['confirmed', 'in_progress'].includes(b.status)).length;
    const completedJobs = bookings.filter((b: any) => b.status === 'completed').length;
    const totalSpent = bookings
      .filter((b: any) => ['completed'].includes(b.status))
      .reduce((sum: number, b: any) => sum + (parseFloat(b.total_amount) || 0), 0);
    
    return { pendingOffers, acceptedOffers, pendingPayment, activeJobs, completedJobs, totalSpent };
  };

  const stats = calculateStats();

  const bookingsByStatus = {
    pendingOffers: bookings.filter((b: any) => b.status === 'offer_pending'),
    acceptedOffers: bookings.filter((b: any) => b.status === 'offer_accepted'),
    pendingPayment: bookings.filter((b: any) => b.status === 'payment_pending'),
    activeJobs: bookings.filter((b: any) => ['confirmed', 'in_progress'].includes(b.status)),
    awaitingConfirmation: bookings.filter((b: any) => b.status === 'awaiting_confirmation'),
    completedJobs: bookings.filter((b: any) => b.status === 'completed'),
    other: bookings.filter((b: any) => 
      !['offer_pending', 'offer_accepted', 'payment_pending', 'confirmed', 
        'in_progress', 'awaiting_confirmation', 'completed'].includes(b.status)
    )
  };

  const getStatusDescription = (status: string) => {
    const descriptions: { [key: string]: string } = {
      'offer_pending': 'Waiting for worker to accept your offer',
      'offer_accepted': 'Worker accepted! Make payment to confirm',
      'payment_pending': 'Payment initiated - complete to confirm booking',
      'confirmed': 'Booking confirmed - waiting for work to start',
      'in_progress': 'Work in progress',
      'awaiting_confirmation': 'Worker completed - please confirm to release payment',
      'completed': 'Job completed - payment released',
      'pending': 'Booking pending'
    };
    return descriptions[status] || status;
  };

  const handleInitiatePayment = async (bookingId: string) => {
    console.log('💰 Initiating escrow payment for booking:', bookingId);
    
    try {
      const booking = bookings.find((b: any) => b.id === bookingId);
      if (!booking) throw new Error('Booking not found');

      const walletResponse = await fetch(`https://one2fingers-backend.onrender.com/api/wallets/balance/${user?.id}`);
      const walletData = await walletResponse.json();
      const currentBalance = walletData.balance || 0;
      
      if (currentBalance < booking.total_amount) {
        toast({
          title: "Insufficient Funds",
          description: `Please add $${(booking.total_amount - currentBalance).toFixed(2)} to your wallet`,
          variant: "destructive",
        });
        return;
      }
      
      toast({ title: "Processing Payment", description: "Holding funds in escrow..." });
      
      const response = await fetch('https://one2fingers-backend.onrender.com/api/payments/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          amount: booking.total_amount,
          client_id: user?.id,
          worker_id: booking.worker_id,
          payment_method: 'wallet'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment failed');
      }

      const result = await response.json();
      
      toast({
        title: "Payment Successful!",
        description: `$${booking.total_amount} held in escrow. Worker can now start the job.`,
        variant: "default",
      });
      
      console.log('✅ Escrow payment successful:', result);
      
      refetch();
      window.dispatchEvent(new Event('refreshWallet'));
      
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      toast({ title: "Payment Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleConfirmCompletion = async (bookingId: string) => {
    console.log('💰 User confirming job completion for booking:', bookingId);
    
    try {
      toast({
        title: "Processing",
        description: "Confirming job completion and releasing payment...",
      });

      const response = await fetch(`https://one2fingers-backend.onrender.com/api/bookings/${bookingId}/confirm-completion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: user?.id })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to confirm completion');
      }

      const result = await response.json();
      
      toast({
        title: "Success! 🎉",
        description: `Job confirmed! $${result.amounts.worker_received} released to worker.`,
        variant: "default",
      });
      
      refetch();
      window.dispatchEvent(new Event('refreshWallet'));
      
    } catch (error: any) {
      console.error('❌ Confirm completion error:', error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getActionButton = (booking: any) => {
    if (booking.status === 'confirmed') {
      return (
        <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Payment secured in escrow - waiting for worker to start
        </div>
      );
    }
    
    switch (booking.status) {
      case 'offer_accepted':
        return (
          <Button 
            size="sm" 
            onClick={() => handleInitiatePayment(booking.id)}
            className="mt-2"
            disabled={booking.payment_status === 'processing'}
          >
            <DollarSign className="h-4 w-4 mr-1" />
            {booking.payment_status === 'processing' ? 'Processing...' : 'Make Payment'}
          </Button>
        );
        
      case 'in_progress':
        return (
          <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
            <Clock className="h-4 w-4 animate-pulse" />
            Job in progress - worker will notify when complete
          </div>
        );
        
      case 'awaiting_confirmation':
        return (
          <div className="mt-2 space-y-2">
            <div className="text-sm text-yellow-600 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Worker has marked job as complete. Please confirm to release payment.
            </div>
            <Button 
              size="sm" 
              onClick={() => handleConfirmCompletion(booking.id)}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Confirm Completion
            </Button>
            {booking.auto_release_at && (
              <div className="text-xs text-gray-500">
                Auto-confirms on {new Date(booking.auto_release_at).toLocaleDateString()} if no action taken
              </div>
            )}
          </div>
        );
        
      case 'completed':
        return (
          <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Job completed - payment released
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  // Get unread notifications
  const unreadNotifications = notifications.filter((n: any) => !n.is_read);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
			<div className="flex items-center gap-4">
				<Button variant="ghost" onClick={() => navigate(-1)} className="flex items-center gap-2">
					<ArrowLeft className="h-4 w-4" />
					Back
				</Button>
			  <h1 className="text-3xl font-bold">My Dashboard</h1>
			</div>
			<div className="flex items-center gap-4">
				<Button variant="outline" onClick={() => setShowInbox(true)} className="flex items-center gap-2">
					<MessageSquare className="h-4 w-4" />
					Messages
				</Button>
				<Button asChild variant="outline">
					<Link to="/worker-registration">Share Your Skills, Become a Worker</Link>
				</Button>
				<Button variant="outline" onClick={() => setShowEditProfile(true)}>
				  Edit Profile
				</Button>
			</div>
      </div>

      {/* Notifications Section - Only show unread notifications */}
      {unreadNotifications.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-5 w-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Notifications</h2>
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadNotifications.length} new
            </span>
          </div>
          <div className="space-y-2">
            {unreadNotifications.slice(0, 5).map((notification: any) => (
              <Card 
                key={notification.id} 
                className="p-3 relative bg-blue-50 border-blue-200"
              >
                <button 
                  onClick={() => markNotificationAsRead(notification.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex justify-between pr-6">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className="text-xs text-gray-500">
                    {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                {notification.booking_id && (
                  <p className="text-xs text-gray-500 mt-2">
                    Booking ID: {notification.booking_id.substring(0, 8)}...
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <WalletBalance />
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <h3 className="font-semibold">Pending Offers</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.pendingOffers}</p>
          <p className="text-xs text-gray-500 mt-1">Awaiting worker response</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <h3 className="font-semibold">Accepted</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.acceptedOffers}</p>
          <p className="text-xs text-gray-500 mt-1">Ready for payment</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-purple-500" />
            <h3 className="font-semibold">Awaiting Payment</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.pendingPayment}</p>
          <p className="text-xs text-gray-500 mt-1">Accepted offers ready for payment</p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-green-500" />
            <h3 className="font-semibold">Active Jobs</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{stats.activeJobs}</p>
          <p className="text-xs text-gray-500 mt-1">Work in progress</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Total Spent</h3>
          <p className="text-2xl font-bold mt-2">${stats.totalSpent.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">On completed jobs</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section>
            <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
            
            {bookingsLoading ? (
              <p>Loading bookings...</p>
            ) : bookings.length > 0 ? (
              <div className="space-y-6">
                {/* Pending Offers */}
                {bookingsByStatus.pendingOffers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-amber-500" />
                      Pending Offers ({bookingsByStatus.pendingOffers.length})
                    </h3>
                    <div className="grid gap-3">
                      {bookingsByStatus.pendingOffers.map((booking: any) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          getStatusDescription={getStatusDescription}
                          getActionButton={getActionButton}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Accepted Offers */}
                {bookingsByStatus.acceptedOffers.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      Accepted Offers ({bookingsByStatus.acceptedOffers.length})
                    </h3>
                    <div className="grid gap-3">
                      {bookingsByStatus.acceptedOffers.map((booking: any) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          getStatusDescription={getStatusDescription}
                          getActionButton={getActionButton}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Pending Payment */}
                {bookingsByStatus.pendingPayment.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-purple-500" />
                      Pending Payment ({bookingsByStatus.pendingPayment.length})
                    </h3>
                    <div className="grid gap-3">
                      {bookingsByStatus.pendingPayment.map((booking: any) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          getStatusDescription={getStatusDescription}
                          getActionButton={getActionButton}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Active Jobs */}
                {bookingsByStatus.activeJobs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-green-500" />
                      Active Jobs ({bookingsByStatus.activeJobs.length})
                    </h3>
                    <div className="grid gap-3">
                      {bookingsByStatus.activeJobs.map((booking: any) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          getStatusDescription={getStatusDescription}
                          getActionButton={getActionButton}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Awaiting Confirmation Section */}
                {bookingsByStatus.awaitingConfirmation.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      Awaiting Your Confirmation ({bookingsByStatus.awaitingConfirmation.length})
                    </h3>
                    <div className="grid gap-3">
                      {bookingsByStatus.awaitingConfirmation.map((booking: any) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          getStatusDescription={getStatusDescription}
                          getActionButton={getActionButton}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Completed Jobs */}
                {bookingsByStatus.completedJobs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-gray-500" />
                      Completed ({bookingsByStatus.completedJobs.length})
                    </h3>
                    <div className="grid gap-3">
                      {bookingsByStatus.completedJobs.map((booking: any) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          getStatusDescription={getStatusDescription}
                          getActionButton={getActionButton}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Other Statuses */}
                {bookingsByStatus.other.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Other Bookings ({bookingsByStatus.other.length})</h3>
                    <div className="grid gap-3">
                      {bookingsByStatus.other.map((booking: any) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          getStatusDescription={getStatusDescription}
                          getActionButton={getActionButton}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card className="p-6">
                <p className="text-center text-gray-600">No bookings yet</p>
                <Button asChild className="mt-4 mx-auto block">
                  <Link to="/">Find Workers</Link>
                </Button>
              </Card>
            )}
          </section>
        </div>
        
        <div>
          <RecentTransactions />
        </div>
      </div>

      {selectedWorker && (
        <MessagingDialog
          isOpen={!!selectedWorker}
          onClose={() => setSelectedWorker(null)}
          workerId={selectedWorker.id}
          workerUserId={selectedWorker.userId}
          workerName={selectedWorker.name}
        />
      )}
	 	<ClientProfileModal
		  isOpen={showEditProfile}
		  onClose={() => setShowEditProfile(false)}
		  user={user}
		  onUpdate={(updatedUser) => {
			// Update the user object in the auth context
			// Since you're using useAuth(), you may need to refresh the auth state
			// For now, reload the page to fetch fresh data
			window.location.reload(true);
		  }}
		/>
    </div>
  );
}

// Booking Card Component
function BookingCard({ 
  booking, 
  getStatusDescription, 
  getActionButton 
}: { 
  booking: any; 
  getStatusDescription: (status: string) => string;
  getActionButton: (booking: any) => React.ReactNode;
}) {
  return (
    <Card className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">
                {booking.worker_name} - {booking.worker_category}
              </h3>
              <p className="text-sm text-gray-600">
                {format(new Date(booking.booking_date), "PPP")} • {booking.start_time} - {booking.end_time}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">
                ${Number(booking.total_amount).toFixed(2)}
              </p>
              {booking.payment_method && (
                <p className="text-xs text-gray-500">Payment: {booking.payment_method}</p>
              )}
            </div>
          </div>
          
          {booking.service_details && (
            <p className="text-sm text-gray-700 mt-2">{booking.service_details}</p>
          )}
          
          <div className="mt-3 flex items-center gap-2">
            <BookingStatusBadge status={booking.status} />
            <span className="text-sm text-gray-600">{getStatusDescription(booking.status)}</span>
          </div>
          
          <div className="mt-3">{getActionButton(booking)}</div>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-3">
        Created: {format(new Date(booking.created_at), "PPp")}
      </p>
    </Card>
  );
}
