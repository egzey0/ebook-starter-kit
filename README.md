# Ebook Starter Kit

Gotowy kit do sprzedazy ebooka online. Stripe + Resend + Vercel. Zero frameworkow — czysty HTML + serverless API.

**Co dostajesz:**
- Landing page (profesjonalny sales page)
- Platnosci Stripe Checkout (karty, BLIK, przelewy)
- Automatyczny email z linkiem do pobrania (Resend)
- Automatyczne faktury (Fakturownia, opcjonalnie)
- Autouzupelnianie danych firmy z NIP (API Biala Lista)
- Lista mailingowa (Resend Audiences)
- Cookie consent + GA4 + Meta Pixel
- Strona po zakupie z downloadem
- Regulamin + Polityka prywatnosci (szablony)
- SEO: schema markup, sitemap, robots.txt, OG tagi
- Token-based download (zabezpieczony PDF)

**Koszt utrzymania:**
- Hosting: 0 PLN (Vercel free tier)
- Maile: 0 PLN (Resend free, 3000/msc)
- Stripe: 1.5% + 1 PLN za transakcje
- Domena: ~40 PLN/rok

---

## Szybki start (15 minut)

### 1. Sklonuj repo

```bash
git clone https://github.com/TWOJ-USER/ebook-starter-kit.git
cd ebook-starter-kit
npm install
```

### 2. Wrzuc swojego ebooka

Umiesz plik PDF w katalogu glownym jako `ebook.pdf`.

Jesli chcesz inna nazwe pliku — zmien `PDF_FILENAME` w `api/download.js`.

### 3. Skonfiguruj tokeny

Skopiuj `.env.example` do `.env`:

```bash
cp .env.example .env
```

Wypelnij tokeny:

