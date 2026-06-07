// components/booking/BookingSubmitHandler.tsx
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { BookingFormData } from "@/types/booking";

interface BookingSubmitProps {
  workerId: string;
  selectedPackage: any;
  paymentMethod: "card" | "paypal" | "wallet";
  onClose: () => void;
  workerName: string;
  hourlyRate: number;
}

// Helper function to calculate booking details
const calculateBookingDetails = (
  data: BookingFormData,
  selectedPackage: any,
  hourlyRate: number
) => {
  // Calculate total hours from start and end time
  const calculateHours = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    // Handle overnight bookings (if end time is earlier than start time)
    let totalMinutes = endMinutes - startMinutes;
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60; // Add 24 hours
    }
    
    return totalMinutes / 60;
  };

  // Get total hours
  const totalHours = data.estimatedHours || calculateHours(data.startTime, data.endTime);
  
  // Calculate total amount
  let totalAmount = 0;
  
  if (selectedPackage && selectedPackage.id !== 'custom') {
    // Use package price
    totalAmount = selectedPackage.price || 0;
  } else {
    // Calculate based on hourly rate
    totalAmount = totalHours * hourlyRate;
    
    // Use custom price if provided
    if (data.totalAmount && data.totalAmount > 0) {
      totalAmount = data.totalAmount;
    }
  }

  return {
    totalHours,
    totalAmount,
    depositAmount: totalAmount * 0.5 // 50% deposit for non-wallet payments
  };
};

