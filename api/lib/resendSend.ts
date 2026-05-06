import { Resend } from 'resend';

function getFrom() {
  return process.env.RESEND_FROM || process.env.EMAIL_FROM || '';
}

export type TransactionalSendResult = { sent: true } | { sent: false; dryRun: true };

export async function sendTransactionalEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<TransactionalSendResult> {
  const dryRun = String(process.env.EMAIL_DRY_RUN || 'false').toLowerCase() === 'true';
  const apiKey = process.env.RESEND_API_KEY;
  const from = getFrom();

  if (dryRun) {
    console.log('[resend dry-run]', { to: params.to, subject: params.subject });
    return { sent: false as const, dryRun: true as const };
  }

  if (!apiKey || !from) {
    throw new Error('RESEND_API_KEY and RESEND_FROM (or EMAIL_FROM) must be set for live sends');
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
    replyTo: params.replyTo
  });

  if (error) throw new Error(error.message);
  return { sent: true as const };
}
