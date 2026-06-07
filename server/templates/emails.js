// server/templates/emails.js

export const welcomeEmail = (name) => ({
  subject: 'Welcome to 12Fingers!',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Welcome to 12Fingers, ${name}!</h2>
      <p>We're excited to have you on board. Here's what you can do:</p>
      <ul>
        <li>Browse trusted workers in your area</li>
        <li>Book services securely</li>
        <li>Pay safely with our escrow system</li>
      </ul>
      <p>
        <a href="${process.env.FRONTEND_URL}/dashboard" 
           style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Go to Dashboard
        </a>
      </p>
    </div>
  `
});

export const paymentConfirmationClientEmail = (name, amount, bookingId, workerName) => ({
  subject: `💰 Payment Confirmed: $${amount}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">Payment Successful!</h2>
      <p>Hi ${name},</p>
      <p>Your payment of <strong>$${amount}</strong> for booking with <strong>${workerName}</strong> has been confirmed.</p>
      <p><strong>Booking ID:</strong> ${bookingId}</p>
      <p>The worker has been notified and will start soon.</p>
      <p>
        <a href="${process.env.FRONTEND_URL}/dashboard" 
           style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Booking
        </a>
      </p>
    </div>
  `
});

export const paymentConfirmationWorkerEmail = (name, amount, bookingId, clientName) => ({
  subject: `🔔 New Job: $${amount} Payment Received`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Job Confirmed!</h2>
      <p>Hi ${name},</p>
      <p>Great news! <strong>${clientName}</strong> has paid <strong>$${amount}</strong> for your services.</p>
      <p><strong>Booking ID:</strong> ${bookingId}</p>
      <p>You can now start the job from your dashboard.</p>
      <p>
        <a href="${process.env.FRONTEND_URL}/worker-dashboard" 
           style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Go to Dashboard
        </a>
      </p>
    </div>
  `
});

export const withdrawalStatusEmail = (name, amount, status, reason = '') => ({
  subject: `💰 Withdrawal ${status}: $${amount}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${status === 'approved' ? '#16a34a' : '#dc2626'};">
        Withdrawal ${status.charAt(0).toUpperCase() + status.slice(1)}
      </h2>
      <p>Hi ${name},</p>
      <p>Your withdrawal request for <strong>$${amount}</strong> has been <strong>${status}</strong>.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      ${status === 'approved' 
        ? '<p>The funds have been sent to your connected bank account.</p>' 
        : '<p>Please contact support if you have questions.</p>'}
      <p>
        <a href="${process.env.FRONTEND_URL}/worker-dashboard" 
           style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Dashboard
        </a>
      </p>
    </div>
  `
});

// Optional: Booking confirmation email (if you want to add later)
export const bookingConfirmationEmail = (clientName, workerName, bookingDate, amount) => ({
  subject: `Booking Confirmed with ${workerName}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Booking Confirmed! 🎉</h2>
      <p>Hi ${clientName},</p>
      <p>Great news! Your booking with <strong>${workerName}</strong> has been confirmed.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li>Date: ${new Date(bookingDate).toLocaleDateString()}</li>
        <li>Amount: $${amount}</li>
      </ul>
      <p>You can track your booking in your dashboard.</p>
      <p>
        <a href="${process.env.FRONTEND_URL}/dashboard" 
           style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Booking
        </a>
      </p>
    </div>
  `
});