#### Stripe (wymagane)
1. Zaloz konto na [stripe.com](https://stripe.com)
2. Stripe Dashboard > Developers > API keys
3. Skopiuj **Secret key** (`sk_live_...`) do `STRIPE_SECRET_KEY`
4. Stripe Dashboard > Developers > Webhooks > Add endpoint
   - URL: `https://twojadomena.pl/api/stripe-webhook`
   - Events: `checkout.session.completed`
   - Skopiuj **Signing secret** (`whsec_...`) do `STRIPE_WEBHOOK_SECRET`

#### Resend (wymagane)
1. Zaloz konto na [resend.com](https://resend.com)
2. Zweryfikuj domene (DNS records)
3. API Keys > Create > skopiuj do `RESEND_API_KEY`
4. Audiences > Create > skopiuj ID do `RESEND_AUDIENCE_ID` (opcjonalne)

#### Token Secret (wymagane)
Wymysl losowy ciag. W terminalu:
```bash
openssl rand -hex 32
```
Wklej wynik do `TOKEN_SECRET`.

#### Fakturownia (opcjonalne)
1. Zaloz konto na [fakturownia.pl](https://fakturownia.pl)
2. Ustawienia > API > skopiuj token do `FAKTUROWNIA_TOKEN`
3. Twoja subdomena (np. `mojafirma` z `mojafirma.fakturownia.pl`) do `FAKTUROWNIA_DOMAIN`

#### Analityka (opcjonalne)
- GA4: [analytics.google.com](https://analytics.google.com) > Admin > Data Streams > Measurement ID
- Meta Pixel: [business.facebook.com](https://business.facebook.com/events_manager) > Event Manager > Pixel ID

Wpisz ID w `cookies.js` (linie 6-7).

### 4. Dostosuj tresc

**`index.html`** — glowna strona sprzedazowa:
- Zmien tytul ebooka, opis, cene
- Wypelnij sekcje: pain points, rozdzialy, opinie, o autorze, FAQ
- Zmien `twojadomena.pl` na swoja domene
- Zmien `kontakt@twojadomena.pl` na swoj email

**`dziekujemy.html`** — strona po zakupie:
- Zmien `kontakt@twojadomena.pl` na swoj email

**`api/pay.js`** — konfiguracja produktu:
- `PRODUCT_NAME` — nazwa ebooka
- `PRODUCT_DESCRIPTION` — opis w Stripe Checkout
- `PRODUCT_PRICE` — cena brutto w **groszach** (4900 = 49 PLN)
- `VAT_RATE` — stawka VAT (ebooki w PL = 5%)

**`api/stripe-webhook.js`** — konfiguracja emaila:
- `PRODUCT_NAME` — nazwa w emailu
- `FROM_EMAIL` — adres nadawcy (musi byc zweryfikowany w Resend)
- `CONTACT_EMAIL` — email kontaktowy w stopce maila

**`api/download.js`** — konfiguracja pliku:
- `PDF_FILENAME` — nazwa pliku PDF w katalogu
- `DOWNLOAD_FILENAME` — nazwa pliku przy pobieraniu

**`regulamin.html`** + **`polityka-prywatnosci.html`**:
- Wpisz dane firmy, adres, NIP

**`sitemap.xml`** + **`robots.txt`**:
- Zmien `twojadomena.pl` na swoja domene

### 5. Deploy na Vercel

```bash
npm install -g vercel
vercel
```

Lub: polacz repo z [vercel.com](https://vercel.com) i deploy automatyczny.

**WAZNE:** Dodaj env vars w Vercel Dashboard:
Vercel > Project > Settings > Environment Variables > dodaj wszystkie zmienne z `.env`.

### 6. Podepnij domene

Vercel > Project > Settings > Domains > dodaj domene.

W panelu rejestratora (OVH, home.pl, etc.) dodaj:
- Rekord A: `76.76.21.21`
- Rekord CNAME: `cname.vercel-dns.com`

### 7. Ustaw webhook Stripe

Stripe Dashboard > Developers > Webhooks > Add endpoint:
- URL: `https://twojadomena.pl/api/stripe-webhook`
- Events: `checkout.session.completed`

### 8. Testuj

1. Stripe: uzyj trybu test (klucze `sk_test_...`)
2. Karta testowa: `4242 4242 4242 4242`, dowolna data, dowolne CVC
3. Sprawdz czy email z ebookiem dochodzi
4. Sprawdz czy faktura sie tworzy (jesli skonfigurowales)
5. Przelacz na klucze live i gotowe

---

## Struktura plikow

```
ebook-starter-kit/
├── index.html              <- strona sprzedazowa
├── dziekujemy.html          <- strona po zakupie
├── cookies.js               <- GA4 + Meta Pixel + consent
├── ebook.pdf                <- TWOJ EBOOK (dodaj sam)
├── regulamin.html           <- szablon regulaminu
├── polityka-prywatnosci.html <- szablon polityki
├── favicon.svg              <- ikona strony
├── sitemap.xml              <- SEO
├── robots.txt               <- SEO
├── vercel.json              <- config Vercela
├── package.json             <- dependencies
├── .env.example             <- szablon env vars
├── .gitignore
├── api/
│   ├── pay.js               <- tworzy sesje Stripe Checkout
│   ├── stripe-webhook.js    <- obsluga po platnosci (email + faktura)
│   ├── download.js          <- serwuje PDF po weryfikacji tokena
│   ├── verify-token.js      <- weryfikacja tokena (dla strony dziekujemy)
│   └── subscribe.js         <- zapis na liste mailingowa
└── README.md
```

---

## FAQ

**Ile to kosztuje?**
Hosting i maile za darmo. Placisz tylko prowizje Stripe (1.5% + 1 PLN) i domene (~40 PLN/rok).

**Czy musze miec firme?**
Do sprzedazy online w PL potrzebujesz JDG lub spolki. Jesli masz <18 lat — rodzic moze zalozyc JDG.

**Czy moge zmienic design?**
Tak — to czysty HTML + CSS. Zmieniaj co chcesz.

**Czy moge sprzedawac w innej walucie?**
Tak — zmien `PRODUCT_CURRENCY` w `api/pay.js` i ceny w HTML.

**Czy Fakturownia jest wymagana?**
Nie — jesli nie ustawisz `FAKTUROWNIA_TOKEN`, ta czesc sie pominie. Ale jesli masz JDG, faktury sa obowiazkowe.
