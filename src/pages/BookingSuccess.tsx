//src/pages/BookingSuccess.tsx
/*import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Payment Successful!",
      description: "Your booking has been confirmed.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your booking. You will receive a confirmation email shortly.
        </p>
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </div>
    </div>
  );
};

export default BookingSuccess;*/

//src/pages/BookingSuccess.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

interface PaymentDetails {
  sessionId: string;
  amount: number;
  currency: string;
  status: string;
  bookingId?: string;
  workerName?: string;
  bookingDate?: string;
}

const BookingSuccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("No payment session found");
        setIsLoading(false);
        return;
      }

      try {
        console.log("🔍 Verifying payment session:", sessionId);
        
        // Call backend to verify Stripe session
        const response = await fetch(`https://one2fingers-backend.onrender.com/api/verify-payment?session_id=${sessionId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to verify payment: ${response.status}`);
        }

        const paymentData = await response.json();
        
        if (paymentData.success) {
          setPaymentDetails(paymentData.payment);
          toast({
            title: "Payment Successful!",
            description: "Your booking has been confirmed and payment processed.",
          });
        } else {
          throw new Error(paymentData.error || "Payment verification failed");
        }
      } catch (err) {
        console.error("💥 Payment verification error:", err);
        setError(err.message);
        toast({
          variant: "destructive",
          title: "Payment Verification Failed",
          description: "We couldn't verify your payment. Please contact support.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, toast]);

  // Add this new endpoint to your server/index.js first
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <Clock className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Verifying Payment...</h1>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Issue</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            Session ID: {sessionId}
          </p>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentDetails && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Payment Successful
                </Badge>
                <p className="text-sm text-gray-600 mt-2">
                  Your payment of ${(paymentDetails.amount / 100).toFixed(2)} has been processed.
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Session ID:</span>
                  <span className="font-mono text-xs">{paymentDetails.sessionId}</span>
                </div>
                {paymentDetails.bookingId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{paymentDetails.bookingId}</span>
                  </div>
                )}
                {paymentDetails.workerName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Worker:</span>
                    <span className="font-medium">{paymentDetails.workerName}</span>
                  </div>
                )}
                {paymentDetails.bookingDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Date:</span>
                    <span className="font-medium">{paymentDetails.bookingDate}</span>
                  </div>
                )}
              </div>
            </>
          )}
          
          <p className="text-gray-600 text-center">
            Thank you for your booking. You will receive a confirmation email shortly.
          </p>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate("/")} 
              className="flex-1"
            >
              Return to Home
            </Button>
            <Button 
              variant="outline" 
              /*onClick={() => navigate("/bookings")}*/
			  onClick={() => navigate("/user-dashboard")}  // USE EXISTING ROUTE
              className="flex-1"
            >
              View Bookings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSuccess;
