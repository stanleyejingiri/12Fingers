// src/pages/AdminDashboard.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "@/components/ui/alert";
import { FileText } from "lucide-react";
import { 
  ArrowLeft, 
  DollarSign, 
  Users, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Eye,
  Calendar,
  AlertTriangle,
  WifiOff,
  Home
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

interface Withdrawal {
  id: number;
  worker_id: string;
  worker_name: string;
  amount: number | string;
  status: string;
  stripe_account_id: string;
  requested_at: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  wallet_balance: number;
  total_bookings: number;
  completed_bookings: number;
  status?: string;
  suspension_reason?: string;
}

interface Worker {
  id: string;
  name: string;
  category: string;
  is_verified: boolean;
  stripe_connected: boolean;
  created_at: string;
  wallet_balance: number;
  total_jobs: number;
  completed_jobs: number;
  total_earnings: number;
  status?: string;
  suspension_reason?: string;
}

interface Booking {
  id: string;
  client_name: string;
  worker_name: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  status: string;
  created_at: string;
  payment_method: string;
}

interface PlatformStats {
  total_users: number;
  total_workers: number;
  total_bookings: number;
  completed_bookings: number;
  in_progress_bookings: number;
  pending_bookings: number;
  total_commission: number;
  pending_withdrawals: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [pendingWithdrawals, setPendingWithdrawals] = useState<Withdrawal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  
  // User suspension state
  const [showSuspendDialog, setShowSuspendDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  
  // Worker suspension state
  const [showWorkerSuspendDialog, setShowWorkerSuspendDialog] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [selectedWorkerName, setSelectedWorkerName] = useState('');
  
  const [suspendReason, setSuspendReason] = useState('');
  
	const [loading, setLoading] = useState({
		withdrawals: true,
		users: true,
		workers: true,
		bookings: true,
		stats: true
	  });
  
	const [processingId, setProcessingId] = useState<number | null>(null);
  
	//Add these state variables with your other useState declarations:
	const [pendingVerificationRequests, setPendingVerificationRequests] = useState<any[]>([]);
	const [loadingVerification, setLoadingVerification] = useState(false);
	const [selectedRequest, setSelectedRequest] = useState<any>(null);
	const [adminNotes, setAdminNotes] = useState("");
	const [showRejectDialog, setShowRejectDialog] = useState(false);
	const [rejectReason, setRejectReason] = useState("");
	const [verifiedWorkersCount, setVerifiedWorkersCount] = useState(0);
	
  // Admin check
  const isAdmin = user?.id === 'c8008077-f7ab-11f0-b194-8d6e8344ca2c';
  
  const formatAmount = (amount: number | string): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Retry fetch function with exponential backoff
  const fetchWithRetry = async (url: string, retries = 3): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.log(`Attempt ${i + 1} failed for ${url}, ${retries - i - 1} retries left`);
        
        if (i === retries - 1) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
  };

  const handleFetchError = (error: any, endpoint: string) => {
    console.error(`❌ Error fetching ${endpoint}:`, error);
    setApiErrors(prev => [...prev, endpoint]);
    
    toast({
      title: "Connection Error",
      description: `Failed to load ${endpoint}. ${error.message || 'Please try again.'}`,
      variant: "destructive",
    });
  };

  useEffect(() => {
    if (!user) return;
    
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    
    fetchAllData();
  }, [user, isAdmin]);

  	const fetchAllData = async () => {
	  setApiErrors([]);
	  await Promise.all([
		fetchPendingWithdrawals(),
		fetchUsers(),
		fetchWorkers(),
		fetchBookings(),
		fetchStats(),
		fetchVerificationRequests(), // ← add this
		fetchVerifiedWorkersCount(), // ← add this
	  ]);
	};

  const fetchPendingWithdrawals = async () => {
    try {
      setLoading(prev => ({ ...prev, withdrawals: true }));
      const data = await fetchWithRetry('http://localhost:3001/api/withdrawals/pending');
      setPendingWithdrawals(data.withdrawals || []);
    } catch (error) {
      handleFetchError(error, 'withdrawals');
    } finally {
      setLoading(prev => ({ ...prev, withdrawals: false }));
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true }));
      const data = await fetchWithRetry('http://localhost:3001/api/admin/users');
      setUsers(data.users || []);
    } catch (error) {
      handleFetchError(error, 'users');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchWorkers = async () => {
    try {
      setLoading(prev => ({ ...prev, workers: true }));
      const data = await fetchWithRetry('http://localhost:3001/api/admin/workers');
      setWorkers(data.workers || []);
    } catch (error) {
      handleFetchError(error, 'workers');
    } finally {
      setLoading(prev => ({ ...prev, workers: false }));
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(prev => ({ ...prev, bookings: true }));
      const data = await fetchWithRetry('http://localhost:3001/api/bookings');
      setBookings(data.bookings || []);
    } catch (error) {
      handleFetchError(error, 'bookings');
    } finally {
      setLoading(prev => ({ ...prev, bookings: false }));
    }
  };

	const fetchStats = async () => {
		try {
		  setLoading(prev => ({ ...prev, stats: true }));
		  const data = await fetchWithRetry('http://localhost:3001/api/admin/stats');
		  setStats(data.stats || null);
		} catch (error) {
		  handleFetchError(error, 'statistics');
		} finally {
		  setLoading(prev => ({ ...prev, stats: false }));
		}
	};
	
	const fetchVerificationRequests = async () => {
		try {
		setLoadingVerification(true);
		const response = await fetch('http://localhost:3001/api/verification/pending');
		const data = await response.json();
		if (data.success) {
		  setPendingVerificationRequests(data.requests || []);
		}
	  } catch (error) {
		console.error('Error fetching verification requests:', error);
	  } finally {
		setLoadingVerification(false);
	  }
	};
	
	const fetchVerifiedWorkersCount = async () => {
	  try {
		const response = await fetch('http://localhost:3001/api/admin/workers');
		const data = await response.json();
		if (data.success) {
		  const verifiedCount = data.workers.filter((w: any) => w.is_verified === 1).length;
		  setVerifiedWorkersCount(verifiedCount);
		}
	  } catch (error) {
		console.error('Error fetching verified workers count:', error);
	  }
	};


  const handleProcessWithdrawal = async (withdrawalId: number, action: 'approve' | 'reject') => {
    try {
      setProcessingId(withdrawalId);
      
      const response = await fetch(`http://localhost:3001/api/withdrawals/process/${withdrawalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          admin_id: user?.id,
          action,
          reason: action === 'reject' ? 'Rejected by admin' : undefined
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to process withdrawal');
      }

      const result = await response.json();
      
      toast({
        title: action === 'approve' ? "✅ Withdrawal Approved" : "❌ Withdrawal Rejected",
        description: result.message,
        variant: action === 'approve' ? "default" : "destructive",
      });

      await Promise.all([
        fetchPendingWithdrawals(),
        fetchWorkers(),
        fetchStats()
      ]);
      
    } catch (error: any) {
      console.error('Process withdrawal error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  // User suspension handlers
  const handleSuspendUser = async () => {
    if (!selectedUserId || !suspendReason.trim()) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/admin/users/${selectedUserId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: suspendReason,
          adminId: user?.id
        })
      });
      
      if (!response.ok) throw new Error('Failed to suspend user');
      
      toast({
        title: "User Suspended",
        description: `${selectedUserName} has been suspended.`,
        variant: "default",
      });
      
      setShowSuspendDialog(false);
      setSuspendReason('');
      await fetchUsers();
      
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === selectedUserId 
            ? { ...u, status: 'suspended', suspension_reason: suspendReason }
            : u
        )
      );
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUnsuspendUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/users/${userId}/unsuspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: user?.id })
      });
      
      if (!response.ok) throw new Error('Failed to unsuspend user');
      
      toast({
        title: "User Reactivated",
        description: "User account has been reactivated.",
        variant: "default",
      });
      
      await fetchUsers();
      
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === userId 
            ? { ...u, status: 'active', suspension_reason: undefined }
            : u
        )
      );
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Worker suspension handlers
  const handleSuspendWorker = async () => {
    if (!selectedWorkerId || !suspendReason.trim()) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/admin/workers/${selectedWorkerId}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: suspendReason,
          adminId: user?.id
        })
      });
      
      if (!response.ok) throw new Error('Failed to suspend worker');
      
      toast({
        title: "Worker Suspended",
        description: `${selectedWorkerName} has been suspended.`,
        variant: "default",
      });
      
      setShowWorkerSuspendDialog(false);
      setSuspendReason('');
      fetchWorkers();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUnsuspendWorker = async (workerId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/workers/${workerId}/unsuspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: user?.id })
      });
      
      if (!response.ok) throw new Error('Failed to unsuspend worker');
      
      toast({
        title: "Worker Reactivated",
        description: "Worker account has been reactivated.",
        variant: "default",
      });
      
      fetchWorkers();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };
	
	const handleApproveVerification = async (requestId: string) => {
		try {
			const response = await fetch(`http://localhost:3001/api/verification/approve/${requestId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ admin_id: user?.id, notes: adminNotes }),
			});
			const data = await response.json();
				if (data.success) {
				toast({ title: "Approved", description: "Worker verification approved" });
				fetchVerificationRequests();
				fetchWorkers(); // Refresh workers list to update verified status
				setAdminNotes("");
				setSelectedRequest(null);
			} else {
			throw new Error(data.error);
			}
		} catch (error: any) {
			toast({ title: "Error", description: error.message, variant: "destructive" });
		}
	};

	const handleRejectVerification = async (requestId: string) => {
		if (!rejectReason.trim()) {
			toast({ title: "Error", description: "Please provide a reason for rejection", variant: "destructive" });
			return;
		}
		try {
			const response = await fetch(`http://localhost:3001/api/verification/reject/${requestId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ admin_id: user?.id, reason: rejectReason }),
		});
		const data = await response.json();
			if (data.success) {
			toast({ title: "Rejected", description: "Worker verification rejected" });
			fetchVerificationRequests();
			setRejectReason("");
			setShowRejectDialog(false);
			setSelectedRequest(null);
		} else {
		  throw new Error(data.error);
		}
	} catch (error: any) {
		toast({ title: "Error", description: error.message, variant: "destructive" });
	  }
	};
	
	const getStatusBadge = (status: string) => {
		const variants: { [key: string]: string } = {
		  'pending': 'bg-gray-100 text-gray-800',
		  'offer_pending': 'bg-yellow-100 text-yellow-800',
		  'offer_accepted': 'bg-blue-100 text-blue-800',
		  'confirmed': 'bg-purple-100 text-purple-800',
		  'in_progress': 'bg-green-100 text-green-800',
		  'awaiting_confirmation': 'bg-orange-100 text-orange-800',
		  'completed': 'bg-green-600 text-white',
		  'cancelled': 'bg-red-100 text-red-800'
		};
		return variants[status] || 'bg-gray-100 text-gray-800';
	};

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const renderErrorBanner = () => {
    if (apiErrors.length === 0) return null;
    
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
        <WifiOff className="h-5 w-5 text-red-500 mt-0.5" />
        <div>
          <h3 className="font-semibold text-red-800">Connection Issues</h3>
          <p className="text-sm text-red-600">
            Failed to load: {apiErrors.join(', ')}. 
            <button 
              onClick={fetchAllData}
              className="ml-2 underline hover:no-underline font-medium"
            >
              Retry
            </button>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Navigation Buttons */}
      <div className="flex gap-2 mb-6">
        <Button asChild variant="ghost" size="sm">
			<Link to="/">
				<ArrowLeft className="h-4 w-4 mr-1" />
				Back
			</Link>
		</Button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchAllData}
          className="flex items-center gap-2"
          disabled={Object.values(loading).some(l => l)}
        >
          <RefreshCw className={`h-4 w-4 ${Object.values(loading).some(l => l) ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </div>

      {renderErrorBanner()}

      {stats && !apiErrors.includes('statistics') && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-500" />
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
              <p className="text-2xl font-bold">{stats.total_users}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-green-500" />
                <p className="text-sm text-muted-foreground">Total Workers</p>
              </div>
              <p className="text-2xl font-bold">{stats.total_workers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-purple-500" />
                <p className="text-sm text-muted-foreground">Platform Revenue</p>
              </div>
              <p className="text-2xl font-bold">${formatAmount(stats.total_commission)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <p className="text-sm text-muted-foreground">Pending Withdrawals</p>
              </div>
              <p className="text-2xl font-bold">{stats.pending_withdrawals}</p>
            </CardContent>
          </Card>
        </div>
      )}

    <Tabs defaultValue="withdrawals" className="space-y-4">
        <TabsList>
			  <TabsTrigger value="withdrawals" className="flex items-center gap-2">
				<DollarSign className="h-4 w-4" />
				Withdrawals ({pendingWithdrawals.length})
			  </TabsTrigger>
			  <TabsTrigger value="users" className="flex items-center gap-2">
				<Users className="h-4 w-4" />
				Users ({users.length})
			  </TabsTrigger>
			  <TabsTrigger value="workers" className="flex items-center gap-2">
				<Briefcase className="h-4 w-4" />
				Workers ({workers.length})
			  </TabsTrigger>
			  <TabsTrigger value="bookings" className="flex items-center gap-2">
				<Calendar className="h-4 w-4" />
				Bookings ({bookings.length})
			  </TabsTrigger>
			  <TabsTrigger value="verification" className="flex items-center gap-2">
				<Shield className="h-4 w-4" />
				Verification Requests ({pendingVerificationRequests.length})
				<Badge variant="secondary" className="ml-1 bg-green-100 text-green-800">
					{verifiedWorkersCount} verified
				</Badge>
			  </TabsTrigger>
		</TabsList>

        {/* Withdrawals Tab */}
        <TabsContent value="withdrawals">
          <Card>
				<CardHeader>
				  <CardTitle className="flex items-center gap-2">
					<Clock className="h-5 w-5 text-yellow-500" />
					Pending Withdrawal Requests
				  </CardTitle>
				</CardHeader>
				<CardContent>
					{loading.withdrawals ? (
						<div className="space-y-3">
							{[1,2,3].map(i => (
								<div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
							))}
						</div>
					  ) : apiErrors.includes('withdrawals') ? (
						<div className="text-center py-8">
						  <AlertTriangle className="h-12 w-12 text-red-300 mx-auto mb-3" />
						  <p className="text-gray-500">Failed to load withdrawals</p>
						  <Button variant="outline" size="sm" onClick={fetchPendingWithdrawals} className="mt-2">
							<RefreshCw className="h-3 w-3 mr-2" />
							Retry
						  </Button>
						</div>
					  ) : pendingWithdrawals.length === 0 ? (
						<div className="text-center py-8">
						  <CheckCircle className="h-12 w-12 text-green-300 mx-auto mb-3" />
						  <p className="text-gray-500">No pending withdrawals</p>
						</div>
					  ) : (
					<div className="space-y-4">
						{pendingWithdrawals.map((withdrawal) => (
							<Card key={withdrawal.id} className="p-4 border-l-4 border-l-yellow-500">
								<div className="flex justify-between items-start">
									<div>
									  <h3 className="font-semibold text-lg">
										{withdrawal.worker_name}
									  </h3>
									  <p className="text-sm text-gray-600">
										Requested: {format(new Date(withdrawal.requested_at), 'PPP p')}
									  </p>
									  <p className="text-xs text-gray-500">
										Worker ID: {withdrawal.worker_id.substring(0, 8)}...
									  </p>
									</div>
									<div className="text-right">
									  <p className="text-2xl font-bold text-blue-600">
										${formatAmount(withdrawal.amount)}
									  </p>
									  <Badge className="bg-yellow-100 text-yellow-800">
										{withdrawal.status}
									  </Badge>
									</div>
								</div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => handleProcessWithdrawal(withdrawal.id, 'approve')}
                          disabled={processingId === withdrawal.id}
                          className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                        >
                          {processingId === withdrawal.id ? (
                            <>Processing...</>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Approve & Pay
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleProcessWithdrawal(withdrawal.id, 'reject')}
                          disabled={processingId === withdrawal.id}
                          className="flex-1 gap-2 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                All Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.users ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : apiErrors.includes('users') ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-red-300 mx-auto mb-3" />
                  <p className="text-gray-500">Failed to load users</p>
                  <Button variant="outline" size="sm" onClick={fetchUsers} className="mt-2">
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No users found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <Card key={user.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Joined: {format(new Date(user.created_at), 'PPP')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            ${formatAmount(user.wallet_balance)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.total_bookings} bookings ({user.completed_bookings} completed)
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-2 border-t pt-3">
                        {user.status === 'suspended' ? (
                          <>
                            <Badge className="bg-red-100 text-red-800">Suspended</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnsuspendUser(user.id)}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Reactivate
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUserId(user.id);
                              setSelectedUserName(user.name);
                              setShowSuspendDialog(true);
                            }}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Suspend
                          </Button>
                        )}
                        {user.suspension_reason && (
                          <p className="text-xs text-red-600 ml-2">
                            Reason: {user.suspension_reason}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workers Tab */}
        <TabsContent value="workers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-500" />
                All Workers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.workers ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : apiErrors.includes('workers') ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-red-300 mx-auto mb-3" />
                  <p className="text-gray-500">Failed to load workers</p>
                  <Button variant="outline" size="sm" onClick={fetchWorkers} className="mt-2">
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : workers.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No workers found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {workers.map((worker) => (
                    <Card key={worker.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{worker.name}</h3>
                            {worker.is_verified ? (
                              <Badge className="bg-green-100 text-green-800">Verified</Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                            )}
                            {worker.stripe_connected && (
                              <Badge className="bg-blue-100 text-blue-800">Stripe Connected</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{worker.category}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Joined: {format(new Date(worker.created_at), 'PPP')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            ${formatAmount(worker.wallet_balance)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {worker.completed_jobs}/{worker.total_jobs} jobs completed
                          </p>
                          <p className="text-xs font-semibold text-blue-600">
                            Earned: ${formatAmount(worker.total_earnings)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center gap-2 border-t pt-3">
                        {worker.status === 'suspended' ? (
                          <>
                            <Badge className="bg-red-100 text-red-800">Suspended</Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnsuspendWorker(worker.id)}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Reactivate
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedWorkerId(worker.id);
                              setSelectedWorkerName(worker.name);
                              setShowWorkerSuspendDialog(true);
                            }}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Suspend
                          </Button>
                        )}
                        {worker.suspension_reason && (
                          <p className="text-xs text-red-600 ml-2">
                            Reason: {worker.suspension_reason}
                          </p>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                All Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading.bookings ? (
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : apiErrors.includes('bookings') ? (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-red-300 mx-auto mb-3" />
                  <p className="text-gray-500">Failed to load bookings</p>
                  <Button variant="outline" size="sm" onClick={fetchBookings} className="mt-2">
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No bookings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <Card key={booking.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{booking.worker_name}</h3>
                            <span className="text-sm text-gray-500">for</span>
                            <h3 className="font-semibold">{booking.client_name}</h3>
                          </div>
                          <p className="text-sm text-gray-600">
                            {format(new Date(booking.booking_date), 'PPP')} • {booking.start_time} - {booking.end_time}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Created: {format(new Date(booking.created_at), 'PPP')}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusBadge(booking.status)}>
                            {booking.status}
                          </Badge>
                          <p className="text-lg font-bold text-blue-600 mt-2">
                            ${formatAmount(booking.total_amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Payment: {booking.payment_method || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
		
			{/* Verification Tab */}
<TabsContent value="verification">
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-blue-500" />
        Verification Requests
      </CardTitle>
      <CardDescription>Review and process worker verification requests</CardDescription>
    </CardHeader>
    <CardContent>
      {loadingVerification ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>)}
        </div>
      ) : pendingVerificationRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No pending verification requests</div>
      ) : (
        <div className="space-y-4">
          {pendingVerificationRequests.map((req) => (
            <Card key={req.id} className="p-4 border-l-4 border-l-yellow-500">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{req.worker_name}</h3>
                  
                  {/* Identity Information */}
                  <div className="bg-gray-50 p-3 rounded-md space-y-1">
                    <p className="text-sm font-medium">Identity Information:</p>
                    <p className="text-sm">Legal Name: <span className="font-semibold">{req.legal_name}</span></p>
                    <p className="text-sm">ID Type: {req.id_type} | ID Number: {req.id_number}</p>
                    {req.document_url && (
                      <div className="mt-2">
                        <a 
                          href={`http://localhost:3001${req.document_url}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          View Uploaded Document
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {/* Business Information (if provided) */}
                  {(req.business_name || req.business_type) && (
                    <div className="bg-gray-50 p-3 rounded-md space-y-1">
                      <p className="text-sm font-medium">Business Information:</p>
                      {req.business_name && <p className="text-sm">Business Name: {req.business_name}</p>}
                      {req.business_type && <p className="text-sm">Business Type: {req.business_type}</p>}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-400">Requested: {new Date(req.requested_at).toLocaleDateString()}</p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedRequest(req);
                      setAdminNotes("");
                      handleApproveVerification(req.id);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedRequest(req);
                      setShowRejectDialog(true);
                    }}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>
	</Tabs>

      {/* Suspend User Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
			<DialogContent>
			  <DialogHeader>
				<DialogTitle>Suspend User</DialogTitle>
				<DialogDescription>
				  Are you sure you want to suspend {selectedUserName}? They will not be able to log in.
				</DialogDescription>
			  </DialogHeader>
			  
			  <div className="space-y-4 py-4">
				<div className="space-y-2">
				  <Label htmlFor="reason">Suspension Reason</Label>
				  <textarea
					id="reason"
					className="w-full min-h-[100px] p-3 border rounded-md"
					placeholder="Enter reason for suspension..."
					value={suspendReason}
					onChange={(e) => setSuspendReason(e.target.value)}
				  />
				</div>
				
				<div className="flex gap-2 justify-end">
				  <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
					Cancel
				  </Button>
				  <Button 
					onClick={handleSuspendUser}
					disabled={!suspendReason.trim()}
					className="bg-red-600 hover:bg-red-700"
				  >
					Suspend User
				  </Button>
				</div>
			  </div>
			</DialogContent>
      </Dialog>

      {/* Suspend Worker Dialog */}
      <Dialog open={showWorkerSuspendDialog} onOpenChange={setShowWorkerSuspendDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend Worker</DialogTitle>
            <DialogDescription>
              Are you sure you want to suspend {selectedWorkerName}? They will not be able to log in or accept new jobs.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="worker-reason">Suspension Reason</Label>
              <textarea
                id="worker-reason"
                className="w-full min-h-[100px] p-3 border rounded-md"
                placeholder="Enter reason for suspension..."
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowWorkerSuspendDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSuspendWorker}
                disabled={!suspendReason.trim()}
                className="bg-red-600 hover:bg-red-700"
              >
                Suspend Worker
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
	  
		
		{/* Reject Verification Dialog */}
		<Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
		  <DialogContent>
			<DialogHeader>
			  <DialogTitle>Reject Verification Request</DialogTitle>
			  <DialogDescription>
				Please provide a reason for rejecting this verification request.
				The worker will see this reason and may reapply.
			  </DialogDescription>
			</DialogHeader>
			<div className="space-y-4 py-4">
			  <div className="space-y-2">
				<Label htmlFor="reject-reason">Rejection Reason</Label>
				<textarea
				  id="reject-reason"
				  className="w-full min-h-[100px] p-3 border rounded-md"
				  placeholder="Enter reason for rejection..."
				  value={rejectReason}
				  onChange={(e) => setRejectReason(e.target.value)}
				/>
			  </div>
			  <div className="flex gap-2 justify-end">
				<Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancel</Button>
				<Button 
				  onClick={() => selectedRequest && handleRejectVerification(selectedRequest.id)}
				  className="bg-red-600 hover:bg-red-700"
				>
				  Confirm Rejection
				</Button>
			  </div>
			</div>
		  </DialogContent>
		</Dialog>
	  
    </div>
  );
}