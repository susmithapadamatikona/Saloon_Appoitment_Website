/* ==========================================================================
   images.js — real photography engine with branded fallback art
   --------------------------------------------------------------------------
   Every image on the platform is requested through Img.get(seed, kind).

   1. PRIMARY   — curated Full-HD salon/beauty photography served from the
                  Unsplash CDN. Key entities (services, stylists, salons)
                  are hand-mapped in OVERRIDES; everything else picks
                  deterministically from a per-category pool, so the same
                  seed always shows the same photo.
   2. FALLBACK  — if a photo fails (offline, blocked CDN), a branded SVG
                  gradient artwork is swapped in automatically. The site
                  never shows a broken image.
   3. LOCAL     — drop files into assets/images/ as <seed>.jpg and set
                  Img.useFiles = true to serve your own photography.
   ========================================================================== */
(function (global) {
  'use strict';

  /* ---------- deterministic hash ---------- */
  function hash(str) {
    var h = 2166136261;
    str = String(str);
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h;
  }
  function rnd(seedNum, i) {
    var x = Math.sin(seedNum * 9301 + i * 49297) * 233280;
    return x - Math.floor(x);
  }

  /* ========================================================================
     CURATED PHOTO LIBRARY (Unsplash CDN photo ids)
     Grouped by visual category. All are long-lived, widely-used photos.
     ======================================================================== */
  var PHOTOS = {
    hair: [
      '1560066984-138dadb4c035', // stylist cutting hair in salon
      '1562322140-8baeececf3df', // hairdresser working on long hair
      '1580618672591-eb180b1a973f', // blow-dry styling
      '1522337660859-02fbefca4702', // beauty salon styling scene
      '1492106087820-71f1a00d2b11', // glossy long hair
      '1519735777090-ec97162dc266', // hair braid detail
      '1605497788044-5a32c7078486', // hair colouring foils
      '1599351431202-1e0f0137899a'  // braided hairstyle
    ],
    makeup: [
      '1487412947147-5cebf100ffc2', // makeup application close-up
      '1512496015851-a90fb38ba796', // makeup brushes flat-lay
      '1596462502278-27bfdc403348', // eyeshadow palette
      '1522335789203-aabd1fc54bc9', // lipstick swatches
      '1487412720507-e7ab37603c6f', // glam lips portrait
      '1526045478516-99145907023c', // cosmetics collection
      '1457972729786-0411a3b2b626'  // painted nails & lipstick hands
    ],
    nails: [
      '1604654894610-df63bc536371', // manicure in progress
      '1519823551278-64ac92734fb1', // nail polish hands
      '1610992015732-2449b76344bc', // nail polish bottles
      '1457972729786-0411a3b2b626', // manicured hands
      '1632345031435-8727f6897d53'  // nail art detail
    ],
    spa: [
      '1544161515-4ab6ce6db874', // spa stones massage
      '1540555700478-4be289fbecef', // back massage
      '1600334129128-685c5582fd35', // spa treatment room
      '1570172619644-dfd03ed5d881', // face mask relaxation
      '1596178065887-1198b6148b2b', // candles & towels
      '1519415510236-718bdfcd89c8'  // relaxing spa scene
    ],
    skin: [
      '1570172619644-dfd03ed5d881', // facial mask
      '1556228453-efd6c1ff04f6',   // skincare product on pink
      '1570554886111-e80fcca6a029', // serum bottle
      '1556228720-195a672e8a03',   // minimalist skincare
      '1508214751196-bcfd4ca60f91', // fresh-skin portrait
      '1576426863848-c21f53c60b19'  // facial treatment
    ],
    bridal: [
      '1595777457583-95e059d581b8', // bride in gown
      '1519741497674-611481863552', // wedding couple
      '1583939003579-730e3918a45a', // wedding celebration
      '1606800052052-a08af7148866', // wedding portrait
      '1610030469668-8e9f641aaf27', // henna / mehendi hands
      '1609357605129-26f69add5d6e'  // bridal detail
    ],
    salon: [
      '1600948836101-f9ffda59d250', // modern salon interior
      '1521590832167-7bcbfaa6381f', // salon chairs & mirrors
      '1585747860715-2ba37e788b70', // barbershop interior
      '1560066984-138dadb4c035',   // salon at work
      '1522337660859-02fbefca4702', // styling stations
      '1633681926022-84c23e8cb2d6'  // beauty room
    ],
    interior: [
      '1600948836101-f9ffda59d250',
      '1521590832167-7bcbfaa6381f',
      '1585747860715-2ba37e788b70',
      '1522337660859-02fbefca4702',
      '1633681926022-84c23e8cb2d6',
      '1595475884562-073c30d45670'
    ],
    person: [
      '1494790108377-be9c29b29330', // woman portrait
      '1438761681033-6461ffad8d80', // woman portrait
      '1544005313-94ddf0286df2',   // woman portrait
      '1534528741775-53994a69daeb', // woman portrait
      '1517841905240-472988babdf9', // woman portrait
      '1529626455594-4ff0802cfb7e', // woman portrait
      '1524504388940-b1c1722653e1', // woman portrait
      '1531746020798-e6953c6e8e04'  // woman portrait
    ],
    man: [
      '1507003211169-0a1dd7228f2d', // man portrait
      '1500648767791-00dcc994a43e', // man portrait
      '1503951914875-452162b0f3f1'  // barber at work
    ],
    blog: [
      '1522338242992-e1a54906a8da', // hair-care flat-lay
      '1512496015851-a90fb38ba796', // makeup flat-lay
      '1556228453-efd6c1ff04f6',   // skincare still life
      '1526045478516-99145907023c', // cosmetics
      '1487412947147-5cebf100ffc2', // makeup artistry
      '1596462502278-27bfdc403348', // palette
      '1522337660859-02fbefca4702'  // salon scene
    ],
    gallery: [
      '1560066984-138dadb4c035', '1487412947147-5cebf100ffc2',
      '1604654894610-df63bc536371', '1544161515-4ab6ce6db874',
      '1595777457583-95e059d581b8', '1600948836101-f9ffda59d250'
    ],
    offer: [
      '1522335789203-aabd1fc54bc9', '1556228453-efd6c1ff04f6',
      '1544161515-4ab6ce6db874', '1604654894610-df63bc536371'
    ],
    service: [
      '1560066984-138dadb4c035', '1522337660859-02fbefca4702',
      '1487412947147-5cebf100ffc2', '1544161515-4ab6ce6db874',
      '1519823551278-64ac92734fb1', '1570172619644-dfd03ed5d881'
    ]
  };

  /* ---------- hand-mapped photos for key entities (seed → photo id) ------ */
  var OVERRIDES = {
    /* hero + feature imagery */
    'hero-main': '1562322140-8baeececf3df',
    'why-lumiere': '1600948836101-f9ffda59d250',
    'join-team': '1522337660859-02fbefca4702',
    'about-story': '1585747860715-2ba37e788b70',
    'about-video': '1600948836101-f9ffda59d250',
    'auth-login': '1600948836101-f9ffda59d250',
    'auth-register': '1487412947147-5cebf100ffc2',
    'auth-forgot': '1544161515-4ab6ce6db874',

    /* services */
    'haircut-styling': '1560066984-138dadb4c035',
    'hair-coloring': '1605497788044-5a32c7078486',
    'hair-spa': '1522337660859-02fbefca4702',
    'keratin-treatment': '1580618672591-eb180b1a973f',
    'facial-treatment': '1570172619644-dfd03ed5d881',
    'skin-brightening': '1556228453-efd6c1ff04f6',
    'anti-aging-facial': '1570554886111-e80fcca6a029',
    'party-makeup': '1487412947147-5cebf100ffc2',
    'bridal-makeup': '1595777457583-95e059d581b8',
    'engagement-package': '1519741497674-611481863552',
    'nail-art': '1604654894610-df63bc536371',
    'manicure': '1519823551278-64ac92734fb1',
    'pedicure': '1457972729786-0411a3b2b626',
    'spa-massage': '1544161515-4ab6ce6db874',
    'body-polishing': '1540555700478-4be289fbecef',
    'head-massage': '1600334129128-685c5582fd35',
    'waxing': '1556228720-195a672e8a03',
    'eyebrow-threading': '1487412720507-e7ab37603c6f',
    'mehendi': '1610030469668-8e9f641aaf27',
    'hair-extensions': '1492106087820-71f1a00d2b11',
    'kids-haircut': '1503951914875-452162b0f3f1',
    'groom-package': '1503951914875-452162b0f3f1',

    /* stylists — distinct portraits, gender-appropriate */
    'aarohi-mehta': '1494790108377-be9c29b29330',
    'priya-nair': '1438761681033-6461ffad8d80',
    'sana-kapoor': '1534528741775-53994a69daeb',
    'ritika-shah': '1517841905240-472988babdf9',
    'meera-iyer': '1544005313-94ddf0286df2',
    'zoya-khan': '1529626455594-4ff0802cfb7e',
    'kabir-anand': '1507003211169-0a1dd7228f2d',
    'ananya-roy': '1524504388940-b1c1722653e1',
    'divya-menon': '1519699047748-de8e457a634e',
    'naina-verma': '1531746020798-e6953c6e8e04',

    /* salons */
    'lumiere-bandra': '1600948836101-f9ffda59d250',
    'lumiere-juhu': '1522337660859-02fbefca4702',
    'lumiere-powai': '1585747860715-2ba37e788b70',
    'lumiere-koregaon': '1600334129128-685c5582fd35',
    'lumiere-indiranagar': '1521590832167-7bcbfaa6381f',
    'lumiere-jubilee': '1633681926022-84c23e8cb2d6',
    'lumiere-cp': '1562322140-8baeececf3df',
    'lumiere-anna-nagar': '1560066984-138dadb4c035',

    /* blog posts — distinct, topic-appropriate photos (slug hashing collides) */
    'winter-hair-care-guide': '1522338242992-e1a54906a8da',
    'facial-frequency-truth': '1570172619644-dfd03ed5d881',
    'bridal-beauty-timeline': '1595777457583-95e059d581b8',
    'nail-art-trends-2026': '1632345031435-8727f6897d53',
    'hair-colour-maintenance': '1605497788044-5a32c7078486',
    'makeup-for-indian-skin': '1487412947147-5cebf100ffc2',
    'spa-day-benefits': '1540555700478-4be289fbecef',
    'acne-skincare-routine': '1556228453-efd6c1ff04f6',
    'salon-hygiene-standards': '1521590832167-7bcbfaa6381f',

    /* category tiles */
    'cat-hair': '1560066984-138dadb4c035',
    'cat-skin': '1570172619644-dfd03ed5d881',
    'cat-makeup': '1487412947147-5cebf100ffc2',
    'cat-nails': '1604654894610-df63bc536371',
    'cat-spa': '1544161515-4ab6ce6db874',
    'cat-bridal': '1595777457583-95e059d581b8',
    'cat-wellness': '1540555700478-4be289fbecef',
    'cat-all-services': '1521590832167-7bcbfaa6381f'
  };

  /* map loose kind names onto photo pools */
  function pool(kind) {
    if (PHOTOS[kind]) return PHOTOS[kind];
    if (/hair/.test(kind)) return PHOTOS.hair;
    if (/skin|facial/.test(kind)) return PHOTOS.skin;
    if (/make/.test(kind)) return PHOTOS.makeup;
    if (/nail/.test(kind)) return PHOTOS.nails;
    if (/spa|massage|well/.test(kind)) return PHOTOS.spa;
    if (/brid|mehendi|wedding/.test(kind)) return PHOTOS.bridal;
    if (/salon|interior|store/.test(kind)) return PHOTOS.salon;
    if (/person|portrait|user/.test(kind)) return PHOTOS.person;
    if (/blog|post/.test(kind)) return PHOTOS.blog;
    return PHOTOS.service;
  }

  /** Resolve seed+kind → Unsplash photo id (deterministic). */
  function photoId(seed, kind) {
    if (OVERRIDES[seed]) return OVERRIDES[seed];
    var p = pool(kind || 'service');
    return p[hash(seed) % p.length];
  }

  /** Build a Full-HD CDN URL cropped to the requested aspect ratio. */
  function photoUrl(seed, kind, w, h) {
    w = w || 800;
    h = h || 600;
    /* serve at 2× the layout size for retina sharpness, capped at Full HD */
    var scale = Math.min(2, 1920 / w);
    var W = Math.min(1920, Math.round(w * Math.max(1, scale)));
    var H = Math.round(W * (h / w));
    var face = /person|portrait|man/.test(kind || '') ? '&crop=faces' : '';
    return 'https://images.unsplash.com/photo-' + photoId(seed, kind) +
      '?auto=format&fit=crop&q=80&w=' + W + '&h=' + H + face;
  }

  /* ========================================================================
     BRANDED FALLBACK ART (offline / CDN-blocked safety net)
     ======================================================================== */
  var PALETTES = [
    ['#FCE4EC', '#F06292', '#AD1457', '#FFFFFF'],
    ['#F8BBD0', '#E91E63', '#6A1B3D', '#FFF3F7'],
    ['#EDE7F6', '#9575CD', '#4A2C7A', '#FFFFFF'],
    ['#FFF3E0', '#FFB74D', '#B4741A', '#FFF9F2'],
    ['#E0F2F1', '#4DB6AC', '#1F6E68', '#FFFFFF'],
    ['#E3F2FD', '#64B5F6', '#2F79B8', '#FFFFFF'],
    ['#FCE4EC', '#9575CD', '#AD1457', '#FFF7FA'],
    ['#FFEBEE', '#F06292', '#7B1F3F', '#FFFFFF']
  ];

  var GLYPH = {
    service: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>',
    hair: '<path d="M12 2C7 2 4 6 4 11v9h4v-7c0-1 1-2 2-2s2 1 2 2v7h4v-9c0-5-3-9-4-9z"/>',
    skin: '<path d="M12 2.7l5.3 5.3a7.5 7.5 0 1 1-10.6 0z"/>',
    makeup: '<path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/><path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>',
    nails: '<path d="M18 11V6a2 2 0 0 0-4 0v5M14 10V4a2 2 0 0 0-4 0v7M10 10.5V6a2 2 0 0 0-4 0v9"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    spa: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
    bridal: '<path d="M2 18h20l-1.5-9-5 4L12 5 8.5 13l-5-4L2 18z"/><line x1="4" y1="21" x2="20" y2="21"/>',
    salon: '<path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9"/><path d="M9 21v-6h6v6"/>',
    person: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a8 8 0 0 1 16 0v1"/>',
    blog: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="15" x2="8" y2="15"/>',
    gallery: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
    interior: '<path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-7h6v7"/>'
  };

  function svg(seed, kind, w, h) {
    var n = hash(seed);
    var pal = PALETTES[n % PALETTES.length];
    var c1 = pal[0], c2 = pal[1], c3 = pal[2], c4 = pal[3];
    var id = 'g' + (n % 99999);
    var angle = Math.floor(rnd(n, 1) * 140) + 20;
    var glyph = GLYPH[kind] || GLYPH.service;

    var blobs = '';
    for (var i = 0; i < 4; i++) {
      var cx = Math.round(rnd(n, i + 2) * w);
      var cy = Math.round(rnd(n, i + 7) * h);
      var r = Math.round((0.18 + rnd(n, i + 11) * 0.3) * Math.min(w, h));
      var fill = [c4, c2, c1, c3][i % 4];
      var op = (0.14 + rnd(n, i + 17) * 0.3).toFixed(2);
      blobs += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '" opacity="' + op + '"/>';
    }
    var gs = Math.round(Math.min(w, h) * 0.34);

    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<defs><linearGradient id="' + id + '" gradientTransform="rotate(' + angle + ')">' +
      '<stop offset="0%" stop-color="' + c1 + '"/><stop offset="52%" stop-color="' + c2 + '"/>' +
      '<stop offset="100%" stop-color="' + c3 + '"/></linearGradient>' +
      '<filter id="b' + id + '" x="-30%" y="-30%" width="160%" height="160%">' +
      '<feGaussianBlur stdDeviation="' + Math.round(Math.min(w, h) * 0.08) + '"/></filter></defs>' +
      '<rect width="' + w + '" height="' + h + '" fill="url(#' + id + ')"/>' +
      '<g filter="url(#b' + id + ')">' + blobs + '</g>' +
      '<g transform="translate(' + (w / 2 - gs / 2) + ' ' + (h / 2 - gs / 2) + ') scale(' + (gs / 24) + ')" ' +
      'fill="none" stroke="' + c4 + '" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" opacity="0.42">' +
      glyph + '</g></svg>';
  }

  var cache = {};

  /* ========================================================================
     PUBLIC API
     ======================================================================== */
  var Img = {
    useFiles: false,
    dir: 'assets/images/',

    /** Branded SVG artwork as a data URI (fallback layer). */
    art: function (seed, kind, w, h) {
      var key = seed + '|' + kind + '|' + w + '|' + h;
      if (cache[key]) return cache[key];
      var uri = 'data:image/svg+xml;charset=utf-8,' +
        encodeURIComponent(svg(seed, kind || 'service', w || 800, h || 600));
      cache[key] = uri;
      return uri;
    },

    /** src for an <img> — local file, real photo, in that preference order. */
    get: function (seed, kind, w, h) {
      if (Img.useFiles) return Img.dir + seed + '.jpg';
      return photoUrl(seed, kind, w, h);
    },

    /** onerror handler — swaps a failed photo for branded artwork. */
    fallback: function (el) {
      if (el.dataset.fellBack) return;
      el.dataset.fellBack = '1';
      el.src = Img.art(el.dataset.seed || el.alt || 'lumiere', el.dataset.kind || 'service',
        parseInt(el.dataset.w, 10) || 800, parseInt(el.dataset.h, 10) || 600);
    },

    /** Full <img> tag with lazy-loading, alt text and fallback wiring. */
    tag: function (opts) {
      var o = opts || {};
      var w = o.w || 800, h = o.h || 600;
      return '<img src="' + Img.get(o.seed, o.kind, w, h) + '" alt="' + (o.alt || '').replace(/"/g, '&quot;') +
        '" loading="' + (o.eager ? 'eager' : 'lazy') + '" decoding="async" width="' + w + '" height="' + h +
        '" data-seed="' + o.seed + '" data-kind="' + (o.kind || 'service') + '" data-w="' + w + '" data-h="' + h +
        '" onerror="Img.fallback(this)"' + (o.cls ? ' class="' + o.cls + '"' : '') + '>';
    },

    /** Hydrate <img data-img="seed" data-kind="…"> written directly in HTML. */
    hydrate: function (root) {
      (root || document).querySelectorAll('img[data-img]').forEach(function (el) {
        if (el.getAttribute('src')) return;
        var w = parseInt(el.dataset.w, 10) || el.width || 800;
        var h = parseInt(el.dataset.h, 10) || el.height || 600;
        el.dataset.seed = el.dataset.img;
        el.dataset.w = w;
        el.dataset.h = h;
        el.src = Img.get(el.dataset.img, el.dataset.kind || 'service', w, h);
        el.setAttribute('onerror', 'Img.fallback(this)');
      });
    },

    photoId: photoId
  };

  /* Safety net: catch load failures from ANY <img> on the page (including
     ones created without explicit onerror wiring) and apply fallback art.
     'error' doesn't bubble, so listen in the capture phase. */
  document.addEventListener('error', function (e) {
    var el = e.target;
    if (el && el.tagName === 'IMG' && !el.dataset.fellBack) {
      if (!el.dataset.seed) el.dataset.seed = (el.alt || el.getAttribute('src') || 'lumiere').slice(0, 48);
      Img.fallback(el);
    }
  }, true);

  global.Img = Img;
  document.addEventListener('DOMContentLoaded', function () { Img.hydrate(document); });
})(window);
