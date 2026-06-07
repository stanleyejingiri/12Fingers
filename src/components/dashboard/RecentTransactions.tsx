// src/components/dashboard/RecentTransactions.tsx
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownCircle, ArrowUpCircle, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'escrow_hold' | 'escrow_release';
  amount: number;
  description: string;
  booking_id?: string;
  booking_date?: string;
  worker_name?: string;
  created_at: string;
}

export function RecentTransactions() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchTransactions();
    }
  }, [user]);

  
  const fetchTransactions = async () => {
  try {
    setLoading(true);
    const response = await fetch(`http://localhost:3001/api/wallets/transactions/${user.id}?limit=10`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    const data = await response.json();
    console.log('📊 RAW API Response:', data); // 🔴 See full response
    console.log('📊 Transactions array:', data.transactions); // 🔴 See transactions
    if (data.transactions && data.transactions.length > 0) {
      console.log('📊 First transaction type:', data.transactions[0].type); // 🔴 Check type value
    }
    setTransactions(data.transactions || []);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    toast({
      title: "Error",
      description: "Failed to load transactions",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'credit': return <ArrowDownCircle className="h-4 w-4 text-green-500" />;
      case 'debit': return <ArrowUpCircle className="h-4 w-4 text-red-500" />;
      case 'escrow_hold': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'escrow_release': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'credit': return 'text-green-600';
      case 'debit': return 'text-red-600';
      case 'escrow_hold': return 'text-yellow-600';
      case 'escrow_release': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>No transactions yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your transaction history will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Last 10 wallet activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <p className="font-medium text-sm">
				  {transaction.description.length > 40 
					? transaction.description.substring(0, 40) + '...' 
					: transaction.description}
				  </p>
                  {transaction.worker_name && (
                    <p className="text-xs text-muted-foreground">
                      {transaction.worker_name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                  {transaction.type === 'credit' || transaction.type === 'escrow_release' ? '+' : '-'}
                  ${transaction.amount.toFixed(2)}
                </p>
                <Badge variant="outline" className="text-xs mt-1">
                  {transaction.type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}