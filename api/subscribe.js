// Vercel serverless — zapis na liste mailingowa (Resend Audiences)
// POST /api/subscribe { email }

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;

module.exports = async function handler(req, res) {
  const origin = process.env.SITE_URL || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email wymagany' });

  if (!AUDIENCE_ID) return res.status(500).json({ error: 'Brak RESEND_AUDIENCE_ID' });

  try {
    await resend.contacts.create({
      audienceId: AUDIENCE_ID,
      email,
      unsubscribed: false,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Nie udalo sie zapisac' });
  }
};
