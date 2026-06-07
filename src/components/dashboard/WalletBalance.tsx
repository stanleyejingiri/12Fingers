// src/components/dashboard/WalletBalance.tsx
/*import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddFundsDialog } from "./AddFundsDialog";

export function WalletBalance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showAddFunds, setShowAddFunds] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchWalletBalance();
    }
  }, [user]);

  const fetchWalletBalance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://one2fingers-backend.onrender.com/api/wallets/balance/${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch wallet balance');
      }
      
      const data = await response.json();
      setBalance(data.balance || 0);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet balance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = (amount: number) => {
    // This will be implemented in AddFundsDialog
    console.log('Adding funds:', amount);
    fetchWalletBalance(); // Refresh balance
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="h-5 w-5" />
              Wallet Balance
            </CardTitle>
            <CardDescription>
              Available funds for bookings
            </CardDescription>
          </div>
          <Button 
            size="sm" 
            onClick={() => setShowAddFunds(true)}
            className="gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            Add Funds
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${balance.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Funds are held in escrow when booking workers
          </p>
        </CardContent>
      </Card>

      <AddFundsDialog
        open={showAddFunds}
        onOpenChange={setShowAddFunds}
        onAddFunds={handleAddFunds}
        userId={user?.id}
      />
    </>
  );
}*/

// src/components/dashboard/WalletBalance.tsx
/*import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, PlusCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddFundsDialog } from "./AddFundsDialog";

export function WalletBalance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);

  const fetchWalletBalance = async () => {
    if (!user?.id) return;
    
    try {
      setRefreshing(true);
      const response = await fetch(`https://one2fingers-backend.onrender.com/api/wallets/balance/${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch wallet balance');
      }
      
      const data = await response.json();
      setBalance(data.balance || 0);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet balance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (user?.id) {
      fetchWalletBalance();
    }
  }, [user]);

  // Listen for refresh events
  useEffect(() => {
    const handleRefreshEvent = () => {
      console.log('🔄 Wallet balance refresh triggered');
      fetchWalletBalance();
    };

    // Listen for custom events
    window.addEventListener('refreshWallet', handleRefreshEvent);
    window.addEventListener('bookingCompleted', handleRefreshEvent);
    
    // Also refresh when window gains focus (user comes back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchWalletBalance();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('refreshWallet', handleRefreshEvent);
      window.removeEventListener('bookingCompleted', handleRefreshEvent);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleAddFunds = (amount: number) => {
    console.log('Adding funds:', amount);
    fetchWalletBalance(); // Refresh balance
  };

  const handleRefresh = () => {
    fetchWalletBalance();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="h-5 w-5" />
              Wallet Balance
            </CardTitle>
            <CardDescription>
              Available funds for bookings
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button 
              size="sm" 
              onClick={() => setShowAddFunds(true)}
              className="gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add Funds
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${balance.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Funds are held in escrow when booking workers
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
        </CardContent>
      </Card>

      <AddFundsDialog
        open={showAddFunds}
        onOpenChange={setShowAddFunds}
        onAddFunds={handleAddFunds}
        userId={user?.id}
      />
    </>
  );
}*/

