// Cookie consent + GA4 + Meta Pixel
// Tokeny brane z <meta> tagow w HTML (patrz index.html) lub hardkoduj ponizej

(function() {
  // === CONFIG ===
  // Wpisz swoje ID lub zostaw puste jesli nie uzywasz
  var GA4_ID = ''; // np. 'G-XXXXXXXXXX'
  var META_PIXEL_ID = ''; // np. '1234567890'

  var COOKIE_NAME = 'cookie_consent';
  var COOKIE_DAYS = 365;

  function getCookie(name) {
    var v = document.cookie.match('(^|;)\\s*' + name + '=([^;]*)');
    return v ? v[2] : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 86400000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }

  function loadGA4() {
    if (!GA4_ID) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA4_ID);

    // Purchase event na stronie sukcesu
    var path = window.location.pathname;
    if (path === '/dziekujemy' || path === '/dziekujemy.html') {
      gtag('event', 'purchase', { currency: 'PLN', value: 49, items: [{ item_name: 'Ebook', price: 49, quantity: 1 }] });
    }
  }

  function loadMetaPixel() {
    if (!META_PIXEL_ID) return;
    !function(f,b,e,v,n,t,s) {
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');

    var path = window.location.pathname;
    if (path === '/' || path === '/index.html') {
      fbq('track', 'ViewContent', { content_name: 'Ebook', content_type: 'product', value: 49, currency: 'PLN' });
    }
    if (path === '/dziekujemy' || path === '/dziekujemy.html') {
      fbq('track', 'Purchase', { content_name: 'Ebook', value: 49, currency: 'PLN' });
    }
  }

  function loadAll() { loadGA4(); loadMetaPixel(); }

  var consent = getCookie(COOKIE_NAME);
  if (consent === 'all') { loadAll(); return; }
  if (consent === 'necessary') { return; }

  // --- BANNER ---
  var banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.innerHTML =
    '<div class="cb-inner">' +
      '<div class="cb-text">' +
        '<b>Cookies</b><br>' +
        'Uzywamy cookies do analityki (Google, Meta). ' +
        '<a href="/polityka-prywatnosci" style="color:#2563eb;">Polityka prywatnosci</a>' +
      '</div>' +
      '<div class="cb-buttons">' +
        '<button id="cb-accept" class="cb-btn cb-yes">Akceptuje</button>' +
        '<button id="cb-reject" class="cb-btn cb-no">Tylko niezbedne</button>' +
      '</div>' +
    '</div>';

  var style = document.createElement('style');
  style.textContent =
    '#cookie-banner {' +
      'position:fixed;bottom:0;left:0;right:0;z-index:9999;' +
      'background:#fff;border-top:1px solid #e5e7eb;' +
      'box-shadow:0 -4px 20px rgba(0,0,0,0.08);' +
      'padding:0;font-family:system-ui,sans-serif;font-size:14px;' +
    '}' +
    '#cookie-banner .cb-inner {' +
      'max-width:720px;margin:0 auto;padding:16px 20px;' +
      'display:flex;align-items:center;gap:16px;flex-wrap:wrap;' +
    '}' +
    '#cookie-banner .cb-text { flex:1;min-width:200px;line-height:1.4;color:#555; }' +
    '#cookie-banner .cb-buttons { display:flex;gap:8px;flex-shrink:0; }' +
    '#cookie-banner .cb-btn {' +
      'font-family:system-ui,sans-serif;font-size:13px;font-weight:600;' +
      'padding:8px 18px;border:none;border-radius:6px;cursor:pointer;' +
    '}' +
    '#cookie-banner .cb-yes { background:#1a1a1a;color:#fff; }' +
    '#cookie-banner .cb-yes:hover { background:#333; }' +
    '#cookie-banner .cb-no { background:#f3f4f6;color:#333; }' +
    '#cookie-banner .cb-no:hover { background:#e5e7eb; }' +
    '@media(max-width:600px) {' +
      '#cookie-banner .cb-inner { flex-direction:column;text-align:center;gap:10px; }' +
      '#cookie-banner .cb-buttons { width:100%;justify-content:center; }' +
    '}';

  document.head.appendChild(style);

  function show() {
    document.body.appendChild(banner);
    document.getElementById('cb-accept').addEventListener('click', function() {
      setCookie(COOKIE_NAME, 'all', COOKIE_DAYS);
      banner.remove();
      loadAll();
    });
    document.getElementById('cb-reject').addEventListener('click', function() {
      setCookie(COOKIE_NAME, 'necessary', COOKIE_DAYS);
      banner.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', show);
  } else {
    show();
  }
})();
