/* ==========================================================================
   wishlist.js — favourite services / salons / stylists
   Buttons: <button data-wish="service|salon|stylist" data-wish-id="N">
   ========================================================================== */
(function (global) {
  'use strict';

  var NAMES = { service: 'service', salon: 'salon', stylist: 'stylist' };

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-wish]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();

    var type = btn.dataset.wish;
    var id = parseInt(btn.dataset.wishId, 10);
    var added = Store.toggleWishlist(type, id);

    /* sync every button for this item on the page */
    document.querySelectorAll('[data-wish="' + type + '"][data-wish-id="' + id + '"]').forEach(function (b) {
      b.classList.toggle('is-active', added);
      b.setAttribute('aria-pressed', added);
    });

    var label = '';
    if (type === 'service') { var s = DATA.service(id); label = s ? s.name : 'Service'; }
    if (type === 'salon') { var l = DATA.salon(id); label = l ? l.name : 'Salon'; }
    if (type === 'stylist') { var t = DATA.stylist(id); label = t ? t.name : 'Stylist'; }

    if (added) {
      Toast.rose('<b>' + label + '</b> saved to your favourites.', 'Added to wishlist ♥');
    } else {
      Toast.info('<b>' + label + '</b> removed from favourites.');
    }

    document.dispatchEvent(new CustomEvent('wishlist:change', { detail: { type: type, id: id, added: added } }));
  });

  var Wishlist = {
    /** Re-sync active states after content injection */
    refresh: function (root) {
      (root || document).querySelectorAll('[data-wish]').forEach(function (b) {
        var active = Store.inWishlist(b.dataset.wish, parseInt(b.dataset.wishId, 10));
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active);
      });
    },
    counts: function () {
      return {
        services: Store.getWishlist('service').length,
        salons: Store.getWishlist('salon').length,
        stylists: Store.getWishlist('stylist').length
      };
    },
    items: function (type) {
      var ids = Store.getWishlist(type);
      var src = type === 'service' ? DATA.SERVICES : type === 'salon' ? DATA.SALONS : DATA.STYLISTS;
      return src.filter(function (x) { return ids.indexOf(x.id) > -1; });
    }
  };

  document.addEventListener('DOMContentLoaded', function () { Wishlist.refresh(document); });
  global.Wishlist = Wishlist;
})(window);
