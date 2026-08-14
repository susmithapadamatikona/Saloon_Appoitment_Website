/* ==========================================================================
   dashboard.js — shared dashboard shell (sidebar, topbar, guards)
   Dash.mount({role:'client'|'owner'|'admin', active:'dashboard', title, sub})
   Individual dashboard pages render their own body content.
   ========================================================================== */
(function (global) {
  'use strict';

  var NAVS = {
    client: [
      { head: 'Overview' },
      { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: 'user-dashboard.html' },
      { id: 'appointments', label: 'My Appointments', icon: 'calendar-check', href: 'my-appointments.html', badge: 'appts' },
      { head: 'Favourites' },
      { id: 'wishlist', label: 'Saved Services', icon: 'heart', href: 'my-favourites.html' },
      { id: 'offers', label: 'Offers & Coupons', icon: 'gift', href: 'my-offers.html' },
      { id: 'loyalty', label: 'Loyalty Points', icon: 'award', href: 'my-loyalty.html' },
      { head: 'Account' },
      { id: 'profile', label: 'My Profile', icon: 'user', href: 'profile.html' },
      { id: 'settings', label: 'Settings', icon: 'settings', href: 'settings.html' }
    ],
    owner: [
      { head: 'Overview' },
      { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: 'salon-dashboard.html' },
      { id: 'appointments', label: 'Appointments', icon: 'calendar-check', href: 'salon-dashboard.html#appointments', badge: 'today' },
      { id: 'customers', label: 'Customers', icon: 'users', href: 'salon-dashboard.html#customers' },
      { head: 'Manage' },
      { id: 'salon', label: 'My Salon', icon: 'store', href: 'salon-dashboard.html#salon' },
      { id: 'services', label: 'Services', icon: 'sparkles', href: 'salon-dashboard.html#services' },
      { id: 'stylists', label: 'Stylists', icon: 'scissors', href: 'salon-dashboard.html#stylists' },
      { id: 'offers', label: 'Offers', icon: 'gift', href: 'salon-dashboard.html#offers' },
      { head: 'Insights' },
      { id: 'revenue', label: 'Revenue', icon: 'trending-up', href: 'salon-dashboard.html#revenue' },
      { id: 'reviews', label: 'Reviews', icon: 'star', href: 'salon-dashboard.html#reviews' },
      { id: 'settings', label: 'Settings', icon: 'settings', href: 'settings.html' }
    ],
    admin: [
      { head: 'Overview' },
      { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: 'admin-dashboard.html' },
      { id: 'analytics', label: 'Analytics', icon: 'bar-chart', href: 'admin-dashboard.html#analytics' },
      { head: 'Platform' },
      { id: 'users', label: 'Users', icon: 'users', href: 'admin-dashboard.html#users' },
      { id: 'salons', label: 'Salons', icon: 'store', href: 'admin-dashboard.html#salons' },
      { id: 'stylists', label: 'Stylists', icon: 'scissors', href: 'admin-dashboard.html#stylists' },
      { id: 'services', label: 'Services', icon: 'sparkles', href: 'admin-dashboard.html#services' },
      { id: 'appointments', label: 'Appointments', icon: 'calendar-check', href: 'admin-dashboard.html#appointments' },
      { head: 'Finance' },
      { id: 'payments', label: 'Payments', icon: 'credit-card', href: 'admin-dashboard.html#payments' },
      { id: 'offers', label: 'Offers', icon: 'gift', href: 'admin-dashboard.html#offers' },
      { id: 'reports', label: 'Reports', icon: 'file-text', href: 'admin-dashboard.html#reports' },
      { id: 'settings', label: 'Settings', icon: 'settings', href: 'settings.html' }
    ]
  };

  var ROLE_LABEL = { client: 'Member', owner: 'Salon Owner', admin: 'Administrator' };

  function mount(cfg) {
    cfg = cfg || {};
    var role = cfg.role || 'client';
    var user = Store.getUser();

    /* demo guard: auto-provision a demo identity so dashboards are explorable */
    if (!user) {
      user = Store.login(
        role === 'owner' ? 'owner@lumierestudio.com' : role === 'admin' ? 'admin@lumierestudio.com' : 'guest@lumierestudio.com',
        role === 'owner' ? 'Aarohi Mehta' : role === 'admin' ? 'Platform Admin' : 'Guest User',
        role
      );
      setTimeout(function () {
        Toast.info('You\'re exploring a demo ' + ROLE_LABEL[role].toLowerCase() + ' account. Everything is saved locally.', 'Demo mode');
      }, 800);
    }

    var initials = user.name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
    var upcoming = Store.getAppointments().filter(function (a) { return a.status === 'upcoming'; }).length;
    var badges = { appts: upcoming, today: 8 };

    var sideHost = document.getElementById('dash-side');
    var topHost = document.getElementById('dash-top');
    if (!sideHost) return user;

    sideHost.innerHTML =
      '<div class="dash-side__head">' + Layout.brandHtml() +
      '<button class="btn-icon btn-icon--sm dash-side__close" id="dash-side-close" aria-label="Close menu">' + Icon.get('x') + '</button></div>' +
      '<div class="dash-side__body"><nav aria-label="Dashboard">' +
      NAVS[role].map(function (item) {
        if (item.head) return '<div class="dash-nav-title">' + item.head + '</div>';
        var badge = item.badge && badges[item.badge] ? '<span class="dash-nav__badge">' + badges[item.badge] + '</span>' : '';
        return '<div class="dash-nav"><a href="' + item.href + '"' + (item.id === cfg.active ? ' class="is-active" aria-current="page"' : '') + '>' +
          Icon.get(item.icon) + item.label + badge + '</a></div>';
      }).join('') +
      '</nav>' +
      '<div class="dash-side__promo mt-6">' +
      '<span class="icon-box icon-box--md icon-box--round">' + Icon.get(role === 'client' ? 'crown' : 'zap') + '</span>' +
      '<b>' + (role === 'client' ? 'Upgrade to Platinum' : 'Boost your bookings') + '</b>' +
      '<p>' + (role === 'client' ? '20% off every service plus a free birthday treat.' : 'Feature your salon on the home page this month.') + '</p>' +
      '<a class="btn btn--white btn--sm" href="' + (role === 'client' ? 'pricing.html' : 'contact.html') + '">Learn more</a>' +
      '</div></div>' +
      '<div class="dash-side__foot">' +
      '<button type="button" class="btn btn--ghost btn--sm btn--block" id="dash-logout">' + Icon.get('log-out') + 'Logout</button>' +
      '</div>';

    if (topHost) {
      topHost.innerHTML =
        '<button class="btn-icon dash-top__burger" id="dash-burger" aria-label="Open dashboard menu">' + Icon.get('menu') + '</button>' +
        '<div><h1>' + (cfg.title || 'Dashboard') + '</h1><p>' + (cfg.sub || 'Welcome back, ' + user.name.split(' ')[0]) + '</p></div>' +
        '<div class="dash-top__actions">' +
        '<div class="dash-search">' + Icon.get('search') + '<input type="search" placeholder="Search…" aria-label="Search dashboard" id="dash-search-input"></div>' +
        '<button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">' +
        '<span class="icon-sun">' + Icon.get('sun') + '</span><span class="icon-moon">' + Icon.get('moon') + '</span></button>' +
        '<a class="btn-icon" href="index.html" aria-label="Back to website">' + Icon.get('home') + '</a>' +
        '<span class="avatar avatar--sm avatar--ring" title="' + user.name + '">' + initials + '</span>' +
        '</div>';
    }

    /* mobile sidebar toggle */
    var burger = document.getElementById('dash-burger');
    var closeBtn = document.getElementById('dash-side-close');
    var backdrop = document.createElement('div');
    backdrop.className = 'drawer-backdrop';
    document.body.appendChild(backdrop);
    function setSide(open) {
      sideHost.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
      document.body.classList.toggle('no-scroll', open);
    }
    if (burger) burger.addEventListener('click', function () { setSide(true); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setSide(false); });
    backdrop.addEventListener('click', function () { setSide(false); });

    /* logout */
    var logoutBtn = document.getElementById('dash-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', function () {
      Modal.confirm({
        title: 'Log out?',
        message: 'You can sign back in anytime. Your appointments and wishlist stay saved on this device.',
        confirmText: 'Logout', icon: 'log-out',
        onConfirm: function () {
          Store.logout();
          Toast.success('You have been logged out. See you soon!');
          setTimeout(function () { location.href = 'login.html'; }, 900);
        }
      });
    });

    Icon.hydrate(sideHost);
    if (topHost) Icon.hydrate(topHost);
    return user;
  }

  /* Reusable stat card */
  function statCard(o) {
    return '<div class="stat-card' + (o.tone ? ' stat-card--' + o.tone : '') + '" data-reveal="up">' +
      '<div class="stat-card__top"><div><div class="stat-card__label">' + o.label + '</div>' +
      '<div class="stat-card__value"' + (o.count !== undefined ? ' data-count="' + o.count + '"' +
        (o.prefix ? ' data-prefix="' + o.prefix + '"' : '') + (o.suffix ? ' data-suffix="' + o.suffix + '"' : '') : '') + '>' +
      (o.count !== undefined ? '0' : o.value) + '</div></div>' +
      '<span class="icon-box icon-box--md' + (o.tone ? ' icon-box--' + o.tone : '') + '">' + Icon.get(o.icon) + '</span></div>' +
      (o.delta !== undefined ?
        '<span class="stat-card__delta stat-card__delta--' + (o.delta >= 0 ? 'up' : 'down') + '">' +
        Icon.get(o.delta >= 0 ? 'trending-up' : 'trending-down') + Math.abs(o.delta) + '% vs last month</span>' : '') +
      (o.spark ? '<div class="stat-card__spark" data-spark="' + o.spark.join(',') + '" data-spark-color="' + (o.sparkColor || '#E91E63') + '"></div>' : '') +
      '</div>';
  }

  function drawSparks(root) {
    (root || document).querySelectorAll('[data-spark]').forEach(function (el) {
      if (el.dataset.sparkDone) return;
      el.dataset.sparkDone = '1';
      Anim.sparkline(el, el.dataset.spark.split(',').map(Number), el.dataset.sparkColor);
    });
  }

  global.Dash = { mount: mount, statCard: statCard, drawSparks: drawSparks };
})(window);
