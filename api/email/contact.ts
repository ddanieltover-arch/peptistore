import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  renderContactSubmittedAdminEmail,
  renderContactSubmittedCustomerEmail
} from '../lib/emailTemplates';
import { sendTransactionalEmail } from '../lib/resendSend';

function getAdminRecipient() {
  return process.env.EMAIL_ADMIN_TO || process.env.EMAIL_SUPPORT_ADDRESS || 'info@researchpeptide.uk';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { fullName, email, subject, message } = req.body || {};
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'Missing required contact fields' });
    }

    const payload = { fullName, email, subject, message };
    const adminTemplate = renderContactSubmittedAdminEmail(payload);
    const customerTemplate = renderContactSubmittedCustomerEmail(payload);

    const [a, b] = await Promise.all([
      sendTransactionalEmail({
        to: getAdminRecipient(),
        subject: adminTemplate.subject,
        html: adminTemplate.html,
        text: adminTemplate.text,
        replyTo: payload.email
      }),
      sendTransactionalEmail({
        to: payload.email,
        subject: customerTemplate.subject,
        html: customerTemplate.html,
        text: customerTemplate.text
      })
    ]);

    const dryRun = ('dryRun' in a && a.dryRun) || ('dryRun' in b && b.dryRun);
    return res.status(200).json({ success: true, dryRun });
  } catch (error: any) {
    console.error('contact handler:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Server error' });
  }
}
