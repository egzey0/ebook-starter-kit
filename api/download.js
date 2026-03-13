// Vercel serverless — serwuje PDF po weryfikacji tokena
// GET /api/download?token=xxx

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 dni

// ============================================================
// KONFIGURACJA — zmień nazwy plików na swoje
// ============================================================
const PDF_FILENAME = 'ebook.pdf'; // plik PDF w katalogu glownym
const DOWNLOAD_FILENAME = 'Ebook.pdf'; // nazwa pliku przy pobieraniu
// ============================================================

const rateMap = new Map();
const RATE_LIMIT = 10;
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

function verifyToken(token) {
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const parts = decoded.split(':');
    if (parts.length < 3) return false;

    const sig = parts.pop();
    const ts = parseInt(parts.pop(), 10);
    const email = parts.join(':');

    const data = email + ':' + ts;
    const expectedSig = crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('hex').slice(0, 16);

    if (sig !== expectedSig) return false;
    if (Math.floor(Date.now() / 1000) - ts > TOKEN_MAX_AGE) return false;

    return true;
  } catch {
    return false;
  }
}

module.exports = async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!checkRate(ip)) {
    return res.status(429).json({ error: 'Za duzo requestow. Sprobuj za chwile.' });
  }

  const token = req.query.token;
  if (!token || !verifyToken(token)) {
    return res.status(403).json({ error: 'Brak dostepu' });
  }

  const pdfPath = path.join(__dirname, '..', PDF_FILENAME);

  try {
    const pdf = fs.readFileSync(pdfPath);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="' + DOWNLOAD_FILENAME + '"');
    res.setHeader('Content-Length', pdf.length);
    return res.status(200).send(pdf);
  } catch (err) {
    console.error('PDF read error:', err);
    return res.status(500).json({ error: 'Blad serwera' });
  }
};
