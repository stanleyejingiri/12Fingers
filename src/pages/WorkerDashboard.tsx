// src/pages/WorkerDashboard.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useWorkerProfile } from "@/hooks/useWorkerProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EditProfileModal } from "@/components/worker-profile/EditProfileModal";
import { Button } from "@/components/ui/button";
import { Settings, MessageSquare, Calendar, CreditCard, Clock, CheckCircle, DollarSign, AlertCircle, ArrowLeft, Home } from "lucide-react";
import { WorkerComments } from "@/components/WorkerComments";
import { MessagingDialog } from "@/components/messaging/MessagingDialog";
import { StripeConnectOnboarding } from "@/components/payment/StripeConnectOnboarding";
import { WalletBalance } from "@/components/dashboard/WalletBalance";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { WorkerBookings } from "@/components/booking/WorkerBookings";
import { useToast } from "@/hooks/use-toast";
import { WithdrawFundsDialog } from "@/components/dashboard/WithdrawFundsDialog";
import { InboxDialog } from "@/components/messaging/InboxDialog";
import { useNavigate, Link } from "react-router-dom";
import { ServicePackagesManager } from "@/components/worker-profile/ServicePackagesManager";
import { Package } from "lucide-react";

export default function WorkerDashboard() {
  const { user } = useAuth();
  const { worker, isLoading } = useWorkerProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  
  // 🔴 State for specific client messaging (from pending offers)
  const [selectedClientForMessaging, setSelectedClientForMessaging] = useState<{
    id: string;
    name: string;
  } | null>(null);
  
  // Payment statistics state
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  
  // 🔴 Handler for the Message button on a pending offer
  const handleOpenChatWithClient = (clientId: string, clientName: string) => {
    console.log('🔴 Opening chat with client:', clientId, clientName);
    setSelectedClientForMessaging({ id: clientId, name: clientName });
    setShowMessages(true);
  };
  
  //inbox
  const [showInbox, setShowInbox] = useState(false);

  console.log("👤 [DEBUG] Current user:", user);
  console.log("👷 [DEBUG] Worker profile:", worker);
  console.log("⏳ [DEBUG] Loading state:", isLoading);

  useEffect(() => {
    const fetchPaymentStats = async () => {
      if (!worker?.id) return;
      
      try {
        setLoadingStats(true);
        
        const balanceResponse = await fetch(`http://localhost:3001/api/wallets/balance/${user?.id}`);
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json();
          setAvailableBalance(balanceData.balance || 0);
        }
        
        const bookingsResponse = await fetch(`http://localhost:3001/api/bookings/worker/${worker.id}`);
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          const completed = bookingsData.bookings.filter((b: any) => b.status === 'completed').length;
          setCompletedJobs(completed);
          const earnings = bookingsData.bookings
            .filter((b: any) => b.status === 'completed')
            .reduce((sum: number, b: any) => sum + (parseFloat(b.total_amount) || 0), 0);
          setTotalEarnings(earnings);
        }
        
        const transactionsResponse = await fetch(`http://localhost:3001/api/wallets/transactions/${user?.id}`);
        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json();
          const releaseTotal = transactionsData.transactions
            ?.filter((t: any) => t.type === 'escrow_release')
            .reduce((sum: number, t: any) => sum + (parseFloat(t.amount) || 0), 0) || 0;
          if (releaseTotal > totalEarnings) {
            setTotalEarnings(releaseTotal);
          }
        }
        
      } catch (error) {
        console.error('Error fetching payment stats:', error);
        toast({
          title: "Error",
          description: "Failed to load payment statistics",
          variant: "destructive",
        });
      } finally {
        setLoadingStats(false);
      }
    };
    
    fetchPaymentStats();
    
    const handleRefresh = () => {
      fetchPaymentStats();
    };
    
    window.addEventListener('refreshWallet', handleRefresh);
    window.addEventListener('bookingCompleted', handleRefresh);
    
    return () => {
      window.removeEventListener('refreshWallet', handleRefresh);
      window.removeEventListener('bookingCompleted', handleRefresh);
    };
  }, [worker?.id, user?.id]);

  if (isLoading) return <div>Loading...</div>;
  if (!worker) return <div>No worker profile found</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-2 mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {worker.name}</h1>
          <p className="text-muted-foreground">Manage your profile and bookings</p>
        </div>
        <div className="flex gap-3">
          <Button
			  variant="outline"
			  onClick={() => setShowInbox(true)}
			  className="flex items-center gap-2"
			>
			  <MessageSquare className="h-4 w-4" />
			  Messages
		</Button>
		  
          <Button
            onClick={() => setShowEditProfile(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Edit Profile
          </Button>
		  
		  {!worker.is_verified && (
			  <Button asChild variant="default" className="bg-green-600 hover:bg-green-700">
				<Link to="/worker-verification">Get Verified</Link>
			  </Button>
			)}
		</div>
      </div>

      <Tabs defaultValue="offers" className="space-y-4">
        <TabsList>
			<TabsTrigger value="offers" className="flex items-center gap-2">
				<Clock className="h-4 w-4" />
				Pending Offers
			</TabsTrigger>
			<TabsTrigger value="accepted" className="flex items-center gap-2">
				<CheckCircle className="h-4 w-4" />
				Accepted Offers
			</TabsTrigger>
			<TabsTrigger value="active" className="flex items-center gap-2">
				<AlertCircle className="h-4 w-4" />
				Active Jobs
			</TabsTrigger>
			<TabsTrigger value="payments" className="flex items-center gap-2">
				<CreditCard className="h-4 w-4" />
				Payments
			</TabsTrigger>
			<TabsTrigger value="reviews">Reviews</TabsTrigger>
			<TabsTrigger value="packages" className="flex items-center gap-2">
				<Package className="h-4 w-4" />
				Service Packages
			</TabsTrigger>
        </TabsList>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                Pending Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WorkerBookings
                statusFilter="offer_pending"
                workerId={worker.id}
                onMessageClick={handleOpenChatWithClient}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accepted">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-500" />
                Accepted Offers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WorkerBookings
				statusFilter="offer_accepted"
				workerId={worker.id}
				onMessageClick={handleOpenChatWithClient}
			  />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-green-500" />
                Active Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WorkerBookings
				statusFilter="active"
				workerId={worker.id}
				onMessageClick={handleOpenChatWithClient}
			  />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <div className="grid gap-6">
            <StripeConnectOnboarding 
              workerId={worker.id}
              onConnected={() => console.log('Stripe account connected!')}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WalletBalance />
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Payment Statistics</CardTitle>
                  <Button 
                    size="sm" 
                    onClick={() => setShowWithdrawDialog(true)}
                    className="gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Withdraw Funds
                  </Button>
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <div className="space-y-3">
                      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Earnings</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${totalEarnings.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">Gross before commission</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Available Balance</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ${availableBalance.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">In your wallet</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Platform Fee</p>
                        <p className="text-lg font-semibold">1%</p>
                        <p className="text-xs text-gray-500">
                          ~${(totalEarnings * 0.01).toFixed(2)} earned
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Completed Jobs</p>
                        <p className="text-lg font-semibold">{completedJobs}</p>
                        <p className="text-xs text-gray-500">Paid jobs</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <WithdrawFundsDialog
              isOpen={showWithdrawDialog}
              onClose={() => setShowWithdrawDialog(false)}
              workerId={worker.id}
              availableBalance={availableBalance}
              onSuccess={() => {
                setShowWithdrawDialog(false);
                window.dispatchEvent(new Event('refreshWallet'));
              }}
            />
            
            <RecentTransactions />
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkerComments workerId={worker.id} />
            </CardContent>
          </Card>
        </TabsContent>
		
		<TabsContent value="packages">
			<Card>
				<CardHeader>
				  <CardTitle>Service Packages</CardTitle>
				  <CardDescription>
						Create fixed-price service packages to help clients book quickly.
				  </CardDescription>
				</CardHeader>
				<CardContent>
				  <ServicePackagesManager workerId={worker.id} />
				</CardContent>
			</Card>
		</TabsContent>
	</Tabs>

	  console.log('🔍 Worker object before edit:', worker);
	  
      <EditProfileModal
		  isOpen={showEditProfile}
		  onClose={() => setShowEditProfile(false)}
		  worker={worker}
		  onUpdate={(updatedData) => {
			// Update the local worker state (optional, for immediate UI update)
			console.log('Worker updated:', updatedData);
			// You could also refresh the worker data here
		  }}
		/>

      {/* 🔴 General Messages Dialog – shows all conversations */}
      <MessagingDialog
        isOpen={showMessages}
        onClose={() => {
          setShowMessages(false);
          setSelectedClientForMessaging(null);
        }}
        workerId={worker.id}
        workerUserId={selectedClientForMessaging?.id || worker.userId || ''}
        workerName={selectedClientForMessaging?.name || worker.name}
      />
	  
	  console.log('🔍 Passing to InboxDialog - workerUserId:', worker.userId || 'user_sint_maarten_1');
	  
	  // Add the InboxDialog at the bottom of the component
		<InboxDialog
		  isOpen={showInbox}
		  onClose={() => setShowInbox(false)}
		  workerId={worker.id}
		  workerUserId={worker.userId || ''}
		  workerName={worker.name}
		/>
		
		<InboxDialog
		  isOpen={showInbox}
		  onClose={() => setShowInbox(false)}
		  workerId={worker.id}
		  workerUserId={worker.userId || 'user_sint_maarten_1'}
		  workerName={worker.name}
		/>
	  
    </div>
  );
}