// src/components/dashboard/WalletBalance.tsx
/*import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, PlusCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddFundsDialog } from "./AddFundsDialog";

export function WalletBalance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);

  const fetchWalletBalance = async () => {
    if (!user?.id) return;
    
    try {
      setRefreshing(true);
      const response = await fetch(`https://one2fingers-backend.onrender.com/api/wallets/balance/${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch wallet balance');
      }
      
      const data = await response.json();
      setBalance(data.balance || 0);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet balance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (user?.id) {
      fetchWalletBalance();
    }
  }, [user]);

  // Listen for refresh events
  useEffect(() => {
    const handleRefreshEvent = () => {
      console.log('🔄 Wallet balance refresh triggered');
      fetchWalletBalance();
    };

    // Listen for custom events
    window.addEventListener('refreshWallet', handleRefreshEvent);
    window.addEventListener('bookingCompleted', handleRefreshEvent);
    
    // Also refresh when window gains focus (user comes back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchWalletBalance();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('refreshWallet', handleRefreshEvent);
      window.removeEventListener('bookingCompleted', handleRefreshEvent);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleAddFunds = (amount: number) => {
    console.log('Adding funds:', amount);
    fetchWalletBalance(); // Refresh balance
  };

  const handleRefresh = () => {
    fetchWalletBalance();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Wallet className="h-5 w-5" />
              Wallet Balance
            </CardTitle>
            <CardDescription>
              Available funds for bookings
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button 
              size="sm" 
              onClick={() => setShowAddFunds(true)}
              className="gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              Add Funds
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${balance.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Funds are held in escrow when booking workers
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
        </CardContent>
      </Card>

      <AddFundsDialog
        open={showAddFunds}
        onOpenChange={setShowAddFunds}
        onAddFunds={handleAddFunds}
        userId={user?.id}
      />
    </>
  );
}*/

// src/components/dashboard/WalletBalance.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, PlusCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddFundsDialog } from "./AddFundsDialog";

export function WalletBalance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);

  const fetchOrCreateWallet = async () => {
    if (!user?.id) return;
    
    try {
      setRefreshing(true);
      // First try to get balance
      const response = await fetch(`https://one2fingers-backend.onrender.com/api/wallets/balance/${user.id}`);
      
      if (response.status === 404) {
        // Wallet doesn't exist, create one
        console.log("💰 Wallet not found, creating new wallet...");
        const createResponse = await fetch(`https://one2fingers-backend.onrender.com/api/wallets/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id })
        });
        
        if (!createResponse.ok) {
          throw new Error('Failed to create wallet');
        }
        
        // Now fetch the new wallet balance (should be 0)
        const newResponse = await fetch(`https://one2fingers-backend.onrender.com/api/wallets/balance/${user.id}`);
        const newData = await newResponse.json();
        setBalance(newData.balance || 0);
        console.log("✅ Wallet created with balance: 0");
      } 
      else if (response.ok) {
        const data = await response.json();
        setBalance(data.balance || 0);
      } else {
        throw new Error('Failed to fetch wallet balance');
      }
    } catch (error: any) {
      console.error('Error with wallet:', error);
      toast({
        title: "Wallet Error",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      // Set a default balance for UI
      setBalance(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (user?.id) {
      fetchOrCreateWallet();
    }
  }, [user]);

  // Listen for refresh events
  useEffect(() => {
    const handleRefreshEvent = () => {
      console.log('🔄 Wallet balance refresh triggered');
      fetchOrCreateWallet();
    };

    window.addEventListener('refreshWallet', handleRefreshEvent);
    window.addEventListener('bookingCompleted', handleRefreshEvent);
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchOrCreateWallet();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('refreshWallet', handleRefreshEvent);
      window.removeEventListener('bookingCompleted', handleRefreshEvent);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleAddFunds = (amount: number) => {
    console.log('Adding funds:', amount);
    fetchOrCreateWallet(); // Refresh balance
  };

  const handleRefresh = () => {
    fetchOrCreateWallet();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
		  <div>
			<CardTitle className="flex items-center gap-2 text-lg">
			  <Wallet className="h-5 w-5" />
			  Wallet Balance
			</CardTitle>
			<CardDescription>
			  Available funds for bookings
			</CardDescription>
		  </div>
		  <div className="flex items-center gap-2">
			
			<Button 
			  size="sm" 
			  onClick={() => setShowAddFunds(true)}
			  className="gap-1 h-8 px-2"
			>
			  <PlusCircle className="h-3 w-3" />
			  <span className="hidden sm:inline">Add Funds</span>
			</Button>
		  </div>
		</CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${balance.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Funds are held in escrow when booking workers
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Last updated: {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
        </CardContent>
      </Card>

      
		<AddFundsDialog
		  open={showAddFunds}
		  onOpenChange={setShowAddFunds}
		  onAddFunds={handleAddFunds}
		  userId={user?.id}
		  userEmail={user?.email}
		/>
    </>
  );
}
