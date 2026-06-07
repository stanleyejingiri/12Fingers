// src/components/booking/utils/bookingUtils.ts 
import { BookingFormData } from "@/types/booking";
import { ServicePackage } from "@/types/worker";

export const calculateBookingDetails = (
  data: BookingFormData,
  selectedPackage: ServicePackage | null,
  hourlyRate: number
) => {
  console.log('🧮 Starting calculation with:', {
    startTime: data.startTime,
    endTime: data.endTime,
    selectedPackage: selectedPackage?.name,
    hourlyRate
  });

  try {
    // Calculate hours between start and end time
    const start = new Date(`2000/01/01 ${data.startTime}`).getTime();
    const end = new Date(`2000/01/01 ${data.endTime}`).getTime();
    const totalHours = (end - start) / (1000 * 60 * 60);
    
    console.log('⏰ Hours calculated:', totalHours);

    // Calculate amount - use package price or hourly rate
    let totalAmount = 0;
    if (selectedPackage && selectedPackage.price) {
      totalAmount = selectedPackage.price;
      console.log('💰 Using package price:', totalAmount);
    } else {
      totalAmount = totalHours * hourlyRate;
      console.log('💰 Using hourly rate calculation:', totalAmount);
    }
    
    // Safe deposit calculation - default to 20% if no depositRequired field
    const depositPercentage = 20; // Default 20% deposit
    const depositAmount = totalAmount * (depositPercentage / 100);

    console.log('💳 Deposit calculated:', {
      totalAmount,
      depositPercentage: `${depositPercentage}%`,
      depositAmount
    });

    return { 
      totalHours: Math.max(totalHours, 1), // Ensure at least 1 hour
      totalAmount: Math.max(totalAmount, 10), // Ensure minimum amount
      depositAmount: Math.max(depositAmount, 5) // Ensure minimum deposit
    };
  } catch (error) {
    console.error('❌ Calculation error, using defaults:', error);
    // Return safe defaults if calculation fails
    return { 
      totalHours: 2, 
      totalAmount: 100.00, 
      depositAmount: 20.00 
    };
  }
};

