/* ==========================================================================
   appointment.js — LocalStorage-backed data layer
   Appointments · Auth (demo) · Wishlist · Loyalty · Preferences
   ========================================================================== */
(function (global) {
  'use strict';

  var KEY = {
    appts: 'lumiere.appointments',
    user: 'lumiere.user',
    wishServices: 'lumiere.wish.services',
    wishSalons: 'lumiere.wish.salons',
    wishStylists: 'lumiere.wish.stylists',
    points: 'lumiere.points',
    draft: 'lumiere.bookingDraft',
    theme: 'lumiere.theme',
    notifRead: 'lumiere.notifRead'
  };

  function read(k, fallback) {
    try {
      var raw = localStorage.getItem(k);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function write(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage full / private mode */ }
  }

  /* ------------------------------------------------------------ seed data */
  function daysFrom(n) {
    var d = new Date();
    d.setDate(d.getDate() + n);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }

  function seedAppointments() {
    return [
      {
        id: 'LUM-482913', serviceId: 3, salonId: 1, stylistId: 1,
        date: daysFrom(2), time: '11:00 AM', status: 'upcoming',
        price: 1299, discount: 0, tax: Math.round(1299 * 0.18), total: 1299 + Math.round(1299 * 0.18),
        name: 'Guest User', createdAt: daysFrom(-3), payMethod: 'Pay at Salon'
      },
      {
        id: 'LUM-471186', serviceId: 8, salonId: 2, stylistId: 3,
        date: daysFrom(9), time: '05:30 PM', status: 'upcoming',
        price: 2499, discount: 250, tax: Math.round(2249 * 0.18), total: 2249 + Math.round(2249 * 0.18),
        name: 'Guest User', createdAt: daysFrom(-1), payMethod: 'UPI', coupon: 'WEEKEND10'
      },
      {
        id: 'LUM-458204', serviceId: 5, salonId: 1, stylistId: 2,
        date: daysFrom(-12), time: '02:00 PM', status: 'completed',
        price: 1599, discount: 0, tax: Math.round(1599 * 0.18), total: 1599 + Math.round(1599 * 0.18),
        name: 'Guest User', createdAt: daysFrom(-20), payMethod: 'Card', rated: 5
      },
      {
        id: 'LUM-450917', serviceId: 12, salonId: 3, stylistId: 4,
        date: daysFrom(-26), time: '04:00 PM', status: 'completed',
        price: 699, discount: 175, tax: Math.round(524 * 0.18), total: 524 + Math.round(524 * 0.18),
        name: 'Guest User', createdAt: daysFrom(-30), payMethod: 'UPI', coupon: 'FIRST25', rated: 4
      },
      {
        id: 'LUM-444382', serviceId: 14, salonId: 4, stylistId: 5,
        date: daysFrom(-8), time: '06:30 PM', status: 'cancelled',
        price: 2299, discount: 0, tax: Math.round(2299 * 0.18), total: 2299 + Math.round(2299 * 0.18),
        name: 'Guest User', createdAt: daysFrom(-15), payMethod: 'Card', cancelReason: 'Schedule conflict'
      }
    ];
  }

  /* ------------------------------------------------------------- module */
  var Store = {

    /* ---------- appointments ---------- */
    getAppointments: function () {
      var list = read(KEY.appts, null);
      if (list === null) {
        list = seedAppointments();
        write(KEY.appts, list);
      }
      // auto-complete past upcoming appointments
      var today = new Date().toISOString().slice(0, 10);
      var changed = false;
      list.forEach(function (a) {
        if (a.status === 'upcoming' && a.date < today) { a.status = 'completed'; changed = true; }
      });
      if (changed) write(KEY.appts, list);
      return list;
    },

    getAppointment: function (id) {
      return Store.getAppointments().filter(function (a) { return a.id === id; })[0] || null;
    },

    saveAppointment: function (appt) {
      var list = Store.getAppointments();
      var idx = -1;
      list.forEach(function (a, i) { if (a.id === appt.id) idx = i; });
      if (idx > -1) list[idx] = appt; else list.unshift(appt);
      write(KEY.appts, list);
      return appt;
    },

    cancelAppointment: function (id, reason) {
      var list = Store.getAppointments();
      list.forEach(function (a) {
        if (a.id === id && a.status === 'upcoming') {
          a.status = 'cancelled';
          a.cancelReason = reason || 'Cancelled by client';
        }
      });
      write(KEY.appts, list);
    },

    rescheduleAppointment: function (id, date, time) {
      var list = Store.getAppointments();
      list.forEach(function (a) {
        if (a.id === id) { a.date = date; a.time = time; a.rescheduled = (a.rescheduled || 0) + 1; }
      });
      write(KEY.appts, list);
    },

    newBookingId: function () {
      return 'LUM-' + String(Math.floor(100000 + Math.random() * 900000));
    },

    /* ---------- booking draft (multi-step wizard persistence) ---------- */
    getDraft: function () { return read(KEY.draft, {}); },
    saveDraft: function (d) { write(KEY.draft, d); },
    clearDraft: function () { try { localStorage.removeItem(KEY.draft); } catch (e) {} },

    /* ---------- demo auth ---------- */
    getUser: function () { return read(KEY.user, null); },
    login: function (email, name, role) {
      var u = {
        name: name || email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); }),
        email: email,
        role: role || 'client',
        joined: new Date().toISOString().slice(0, 10),
        tier: 'Gold'
      };
      write(KEY.user, u);
      return u;
    },
    logout: function () { try { localStorage.removeItem(KEY.user); } catch (e) {} },
    updateUser: function (patch) {
      var u = Store.getUser() || {};
      Object.keys(patch).forEach(function (k) { u[k] = patch[k]; });
      write(KEY.user, u);
      return u;
    },

    /* ---------- wishlist ---------- */
    _wishKey: function (type) {
      return type === 'salon' ? KEY.wishSalons : type === 'stylist' ? KEY.wishStylists : KEY.wishServices;
    },
    getWishlist: function (type) { return read(Store._wishKey(type), []); },
    inWishlist: function (type, id) { return Store.getWishlist(type).indexOf(id) > -1; },
    toggleWishlist: function (type, id) {
      var list = Store.getWishlist(type);
      var i = list.indexOf(id);
      var added;
      if (i > -1) { list.splice(i, 1); added = false; }
      else { list.push(id); added = true; }
      write(Store._wishKey(type), list);
      return added;
    },

    /* ---------- loyalty ---------- */
    getPoints: function () { return read(KEY.points, 1240); },
    addPoints: function (n) {
      var p = Store.getPoints() + n;
      write(KEY.points, p);
      return p;
    },

    /* ---------- theme ---------- */
    getTheme: function () { return read(KEY.theme, null); },
    setTheme: function (t) { write(KEY.theme, t); },

    /* ---------- notifications read state ---------- */
    getNotifRead: function () { return read(KEY.notifRead, []); },
    markNotifsRead: function (ids) {
      var cur = Store.getNotifRead();
      ids.forEach(function (id) { if (cur.indexOf(id) === -1) cur.push(id); });
      write(KEY.notifRead, cur);
    },

    /* session-storage helper for one-off handoffs (e.g. last confirmed id) */
    session: {
      set: function (k, v) { try { sessionStorage.setItem('lumiere.' + k, JSON.stringify(v)); } catch (e) {} },
      get: function (k, f) {
        try {
          var raw = sessionStorage.getItem('lumiere.' + k);
          return raw === null ? f : JSON.parse(raw);
        } catch (e) { return f; }
      },
      del: function (k) { try { sessionStorage.removeItem('lumiere.' + k); } catch (e) {} }
    }
  };

  global.Store = Store;
})(window);
