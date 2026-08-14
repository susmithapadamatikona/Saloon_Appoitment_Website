/* ==========================================================================
   slider.js — lightweight carousel (testimonials & card rows)
   new Slider(rootSel, {perView: {0:1, 780:2, 1080:3}, autoplay: 6000})
   ========================================================================== */
(function (global) {
  'use strict';

  function Slider(root, opts) {
    var self = this;
    this.root = typeof root === 'string' ? document.querySelector(root) : root;
    if (!this.root) return;
    opts = opts || {};
    this.track = this.root.querySelector('.slider__track');
    this.slides = Array.prototype.slice.call(this.track.children);
    this.perViewMap = opts.perView || { 0: 1, 780: 2, 1080: 3 };
    this.autoplayMs = opts.autoplay || 0;
    this.index = 0;
    this.timer = null;

    /* controls */
    var nav = document.createElement('div');
    nav.className = 'slider__nav';
    nav.innerHTML =
      '<div class="slider__arrows">' +
      '<button type="button" class="btn-icon" data-sl-prev aria-label="Previous slide">' + Icon.get('arrow-left') + '</button></div>' +
      '<div class="slider__dots" role="tablist"></div>' +
      '<div class="slider__arrows">' +
      '<button type="button" class="btn-icon" data-sl-next aria-label="Next slide">' + Icon.get('arrow-right') + '</button></div>';
    this.root.appendChild(nav);
    this.dotsHost = nav.querySelector('.slider__dots');

    nav.querySelector('[data-sl-prev]').addEventListener('click', function () { self.go(self.index - 1); self.restart(); });
    nav.querySelector('[data-sl-next]').addEventListener('click', function () { self.go(self.index + 1); self.restart(); });

    /* swipe */
    var startX = null;
    this.root.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    this.root.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 44) { self.go(self.index + (dx < 0 ? 1 : -1)); self.restart(); }
      startX = null;
    }, { passive: true });

    this.root.addEventListener('mouseenter', function () { self.stop(); });
    this.root.addEventListener('mouseleave', function () { self.start(); });

    window.addEventListener('resize', Search.debounce(function () { self.update(); }, 180));
    this.update();
    this.start();
  }

  Slider.prototype.perView = function () {
    var w = window.innerWidth;
    var pv = 1;
    var self = this;
    Object.keys(this.perViewMap).map(Number).sort(function (a, b) { return a - b; }).forEach(function (bp) {
      if (w >= bp) pv = self.perViewMap[bp];
    });
    return pv;
  };

  Slider.prototype.pages = function () {
    return Math.max(1, Math.ceil(this.slides.length / this.perView()));
  };

  Slider.prototype.update = function () {
    var pv = this.perView();
    this.root.classList.remove('slider--2', 'slider--3');
    if (pv === 2) this.root.classList.add('slider--2');
    if (pv >= 3) this.root.classList.add('slider--3');
    if (this.index >= this.pages()) this.index = 0;
    this.go(this.index);
  };

  Slider.prototype.go = function (i) {
    var pages = this.pages();
    this.index = ((i % pages) + pages) % pages;
    this.track.style.transform = 'translateX(-' + (this.index * 100) + '%)';
    this.renderDots();
  };

  Slider.prototype.renderDots = function () {
    var self = this;
    var pages = this.pages();
    var html = '';
    for (var i = 0; i < pages; i++) {
      html += '<button type="button" class="slider__dot' + (i === this.index ? ' is-active' : '') +
        '" data-dot="' + i + '" role="tab" aria-label="Go to slide ' + (i + 1) + '"' +
        (i === this.index ? ' aria-selected="true"' : '') + '></button>';
    }
    this.dotsHost.innerHTML = html;
    this.dotsHost.querySelectorAll('[data-dot]').forEach(function (d) {
      d.addEventListener('click', function () { self.go(parseInt(d.dataset.dot, 10)); self.restart(); });
    });
  };

  Slider.prototype.start = function () {
    var self = this;
    if (this.autoplayMs && !this.timer) {
      this.timer = setInterval(function () { self.go(self.index + 1); }, this.autoplayMs);
    }
  };
  Slider.prototype.stop = function () {
    clearInterval(this.timer);
    this.timer = null;
  };
  Slider.prototype.restart = function () {
    this.stop();
    this.start();
  };

  global.Slider = Slider;
})(window);
