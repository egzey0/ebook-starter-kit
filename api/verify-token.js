// Vercel serverless — weryfikacja tokena pobierania
// GET /api/verify-token?token=xxx

const crypto = require('crypto');

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 dni

const rateMap = new Map();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60 * 1000;

function checkRate(ip) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW) {
    rateMap.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT;
}

module.exports = async function handler(req, res) {
  const origin = process.env.SITE_URL || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);

  if (req.method === 'OPTIONS') return res.status(200).end();

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!checkRate(ip)) {
    return res.status(429).json({ valid: false, error: 'Za duzo requestow.' });
  }

  const token = req.query.token;
  if (!token) return res.status(400).json({ valid: false, error: 'Brak tokena' });

  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const parts = decoded.split(':');
    if (parts.length < 3) return res.status(400).json({ valid: false });

    const sig = parts.pop();
    const ts = parseInt(parts.pop(), 10);
    const email = parts.join(':');

    const data = email + ':' + ts;
    const expectedSig = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('hex').slice(0, 16);

    if (sig !== expectedSig) return res.status(403).json({ valid: false });

    if (Math.floor(Date.now() / 1000) - ts > TOKEN_MAX_AGE) {
      return res.status(403).json({ valid: false, error: 'Token wygasl' });
    }

    return res.status(200).json({ valid: true });
  } catch {
    return res.status(400).json({ valid: false });
  }
};
