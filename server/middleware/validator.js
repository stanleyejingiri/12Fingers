// server/middleware/validator.js
export const validateBooking = (req, res, next) => {
  const { worker_id, booking_date, start_time, end_time, client_id } = req.body;
  
  const errors = [];
  
  if (!worker_id || typeof worker_id !== 'string') {
    errors.push('Valid worker_id is required');
  }
  
  if (!client_id || typeof client_id !== 'string') {
    errors.push('Valid client_id is required');
  }
  
  if (!booking_date || !/^\d{4}-\d{2}-\d{2}$/.test(booking_date)) {
    errors.push('Valid booking_date (YYYY-MM-DD) is required');
  }
  
  if (!start_time || !/^\d{2}:\d{2}$/.test(start_time)) {
    errors.push('Valid start_time (HH:MM) is required');
  }
  
  if (!end_time || !/^\d{2}:\d{2}$/.test(end_time)) {
    errors.push('Valid end_time (HH:MM) is required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  
  next();
};

export const validatePayment = (req, res, next) => {
  const { booking_id, amount } = req.body;
  
  const errors = [];
  
  if (!booking_id || typeof booking_id !== 'string') {
    errors.push('Valid booking_id is required');
  }
  
  if (!amount || isNaN(amount) || amount <= 0) {
    errors.push('Valid amount greater than 0 is required');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  
  next();
};