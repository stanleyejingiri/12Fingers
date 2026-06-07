//src/components/booking/utils/checkoutUtils.ts
interface CheckoutSessionParams {
  workerId: string;
  bookingId: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  totalAmount: number;
  packageId: string;
  paymentMethod: string;
}

export const createCheckoutSession = async ({
  workerId,
  bookingId,
  bookingDate,
  startTime,
  endTime,
  totalAmount,
  packageId,
  paymentMethod,
}: CheckoutSessionParams): Promise<string> => {
  // Use local API instead of Supabase Edge Function
  const response = await fetch('https://one2fingers-backend.onrender.com/api/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      workerId,
      bookingId,
      bookingDate: bookingDate.toISOString().split('T')[0],
      startTime,
      endTime,
      totalAmount,
      packageId,
      paymentMethod
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create checkout session');
  }

  const { url, success, error } = await response.json();
  
  if (!success || error) {
    throw new Error(error || 'Failed to create checkout session');
  }

  return url;
};
/***************/


/*
interface CheckoutSessionParams {
  session: any;
  workerId: string;
  bookingId: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  totalAmount: number;
  packageId: string;
  paymentMethod: string;
}

export const createCheckoutSession = async ({
  session,
  workerId,
  bookingId,
  bookingDate,
  startTime,
  endTime,
  totalAmount,
  packageId,
  paymentMethod,
}: CheckoutSessionParams): Promise<string> => {
  const response = await fetch('https://45bdf55e-85bc-4a43-a71d-e38916341d73.functions.supabase.co/v1/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({
      workerId,
      bookingId,
      bookingDate: bookingDate.toISOString().split('T')[0],
      startTime,
      endTime,
      totalAmount,
      packageId,
      isDeposit: true,
      paymentMethod
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const { url, error } = await response.json();
  if (error) throw new Error(error);

  return url;
};*/
