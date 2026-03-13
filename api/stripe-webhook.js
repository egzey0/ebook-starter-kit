// Vercel serverless — Stripe webhook (po udanej platnosci)
// POST /api/stripe-webhook

const crypto = require('crypto');
const Stripe = require('stripe');
const { Resend } = require('resend');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const resend = new Resend(process.env.RESEND_API_KEY);

// ============================================================
// KONFIGURACJA — zmień na swoje dane
// ============================================================
const PRODUCT_NAME = 'Moj Ebook';
const FROM_EMAIL = 'ebook@twojadomena.pl'; // musi byc zweryfikowana w Resend
const CONTACT_EMAIL = 'kontakt@twojadomena.pl';
const VAT_RATE = 5; // stawka VAT (ebooki w PL = 5%)
// ============================================================

function generateToken(email) {
  const ts = Math.floor(Date.now() / 1000);
  const data = email + ':' + ts;
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('hex').slice(0, 16);
  return Buffer.from(data + ':' + sig).toString('base64url');
}

async function sendEbookEmail(email) {
  const token = generateToken(email);
  const downloadUrl = SITE_URL + '/api/download?token=' + token;
  const pageUrl = SITE_URL + '/dziekujemy?token=' + token;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Twoj ' + PRODUCT_NAME + ' - link do pobrania',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
        <h1 style="font-size:24px;margin-bottom:8px;">Dziekuje za zakup!</h1>
        <p style="font-size:16px;color:#555;margin-bottom:24px;">Twoj ebook jest gotowy do pobrania.</p>

        <div style="background:#f0fff0;border:2px solid #008000;padding:20px 24px;margin-bottom:24px;">
          <p style="font-size:16px;margin:0 0 16px;"><strong>Pobierz swojego ebooka:</strong></p>
          <a href="${downloadUrl}" style="display:inline-block;background:#008000;color:#fff;padding:12px 28px;font-size:16px;font-weight:bold;text-decoration:none;">POBIERZ PDF</a>
        </div>

        <p style="font-size:14px;color:#555;">Mozesz tez przejsc na strone z ebookiem:</p>
        <p style="margin-bottom:24px;"><a href="${pageUrl}" style="color:#0000FF;">${pageUrl}</a></p>

        <p style="font-size:14px;color:#555;">Link wazny 7 dni. Jesli wygasnie — napisz do nas, wysliemy nowy.</p>

        <hr style="border:none;border-top:1px solid #ddd;margin:24px 0;">
        <p style="font-size:12px;color:#999;">${CONTACT_EMAIL}</p>
      </div>
    `
  });
}

// --- Fakturownia (opcjonalna) ---

const FAKTUROWNIA_TOKEN = process.env.FAKTUROWNIA_TOKEN;
const FAKTUROWNIA_DOMAIN = process.env.FAKTUROWNIA_DOMAIN;

async function lookupNIP(nip) {
  const cleanNip = nip.replace(/[^0-9]/g, '');
  if (cleanNip.length !== 10) return null;

  const today = new Date().toISOString().split('T')[0];
  const url = `https://wl-api.mf.gov.pl/api/search/nip/${cleanNip}?date=${today}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const subject = data.result?.subject;
    if (!subject) return null;
    return {
      name: subject.name,
      street: subject.workingAddress?.split(',')[0] || '',
      city: subject.residenceAddress?.split(',').pop()?.trim() || '',
      postCode: subject.residenceAddress?.match(/\d{2}-\d{3}/)?.[0] || '',
    };
  } catch {
    return null;
  }
}

async function createInvoice({ email, nip, company, billingName, billingAddress, amount }) {
  if (!FAKTUROWNIA_TOKEN || !FAKTUROWNIA_DOMAIN) return;

  let gusData = null;
  if (nip) gusData = await lookupNIP(nip);

  const today = new Date().toISOString().split('T')[0];

  const invoice = {
    api_token: FAKTUROWNIA_TOKEN,
    invoice: {
      kind: nip ? 'vat' : 'normal',
      number: null,
      sell_date: today,
      issue_date: today,
      payment_type: 'card',
      status: 'paid',
      paid_date: today,
      buyer_name: gusData?.name || company || billingName || email,
      buyer_tax_no: nip,
      buyer_email: email,
      buyer_post_code: gusData?.postCode || billingAddress.postal_code || '',
      buyer_city: gusData?.city || billingAddress.city || '',
      buyer_street: gusData?.street || billingAddress.line1 || '',
      buyer_country: billingAddress.country || 'PL',
      positions: [{
        name: PRODUCT_NAME,
        quantity: 1,
        total_price_gross: (amount / 100).toFixed(2),
        tax: VAT_RATE,
      }],
    }
  };

  const apiUrl = `https://${FAKTUROWNIA_DOMAIN}.fakturownia.pl/invoices.json`;
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invoice),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error('Fakturownia error: ' + text);
  }

  const data = await res.json();

  // Wyslij fakture mailem do kupujacego
  if (data.id) {
    await fetch(`https://${FAKTUROWNIA_DOMAIN}.fakturownia.pl/invoices/${data.id}/send_by_email.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_token: FAKTUROWNIA_TOKEN }),
    });
  }

  return data;
}

// --- Webhook handler ---

module.exports.config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_email || session.metadata?.email;

    const customFields = {};
    if (session.custom_fields) {
      for (const field of session.custom_fields) {
        customFields[field.key] = field.text?.value || '';
      }
    }

    const fullName = customFields.fullname || '';
    const nip = customFields.nip || '';
    const company = customFields.company || '';
    const billingName = fullName || session.customer_details?.name || '';
    const billingAddress = session.customer_details?.address || {};

    console.log('PAYMENT OK:', email, session.id);

    if (email && session.payment_status === 'paid') {
      try {
        await sendEbookEmail(email);
        console.log('Email sent:', email);
      } catch (err) {
        console.error('Email failed:', err);
      }

      try {
        await createInvoice({
          email, nip, company, billingName, billingAddress,
          amount: session.amount_total,
        });
        console.log('Invoice created:', email);
      } catch (err) {
        console.error('Invoice failed:', err);
      }
    }
  }

  res.status(200).json({ received: true });
};
