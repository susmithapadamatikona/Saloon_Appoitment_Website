/* ==========================================================================
   components.js — shared card renderers used across pages
   Everything returns an HTML string; wishlist buttons carry data attributes
   picked up by wishlist.js.
   ========================================================================== */
(function (global) {
  'use strict';

  var UI = {};

  /* ---------------------------------------------------------- service card */
  UI.serviceCard = function (s, opts) {
    opts = opts || {};
    var cat = DATA.category(s.cat);
    var fav = Store.inWishlist('service', s.id);
    return '<article class="svc-card" data-reveal="up">' +
      '<div class="svc-card__media">' +
      Img.tag({ seed: s.slug, kind: s.kind, alt: s.name + ' at Lumière', w: 640, h: 480 }) +
      '<span class="svc-card__cat badge badge--glass">' + Icon.get(cat.icon) + cat.name + '</span>' +
      '<button class="btn-icon btn-icon--glass btn-fav svc-card__fav' + (fav ? ' is-active' : '') + '" data-wish="service" data-wish-id="' + s.id + '" aria-label="Save ' + s.name + ' to wishlist" aria-pressed="' + fav + '">' + Icon.get('heart') + '</button>' +
      '<span class="svc-card__dur">' + Icon.get('clock') + DATA.duration(s.duration) + '</span>' +
      '<span class="svc-card__rating">' + Icon.get('star') + s.rating + '</span>' +
      '</div>' +
      '<div class="svc-card__body">' +
      '<h3 class="svc-card__title"><a href="service-details.html?s=' + s.slug + '">' + s.name + '</a></h3>' +
      '<p class="svc-card__desc">' + s.short + '</p>' +
      (s.tags && s.tags.length ? '<div class="svc-card__tags">' + s.tags.map(function (t) { return '<span class="svc-card__tag">' + t + '</span>'; }).join('') + '</div>' : '') +
      '<div class="svc-card__foot">' +
      '<span class="price"><span class="price__cur">' + DATA.CURRENCY + '</span><span class="price__val">' + s.price.toLocaleString('en-IN') + '</span>' +
      '<span class="price__old">' + DATA.money(s.oldPrice) + '</span></span>' +
      '<a class="btn btn--primary btn--sm" href="404.html">Book Now</a>' +
      '</div></div></article>';
  };

  /* ---------------------------------------------------------- stylist card */
  UI.stylistCard = function (st) {
    var fav = Store.inWishlist('stylist', st.id);
    var salon = DATA.salon(st.salon);
    var statusMap = {
      available: '<span class="badge badge--glass"><span class="avail-dot avail-dot--free">Available today</span></span>',
      busy: '<span class="badge badge--glass"><span class="avail-dot avail-dot--busy">Fully booked</span></span>',
      leave: '<span class="badge badge--glass"><span class="avail-dot avail-dot--off">On leave</span></span>'
    };
    return '<article class="stylist-card" data-reveal="up">' +
      '<div class="stylist-card__media">' +
      Img.tag({ seed: st.slug, kind: 'person', alt: 'Portrait of ' + st.name, w: 560, h: 560 }) +
      '<span class="stylist-card__status">' + (statusMap[st.status] || '') + '</span>' +
      '<button class="btn-icon btn-icon--glass btn-fav stylist-card__fav' + (fav ? ' is-active' : '') + '" data-wish="stylist" data-wish-id="' + st.id + '" aria-label="Save ' + st.name + ' to favourites" aria-pressed="' + fav + '">' + Icon.get('heart') + '</button>' +
      '<div class="stylist-card__socials">' +
      '<a href="#" aria-label="' + st.name + ' on Instagram" onclick="return false;">' + Icon.get('instagram') + '</a>' +
      '<a href="#" aria-label="' + st.name + ' on Facebook" onclick="return false;">' + Icon.get('facebook') + '</a>' +
      '<a href="#" aria-label="' + st.name + ' on YouTube" onclick="return false;">' + Icon.get('youtube') + '</a>' +
      '</div></div>' +
      '<div class="stylist-card__body">' +
      '<h3 class="stylist-card__name"><a href="stylist-details.html?s=' + st.slug + '">' + st.name + '</a></h3>' +
      '<div class="stylist-card__role">' + st.role + '</div>' +
      '<div class="stylist-card__stats">' +
      '<div class="stylist-card__stat"><b>' + st.exp + ' yrs</b><span>Experience</span></div>' +
      '<div class="stylist-card__stat"><b>' + st.rating + ' ★</b><span>' + st.reviews + ' reviews</span></div>' +
      '<div class="stylist-card__stat"><b>' + (st.clients >= 1000 ? (st.clients / 1000).toFixed(1) + 'k' : st.clients) + '</b><span>Clients</span></div>' +
      '</div>' +
      '<div class="text-xs text-muted mb-4" style="display:flex;align-items:center;justify-content:center;gap:6px">' +
      Icon.get('map-pin', '', 13) + (salon ? salon.area + ', ' + salon.city : '') + '</div>' +
      '<div class="stylist-card__actions">' +
      '<a class="btn btn--primary btn--sm" href="404.html">Book Appointment</a>' +
      '<a class="btn btn--ghost btn--sm" href="stylist-details.html?s=' + st.slug + '" aria-label="View ' + st.name + '\'s profile">' + Icon.get('user') + '</a>' +
      '</div></div></article>';
  };

  /* ------------------------------------------------------------ salon card */
  UI.salonCard = function (sl) {
    var fav = Store.inWishlist('salon', sl.id);
    return '<article class="salon-card" data-reveal="up">' +
      '<div class="salon-card__media">' +
      Img.tag({ seed: sl.slug, kind: 'salon', alt: sl.name + ' interior', w: 640, h: 400 }) +
      '<div class="salon-card__top">' +
      '<span class="salon-card__open ' + (sl.open ? 'is-open' : 'is-closed') + '">' + (sl.open ? 'Open now' : 'Closed') + '</span>' +
      '<button class="btn-icon btn-icon--glass btn-fav' + (fav ? ' is-active' : '') + '" data-wish="salon" data-wish-id="' + sl.id + '" aria-label="Save ' + sl.name + ' to favourites" aria-pressed="' + fav + '">' + Icon.get('heart') + '</button>' +
      '</div>' +
      '<div class="salon-card__bottom">' +
      '<span class="salon-card__rating">' + Icon.get('star') + sl.rating + ' (' + sl.reviews.toLocaleString('en-IN') + ')</span>' +
      '<span class="salon-card__dist">' + Icon.get('navigation') + (sl.distance < 50 ? sl.distance + ' km' : sl.city) + '</span>' +
      '</div></div>' +
      '<div class="salon-card__body">' +
      '<div class="salon-card__head"><h3 class="salon-card__name"><a href="salon-details.html?s=' + sl.slug + '">' + sl.name + '</a></h3>' +
      (sl.flagship ? '<span class="badge badge--solid">Flagship</span>' : '') + '</div>' +
      '<div class="salon-card__loc">' + Icon.get('map-pin') + '<span class="salon-card__loc-text">' + sl.address + '</span></div>' +
      '<div class="salon-card__hours">' + Icon.get('clock') + '<span class="truncate">' + sl.hours + '</span></div>' +
      '<div class="salon-card__services">' +
      sl.services.slice(0, 3).map(function (c) { return '<span>' + DATA.category(c).name + '</span>'; }).join('') +
      (sl.services.length > 3 ? '<span class="more">+' + (sl.services.length - 3) + ' more</span>' : '') +
      '</div>' +
      '<div class="salon-card__foot">' +
      '<a class="btn btn--ghost btn--sm" href="404.html">View Details</a>' +
      '<a class="btn btn--primary btn--sm" href="404.html">Book Appointment</a>' +
      '</div></div></article>';
  };

  /* ------------------------------------------------------------ offer card */
  UI.offerCard = function (o) {
    var expiry = new Date(o.expiry);
    var days = Math.max(0, Math.ceil((expiry - new Date()) / 86400000));
    return '<article class="offer-card offer-card--' + (o.tone || 'rose') + '" data-reveal="up">' +
      (o.tag ? '<span class="offer-card__ribbon">' + o.tag + '</span>' : '') +
      '<div class="offer-card__discount">' + o.discount + '</div>' +
      '<h3>' + o.title + '</h3>' +
      '<p>' + o.desc + '</p>' +
      '<div class="offer-card__coupon">' +
      '<span class="offer-card__code">' + o.code + '</span>' +
      '<button class="offer-card__copy" data-copy-code="' + o.code + '">Copy</button>' +
      '</div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
      '<span class="offer-card__expiry">' + Icon.get('clock') +
      (days > 0 ? 'Expires in ' + days + ' day' + (days === 1 ? '' : 's') + ' · ' + DATA.dateShort(o.expiry) : 'Expired') + '</span>' +
      '<a href="404.html" class="offer-card__copy" style="text-decoration:none">Apply Offer</a>' +
      '</div></article>';
  };

  /* ------------------------------------------------------------- post card */
  UI.postCard = function (p, wide) {
    return '<article class="card card--hover post-card' + (wide ? ' post-card--wide' : '') + '" data-reveal="up">' +
      '<a class="card__media" href="blog-details.html?p=' + p.slug + '" aria-label="Read: ' + p.title + '">' +
      Img.tag({ seed: p.slug, kind: p.kind || 'blog', alt: p.title, w: 640, h: 400 }) +
      '<span class="badge badge--solid post-card__cat">' + p.cat + '</span></a>' +
      '<div class="card__body">' +
      '<div class="post-card__meta">' +
      '<span>' + Icon.get('calendar') + DATA.dateShort(p.date) + '</span>' +
      '<span>' + Icon.get('clock') + p.read + ' min read</span>' +
      '</div>' +
      '<h3><a href="blog-details.html?p=' + p.slug + '">' + p.title + '</a></h3>' +
      '<p class="card__desc">' + p.excerpt + '</p>' +
      '<div class="card__foot">' +
      '<div class="post-card__author"><span class="avatar avatar--sm">' + p.author.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('') + '</span>' +
      '<div><b>' + p.author + '</b><span>Contributor</span></div></div>' +
      '<a class="btn btn--link btn--sm" href="404.html">Read ' + Icon.get('arrow-right') + '</a>' +
      '</div></div></article>';
  };

  /* ----------------------------------------------------- testimonial card */
  UI.testimonialCard = function (t) {
    return '<article class="tst-card" data-reveal="up">' +
      '<span class="tst-card__quote">"</span>' +
      Icon.stars(t.rating) +
      '<p>' + t.text + '</p>' +
      '<div class="tst-card__person">' +
      '<span class="avatar avatar--md">' + t.name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('') + '</span>' +
      '<div><b>' + t.name + '</b><span>' + t.role + '</span></div>' +
      '<span class="tst-card__service">' + t.service + '</span>' +
      '</div></article>';
  };

  /* -------------------------------------------------------- appointment */
  UI.apptCard = function (a) {
    var s = DATA.service(a.serviceId);
    var sal = DATA.salon(a.salonId);
    var st = DATA.stylist(a.stylistId);
    var d = new Date(a.date + 'T00:00:00');
    var statusCls = { upcoming: 'status-upcoming', completed: 'status-completed', cancelled: 'status-cancelled' };
    var statusLbl = { upcoming: 'Upcoming', completed: 'Completed', cancelled: 'Cancelled' };
    var days = Math.ceil((d - new Date().setHours(0, 0, 0, 0)) / 86400000);

    var actions = '';
    if (a.status === 'upcoming') {
      actions =
        '<button class="btn btn--ghost btn--sm" data-appt-reschedule="' + a.id + '">' + Icon.get('refresh') + 'Reschedule</button>' +
        '<button class="btn btn--soft btn--sm" data-appt-cancel="' + a.id + '">' + Icon.get('x') + 'Cancel</button>' +
        '<a class="btn btn--primary btn--sm" href="appointment-details.html?id=' + a.id + '">View Details</a>';
    } else if (a.status === 'completed') {
      actions =
        '<a class="btn btn--ghost btn--sm" href="booking.html?service=' + (s ? s.slug : '') + '">' + Icon.get('refresh') + 'Book Again</a>' +
        (a.rated ? '<span class="badge badge--coral">' + Icon.get('star') + 'Rated ' + a.rated + '/5</span>'
          : '<button class="btn btn--soft btn--sm" data-appt-rate="' + a.id + '">' + Icon.get('star') + 'Rate Visit</button>') +
        '<a class="btn btn--primary btn--sm" href="appointment-details.html?id=' + a.id + '">View Details</a>';
    } else {
      actions = '<a class="btn btn--ghost btn--sm" href="booking.html?service=' + (s ? s.slug : '') + '">' + Icon.get('refresh') + 'Rebook</a>' +
        '<a class="btn btn--primary btn--sm" href="appointment-details.html?id=' + a.id + '">View Details</a>';
    }

    return '<article class="appt-card' + (a.status === 'cancelled' ? ' appt-card--cancelled' : '') + '" data-reveal="up">' +
      '<div class="appt-card__date">' +
      '<span class="m">' + d.toLocaleDateString('en-IN', { month: 'short' }) + '</span>' +
      '<span class="d">' + d.getDate() + '</span>' +
      '<span class="w">' + d.toLocaleDateString('en-IN', { weekday: 'short' }) + '</span>' +
      '</div>' +
      '<div class="appt-card__main">' +
      '<div class="appt-card__title">' + (s ? s.name : 'Service') +
      '<span class="badge ' + statusCls[a.status] + ' badge--dot">' + statusLbl[a.status] + '</span>' +
      (a.status === 'upcoming' && days >= 0 && days <= 3 ? '<span class="countdown">' + Icon.get('zap') + (days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : 'In ' + days + ' days') + '</span>' : '') +
      '</div>' +
      '<div class="appt-card__meta">' +
      '<span>' + Icon.get('clock') + a.time + ' · ' + (s ? DATA.duration(s.duration) : '') + '</span>' +
      '<span>' + Icon.get('map-pin') + (sal ? sal.name : '') + '</span>' +
      '<span>' + Icon.get('user') + (st ? st.name : 'Any stylist') + '</span>' +
      '</div>' +
      '<span class="appt-card__id">Booking ID: ' + a.id + '</span>' +
      '</div>' +
      '<div class="appt-card__side">' +
      '<span class="price"><span class="price__cur">' + DATA.CURRENCY + '</span><span class="price__val">' + a.total.toLocaleString('en-IN') + '</span></span>' +
      '<div class="appt-card__actions">' + actions + '</div>' +
      '</div></article>';
  };

  /* ------------------------------------------------------- page hero */
  UI.pageHero = function (title, sub, crumbs) {
    var trail = [['Home', 'index.html']].concat(crumbs || []);
    return '<section class="page-hero"><div class="orb orb--rose" style="width:380px;height:380px;top:-140px;left:-120px"></div>' +
      '<div class="orb orb--lav" style="width:300px;height:300px;bottom:-140px;right:-80px"></div>' +
      '<div class="container page-hero__inner">' +
      '<h1 data-reveal="up">' + title + '</h1>' +
      (sub ? '<p data-reveal="up" data-reveal-delay=".08">' + sub + '</p>' : '') +
      '<nav aria-label="Breadcrumb"><ol class="crumbs" data-reveal="up" data-reveal-delay=".14">' +
      trail.map(function (c, i) {
        var last = i === trail.length - 1;
        return '<li>' + (last ? '<span aria-current="page">' + c[0] + '</span>' : '<a href="' + c[1] + '">' + c[0] + '</a>') + '</li>';
      }).join('') +
      '</ol></nav></div></section>';
  };

  /* --------------------------------------------- copy-code delegation */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy-code]');
    if (!btn) return;
    App.copyText(btn.dataset.copyCode, function () {
      btn.textContent = 'Copied!';
      btn.classList.add('is-copied');
      Toast.success('Coupon <b>' + btn.dataset.copyCode + '</b> copied — apply it at checkout.', 'Code copied');
      setTimeout(function () {
        btn.textContent = 'Copy';
        btn.classList.remove('is-copied');
      }, 2200);
    });
  });

  global.UI = UI;
})(window);
