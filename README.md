# Ebook Starter Kit

**Sprzedawaj swojego ebooka online — bez wiedzy technicznej, za darmo.**

Masz ebooka w PDF i chcesz go sprzedawać w internecie? Ten starter kit daje Ci gotowy sklep. Nie musisz umieć programować — wystarczy że masz [Claude Code](https://claude.ai/download) (AI, które edytuje kod za Ciebie).

---

## Co dostajesz

- **Profesjonalna strona sprzedażowa** — gotowa, responsywna, zoptymalizowana pod sprzedaż
- **Płatności online** — karty, BLIK, przelewy bankowe (przez Stripe)
- **Automatyczna wysyłka ebooka** — kupujący dostaje maila z linkiem do pobrania natychmiast po płatności
- **Automatyczne faktury VAT** — opcjonalnie, przez Fakturownia.pl
- **Strona "dziękujemy"** — z przyciskiem do pobrania PDF
- **Regulamin i polityka prywatności** — gotowe szablony, wystarczy wpisać dane firmy
- **Analityka** — Google Analytics + Meta Pixel (do reklam na FB/IG), z banerem cookies
- **Lista mailingowa** — zbieraj emaile kupujących (przez Resend)
- **SEO** — meta tagi, schema markup, sitemap — żeby Google Cię znalazł
- **Zabezpieczony download** — PDF dostępny tylko dla kupujących, link wygasa po 7 dniach

## Ile to kosztuje

| Co | Koszt |
|---|---|
| Hosting strony (Vercel) | **0 PLN** |
| Wysyłka maili (Resend) | **0 PLN** (do 3000/miesiąc) |
| Prowizja od płatności (Stripe) | **1.5% + 1 PLN** za transakcję |
| Domena (np. mojebook.pl) | **~40 PLN/rok** |

Czyli jeśli sprzedajesz ebooka za 49 PLN, Stripe pobiera ~1.74 PLN. Reszta jest Twoja.

---

## Jak zacząć (nie musisz umieć programować)

### Czego potrzebujesz

- Ebook w formacie PDF
- Firma (JDG lub spółka — w Polsce musisz mieć firmę żeby sprzedawać online)
- Domena (np. mojebook.pl — kupujesz u dowolnego rejestratora za ~40 PLN/rok)
- [Claude Code](https://claude.ai/download) — AI, które zedytuje cały kod za Ciebie

### Krok 1: Pobierz ten projekt

Otwórz terminal (na Windowsie: wyszukaj "Terminal" lub "PowerShell") i wpisz:

```bash
git clone https://github.com/egzey0/ebook-starter-kit.git
cd ebook-starter-kit
npm install
```

> **Nie masz git?** Kliknij zielony przycisk "Code" na górze tej strony → "Download ZIP" → rozpakuj.
>
> **Nie masz npm?** Zainstaluj [Node.js](https://nodejs.org/) (kliknij "LTS", zainstaluj, gotowe).

### Krok 2: Odpal Claude Code i powiedz mu co chcesz

W terminalu, w folderze projektu, uruchom Claude Code:

```bash
claude
```

A potem napisz mu coś w stylu:

> *Cześć, chcę ustawić sklep z moim ebookiem. Mój ebook nazywa się "Jak pisać lepiej", kosztuje 49 PLN, ma 120 stron. Moja domena to jakpisac.pl, email kontakt@jakpisac.pl. Firma: Jan Kowalski, NIP 1234567890, ul. Przykładowa 1, 00-001 Warszawa.*

Claude przeczyta instrukcje z tego repo (`CLAUDE.md`) i:
1. Dopyta o brakujące szczegóły (rozdziały, opinie, bio autora)
2. Zedytuje wszystkie pliki za Ciebie
3. Poda Ci listę kroków co dalej (Stripe, Resend, Vercel)

**To wszystko.** Claude zrobi za Ciebie całą robotę techniczną.

### Krok 3: Załóż konta (darmowe)

Claude powie Ci dokładnie co i gdzie, ale w skrócie:

1. **[Stripe](https://stripe.com)** — tu będą wpływać pieniądze od klientów. Załóż konto, podaj dane firmy i konto bankowe.

2. **[Resend](https://resend.com)** — tu będą wysyłane maile z ebookiem do kupujących. Załóż konto i zweryfikuj domenę.

3. **[Vercel](https://vercel.com)** — tu będzie "mieszkać" Twoja strona w internecie. Połącz z GitHubem, zaimportuj repo, gotowe.

### Krok 4: Wrzuć stronę do internetu

Połącz repo z Vercelem, dodaj klucze API w panelu Vercela, podepnij domenę — i Twój sklep jest live.

Claude poprowadzi Cię przez każdy z tych kroków.

---

## Jak to działa (od strony kupującego)

1. Klient wchodzi na Twoją stronę i klika **"Kupuję"**
2. Wpisuje email, podaje dane płatności (karta/BLIK) na stronie Stripe
3. Po zapłaceniu — trafia na stronę **"Dziękujemy"** z przyciskiem **"Pobierz PDF"**
4. Jednocześnie dostaje **maila z linkiem** do pobrania (na wypadek gdyby zamknął stronę)
5. Opcjonalnie — **faktura VAT** generuje się automatycznie i przychodzi na maila

---

## Struktura projektu

Nie musisz tego rozumieć — Claude ogarnie. Ale jeśli jesteś ciekaw:

```
ebook-starter-kit/
├── index.html               ← strona sprzedażowa (to widzi klient)
├── dziekujemy.html           ← strona po zakupie (pobieranie PDF)
├── cookies.js                ← analityka + baner cookies
├── ebook.pdf                 ← TWÓJ EBOOK (dodaj sam)
├── regulamin.html            ← regulamin sklepu
├── polityka-prywatnosci.html ← polityka prywatności
├── favicon.svg               ← ikonka w przeglądarce
├── sitemap.xml               ← mapa strony dla Google
├── robots.txt                ← instrukcje dla Google
├── vercel.json               ← konfiguracja hostingu
├── package.json              ← lista używanych bibliotek
├── .env.example              ← szablon konfiguracji (klucze API)
├── CLAUDE.md                 ← instrukcje dla Claude Code
├── api/
│   ├── pay.js                ← obsługa płatności
│   ├── stripe-webhook.js     ← wysyłka maila + faktury po zakupie
│   ├── download.js           ← serwowanie pliku PDF
│   ├── verify-token.js       ← weryfikacja linku do pobrania
│   └── subscribe.js          ← zapis na listę mailingową
└── README.md                 ← ten plik
```

---

## FAQ

**Ile to kosztuje?**
Hosting i maile za darmo. Płacisz tylko prowizję Stripe (1.5% + 1 PLN za transakcję) i domenę (~40 PLN/rok).

**Czy muszę umieć programować?**
Nie. Claude Code zedytuje cały kod za Ciebie. Ty tylko podajesz informacje o swoim ebooku.

**Czy muszę mieć firmę?**
Tak — do sprzedaży online w Polsce potrzebujesz JDG lub spółki.

**Czy mogę zmienić wygląd strony?**
Tak — powiedz Claude'owi jak ma wyglądać Twoja strona, a on zmieni design. To czysty HTML + CSS, więc można zmienić wszystko.

**Czy mogę sprzedawać w innej walucie?**
Tak — powiedz Claude'owi, a zmieni walutę na EUR, USD czy co chcesz.

**Czy faktury są wymagane?**
Jeśli masz firmę w Polsce — tak. Starter kit obsługuje automatyczne faktury przez Fakturownia.pl, ale to opcjonalne (możesz wystawiać faktury ręcznie).

**Co jeśli coś nie działa?**
Opisz problem Claude'owi — prawdopodobnie go naprawi. Jeśli nie, napisz issue na tym repo.

---

Zbudowane na: [Stripe](https://stripe.com) · [Resend](https://resend.com) · [Vercel](https://vercel.com) · [Fakturownia](https://fakturownia.pl)
