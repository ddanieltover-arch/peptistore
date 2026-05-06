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

    // Send emails separately so one failure doesn't block the other (though usually both fail if config is missing)
    const results = await Promise.allSettled([
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

    const failures = results.filter((r) => r.status === 'rejected');
    if (failures.length === results.length) {
      // Both failed - likely a configuration issue
      throw (failures[0] as PromiseRejectedResult).reason;
    }

    const successes = results.filter((r) => r.status === 'fulfilled') as PromiseFulfilledResult<any>[];
    const dryRun = successes.some((s) => s.value.dryRun);
    
    return res.status(200).json({ 
      success: true, 
      dryRun,
      partialFailure: failures.length > 0 
    });
  } catch (error: unknown) {
    console.error('contact handler:', error);
    const msg =
      error instanceof Error ? error.message : typeof error === 'string' ? error : JSON.stringify(error);
    return res.status(500).json({
      success: false,
      error: msg || 'Contact email handler failed — check Vercel function logs and RESEND_* env vars.'
    });
  }
}
