type CreateInvoiceBody = {
  order_id?: string;
  amount?: number;
  currency?: string;
  email?: string;
  name?: string;
};

function pickPaymentUrl(payload: any): string | null {
  if (!payload || typeof payload !== 'object') return null;

  const candidates = [
    payload.payment_url,
    payload.paymentUrl,
    payload.invoice_url,
    payload.invoiceUrl,
    payload.checkout_url,
    payload.checkoutUrl,
    payload.url,
    payload.hosted_url,
    payload.hostedUrl,
    payload?.data?.payment_url,
    payload?.data?.paymentUrl,
    payload?.data?.invoice_url,
    payload?.data?.invoiceUrl,
    payload?.data?.checkout_url,
    payload?.data?.checkoutUrl,
    payload?.data?.url,
  ];

  for (const value of candidates) {
    if (typeof value === 'string' && /^https?:\/\//i.test(value)) return value;
  }

  return null;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const apiUrl = process.env.PSILIO_CREATE_INVOICE_URL;
  const secret = process.env.PSILIO_SECRET_KEY;
  const successUrl = process.env.PSILIO_SUCCESS_URL;
  const failedUrl = process.env.PSILIO_FAILED_URL;
  const statusUrl = process.env.PSILIO_STATUS_URL;

  if (!apiUrl || !secret) {
    return res.status(500).json({
      success: false,
      error: 'Psilio is not configured. Missing PSILIO_CREATE_INVOICE_URL or PSILIO_SECRET_KEY.',
    });
  }

  try {
    const body = (req.body || {}) as CreateInvoiceBody;
    const orderId = String(body.order_id || '').trim();
    const amount = Number(body.amount || 0);
    const currency = String(body.currency || 'GBP').toUpperCase();
    const email = String(body.email || '').trim();
    const name = String(body.name || '').trim();

    if (!orderId || !Number.isFinite(amount) || amount <= 0 || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: order_id, amount (>0), email.',
      });
    }

    // Plisio expects api_key + invoice fields as query/form params.
    // Works with endpoint like: https://api.plisio.net/api/v1/invoices/new
    const params = new URLSearchParams();
    params.set('api_key', secret);
    params.set('order_number', orderId);
    params.set('order_name', name || `Order ${orderId}`);
    params.set('source_amount', amount.toFixed(2));
    params.set('source_currency', currency);
    params.set('email', email);
    params.set('plugin', 'peptistore');
    if (statusUrl) params.set('callback_url', statusUrl);
    if (successUrl) params.set('success_callback_url', successUrl);
    if (failedUrl) params.set('fail_callback_url', failedUrl);

    const upstream = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const text = await upstream.text();
    let json: any = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = {};
    }

    if (!upstream.ok || (json && json.status === 'error')) {
      return res.status(502).json({
        success: false,
        error: `Psilio API failed (${upstream.status}). ${
          typeof json?.data?.message === 'string'
            ? json.data.message
            : typeof json?.message === 'string'
              ? json.message
              : text
        }`,
      });
    }

    const paymentUrl = pickPaymentUrl(json);
    if (!paymentUrl) {
      return res.status(502).json({
        success: false,
        error: 'Psilio invoice created but no payment URL was returned.',
        response: json,
      });
    }

    return res.status(200).json({
      success: true,
      paymentUrl,
      raw: json,
    });
  } catch (error: any) {
    console.error('psilio create-invoice handler:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to create Psilio invoice',
    });
  }
}
