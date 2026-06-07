// server/routes/test.js
import express from 'express';
import sendEmail from '../config/email.js';
import { welcomeEmail } from '../templates/emails.js';

const router = express.Router();

router.post('/test-email', async (req, res) => {
  const { email, name } = req.body;
  
  const result = await sendEmail({
    to: email,
    ...welcomeEmail(name)
  });
  
  res.json(result);
});

export default router;