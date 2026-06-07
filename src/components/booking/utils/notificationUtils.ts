interface BookingConfirmationParams {
  session: any;
  bookingId: string;
  userEmail: string;
  workerName: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
}

export const sendBookingConfirmation = async ({
  session,
  bookingId,
  userEmail,
  workerName,
  bookingDate,
  startTime,
  endTime,
}: BookingConfirmationParams): Promise<void> => {
  await fetch('https://45bdf55e-85bc-4a43-a71d-e38916341d73.functions.supabase.co/v1/send-booking-confirmation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    },
    body: JSON.stringify({
      bookingId,
      userEmail,
      workerName,
      bookingDate: bookingDate.toISOString().split('T')[0],
      startTime,
      endTime,
    }),
  });
};
