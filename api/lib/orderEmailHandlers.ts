import { fetchOrderById, patchOrderShippingAddress } from './supabaseOrders';
import {
  renderOrderCreatedAdminEmail,
  renderOrderCreatedCustomerEmail,
  renderOrderStatusCustomerEmail,
  type OrderEmailPayload,
  type OrderLineItem
} from './emailTemplates';
import { sendTransactionalEmail } from './resendSend';

function getAdminRecipient() {
  return process.env.EMAIL_ADMIN_TO || process.env.EMAIL_SUPPORT_ADDRESS || 'info@researchpeptide.uk';
}

function hasOrderEvent(shippingAddress: Record<string, any> | null | undefined, eventKey: string) {
  const sentEmailEvents = shippingAddress?.sent_email_events || {};
  return Boolean(sentEmailEvents[eventKey]);
}

function buildOrderPayload(row: Record<string, any>, statusOverride?: string): OrderEmailPayload | null {
  const shipping = row.shipping_address || {};
  const email = shipping.email;
  if (!email) return null;

  const items: OrderLineItem[] = Array.isArray(row.items)
    ? row.items.map((item: any) => ({
        title: item.title || 'Product',
        quantity: Number(item.quantity || 1),
        price: Number(item.price || 0),
        specification: item.specification || ''
      }))
    : [];

  return {
    orderId: row.id,
    status: statusOverride || row.status || 'pending',
    customerEmail: email,
    customerName: shipping.fullName || 'Researcher',
    totalAmount: Number(row.total_amount || 0),
    shippingCost: Number(shipping.shipping_cost || 0),
    paymentMethod: shipping.payment_method || 'unknown',
    items
  };
}

async function markOrderEvent(orderId: string, shipping: Record<string, any>, eventKey: string) {
  const sentEmailEvents = { ...(shipping.sent_email_events || {}), [eventKey]: new Date().toISOString() };
  await patchOrderShippingAddress(orderId, { ...shipping, sent_email_events: sentEmailEvents });
}

export async function handleOrderCreated(orderId: string) {
  const row = await fetchOrderById(orderId);
  if (!row) throw new Error('Order not found');

  const shipping = row.shipping_address || {};
  if (hasOrderEvent(shipping, 'order_created')) {
    return { skipped: true, reason: 'already-sent' as const };
  }

  const payload = buildOrderPayload(row);
  if (!payload) return { skipped: true, reason: 'missing-customer-email' as const };

  const adminTemplate = renderOrderCreatedAdminEmail(payload);
  const customerTemplate = renderOrderCreatedCustomerEmail(payload);

  const [a, b] = await Promise.all([
    sendTransactionalEmail({
      to: getAdminRecipient(),
      subject: adminTemplate.subject,
      html: adminTemplate.html,
      text: adminTemplate.text
    }),
    sendTransactionalEmail({
      to: payload.customerEmail,
      subject: customerTemplate.subject,
      html: customerTemplate.html,
      text: customerTemplate.text
    })
  ]);

  if (('dryRun' in a && a.dryRun) || ('dryRun' in b && b.dryRun)) {
    return { dryRun: true as const };
  }
  if (!a.sent || !b.sent) {
    throw new Error('Unexpected send state');
  }

  await markOrderEvent(orderId, shipping, 'order_created');
  return { sent: true as const };
}

export async function handleOrderStatus(orderId: string, status: string) {
  const row = await fetchOrderById(orderId);
  if (!row) throw new Error('Order not found');

  const shipping = row.shipping_address || {};
  const eventKey = `status_${status}`;
  if (hasOrderEvent(shipping, eventKey)) {
    return { skipped: true, reason: 'already-sent' as const };
  }

  const payload = buildOrderPayload({ ...row, status });
  if (!payload) return { skipped: true, reason: 'missing-customer-email' as const };

  const template = renderOrderStatusCustomerEmail(payload);
  const result = await sendTransactionalEmail({
    to: payload.customerEmail,
    subject: template.subject,
    html: template.html,
    text: template.text
  });

  if ('dryRun' in result && result.dryRun) {
    return { dryRun: true as const };
  }
  if (!result.sent) {
    throw new Error('Unexpected send state');
  }

  await markOrderEvent(orderId, shipping, eventKey);
  return { sent: true as const };
}
