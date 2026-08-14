/* ==========================================================================
   booking.js — 8-step appointment booking wizard
   Steps: 1 Service · 2 Salon · 3 Stylist · 4 Date · 5 Time · 6 Details
          7 Summary & Payment · 8 Confirmation
   State persists to localStorage (draft) and survives refresh.
   URL prefills: ?service= ?salon= ?stylist= ?coupon=
   ========================================================================== */
(function (global) {
  'use strict';

  var TAX_RATE = 0.18;

  var STEP_META = [
    { key: 'service', label: 'Service', icon: 'sparkles' },
    { key: 'salon', label: 'Salon', icon: 'store' },
    { key: 'stylist', label: 'Stylist', icon: 'user' },
    { key: 'date', label: 'Date', icon: 'calendar' },
    { key: 'time', label: 'Time', icon: 'clock' },
    { key: 'details', label: 'Details', icon: 'edit' },
    { key: 'payment', label: 'Payment', icon: 'credit-card' },
    { key: 'done', label: 'Confirmed', icon: 'check-circle' }
  ];

  var state = {
    step: 0,
    serviceId: null,
    salonId: null,
    stylistId: null,   // -1 = any stylist
    date: null,
    time: null,
    name: '', email: '', phone: '', requests: '',
    coupon: null,
    payMethod: 'Pay at Salon'
  };

  var els = {};
  var cal = null;
  var confirmed = null;

  /* ---------------------------------------------------------- utilities */
  function svc() { return state.serviceId ? DATA.service(state.serviceId) : null; }
  function sal() { return state.salonId ? DATA.salon(state.salonId) : null; }
  function sty() { return state.stylistId && state.stylistId !== -1 ? DATA.stylist(state.stylistId) : null; }

  function pricing() {
    var s = svc();
    var price = s ? s.price : 0;
    var discount = 0;
    if (state.coupon) {
      var o = DATA.offer(state.coupon);
      if (o) {
        if (o.type === 'percent') discount = Math.round(price * o.value / 100);
        else if (o.type === 'flat') discount = Math.min(o.value, price);
        else if (o.type === 'bogo') discount = Math.round(price / 2);
      }
    }
    var net = Math.max(0, price - discount);
    var tax = Math.round(net * TAX_RATE);
    return { price: price, discount: discount, tax: tax, total: net + tax };
  }

  function saveDraft() {
    Store.saveDraft(state);
  }

  /* deterministic busy slots per (date, stylist) */
  function slotBusy(dateStr, time, stylistId) {
    var key = dateStr + '|' + time + '|' + (stylistId || 0);
    var h = 0;
    for (var i = 0; i < key.length; i++) h = ((h << 5) - h + key.charCodeAt(i)) | 0;
    return Math.abs(h) % 100 < 28;
  }

  /* ------------------------------------------------------------ stepper */
  function renderStepper() {
    els.stepper.innerHTML = STEP_META.map(function (s, i) {
      var cls = 'step' + (i === state.step ? ' is-active' : i < state.step ? ' is-done' : '');
      return '<div class="' + cls + '" role="listitem" aria-current="' + (i === state.step ? 'step' : 'false') + '">' +
        '<span class="step__dot">' + (i < state.step ? Icon.get('check') : (i + 1)) + '</span>' +
        '<span class="step__label">' + s.label + '</span></div>';
    }).join('');
  }

  /* ------------------------------------------------------------ summary */
  function renderSummary() {
    var s = svc(), l = sal(), t = sty();
    var p = pricing();

    function row(icon, label, value, empty) {
      return '<div class="summary-row"><span class="summary-row__icon">' + Icon.get(icon) + '</span>' +
        '<div style="min-width:0"><div class="summary-row__label">' + label + '</div>' +
        '<div class="summary-row__value' + (empty ? ' is-empty' : '') + '">' + value + '</div></div></div>';
    }

    var couponHtml;
    if (state.coupon) {
      couponHtml = '<div class="coupon-applied">' + Icon.get('ticket') +
        '<span><b>' + state.coupon + '</b> applied</span>' +
        '<button type="button" id="coupon-remove">Remove</button></div>';
    } else {
      couponHtml = '<div class="coupon-row">' +
        '<input class="input" id="coupon-input" placeholder="Coupon code" aria-label="Coupon code" style="text-transform:uppercase">' +
        '<button type="button" class="btn btn--soft btn--sm" id="coupon-apply">Apply</button></div>';
    }

    els.summary.innerHTML =
      '<div class="summary-card__head"><h3>Booking Summary</h3><p>Updates live as you choose</p></div>' +
      '<div class="summary-card__body">' +
      row('sparkles', 'Service', s ? s.name + ' · ' + DATA.duration(s.duration) : 'Not selected yet', !s) +
      row('store', 'Salon', l ? l.name : 'Not selected yet', !l) +
      row('user', 'Stylist', state.stylistId === -1 ? 'Any available stylist' : (t ? t.name : 'Not selected yet'), !t && state.stylistId !== -1) +
      row('calendar', 'Date', state.date ? DATA.dateLabel(state.date + 'T00:00:00') : 'Not selected yet', !state.date) +
      row('clock', 'Time', state.time || 'Not selected yet', !state.time) +
      couponHtml +
      '<div class="summary-totals">' +
      '<div class="total-line"><span>Service price</span><b>' + DATA.money(p.price) + '</b></div>' +
      (p.discount ? '<div class="total-line total-line--discount"><span>Discount (' + state.coupon + ')</span><b>− ' + DATA.money(p.discount) + '</b></div>' : '') +
      '<div class="total-line"><span>GST (18%)</span><b>' + DATA.money(p.tax) + '</b></div>' +
      '<div class="total-line total-line--grand"><span>Total</span><b>' + DATA.money(p.total) + '</b></div>' +
      '</div>' +
      '<div class="secure-note">' + Icon.get('shield-check') + 'Free cancellation up to 4 hours before</div>' +
      '</div>';

    var apply = document.getElementById('coupon-apply');
    if (apply) {
      var input = document.getElementById('coupon-input');
      function doApply() {
        var code = input.value.trim().toUpperCase();
        if (!code) return;
        var o = DATA.offer(code);
        if (!o) { Toast.error('Code <b>' + code + '</b> isn\'t valid or has expired.', 'Invalid coupon'); return; }
        var s2 = svc();
        if (o.applies.length && (!s2 || o.applies.indexOf(s2.id) === -1)) {
          Toast.warning('That code only applies to specific services. Check the offer terms.', 'Not applicable');
          return;
        }
        if (s2 && o.min > s2.price) {
          Toast.warning('This code needs a minimum order of ' + DATA.money(o.min) + '.', 'Minimum not met');
          return;
        }
        state.coupon = code;
        saveDraft();
        renderSummary();
        Toast.success(o.discount + ' applied to your booking. Nice one!', 'Coupon applied');
      }
      apply.addEventListener('click', doApply);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); doApply(); } });
    }
    var remove = document.getElementById('coupon-remove');
    if (remove) remove.addEventListener('click', function () {
      state.coupon = null;
      saveDraft();
      renderSummary();
      Toast.info('Coupon removed.');
    });
  }

  /* -------------------------------------------------------------- panels */
  function renderService() {
    var cats = [{ id: 'all', name: 'All', icon: 'grid' }].concat(DATA.CATEGORIES);
    var active = els.panel.dataset.catFilter || 'all';
    var list = DATA.SERVICES.filter(function (s) { return active === 'all' || s.cat === active; });

    els.panel.innerHTML =
      '<div class="panel-head"><span class="panel-head__n">Step 1 of 7</span>' +
      '<h2>Choose your service</h2><p>Pick what you\'d like done — price and duration shown on every card.</p></div>' +
      '<div class="tabs tabs--pill mb-6" id="bk-cats">' +
      cats.map(function (c) {
        return '<button type="button" class="tab' + (c.id === active ? ' is-active' : '') + '" data-cat="' + c.id + '">' + c.name + '</button>';
      }).join('') + '</div>' +
      '<div class="pick-grid">' +
      list.map(function (s) {
        var sel = state.serviceId === s.id;
        return '<button type="button" class="pick-card' + (sel ? ' is-selected' : '') + '" data-pick-service="' + s.id + '" aria-pressed="' + sel + '">' +
          '<span class="pick-card__check">' + Icon.get('check') + '</span>' +
          '<span class="pick-card__media">' + Img.tag({ seed: s.slug, kind: s.kind, alt: s.name, w: 480, h: 300 }) + '</span>' +
          '<span class="pick-card__body">' +
          '<span class="pick-card__title">' + s.name + '</span>' +
          '<span class="pick-card__sub">' + s.short + '</span>' +
          '<span class="pick-card__meta"><span>' + Icon.get('clock', '', 13) + ' ' + DATA.duration(s.duration) + ' · ★ ' + s.rating + '</span>' +
          '<span class="price"><span class="price__cur">' + DATA.CURRENCY + '</span><span class="price__val">' + s.price.toLocaleString('en-IN') + '</span></span></span>' +
          '</span></button>';
      }).join('') + '</div>';

    els.panel.querySelector('#bk-cats').addEventListener('click', function (e) {
      var t = e.target.closest('[data-cat]');
      if (!t) return;
      els.panel.dataset.catFilter = t.dataset.cat;
      renderService();
    });
    els.panel.querySelectorAll('[data-pick-service]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = parseInt(b.dataset.pickService, 10);
        if (state.serviceId !== id) {
          state.serviceId = id;
          // reset dependents
          state.stylistId = null;
          state.time = null;
        }
        saveDraft();
        renderService();
        renderSummary();
        setTimeout(function () { go(1); }, 260);
      });
    });
  }

  function renderSalon() {
    var s = svc();
    var list = s ? DATA.SALONS.filter(function (x) {
      return x.services.indexOf(s.cat) > -1 || x.services.indexOf('wellness') > -1 && s.cat === 'wellness';
    }) : DATA.SALONS;
    if (!list.length) list = DATA.SALONS;

    els.panel.innerHTML =
      '<div class="panel-head"><span class="panel-head__n">Step 2 of 7</span>' +
      '<h2>Pick a salon</h2><p>' + (s ? 'Locations offering <b>' + s.name + '</b>, nearest first.' : 'Choose your preferred location.') + '</p></div>' +
      '<div class="pick-grid">' +
      list.sort(function (a, b) { return a.distance - b.distance; }).map(function (l) {
        var sel = state.salonId === l.id;
        return '<button type="button" class="pick-card' + (sel ? ' is-selected' : '') + '" data-pick-salon="' + l.id + '" aria-pressed="' + sel + '">' +
          '<span class="pick-card__check">' + Icon.get('check') + '</span>' +
          '<span class="pick-card__media">' + Img.tag({ seed: l.slug, kind: 'salon', alt: l.name, w: 480, h: 300 }) + '</span>' +
          '<span class="pick-card__body">' +
          '<span class="pick-card__title">' + l.name + '</span>' +
          '<span class="pick-card__sub">' + Icon.get('map-pin', '', 12) + ' ' + l.area + ', ' + l.city + '</span>' +
          '<span class="pick-card__meta"><span>★ ' + l.rating + ' (' + l.reviews.toLocaleString('en-IN') + ')</span>' +
          '<span>' + (l.distance < 50 ? l.distance + ' km away' : l.city) + '</span></span>' +
          '</span></button>';
      }).join('') + '</div>';

    els.panel.querySelectorAll('[data-pick-salon]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = parseInt(b.dataset.pickSalon, 10);
        if (state.salonId !== id) {
          state.salonId = id;
          state.stylistId = null;
        }
        saveDraft();
        renderSummary();
        go(2);
      });
    });
  }

  function renderStylist() {
    var s = svc(), l = sal();
    var pool = DATA.STYLISTS.filter(function (st) {
      var okService = !s || st.services.indexOf(s.id) > -1;
      var okSalon = !l || st.salon === l.slug;
      return okService && okSalon && st.status !== 'leave';
    });
    var relaxed = false;
    if (!pool.length && s) {
      pool = DATA.STYLISTS.filter(function (st) { return st.services.indexOf(s.id) > -1 && st.status !== 'leave'; });
      relaxed = true;
    }
    if (!pool.length) pool = DATA.STYLISTS.filter(function (st) { return st.status !== 'leave'; });

    els.panel.innerHTML =
      '<div class="panel-head"><span class="panel-head__n">Step 3 of 7</span>' +
      '<h2>Choose your stylist</h2><p>' +
      (relaxed ? 'No specialist at that branch — these experts from nearby branches can take your booking.' :
        'Specialists ' + (s ? 'for <b>' + s.name + '</b>' : '') + (l ? ' at ' + l.name : '') + '.') + '</p></div>' +
      '<div class="pick-grid">' +
      '<button type="button" class="pick-card pick-card--any' + (state.stylistId === -1 ? ' is-selected' : '') + '" data-pick-stylist="-1" aria-pressed="' + (state.stylistId === -1) + '">' +
      '<span class="pick-card__check">' + Icon.get('check') + '</span>' +
      '<span class="icon-box icon-box--md icon-box--grad">' + Icon.get('users') + '</span>' +
      '<span class="pick-card__title">Any Available Stylist</span>' +
      '<span class="pick-card__sub">Widest choice of time slots — we\'ll assign a top-rated expert.</span>' +
      '</button>' +
      pool.map(function (st) {
        var sel = state.stylistId === st.id;
        var initials = st.name.split(' ').map(function (w) { return w[0]; }).join('');
        return '<button type="button" class="pick-card' + (sel ? ' is-selected' : '') + '" data-pick-stylist="' + st.id + '" aria-pressed="' + sel + '">' +
          '<span class="pick-card__check">' + Icon.get('check') + '</span>' +
          '<span class="pick-card__media" style="aspect-ratio:16/9">' + Img.tag({ seed: st.slug, kind: 'person', alt: st.name, w: 480, h: 270 }) + '</span>' +
          '<span class="pick-card__body">' +
          '<span class="pick-card__title">' + st.name + '</span>' +
          '<span class="pick-card__sub">' + st.role + ' · ' + st.exp + ' yrs</span>' +
          '<span class="pick-card__meta"><span>★ ' + st.rating + ' (' + st.reviews + ')</span>' +
          '<span class="avail-dot ' + (st.status === 'available' ? 'avail-dot--free">Available' : 'avail-dot--busy">Limited') + '</span></span>' +
          '</span></button>';
      }).join('') + '</div>';

    els.panel.querySelectorAll('[data-pick-stylist]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = parseInt(b.dataset.pickStylist, 10);
        if (state.stylistId !== id) {
          state.stylistId = id;
          state.time = null;
        }
        saveDraft();
        renderSummary();
        go(3);
      });
    });
  }

  function renderDate() {
    els.panel.innerHTML =
      '<div class="panel-head"><span class="panel-head__n">Step 4 of 7</span>' +
      '<h2>Pick a date</h2><p>Green means open, amber means limited slots. Fully booked days are crossed out.</p></div>' +
      '<div id="bk-calendar"></div>' +
      '<div id="bk-date-banner"></div>';

    cal = new Cal(document.getElementById('bk-calendar'), {
      selected: state.date,
      onSelect: function (ds) {
        state.date = ds;
        state.time = null;
        saveDraft();
        renderSummary();
        banner();
        setTimeout(function () { go(4); }, 320);
      }
    });
    function banner() {
      var b = document.getElementById('bk-date-banner');
      if (!state.date) { b.innerHTML = ''; return; }
      b.innerHTML = '<div class="cal-selected-banner">' + Icon.get('calendar-check') +
        '<div><b>' + DATA.dateLabel(state.date + 'T00:00:00') + '</b>' +
        '<span>Now choose a time slot that suits you</span></div></div>';
    }
    banner();
  }

  function renderTime() {
    if (!state.date) { go(3); return; }
    var groups = { morning: [], afternoon: [], evening: [] };
    DATA.TIME_SLOTS.forEach(function (slot) {
      groups[slot.p].push(slot);
    });
    var labels = { morning: ['sunrise', 'Morning'], afternoon: ['sun', 'Afternoon'], evening: ['sunset', 'Evening'] };
    var todayIso = Cal.iso(new Date());
    var nowMins = new Date().getHours() * 60 + new Date().getMinutes();

    function toMins(t) {
      var m = t.match(/(\d+):(\d+)\s*(AM|PM)/);
      var h = parseInt(m[1], 10) % 12 + (m[3] === 'PM' ? 12 : 0);
      return h * 60 + parseInt(m[2], 10);
    }

    els.panel.innerHTML =
      '<div class="panel-head"><span class="panel-head__n">Step 5 of 7</span>' +
      '<h2>Choose a time</h2><p>Slots for <b>' + DATA.dateLabel(state.date + 'T00:00:00') + '</b>' +
      (sty() ? ' with <b>' + sty().name + '</b>' : '') + '.</p></div>' +
      '<div class="slots-legend">' +
      '<span><i class="i-free"></i>Available</span>' +
      '<span><i class="i-sel"></i>Selected</span>' +
      '<span><i class="i-busy"></i>Booked</span></div>' +
      Object.keys(groups).map(function (g) {
        return '<div class="slot-group">' +
          '<div class="slot-group__title">' + Icon.get(labels[g][0]) + labels[g][1] + '</div>' +
          '<div class="slots-grid">' +
          groups[g].map(function (slot) {
            var busy = slotBusy(state.date, slot.t, state.stylistId);
            var past = state.date === todayIso && toMins(slot.t) <= nowMins + 45;
            var disabled = busy || past;
            var sel = state.time === slot.t;
            var offPeak = g === 'morning';
            return '<button type="button" class="slot' + (sel ? ' is-selected' : '') + '" data-pick-time="' + slot.t + '"' +
              (disabled ? ' disabled' : '') + ' aria-pressed="' + sel + '" aria-label="' + slot.t + (disabled ? ', unavailable' : '') + '">' +
              slot.t + (offPeak && !disabled ? '<span class="slot__tag">Off-peak</span>' : '') + '</button>';
          }).join('') + '</div></div>';
      }).join('');

    els.panel.querySelectorAll('[data-pick-time]').forEach(function (b) {
      b.addEventListener('click', function () {
        state.time = b.dataset.pickTime;
        saveDraft();
        renderSummary();
        els.panel.querySelectorAll('.slot').forEach(function (x) { x.classList.remove('is-selected'); });
        b.classList.add('is-selected');
        setTimeout(function () { go(5); }, 300);
      });
    });
  }

  function renderDetails() {
    var user = Store.getUser();
    if (user && !state.name) { state.name = user.name; state.email = user.email; }

    els.panel.innerHTML =
      '<div class="panel-head"><span class="panel-head__n">Step 6 of 7</span>' +
      '<h2>Your details</h2><p>We\'ll send the confirmation and a reminder the day before.</p></div>' +
      '<form id="bk-details-form" novalidate><div class="form-grid form-grid--2">' +
      '<label class="field field--icon has-label"><span class="field__label">Full Name <span class="req">*</span></span>' +
      '<input class="input" id="bk-name" data-rules="required|name" placeholder="e.g. Priya Sharma" value="' + (state.name || '') + '" autocomplete="name">' +
      '<span class="field__icon">' + Icon.get('user') + '</span></label>' +
      '<label class="field field--icon has-label"><span class="field__label">Email <span class="req">*</span></span>' +
      '<input class="input" type="email" id="bk-email" data-rules="required|email" placeholder="you@example.com" value="' + (state.email || '') + '" autocomplete="email">' +
      '<span class="field__icon">' + Icon.get('mail') + '</span></label>' +
      '<label class="field field--icon has-label"><span class="field__label">Phone <span class="req">*</span></span>' +
      '<input class="input" type="tel" id="bk-phone" data-rules="required|phone" placeholder="+91 98765 43210" value="' + (state.phone || '') + '" autocomplete="tel">' +
      '<span class="field__icon">' + Icon.get('phone') + '</span></label>' +
      '<label class="field has-label"><span class="field__label">Special Requests <small class="text-faint">(optional)</small></span>' +
      '<input class="input" id="bk-requests" data-rules="max:120" placeholder="Allergies, preferences, occasion…" value="' + (state.requests || '') + '">' +
      '</label>' +
      '<label class="field form-row-full has-label"><span class="field__label">Notes for your stylist <small class="text-faint">(optional)</small></span>' +
      '<textarea class="textarea" id="bk-notes" data-rules="max:400" placeholder="Anything else we should know — reference photos are welcome on the day.">' + (state.notes || '') + '</textarea>' +
      '<span class="field__hint">Your details are only used for this booking. No spam, ever.</span></label>' +
      '</div></form>';

    ['name', 'email', 'phone', 'requests', 'notes'].forEach(function (k) {
      var input = document.getElementById('bk-' + k);
      if (input) input.addEventListener('input', function () {
        state[k] = input.value;
        saveDraft();
      });
    });
  }

  function renderPayment() {
    var s = svc(), l = sal(), t = sty();
    var p = pricing();
    els.panel.innerHTML =
      '<div class="panel-head"><span class="panel-head__n">Step 7 of 7</span>' +
      '<h2>Review & payment</h2><p>Almost there — double-check the details and pick how you\'d like to pay.</p></div>' +

      '<div class="panel mb-6"><div class="panel__head"><h3>' + Icon.get('clipboard') + 'Appointment recap</h3></div>' +
      '<div class="panel__body"><div class="info-grid">' +
      '<div class="info-tile"><span class="icon-box icon-box--sm">' + Icon.get('sparkles') + '</span><div><span>Service</span><b>' + (s ? s.name : '—') + '</b></div></div>' +
      '<div class="info-tile"><span class="icon-box icon-box--sm icon-box--lav">' + Icon.get('store') + '</span><div><span>Salon</span><b>' + (l ? l.name : '—') + '</b></div></div>' +
      '<div class="info-tile"><span class="icon-box icon-box--sm icon-box--mint">' + Icon.get('user') + '</span><div><span>Stylist</span><b>' + (state.stylistId === -1 ? 'Any available' : t ? t.name : '—') + '</b></div></div>' +
      '<div class="info-tile"><span class="icon-box icon-box--sm icon-box--coral">' + Icon.get('calendar') + '</span><div><span>When</span><b>' + (state.date ? DATA.dateLabel(state.date + 'T00:00:00') : '—') + ' · ' + (state.time || '—') + '</b></div></div>' +
      '</div></div></div>' +

      '<h3 class="mb-4" style="font-size:var(--fs-lg)">Payment method</h3>' +
      '<div class="pay-methods mb-6">' +
      [
        ['Pay at Salon', 'Settle after your service — cash, card or UPI at the counter', 'store', ''],
        ['UPI', 'GPay, PhonePe, Paytm or any UPI app', 'zap', 'lav'],
        ['Card', 'Credit or debit — Visa, Mastercard, Amex, RuPay', 'credit-card', 'sky'],
        ['Wallet', 'Use your Lumière credit and loyalty points', 'wallet', 'mint']
      ].map(function (m) {
        return '<label class="pay-method"><input type="radio" name="paymethod" value="' + m[0] + '"' + (state.payMethod === m[0] ? ' checked' : '') + '>' +
          '<span class="pay-method__dot"></span>' +
          '<span class="icon-box icon-box--sm' + (m[3] ? ' icon-box--' + m[3] : '') + '">' + Icon.get(m[2]) + '</span>' +
          '<span class="pay-method__info"><b>' + m[0] + '</b><span>' + m[1] + '</span></span></label>';
      }).join('') + '</div>' +

      '<div class="note-box note-box--rose">' + Icon.get('info') +
      '<span><b>Total payable: ' + DATA.money(p.total) + '</b> — includes GST' +
      (p.discount ? ' and your ' + DATA.money(p.discount) + ' coupon discount' : '') +
      '. Free cancellation until 4 hours before your slot.</span></div>';

    els.panel.querySelectorAll('input[name="paymethod"]').forEach(function (r) {
      r.addEventListener('change', function () {
        state.payMethod = r.value;
        saveDraft();
      });
    });
  }

  function renderConfirmation() {
    var a = confirmed;
    if (!a) { go(0); return; }
    var s = DATA.service(a.serviceId), l = DATA.salon(a.salonId), t = a.stylistId !== -1 ? DATA.stylist(a.stylistId) : null;

    els.wrap.classList.add('hidden');
    els.stepperWrap.classList.add('hidden');
    els.confirm.classList.remove('hidden');

    els.confirm.innerHTML =
      '<div class="confetti" id="bk-confetti" aria-hidden="true"></div>' +
      '<div class="confirm-wrap">' +
      '<div class="confirm-tick">' + Icon.get('check') + '</div>' +
      '<h1>Appointment Confirmed!</h1>' +
      '<p>You\'re all set, ' + (a.name.split(' ')[0] || 'there') + '. A confirmation is on its way to <b>' + a.email + '</b> and we\'ll remind you the day before.</p>' +
      '<div class="booking-id-chip"><span>Booking ID</span><b>' + a.id + '</b>' +
      '<button type="button" class="btn-icon btn-icon--sm" data-copy-code="' + a.id + '" aria-label="Copy booking ID">' + Icon.get('copy') + '</button></div>' +

      '<div class="ticket" data-reveal="up">' +
      '<div class="ticket__head"><div><h3>' + s.name + '</h3><p>' + l.name + ' · ' + l.area + ', ' + l.city + '</p></div>' +
      '<span class="badge status-confirmed badge--dot">Confirmed</span></div>' +
      '<div class="ticket__perf"><span class="ticket__dash"></span></div>' +
      '<div class="ticket__body"><div class="ticket__grid">' +
      '<div class="ticket__cell"><span>Date</span><b>' + DATA.dateShort(a.date + 'T00:00:00') + '</b><small>' + new Date(a.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long' }) + '</small></div>' +
      '<div class="ticket__cell"><span>Time</span><b>' + a.time + '</b><small>' + DATA.duration(s.duration) + ' session</small></div>' +
      '<div class="ticket__cell"><span>Stylist</span><b>' + (t ? t.name : 'Any expert') + '</b><small>' + (t ? t.role : 'Assigned on arrival') + '</small></div>' +
      '<div class="ticket__cell"><span>Payment</span><b>' + a.payMethod + '</b><small>' + (a.payMethod === 'Pay at Salon' ? 'Due after service' : 'Paid') + '</small></div>' +
      '</div>' +
      '<div class="ticket__total">' +
      '<div><span class="text-xs text-faint uppercase fw-700">Total amount</span><div class="price price--lg"><span class="price__cur">' + DATA.CURRENCY + '</span><span class="price__val">' + a.total.toLocaleString('en-IN') + '</span></div>' +
      (a.discount ? '<span class="badge badge--mint mt-2">' + Icon.get('ticket') + 'Saved ' + DATA.money(a.discount) + '</span>' : '') + '</div>' +
      '<div class="ticket__qr" role="img" aria-label="Booking QR code"></div>' +
      '</div></div></div>' +

      '<div class="confirm-actions">' +
      '<button type="button" class="btn btn--ghost" id="bk-add-cal">' + Icon.get('calendar-plus') + 'Add to Calendar</button>' +
      '<button type="button" class="btn btn--soft" id="bk-download">' + Icon.get('download') + 'Download Receipt</button>' +
      '<a class="btn btn--primary" href="appointment-details.html?id=' + a.id + '">' + Icon.get('eye') + 'View Appointment</a>' +
      '</div>' +
      '<p class="mt-6 text-sm text-muted">Need to make a change? Manage everything from <a href="my-appointments.html">My Appointments</a>.</p>' +
      '</div>';

    /* confetti */
    var box = document.getElementById('bk-confetti');
    var colors = ['#E91E63', '#F06292', '#9575CD', '#FFB74D', '#4DB6AC', '#64B5F6'];
    for (var i = 0; i < 42; i++) {
      var c = document.createElement('i');
      c.style.left = Math.random() * 100 + '%';
      c.style.top = (Math.random() * -18) + '%';
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = (Math.random() * 1.4) + 's';
      c.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      box.appendChild(c);
    }

    document.getElementById('bk-add-cal').addEventListener('click', function () { downloadIcs(a, s, l); });
    document.getElementById('bk-download').addEventListener('click', function () { downloadReceipt(a, s, l, t); });
    App.watchReveal(els.confirm);
  }

  /* ------------------------------------------------------ file downloads */
  function downloadBlob(content, mime, filename) {
    var blob = new Blob([content], { type: mime });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 400);
  }

  function downloadIcs(a, s, l) {
    var m = a.time.match(/(\d+):(\d+)\s*(AM|PM)/);
    var h = parseInt(m[1], 10) % 12 + (m[3] === 'PM' ? 12 : 0);
    var start = a.date.replace(/-/g, '') + 'T' + String(h).padStart(2, '0') + m[2] + '00';
    var endH = h + Math.floor((parseInt(m[2], 10) + s.duration) / 60);
    var endM = (parseInt(m[2], 10) + s.duration) % 60;
    var end = a.date.replace(/-/g, '') + 'T' + String(endH).padStart(2, '0') + String(endM).padStart(2, '0') + '00';
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Lumiere//Booking//EN', 'BEGIN:VEVENT',
      'UID:' + a.id + '@lumierestudio.com',
      'DTSTART:' + start, 'DTEND:' + end,
      'SUMMARY:' + s.name + ' — Lumière (' + a.id + ')',
      'LOCATION:' + l.address.replace(/,/g, '\\,'),
      'DESCRIPTION:Booking ' + a.id + ' with Lumière Studio. Free cancellation until 4h before.',
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    downloadBlob(ics, 'text/calendar', 'lumiere-' + a.id + '.ics');
    Toast.success('Calendar file downloaded — open it to add the event.', 'Added to calendar');
  }

  function downloadReceipt(a, s, l, t) {
    var lines = [
      '══════════════════════════════════════════',
      '   LUMIÈRE BEAUTY STUDIO — BOOKING RECEIPT',
      '══════════════════════════════════════════',
      '',
      ' Booking ID   : ' + a.id,
      ' Status       : CONFIRMED',
      ' Booked on    : ' + DATA.dateShort(new Date()),
      '',
      '──────────────────────────────────────────',
      ' Service      : ' + s.name,
      ' Duration     : ' + DATA.duration(s.duration),
      ' Salon        : ' + l.name,
      '                ' + l.address,
      ' Stylist      : ' + (t ? t.name : 'Any available expert'),
      ' Date         : ' + DATA.dateLabel(a.date + 'T00:00:00'),
      ' Time         : ' + a.time,
      ' Client       : ' + a.name,
      '──────────────────────────────────────────',
      ' Service price:  ' + DATA.money(a.price),
      a.discount ? ' Discount     : -' + DATA.money(a.discount) + (a.coupon ? '  (' + a.coupon + ')' : '') : null,
      ' GST (18%)    :  ' + DATA.money(a.tax),
      ' TOTAL        :  ' + DATA.money(a.total),
      ' Payment      :  ' + a.payMethod,
      '──────────────────────────────────────────',
      '',
      ' Free cancellation until 4 hours before.',
      ' ' + DATA.BRAND.phone + ' · ' + DATA.BRAND.email,
      '',
      ' Thank you for choosing Lumière. ✨',
      '══════════════════════════════════════════'
    ].filter(Boolean);
    downloadBlob(lines.join('\n'), 'text/plain;charset=utf-8', 'lumiere-receipt-' + a.id + '.txt');
    Toast.success('Receipt downloaded.', 'Receipt saved');
  }

  /* ------------------------------------------------------------ wizard */
  var RENDERERS = [renderService, renderSalon, renderStylist, renderDate, renderTime, renderDetails, renderPayment];

  function validateStep(i) {
    switch (i) {
      case 0:
        if (!state.serviceId) { Toast.warning('Choose a service to continue.', 'Select a service'); return false; }
        return true;
      case 1:
        if (!state.salonId) { Toast.warning('Pick the salon you\'d like to visit.', 'Select a salon'); return false; }
        return true;
      case 2:
        if (state.stylistId === null) { Toast.warning('Choose a stylist, or tap "Any Available Stylist".', 'Select a stylist'); return false; }
        return true;
      case 3:
        if (!state.date) { Toast.warning('Pick an available date from the calendar.', 'Select a date'); return false; }
        return true;
      case 4:
        if (!state.time) { Toast.warning('Choose a time slot that works for you.', 'Select a time'); return false; }
        return true;
      case 5:
        var form = document.getElementById('bk-details-form');
        if (form && !Validate.form(form)) {
          Toast.error('Please fix the highlighted fields.', 'Check your details');
          return false;
        }
        return true;
      default:
        return true;
    }
  }

  function go(i) {
    if (i > state.step) {
      for (var k = state.step; k < i; k++) {
        if (!validateStep(k)) return;
      }
    }
    state.step = Math.max(0, Math.min(i, 6));
    saveDraft();
    renderStepper();
    RENDERERS[state.step]();
    renderNav();
    Icon.hydrate(els.panel);
    window.scrollTo({ top: Math.max(0, els.stepperWrap.getBoundingClientRect().top + window.scrollY - 110), behavior: 'smooth' });
  }

  function renderNav() {
    var last = state.step === 6;
    els.nav.innerHTML =
      '<button type="button" class="btn btn--ghost" id="bk-back"' + (state.step === 0 ? ' disabled' : '') + '>' +
      Icon.get('arrow-left') + 'Back</button>' +
      '<div class="text-sm text-muted">Step ' + (state.step + 1) + ' of 7</div>' +
      (last
        ? '<button type="button" class="btn btn--primary btn--lg" id="bk-confirm">' + Icon.get('check-circle') + 'Confirm Booking</button>'
        : '<button type="button" class="btn btn--primary" id="bk-next">Continue' + Icon.get('arrow-right') + '</button>');

    document.getElementById('bk-back').addEventListener('click', function () { go(state.step - 1); });
    var next = document.getElementById('bk-next');
    if (next) next.addEventListener('click', function () { go(state.step + 1); });
    var conf = document.getElementById('bk-confirm');
    if (conf) conf.addEventListener('click', confirmBooking);
  }

  function confirmBooking() {
    for (var k = 0; k <= 5; k++) if (!validateStep(k)) { go(k); return; }
    var btn = document.getElementById('bk-confirm');
    btn.classList.add('is-loading');

    setTimeout(function () {
      var p = pricing();
      var appt = {
        id: Store.newBookingId(),
        serviceId: state.serviceId,
        salonId: state.salonId,
        stylistId: state.stylistId,
        date: state.date,
        time: state.time,
        status: 'upcoming',
        price: p.price, discount: p.discount, tax: p.tax, total: p.total,
        name: state.name, email: state.email, phone: state.phone,
        requests: state.requests, notes: state.notes,
        coupon: state.coupon, payMethod: state.payMethod,
        createdAt: Cal.iso(new Date())
      };
      Store.saveAppointment(appt);
      Store.addPoints(Math.round(p.total / 10));
      Store.clearDraft();
      Store.session.set('lastBooking', appt.id);
      confirmed = appt;
      renderConfirmation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      Toast.success('Booking <b>' + appt.id + '</b> confirmed. You earned ' + Math.round(p.total / 10) + ' loyalty points!', 'See you soon ✨');
    }, 1100);
  }

  /* --------------------------------------------------------------- init */
  function init() {
    els.stepperWrap = document.getElementById('bk-stepper-wrap');
    els.stepper = document.getElementById('bk-stepper');
    els.panel = document.getElementById('bk-panel');
    els.nav = document.getElementById('bk-nav');
    els.summary = document.getElementById('bk-summary');
    els.wrap = document.getElementById('bk-wrap');
    els.confirm = document.getElementById('bk-confirm-screen');
    if (!els.panel) return;

    /* restore draft */
    var draft = Store.getDraft();
    if (draft && draft.serviceId !== undefined) {
      Object.keys(state).forEach(function (k) {
        if (draft[k] !== undefined) state[k] = draft[k];
      });
      /* drop stale past dates */
      if (state.date && state.date < Cal.iso(new Date())) { state.date = null; state.time = null; }
    }

    /* URL prefills override draft */
    var qs = new URLSearchParams(location.search);
    if (qs.get('service')) {
      var s = DATA.service(qs.get('service'));
      if (s) { state.serviceId = s.id; if (state.step < 1) state.step = 1; }
    }
    if (qs.get('salon')) {
      var l = DATA.salon(qs.get('salon'));
      if (l) { state.salonId = l.id; }
    }
    if (qs.get('stylist')) {
      var t = DATA.stylist(qs.get('stylist'));
      if (t) {
        state.stylistId = t.id;
        if (!state.serviceId && t.services.length) state.serviceId = t.services[0];
        var home = DATA.salon(t.salon);
        if (home && !state.salonId) state.salonId = home.id;
        if (state.step < 3) state.step = 3;
      }
    }
    if (qs.get('coupon')) {
      var o = DATA.offer(qs.get('coupon'));
      if (o) {
        state.coupon = o.code;
        Toast.rose('Coupon <b>' + o.code + '</b> is ready — it\'ll apply automatically at checkout.', 'Offer loaded');
      }
    }
    state.step = Math.min(state.step, 6);

    renderStepper();
    renderSummary();
    RENDERERS[state.step]();
    renderNav();
  }

  global.Booking = { init: init };
})(window);
