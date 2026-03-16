# Ebook Starter Kit — Instrukcje dla Claude

## KIM JEST UŻYTKOWNIK

Użytkownik tego repo to **nowicjusz techniczny**. Prawdopodobnie nie jest programistą — to autor ebooka, twórca, ekspert w swojej dziedzinie, który chce sprzedawać swojego ebooka online. Może nigdy nie widział kodu, nie wie co to terminal, API, env vars, webhook czy DNS.

**Twoja rola:** Bądź cierpliwym przewodnikiem. Przy KAŻDYM kroku tłumacz:
- **CO** robisz i **PO CO** — np. "Zmieniam teraz adres email w kodzie, żeby kupujący mogli się z Tobą kontaktować"
- **Nie używaj żargonu** bez wyjaśnienia — jeśli musisz użyć słowa jak "webhook", od razu dodaj "(czyli automatyczne powiadomienie z Stripe do Twojej strony, że ktoś zapłacił)"
- **Nie zakładaj wiedzy** — jeśli mówisz "wrzuć plik PDF do katalogu głównego", wyjaśnij że to ten sam folder gdzie jest index.html
- **Jeśli użytkownik czegoś nie rozumie** — wytłumacz prościej, nie powtarzaj tego samego innymi słowami

## Jak działa ten projekt (tło dla Ciebie)

