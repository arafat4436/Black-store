import type { Order } from '../types';

const TELEGRAM_BOT_TOKEN = '8929494628:AAER_m3BwpmHs8DuCccUBqsk5IRRIDkH5S0';
const TELEGRAM_CHAT_ID = '1950215741';

const EMAILJS_SERVICE_ID = 'service_uq6m8hl';
const EMAILJS_TEMPLATE_ID = 'template_tpv8lyi';
const EMAILJS_PUBLIC_KEY = '0tbIfB3dfmte29Wzk';

/**
 * Send Telegram notification to Admin when a new order is placed
 */
export const notifyAdminTelegram = async (order: Order) => {
  const itemsList = order.items
    .map((item) => `  • ${item.product.name} (${item.size}) x${item.quantity} — ৳${(item.product.price * item.quantity).toLocaleString()}`)
    .join('\n');

  const message =
`🛒 *NEW ORDER RECEIVED!*

📋 *Order ID:* \`${order.orderId}\`
📅 *Date:* ${order.date}

👤 *Customer:*
  Name: ${order.customer.name}
  Phone: ${order.customer.phone}
  Address: ${order.customer.address}
  Area: ${order.customer.district === 'inside' ? 'Inside Dhaka' : 'Outside Dhaka'}

🛍️ *Items:*
${itemsList}

🚚 Delivery: ৳${order.deliveryCharge}
💰 *Total: ৳${order.total.toLocaleString()}*
💳 Payment: ${order.paymentMethod}`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (error) {
    console.error('Telegram notification failed:', error);
  }
};

/**
 * Send order confirmation email to Customer via EmailJS
 */
export const notifyCustomerEmail = async (order: Order, customerEmail: string) => {
  const itemsList = order.items
    .map((item) => `${item.product.name} (${item.size}) x${item.quantity}`)
    .join(', ');

  const templateParams = {
    customer_name: order.customer.name,
    customer_email: customerEmail,
    order_id: order.orderId,
    order_total: order.total.toLocaleString(),
    order_items: itemsList,
    delivery_charge: order.deliveryCharge.toString(),
    payment_method: order.paymentMethod,
  };

  try {
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: templateParams,
      }),
    });
  } catch (error) {
    console.error('Email notification failed:', error);
  }
};
