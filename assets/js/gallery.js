/* ==========================================================================
   gallery.js — filterable gallery + lightbox + before/after slider
   ========================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------ lightbox */
  var lb = { el: null, items: [], index: 0 };

  function ensureLightbox() {
    if (lb.el) return lb.el;
    var el = document.createElement('div');
    el.className = 'lightbox';
    el.id = 'lightbox';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Image viewer');
    el.innerHTML =
      '<span class="lightbox__counter" id="lb-counter"></span>' +
      '<button class="lightbox__close" id="lb-close" aria-label="Close viewer">' + Icon.get('x') + '</button>' +
      '<button class="lightbox__btn lightbox__prev" id="lb-prev" aria-label="Previous image">' + Icon.get('chevron-left') + '</button>' +
      '<div class="lightbox__stage"><img id="lb-img" src="" alt="">' +
      '<div class="lightbox__caption"><b id="lb-title"></b><span id="lb-sub"></span></div></div>' +
      '<button class="lightbox__btn lightbox__next" id="lb-next" aria-label="Next image">' + Icon.get('chevron-right') + '</button>';
    document.body.appendChild(el);

    el.querySelector('#lb-close').addEventListener('click', closeLightbox);
    el.querySelector('#lb-prev').addEventListener('click', function () { step(-1); });
    el.querySelector('#lb-next').addEventListener('click', function () { step(1); });
    el.addEventListener('click', function (e) { if (e.target === el) closeLightbox(); });
    document.addEventListener('keydown', function (e) {
      if (!el.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });

    /* touch swipe */
    var startX = null;
    el.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 48) step(dx > 0 ? -1 : 1);
      startX = null;
    }, { passive: true });

    lb.el = el;
    return el;
  }

  function show() {
    var item = lb.items[lb.index];
    if (!item) return;
    var img = document.getElementById('lb-img');
    img.src = item.src;
    img.alt = item.title || '';
    document.getElementById('lb-title').textContent = item.title || '';
    document.getElementById('lb-sub').textContent = item.sub || '';
    document.getElementById('lb-counter').textContent = (lb.index + 1) + ' / ' + lb.items.length;
  }

  function step(dir) {
    lb.index = (lb.index + dir + lb.items.length) % lb.items.length;
    show();
  }

  function openLightbox(items, index) {
    ensureLightbox();
    lb.items = items;
    lb.index = index || 0;
    show();
    lb.el.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox() {
    if (!lb.el) return;
    lb.el.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  /* Auto-bind: any [data-lightbox-group] container, items = [data-lb-src] */
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-lb-src]');
    if (!trigger) return;
    e.preventDefault();
    var group = trigger.closest('[data-lightbox-group]') || document;
    var nodes = Array.prototype.slice.call(group.querySelectorAll('[data-lb-src]'))
      .filter(function (n) { return n.offsetParent !== null || n === trigger; });
    var items = nodes.map(function (n) {
      return { src: n.dataset.lbSrc, title: n.dataset.lbTitle || '', sub: n.dataset.lbSub || '' };
    });
    openLightbox(items, nodes.indexOf(trigger));
  });

  /* ---------------------------------------------------- filterable grid */
  function bindFilterGrid(tabsSel, gridSel) {
    var tabs = document.querySelector(tabsSel);
    var grid = document.querySelector(gridSel);
    if (!tabs || !grid) return;
    tabs.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-gal-filter]');
      if (!btn) return;
      tabs.querySelectorAll('[data-gal-filter]').forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      var f = btn.dataset.galFilter;
      var shown = 0;
      grid.querySelectorAll('[data-gal-cat]').forEach(function (item) {
        var match = f === 'all' || item.dataset.galCat === f;
        item.classList.toggle('is-hidden', !match);
        if (match) {
          shown++;
          item.style.animation = 'none';
          void item.offsetWidth; /* restart animation */
          item.style.animation = 'popIn .45s var(--e-out) both';
          item.style.animationDelay = Math.min(shown * 0.05, 0.4) + 's';
        }
      });
    });
  }

  /* ------------------------------------------------- before/after slider */
  function bindBASliders(root) {
    (root || document).querySelectorAll('.ba-slider').forEach(function (el) {
      if (el.dataset.baBound) return;
      el.dataset.baBound = '1';
      var after = el.querySelector('.ba-slider__after');
      var handle = el.querySelector('.ba-slider__handle');

      function setPos(clientX) {
        var r = el.getBoundingClientRect();
        var p = Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100));
        after.style.clipPath = 'inset(0 0 0 ' + p + '%)';
        handle.style.left = p + '%';
      }
      el.addEventListener('pointermove', function (e) {
        if (e.pressure > 0 || e.pointerType === 'mouse') setPos(e.clientX);
      });
      el.addEventListener('pointerdown', function (e) { setPos(e.clientX); });
      el.addEventListener('touchmove', function (e) { setPos(e.touches[0].clientX); }, { passive: true });
    });
  }

  document.addEventListener('DOMContentLoaded', function () { bindBASliders(document); });

  global.Gallery = {
    open: openLightbox,
    close: closeLightbox,
    bindFilterGrid: bindFilterGrid,
    bindBASliders: bindBASliders
  };
})(window);