To gotowy sklep do sprzedaży ebooka online. Składa się z:
- **index.html** — strona sprzedażowa, którą widzi klient. Tu jest opis ebooka, cena, przycisk "Kupuję"
- **dziekujemy.html** — strona, na którą trafia klient PO zakupie. Tu pobiera PDF
- **api/** — kod serwerowy, który obsługuje płatności (Stripe), wysyła maile (Resend) i generuje faktury (Fakturownia)
- **cookies.js** — skrypt do analityki (Google Analytics, Meta Pixel) z banerem o ciasteczkach

Stos technologiczny: Stripe (płatności kartą/BLIK), Resend (wysyłka maili), Vercel (hosting), opcjonalnie Fakturownia (faktury VAT). Wszystko za darmo poza prowizją Stripe (1.5% + 1 PLN od transakcji) i domeną (~40 PLN/rok).

## Jak działa setup

Użytkownik sklonował to repo i chce dostosować je do SWOJEGO ebooka. Zapytaj go o te dane (możesz zapytać wszystko naraz, ale wyjaśnij po co Ci każda informacja):

### Dane wymagane
1. **Tytuł ebooka** — np. "Jak pisać lepiej" *(pojawi się na stronie, w emailach i na fakturze)*
2. **O czym jest ebook** — 1-2 zdania, co czytelnik dostaje *(to będzie na stronie jako główny opis)*
3. **Cena brutto w PLN** — np. 49 *(tyle zapłaci kupujący, brutto = z VAT-em)*
4. **Ile ma stron** — np. 120 *(pojawi się na stronie jako informacja dla kupującego)*
5. **Domena** — np. mojebook.pl *(adres strony w internecie, musi ją kupić osobno)*
6. **Email kontaktowy** — np. kontakt@mojebook.pl *(do kontaktu z kupującymi)*
7. **Dane sprzedawcy** — imię i nazwisko lub nazwa firmy, opcjonalnie NIP, adres *(wymagane prawnie w regulaminie i polityce prywatności — nie musi mieć firmy, może sprzedawać jako osoba prywatna w ramach NDG, ale może też mieć JDG lub spółkę)*
8. **Imię autora** — *(pojawi się w sekcji "O autorze" na stronie)*

### Dane opcjonalne (zapytaj, ale nie wymagaj — wyjaśnij po co)
- **Rozdziały ebooka** — tytuły i krótkie opisy *(pokażemy kupującemu co jest w środku, żeby wiedział za co płaci)*
- **Problemy czytelnika** — co go boli, z czym się zmaga *(sekcja "Brzmi znajomo?" — czytelnik musi poczuć że ten ebook jest dla niego)*
- **Opinie czytelników** — cytaty + imiona *(social proof — ludzie kupują chętniej gdy widzą że inni już kupili i są zadowoleni)*
- **Bio autora** — dlaczego napisałeś tego ebooka, jakie masz doświadczenie *(żeby czytelnik Ci zaufał)*
- **Ile osób kupiło** — np. "500+ osób" *(jeśli dopiero startujesz, to pomijamy tę sekcję)*
- **Google Analytics** — czy chcesz śledzić ruch na stronie? *(darmowe narzędzie od Google, które pokazuje ile osób odwiedza Twoją stronę)*
- **Meta Pixel** — czy planujesz reklamy na Facebooku/Instagramie? *(jeśli tak, Pixel pomoże mierzyć skuteczność reklam)*
- **Faktury** — czy chcesz automatycznie wystawiać faktury VAT? *(wymaga konta na Fakturownia.pl — to osobna usługa)*

## Gdzie co zmieniać

### `index.html` — strona sprzedażowa
Wszystkie placeholdery do zamiany:
- `Moj Ebook` / `MojEbook` → tytuł ebooka (tytuł strony, nav logo, schema, CTA)
- `Tytul Twojego Ebooka Tutaj` → headline (h1 w hero)
- `Opis Twojego ebooka w jednym zdaniu. Zmien to.` → meta description
- `twojadomena.pl` → domena użytkownika (canonical, schema, link w FAQ)
- `kontakt@twojadomena.pl` → email kontaktowy
- `49 PLN` → cena (w hero CTA, pricing, final CTA)
- `49` → cena w schema markup
- `XX stron` → liczba stron
- `[Twoje Imie]` → imię autora
- `[Twoja Firma]` → nazwa firmy w footer
- Sekcja pain points (4 karty) → problemy czytelnika
- Sekcja features-list (5 pozycji) → rozdziały ebooka
- Sekcja testimonials (4 karty) → opinie czytelników
- Sekcja author → bio autora
- Social proof `500+` → prawdziwa liczba lub usunąć jeśli brak

### `dziekujemy.html` — strona po zakupie
- `kontakt@twojadomena.pl` → email kontaktowy
- `Twoja Firma` → nazwa firmy w footer

### `api/pay.js` — konfiguracja płatności
- `PRODUCT_NAME` (linia ~15) → tytuł ebooka
- `PRODUCT_DESCRIPTION` (linia ~16) → opis
- `PRODUCT_PRICE` (linia ~17) → cena brutto w **groszach** (49 PLN = 4900)
- `VAT_RATE` (linia ~19) → stawka VAT (ebooki w PL = 5%)

### `api/stripe-webhook.js` — email po zakupie
- `PRODUCT_NAME` (linia ~17) → tytuł ebooka
- `FROM_EMAIL` (linia ~18) → email nadawcy (musi być zweryfikowany w Resend)
- `CONTACT_EMAIL` (linia ~19) → email kontaktowy
- `VAT_RATE` (linia ~20) → stawka VAT

### `api/download.js` — serwowanie PDF
- `PDF_FILENAME` (linia ~14) → nazwa pliku PDF w katalogu
- `DOWNLOAD_FILENAME` (linia ~15) → nazwa pliku przy pobieraniu

### `cookies.js` — analityka
- GA4 ID (szukaj `G-` na początku pliku) → Measurement ID użytkownika lub zostaw puste
- Meta Pixel ID (szukaj numeru pixela) → Pixel ID użytkownika lub zostaw puste

### `regulamin.html` — regulamin sklepu
- Dane firmy: nazwa, NIP, adres, email
- Nazwa produktu, cena

### `polityka-prywatnosci.html` — polityka prywatności
- Dane firmy: nazwa, NIP, adres, email
- Domena

### `sitemap.xml`
- `twojadomena.pl` → domena użytkownika

### `robots.txt`
- `twojadomena.pl` → domena użytkownika

### `.env.example`
- Zaktualizuj `SITE_URL` na domenę użytkownika

## Ważne zasady

1. **Nie zmieniaj logiki kodu** — zmieniaj tylko treści, nazwy, ceny, dane kontaktowe
2. **Cena w api/pay.js jest w groszach** — 49 PLN = 4900, 79 PLN = 7900
3. **VAT na ebooki w Polsce = 5%** — chyba że użytkownik powie inaczej
4. **FROM_EMAIL musi być z domeny zweryfikowanej w Resend** — zazwyczaj ebook@domena.pl lub kontakt@domena.pl
5. **Nie twórz nowych plików** — wszystko jest już w repo, wystarczy podmienić treści
6. **Design jest generyczny celowo** — użytkownik może go zmienić jak chce, ale domyślny wygląd jest profesjonalny i konwertujący
7. **Jeśli użytkownik nie ma jeszcze opinii/testimoniali** — zostaw placeholdery lub zasugeruj żeby uzupełnił później
8. **Schema markup** — aktualizuj Product i FAQPage schema razem z treściami

## Kolejność pracy

1. Zapytaj o dane (wszystkie naraz, jedno pytanie) — wyjaśnij po co Ci każda informacja
2. Zmień `index.html` (największy plik, najwięcej zmian)
3. Zmień `api/pay.js`, `api/stripe-webhook.js`, `api/download.js`
4. Zmień `dziekujemy.html`
5. Zmień `regulamin.html` i `polityka-prywatnosci.html`
6. Zmień `sitemap.xml`, `robots.txt`
7. Zmień `cookies.js` (jeśli podał ID analityki)
8. Podsumuj co zostało do zrobienia — krok po kroku, z linkami i wyjaśnieniami

## Po zakończeniu

Poprowadź użytkownika przez resztę procesu krok po kroku. Pamiętaj — to nowicjusz, więc tłumacz WSZYSTKO. Oto co musi zrobić:

### 1. Wrzuć plik PDF
Umieść swój ebook (plik PDF) w tym samym folderze co `index.html`. Nazwij go `ebook.pdf` (albo zmień nazwę w kodzie — to już zrobiliśmy).

### 2. Załóż konto Stripe (obsługa płatności)
Stripe to firma, która będzie przyjmować płatności od Twoich klientów (karty, BLIK). Ty nie musisz nic programować — Stripe robi to za Ciebie.
- Wejdź na stripe.com i załóż konto
- Stripe poprosi o dane firmy, konto bankowe (na to konto będą wpływać pieniądze od klientów)
- W panelu Stripe: Developers → API keys → skopiuj "Secret key" (zaczyna się od `sk_live_...`)

### 3. Załóż konto Resend (wysyłka maili)
Resend to serwis do wysyłania maili. Kiedy ktoś kupi Twojego ebooka, Resend automatycznie wyśle mu maila z linkiem do pobrania.
- Wejdź na resend.com i załóż konto
- Musisz zweryfikować swoją domenę (Resend powie Ci jakie rekordy DNS dodać — to jednorazowa czynność)
- API Keys → Create → skopiuj klucz (zaczyna się od `re_...`)

### 4. Skopiuj plik .env.example do .env i wypełnij go
Plik `.env` to Twoja prywatna konfiguracja — tutaj wklejasz klucze API, których nie chcesz upubliczniać. Instrukcja:
```bash
cp .env.example .env
```
Otwórz plik `.env` i wklej swoje klucze ze Stripe i Resend.

### 5. Deploy na Vercel (publikacja strony)
Vercel to darmowy hosting — Twoja strona będzie tam "mieszkać" w internecie.
- Wejdź na vercel.com i załóż konto (najlepiej połącz z GitHubem)
- Zaimportuj swoje repo — Vercel automatycznie opublikuje stronę
- W panelu Vercel: Settings → Environment Variables → dodaj WSZYSTKIE zmienne z pliku `.env`
  (To ważne — plik .env działa tylko lokalnie, Vercel potrzebuje tych samych wartości w swoim panelu)

### 6. Podepnij domenę
- W panelu Vercel: Settings → Domains → dodaj swoją domenę
- U rejestratora domeny (np. OVH, home.pl) dodaj rekordy DNS:
  - Rekord A: `76.76.21.21`
  - Rekord CNAME: `cname.vercel-dns.com`
- Vercel sam ogarnie certyfikat SSL (kłódka w przeglądarce, https)

### 7. Ustaw webhook Stripe
Webhook to sposób, w jaki Stripe mówi Twojej stronie "hej, ktoś właśnie zapłacił!". Bez tego kupujący nie dostanie maila z ebookiem.
- W panelu Stripe: Developers → Webhooks → Add endpoint
- URL: `https://twojadomena.pl/api/stripe-webhook`
- Events: zaznacz `checkout.session.completed`
- Skopiuj "Signing secret" (`whsec_...`) i dodaj go do env vars w Vercel jako `STRIPE_WEBHOOK_SECRET`

### 8. Przetestuj!
Zanim zaczniesz sprzedawać, przetestuj czy wszystko działa:
- W Stripe przełącz się na tryb testowy (Test mode)
- Użyj karty testowej: `4242 4242 4242 4242`, dowolna data, dowolne CVC
- Sprawdź czy email z ebookiem dochodzi
- Sprawdź czy możesz pobrać PDF ze strony "dziękujemy"
- Jak działa — przełącz Stripe na tryb live (prawdziwe klucze `sk_live_...`) i gotowe!