export const useBookingSubmit = ({
  workerId,
  selectedPackage,
  paymentMethod,
  onClose,
  workerName,
  hourlyRate
}: BookingSubmitProps) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (data: BookingFormData) => {
    console.log('=== 🚀 BOOKING PROCESS STARTED ===');
    console.log('🔍 BOOKING DEBUG - Payment Method:', paymentMethod);
    
    if (!user) {
      console.log('❌ NO USER - Cannot proceed');
      toast({
        title: "Error",
        description: "Please sign in to book a worker",
        variant: "destructive",
      });
      return;
    }

    console.log('👤 USER OBJECT:', JSON.stringify(user, null, 2));

    try {
      // Calculate booking details
      console.log('🧮 Calculating booking details...');
      const { totalHours, totalAmount } = calculateBookingDetails(
        data, 
        selectedPackage, 
        hourlyRate
      );

      const isCustomOffer = !selectedPackage || selectedPackage.id === 'custom';

      // Prepare request data for LOCAL MYSQL API
      const requestData = {
        worker_id: workerId,
        package_id: isCustomOffer ? null : (selectedPackage?.id || null),
        booking_date: data.date.toISOString().split('T')[0],
        start_time: data.startTime,
        end_time: data.endTime,
        service_details: data.serviceDetails || 'No details provided',
        special_instructions: data.specialInstructions || 'No special instructions',
        is_custom_offer: isCustomOffer,
        custom_price: totalAmount,
        client_id: user.id,
        client_name: user.name || 'Unknown Client',
        client_email: user.email || 'unknown@email.com',
        total_amount: totalAmount,
        estimated_hours: totalHours,
        payment_method: paymentMethod,
        // All custom offers start as 'offer_pending' - payment happens later
        status: isCustomOffer ? 'offer_pending' : 'pending'
      };

      console.log('📤 REQUEST DATA FOR LOCAL API:', JSON.stringify(requestData, null, 2));

      // For wallet payments: Only check balance, don't deduct yet
      if (paymentMethod === 'wallet') {
        console.log('💰 Checking wallet balance (no deduction yet)...');
        const balanceResponse = await fetch(`http://localhost:3001/api/wallets/balance/${user.id}`);
        
        if (!balanceResponse.ok) {
          throw new Error('Failed to check wallet balance');
        }
        
        const balanceData = await balanceResponse.json();
        console.log('💰 Current wallet balance:', balanceData.balance);
        
        // Just check balance, don't deduct - payment happens after worker acceptance
        if (balanceData.balance < totalAmount) {
          toast({
            title: "Insufficient Funds",
            description: `You need $${totalAmount} for this offer but only have $${balanceData.balance} in your wallet. Please add funds if you want to use wallet payment after the worker accepts.`,
            variant: "destructive",
          });
          return;
        }
        
        console.log('✅ Sufficient wallet balance available');
      }

      // Step 2: Create booking
      console.log('📤 Creating booking...');
      const bookingResponse = await fetch('http://localhost:3001/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      console.log('📥 Booking response status:', bookingResponse.status);
      
      if (!bookingResponse.ok) {
        const errorText = await bookingResponse.text();
        console.log('❌ Booking creation failed:', errorText);
        throw new Error(`Booking failed: ${bookingResponse.status} - ${errorText}`);
      }
      
      const bookingResult = await bookingResponse.json();
      console.log('✅ BOOKING CREATED:', bookingResult);
      
      const bookingId = bookingResult.booking_id || bookingResult.data?.booking_id;

      if (!bookingId) {
        throw new Error('No booking ID returned from server');
      }

      // Handle different payment flows based on payment method
      if (paymentMethod === 'wallet') {
        // Wallet payment: No escrow yet - will happen after worker acceptance
        console.log('⏳ Wallet payment deferred until worker accepts offer');
        
        toast({
          title: "Offer Submitted! ⏳",
          description: `Your custom offer has been sent to ${workerName}. They will review and accept before wallet payment is processed.`,
          variant: "default",
        });
        
      } else if (paymentMethod === 'card' || paymentMethod === 'paypal') {
        // Card/PayPal: For NON-CUSTOM offers, process payment immediately
        // For custom offers, payment should also wait for worker acceptance
        if (!isCustomOffer) {
          console.log('💳 Creating Stripe checkout for immediate payment...');
          const checkoutResponse = await fetch('http://localhost:3001/api/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              workerId,
              bookingId,
              bookingDate: data.date,
              startTime: data.startTime,
              endTime: data.endTime,
              totalAmount,
              packageId: selectedPackage?.id || 'custom',
              paymentMethod
            })
          });
          
          if (!checkoutResponse.ok) {
            throw new Error('Failed to create checkout session');
          }
          
          const checkoutResult = await checkoutResponse.json();
          
          // Redirect to Stripe checkout
          if (checkoutResult.url) {
            window.location.href = checkoutResult.url;
            return;
          }
        } else {
          // Custom offer with card/paypal - payment also deferred
          console.log('⏳ Card/PayPal payment deferred until worker accepts offer');
          
          toast({
            title: "Offer Submitted! ⏳",
            description: `Your custom offer has been sent to ${workerName}. They will review and accept before payment is required.`,
            variant: "default",
          });
        }
      }

      // Success message (if not redirected to Stripe)
      if (!(paymentMethod === 'card' || paymentMethod === 'paypal') || isCustomOffer) {
        toast({
          title: "Offer Submitted Successfully! 🎉",
          description: `Your custom offer has been sent to ${workerName}. They will review and respond soon.`,
          variant: "default",
        });
      }

      // 🔥 TRIGGER REFRESH EVENTS
      setTimeout(() => {
        console.log('🔄 Triggering refresh events after booking...');
        window.dispatchEvent(new CustomEvent('refreshWallet'));
        window.dispatchEvent(new CustomEvent('bookingCompleted'));
        window.dispatchEvent(new CustomEvent('refreshBookings'));
      }, 500);

      onClose();
      return;

    } catch (error) {
      console.error('💥 BOOKING ERROR:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Please check console for details",
        variant: "destructive",
      });
    }
  };

  return { handleSubmit };
};

// Helper function for direct wallet transactions (fallback) - Keep for future use
const createDirectWalletTransaction = async (userId: string, amount: number, bookingId: number) => {
  try {
    console.log('💸 Creating direct wallet transaction...');
    const response = await fetch('http://localhost:3001/api/wallets/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        amount: -amount,
        type: 'booking_payment',
        description: `Payment for booking #${bookingId}`,
        status: 'completed'
      })
    });
    
    if (response.ok) {
      console.log('✅ Direct wallet transaction created');
    }
  } catch (error) {
    console.error('Failed to create direct wallet transaction:', error);
  }
};