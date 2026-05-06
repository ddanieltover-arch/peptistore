/** Calls Vercel serverless routes (same-origin on prod). Same shape as legacy backend email API. */

export async function postOrderCreatedEmail(orderId: string) {
  const response = await fetch('/api/email/order-created', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId })
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `order-created failed (${response.status})`);
  }
  return response.json() as Promise<{ success: boolean; result?: unknown }>;
}

export async function postOrderStatusEmail(orderId: string, status: string) {
  const response = await fetch('/api/email/order-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId, status })
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `order-status failed (${response.status})`);
  }
  return response.json() as Promise<{ success: boolean; result?: unknown }>;
}

export async function postContactEmail(payload: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}) {
  const response = await fetch('/api/email/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `contact email failed (${response.status})`);
  }
  return response.json() as Promise<{ success: boolean }>;
}
