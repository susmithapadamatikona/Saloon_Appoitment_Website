/* ==========================================================================
   navigation.js — shared layout injection
   Renders the site header (topbar + navbar + mobile drawer) and the
   footer into  <header id="site-header">  and  <footer id="site-footer">
   so all 27 pages share one source of truth.
   Skipped automatically on auth / dashboard pages that opt out.
   ========================================================================== */
(function (global) {
  'use strict';

  var NAV = [
    { label: 'Home', href: 'index.html' },
    { label: 'About', href: 'about.html' },
    { label: 'Services', href: 'services.html' },
    { label: 'Stylists', href: 'stylists.html' },
    { label: 'Gallery', href: 'gallery.html' },
    { label: 'Blog', href: 'blog.html' },
    { label: 'Contact', href: 'contact.html' }
  ];

  function page() {
    var p = location.pathname.split('/').pop() || 'index.html';
    return p;
  }

  function brandHtml() {
    return '<a class="brand" href="index.html" aria-label="Stackly — home">' +
      '<img class="brand__logo" src="assets/images/stackly-whitish_blue-logo.webp" alt="Stackly" width="160" height="66" decoding="async"></a>';
  }

  /* ------------------------------------------------------------ header */
  function headerHtml() {
    var cur = page();
    var B = DATA.BRAND;

    var navItems = NAV.map(function (item) {
      var isActive = item.href === cur ||
        (item.menu || []).some(function (m) { return m.href === cur; });
      var link = '<a class="nav__link' + (isActive ? ' is-active' : '') + '" href="' + item.href + '"' +
        (isActive ? ' aria-current="page"' : '') + '>' + item.label +
        (item.menu ? Icon.get('chevron-down') : '') + '</a>';
      var menu = '';
      if (item.menu) {
        menu = '<div class="nav__menu" role="menu">' + item.menu.map(function (m) {
          return '<a role="menuitem" href="' + m.href + '"' + (m.href === cur ? ' class="is-active"' : '') + '>' +
            Icon.get(m.icon) + m.label + '</a>';
        }).join('') + '</div>';
      }
      return '<li class="nav__item' + (item.menu ? ' has-menu' : '') + '">' + link + menu + '</li>';
    }).join('');

    var authArea =
      '<div class="nav-auth">' +
      '<a class="nav-login" href="login.html">Login</a>' +
      '<a class="btn btn--soft btn--sm" href="register.html">' + Icon.get('user-plus') + 'Register</a>' +
      '</div>';

    return '' +
      /* ---------- top bar ---------- */
      '<div class="topbar" id="topbar"><div class="container topbar__inner">' +
      '<a class="topbar__offer" href="offers.html">' + Icon.get('gift') +
      '<span>Festive Glow — <b>30% OFF</b> party makeup &amp; nail art</span></a>' +
      '<div class="topbar__meta">' +
      '<a class="topbar__meta-item keep" href="tel:' + B.phoneHref + '">' + Icon.get('phone') + B.phone + '</a>' +
      '<a class="topbar__meta-item" href="mailto:' + B.email + '">' + Icon.get('mail') + B.email + '</a>' +
      '<span class="topbar__meta-item">' + Icon.get('map-pin') + 'Mumbai · 8 cities</span>' +
      '<div class="topbar__socials">' +
      DATA.BRAND.socials.slice(0, 4).map(function (s) {
        return '<a href="' + s.url + '" aria-label="' + s.label + '">' + Icon.get(s.icon) + '</a>';
      }).join('') + '</div>' +
      '<div class="lang-select" id="lang-root">' +
      '<button class="lang-select__btn" id="lang-btn" aria-expanded="false">' + Icon.get('globe', '', 12) +
      '<span id="lang-current">EN</span>' + Icon.get('chevron-down') + '</button>' +
      '<div class="lang-select__menu" id="lang-menu">' +
      '<button data-lang="EN" class="is-active">🇬🇧 English</button>' +
      '<button data-lang="HI">🇮🇳 हिन्दी</button>' +
      '<button data-lang="MR">🇮🇳 मराठी</button>' +
      '<button data-lang="TA">🇮🇳 தமிழ்</button>' +
      '</div></div>' +
      '</div></div></div>' +

      /* ---------- navbar ---------- */
      '<div class="navbar"><div class="container navbar__inner">' +
      brandHtml() +
      '<nav aria-label="Primary"><ul class="nav">' + navItems + '</ul></nav>' +
      '<div class="nav-actions">' +
      authArea +
      '<a class="btn btn--primary btn--sm" href="booking.html">' + Icon.get('calendar-plus') + 'Book Appointment</a>' +
      '<button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="drawer">' +
      '<span></span><span></span><span></span></button>' +
      '</div></div></div>';
  }

  /* ------------------------------------------------------------ drawer */
  function drawerHtml() {
    var cur = page();
    var groups = NAV.map(function (item) {
      if (!item.menu) {
        return '<a class="m-nav__link' + (item.href === cur ? ' is-active' : '') + '" href="' + item.href + '">' + item.label + '</a>';
      }
      var isOpen = (item.menu || []).some(function (m) { return m.href === cur; }) || item.href === cur;
      return '<div class="m-nav__group' + (isOpen ? ' is-open' : '') + '">' +
        '<button class="m-nav__toggle" aria-expanded="' + (isOpen ? 'true' : 'false') + '">' + item.label + Icon.get('chevron-down') + '</button>' +
        '<div class="m-nav__sub"><div>' + item.menu.map(function (m) {
          return '<a href="' + m.href + '">' + m.label + '</a>';
        }).join('') + '</div></div></div>';
    }).join('');

    var authBtns =
      '<a class="btn btn--primary btn--block" href="booking.html">' + Icon.get('calendar-plus') + 'Book Appointment</a>' +
      '<div class="grid grid-2" style="gap:10px">' +
      '<a class="btn btn--ghost" href="login.html">Login</a>' +
      '<a class="btn btn--soft" href="register.html">Register</a></div>';

    return '<div class="drawer-backdrop" id="drawer-backdrop"></div>' +
      '<aside class="drawer" id="drawer" aria-label="Mobile menu" aria-hidden="true">' +
      '<div class="drawer__head">' + brandHtml() +
      '<button class="drawer__close" id="drawer-close" aria-label="Close menu">' + Icon.get('x') + '</button></div>' +
      '<div class="drawer__body">' +
      '<nav class="m-nav" aria-label="Mobile primary">' + groups + '</nav>' +
      '<div class="drawer__contact">' +
      '<a href="tel:' + DATA.BRAND.phoneHref + '">' + Icon.get('phone') + DATA.BRAND.phone + '</a>' +
      '<a href="mailto:' + DATA.BRAND.email + '">' + Icon.get('mail') + DATA.BRAND.email + '</a>' +
      '<span style="display:flex;align-items:center;gap:9px">' + Icon.get('clock') + DATA.BRAND.hours + '</span>' +
      '</div></div>' +
      '<div class="drawer__foot">' + authBtns + '</div></aside>';
  }

  /* --------------------------------------------- pre-footer CTA band --- */
  /* Rendered as a sibling BEFORE the footer element so the card straddles
     the page/footer boundary without covering the footer content. */
  function ctaBandHtml() {
    return '<div class="cta-band" aria-label="Book an appointment"><div class="container"><div class="cta-band__inner">' +
      '<div><h2>Ready to look your absolute best?</h2>' +
      '<p>Book with any of our 50+ expert stylists across 8 cities. Your first appointment is 25% off with code FIRST25.</p></div>' +
      '<div class="cta-band__actions">' +
      '<a class="btn btn--white btn--lg" href="booking.html">' + Icon.get('calendar-plus') + 'Book Appointment</a>' +
      '<a class="btn btn--on-dark btn--lg" href="services.html">Explore Services</a>' +
      '</div></div></div></div>';
  }

  /* ------------------------------------------------------------ footer */
  function footerHtml() {
    var B = DATA.BRAND;
    return '' +
      '<div class="site-footer-inner">' +
      '<div class="container">' +
      '<div class="footer-grid">' +

      '<div class="footer-brand">' + brandHtml() +
      '<p>Premium beauty appointments made effortless. Fifty expert stylists, twenty partner salons, one standard of care since 2016.</p>' +
      '<div class="footer-socials">' +
      B.socials.map(function (s) { return '<a href="' + s.url + '" aria-label="' + s.label + '">' + Icon.get(s.icon) + '</a>'; }).join('') +
      '</div></div>' +

      '<div class="footer-col"><h4>Explore</h4><nav class="footer-links" aria-label="Footer — explore">' +
      '<a href="about.html">About Us</a><a href="services.html">Services</a><a href="stylists.html">Our Stylists</a>' +
      '<a href="salons.html">Find a Salon</a><a href="gallery.html">Gallery</a><a href="blog.html">Blog</a>' +
      '</nav></div>' +

      '<div class="footer-col"><h4>Bookings</h4><nav class="footer-links" aria-label="Footer — bookings">' +
      '<a href="booking.html">Book Appointment</a><a href="my-appointments.html">My Appointments</a>' +
      '<a href="offers.html">Offers &amp; Coupons</a><a href="pricing.html">Membership</a>' +
      '<a href="faq.html">FAQ</a><a href="testimonials.html">Testimonials</a>' +
      '</nav></div>' +

      '<div class="footer-col"><h4>Contact</h4><ul class="footer-contact">' +
      '<li>' + Icon.get('map-pin') + '<div><span class="lbl">Flagship studio</span>' + B.address + '</div></li>' +
      '<li>' + Icon.get('phone') + '<div><span class="lbl">Call us</span><a href="tel:' + B.phoneHref + '">' + B.phone + '</a></div></li>' +
      '<li>' + Icon.get('mail') + '<div><span class="lbl">Email</span><a href="mailto:' + B.email + '">' + B.email + '</a></div></li>' +
      '<li>' + Icon.get('clock') + '<div><span class="lbl">Open hours</span>' + B.hours + '</div></li>' +
      '</ul></div>' +

      '<div class="footer-col footer-news"><h4>Stay in the Glow</h4>' +
      '<p>Beauty tips, seasonal offers and first access to new services. One email a week, never more.</p>' +
      '<form class="news-form" id="newsletter-form" novalidate>' +
      '<input type="email" placeholder="Your email address" aria-label="Email address for newsletter" required>' +
      '<button type="submit" aria-label="Subscribe">' + Icon.get('send') + '</button></form>' +
      '<span class="news-note">By subscribing you agree to our privacy policy. Unsubscribe anytime.</span>' +
      '</div>' +

      '</div>' +
      '<div class="footer-bottom">' +
      '<p>© 2026 Lumière Beauty Studio Pvt. Ltd. All rights reserved. Crafted with ♥ in Mumbai.</p>' +
      '<div class="footer-legal"><a href="faq.html">Privacy Policy</a><a href="faq.html">Terms of Service</a><a href="contact.html">Support</a></div>' +
      '<div class="footer-pay"><span>We accept</span><div>UPI</div><div>VISA</div><div>MC</div><div>AMEX</div><div>RUPAY</div></div>' +
      '</div></div></div>';
  }

  /* ============================================================ behaviour */
  function bindHeader(headerEl) {
    /* sticky shadow + topbar collapse */
    var onScroll = function () {
      headerEl.classList.toggle('is-stuck', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* burger / drawer */
    var burger = document.getElementById('burger');
    var drawer = document.getElementById('drawer');
    var backdrop = document.getElementById('drawer-backdrop');
    function setDrawer(open) {
      drawer.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open);
      drawer.setAttribute('aria-hidden', !open);
      document.body.classList.toggle('no-scroll', open);
    }
    if (burger) {
      burger.addEventListener('click', function () { setDrawer(!drawer.classList.contains('is-open')); });
      backdrop.addEventListener('click', function () { setDrawer(false); });
      document.getElementById('drawer-close').addEventListener('click', function () { setDrawer(false); });
      drawer.querySelectorAll('.m-nav__toggle').forEach(function (t) {
        t.addEventListener('click', function () {
          var g = t.closest('.m-nav__group');
          var open = g.classList.toggle('is-open');
          t.setAttribute('aria-expanded', open);
        });
      });
    }

    /* language selector */
    var langRoot = document.getElementById('lang-root');
    if (langRoot) {
      var langBtn = document.getElementById('lang-btn');
      langBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = langRoot.classList.toggle('is-open');
        langBtn.setAttribute('aria-expanded', open);
      });
      document.getElementById('lang-menu').addEventListener('click', function (e) {
        var b = e.target.closest('button[data-lang]');
        if (!b) return;
        document.querySelectorAll('#lang-menu button').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        document.getElementById('lang-current').textContent = b.dataset.lang;
        langRoot.classList.remove('is-open');
        Toast.info('Language preference saved — full translations are on our roadmap.', 'Language: ' + b.dataset.lang);
      });
    }

    /* profile dropdown */
    var profileRoot = document.getElementById('profile-root');
    if (profileRoot) {
      var pb = document.getElementById('profile-btn');
      pb.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = profileRoot.classList.toggle('is-open');
        pb.setAttribute('aria-expanded', open);
      });
      var lo = document.getElementById('logout-btn');
      if (lo) lo.addEventListener('click', function () {
        Modal.confirm({
          title: 'Sign out?',
          message: 'You can sign back in anytime. Your appointments and wishlist stay saved on this device.',
          confirmText: 'Sign Out', icon: 'log-out',
          onConfirm: function () {
            Store.logout();
            Toast.success('You have been signed out. See you soon!');
            setTimeout(function () { location.href = 'index.html'; }, 900);
          }
        });
      });
    }

    /* notifications */
    var notifRoot = document.getElementById('notif-root');
    if (notifRoot) {
      var nb = document.getElementById('notif-btn');
      var panel = document.getElementById('notif-panel');
      var readIds = Store.getNotifRead();
      var items = DATA.NOTIFICATIONS.map(function (n) {
        var unread = n.unread && readIds.indexOf(n.id) === -1;
        return { n: n, unread: unread };
      });
      function renderNotifs() {
        var unreadCount = items.filter(function (x) { return x.unread; }).length;
        var count = document.getElementById('notif-count');
        if (count) {
          count.textContent = unreadCount;
          count.style.display = unreadCount ? '' : 'none';
        }
        panel.innerHTML =
          '<div class="notif__head"><h4>Notifications</h4><button type="button" id="notif-clear">Mark all read</button></div>' +
          '<div class="notif__list">' + items.map(function (x) {
            return '<div class="notif__item' + (x.unread ? ' is-unread' : '') + '"><div><p>' + x.n.text + '</p>' +
              '<time>' + x.n.time + '</time></div></div>';
          }).join('') + '</div>' +
          '<div class="notif__foot"><a href="user-dashboard.html">View all activity</a></div>';
        var clear = document.getElementById('notif-clear');
        if (clear) clear.addEventListener('click', function () {
          items.forEach(function (x) { x.unread = false; });
          Store.markNotifsRead(DATA.NOTIFICATIONS.map(function (n) { return n.id; }));
          renderNotifs();
          Toast.success('All notifications marked as read.');
        });
      }
      renderNotifs();
      nb.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = notifRoot.classList.toggle('is-open');
        nb.setAttribute('aria-expanded', open);
      });
    }

    /* close popovers on outside click */
    document.addEventListener('click', function (e) {
      ['lang-root', 'profile-root', 'notif-root'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el && !el.contains(e.target)) el.classList.remove('is-open');
      });
    });

  }

  function bindFooter(footerEl) {
    var form = document.getElementById('newsletter-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = form.querySelector('input').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          Toast.error('Please enter a valid email address to subscribe.');
          return;
        }
        var btn = form.querySelector('button');
        btn.classList.add('is-loading');
        setTimeout(function () {
          btn.classList.remove('is-loading');
          form.reset();
          Toast.rose('Welcome to the glow list! Check your inbox for a hello from us.', 'Subscribed ✨');
        }, 900);
      });
    }
  }

  /* ============================================================== mount */
  function mount() {
    var headerHost = document.getElementById('site-header');
    if (headerHost) {
      headerHost.className = 'site-header';
      headerHost.innerHTML = headerHtml();
      document.body.insertAdjacentHTML('beforeend', drawerHtml());
      bindHeader(headerHost);
    }
    var footerHost = document.getElementById('site-footer');
    if (footerHost) {
      footerHost.className = 'site-footer';
      footerHost.insertAdjacentHTML('beforebegin', ctaBandHtml());
      footerHost.innerHTML = footerHtml();
      bindFooter(footerHost);
    }
  }

  global.Layout = { mount: mount, page: page, brandHtml: brandHtml };
})(window);
