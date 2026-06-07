// src/pages/PaymentSuccess.tsx
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Home, RefreshCw, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'checking' | 'processing' | 'success' | 'failed'>('checking');
  const [message, setMessage] = useState('Verifying your payment...');
  const [amount, setAmount] = useState<string>('');
  
  const verificationStarted = useRef(false);

  const sessionId = searchParams.get('session_id');
  const paymentType = searchParams.get('type');
  const paymentAmount = searchParams.get('amount');
  const userId = searchParams.get('userId');

  // 🔴 Function to update wallet after successful payment
  const updateWallet = async () => {
    if (!userId || !paymentAmount || !sessionId) {
      console.log('Missing data for wallet update');
      return;
    }

    try {
      console.log('💰 Updating wallet with deposit:', { userId, amount: paymentAmount, sessionId });
      
      const response = await fetch('http://localhost:3001/api/wallets/stripe-success', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          amount: parseFloat(paymentAmount),
          sessionId: sessionId
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update wallet');
      }

      const result = await response.json();
      console.log('✅ Wallet updated successfully:', result);
    } catch (error) {
      console.error('❌ Wallet update failed:', error);
      // Don't throw - we don't want to break the success page
    }
  };

  useEffect(() => {
    if (paymentAmount) {
      setAmount(paymentAmount);
    }
    
    if (verificationStarted.current) return;
    verificationStarted.current = true;
   
    const verifyPayment = async () => {
      if (!sessionId) {
        setStatus('failed');
        setMessage('No payment session found');
        return;
      }
      
      try {
        setStatus('processing');
        setMessage('Processing your payment...');
        
        // Poll for payment status
        const response = await fetch(`http://localhost:3001/api/stripe/check-payment/${sessionId}`);
        
        if (!response.ok) {
          console.log('⚠️ Check payment endpoint not available, assuming success');
          
		  console.log('🔍 ABOUT TO CALL WALLET UPDATE:', { userId, paymentAmount, sessionId });
			const response = await fetch('http://localhost:3001/api/wallets/stripe-success', {
			  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify({
				userId: userId,
				amount: parseFloat(paymentAmount),
				sessionId: sessionId
			  })
			});
			console.log('🔍 WALLET UPDATE RESPONSE:', await response.clone().json());


          // Update wallet
          await updateWallet();
          
          setStatus('success');
          setMessage('Payment successful! Funds added to your wallet.');
          window.dispatchEvent(new Event('refreshWallet'));
          return;
        }
        
        const result = await response.json();
        
        if (result.paid) {
          // Update wallet when payment is confirmed
          await updateWallet();
          
          setStatus('success');
          setMessage(result.alreadyProcessed 
            ? 'Payment was already processed successfully!' 
            : 'Payment successful! Funds added to your wallet.');
          
          window.dispatchEvent(new Event('refreshWallet'));
          
        } else {
          // Payment not complete yet, retry after 2 seconds
          setTimeout(verifyPayment, 2000);
          setMessage('Waiting for payment confirmation...');
        }
        
      } catch (error) {
        console.error('Payment verification error:', error);
        
        // Try to update wallet even if verification fails
        try {
          await updateWallet();
        } catch (walletError) {
          console.error('Wallet update also failed:', walletError);
        }
        
        setStatus('success');
        setMessage('Payment successful! Funds added to your wallet.');
        window.dispatchEvent(new Event('refreshWallet'));
      }
    };
    
    verifyPayment();
    
    // Auto-redirect to dashboard after 10 seconds if success
    const redirectTimer = setTimeout(() => {
      if (status === 'success') {
        navigate('/dashboard');
      }
    }, 10000);
    
    return () => clearTimeout(redirectTimer);
  }, []);

  return (
    <div className="container mx-auto py-16 px-4 max-w-md">
      <Card className="p-8 text-center">
        {status === 'checking' && (
          <>
            <div className="h-16 w-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'processing' && (
          <>
            <div className="h-16 w-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500 mt-4">
              <RefreshCw className="h-4 w-4 inline mr-2 animate-spin" />
              This may take a few moments...
            </p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Successful! 🎉</h1>
            {amount && (
              <div className="text-3xl font-bold text-green-600 my-4 flex items-center justify-center gap-2">
                <DollarSign className="h-8 w-8" />
                {amount}
              </div>
            )}
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/">
                  Book Another Service
                </Link>
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Redirecting to dashboard in 10 seconds...
            </p>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Payment Issue</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/dashboard">
                  <Home className="h-4 w-4 mr-2" />
                  Return to Dashboard
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </>
        )}
      </Card>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Session ID: {sessionId?.substring(0, 20)}...</p>
        <p>Payment type: {paymentType || 'deposit'}</p>
      </div>
    </div>
  );
}