// Vercel serverless — tworzy sesję Stripe Checkout
// POST /api/pay { email }

const crypto = require('crypto');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;

// ============================================================
// KONFIGURACJA PRODUKTU — zmień na swoje dane
// ============================================================
const PRODUCT_NAME = 'Mój Ebook';
const PRODUCT_DESCRIPTION = 'Opis Twojego ebooka w jednym zdaniu.';
const PRODUCT_PRICE = 4900; // cena BRUTTO w groszach (4900 = 49 PLN)
const PRODUCT_CURRENCY = 'pln';
const VAT_RATE = 5; // stawka VAT w % (ebooki w PL = 5%)
// ============================================================

function generateToken(email) {
  const ts = Math.floor(Date.now() / 1000);
  const data = email + ':' + ts;
  const sig = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('hex').slice(0, 16);
  return Buffer.from(data + ':' + sig).toString('base64url');
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', SITE_URL);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { email } = req.body || {};
  if (!email || !email.includes('@') || email.length < 5) {
    return res.status(400).json({ error: 'Podaj prawidlowy email' });
  }

  try {
    const sessionParams = {
      mode: 'payment',
      customer_email: email,
      success_url: SITE_URL + '/dziekujemy?token=' + generateToken(email),
      cancel_url: SITE_URL + '/#cennik',
      metadata: { email },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      custom_fields: [
        {
          key: 'fullname',
          label: { type: 'custom', custom: 'Imie i nazwisko' },
          type: 'text',
          optional: false,
        },
        {
          key: 'nip',
          label: { type: 'custom', custom: 'NIP (opcjonalnie, do faktury)' },
          type: 'text',
          optional: true,
        },
        {
          key: 'company',
          label: { type: 'custom', custom: 'Nazwa firmy (opcjonalnie, do faktury)' },
          type: 'text',
          optional: true,
        },
      ],
    };

    if (STRIPE_PRICE_ID) {
      sessionParams.line_items = [{ price: STRIPE_PRICE_ID, quantity: 1 }];
    } else {
      sessionParams.line_items = [{
        price_data: {
          currency: PRODUCT_CURRENCY,
          product_data: {
            name: PRODUCT_NAME,
            description: PRODUCT_DESCRIPTION,
          },
          unit_amount: PRODUCT_PRICE,
        },
        quantity: 1,
      }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Payment error:', err);
    return res.status(500).json({ error: 'Blad platnosci: ' + err.message });
  }
};
