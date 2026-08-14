/* ==========================================================================
   main.js — page bootstrap
   Loader · layout mount · back-to-top · scroll progress · reveal · counters
   · smooth scroll · tabs · accordions · sticky CTA
   ========================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------- loader */
  function initLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) return;
    var done = function () {
      loader.classList.add('is-done');
      setTimeout(function () { loader.remove(); }, 650);
    };
    if (document.readyState === 'complete') setTimeout(done, 250);
    else window.addEventListener('load', function () { setTimeout(done, 250); });
    /* hard fallback so the site is never stuck behind the loader */
    setTimeout(done, 2600);
  }

  /* -------------------------------------------------- back to top + bar */
  function initScrollUi() {
    var btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = Icon.get('arrow-up');
    document.body.appendChild(btn);
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.appendChild(bar);

    var ticking = false;
    function update() {
      var y = window.scrollY;
      btn.classList.toggle('is-visible', y > 480);
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ------------------------------------------------------ scroll reveal */
  var revealObserver = null;
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var el = en.target;
          var delay = parseFloat(el.dataset.revealDelay || 0);
          if (delay) el.style.transitionDelay = delay + 's';
          el.classList.add('is-revealed');
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { revealObserver.observe(el); });
  }
  function watchReveal(root) {
    if (!revealObserver) return;
    (root || document).querySelectorAll('[data-reveal]:not(.is-revealed)').forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* -------------------------------------------------- animated counters */
  function animateCounter(el) {
    var target = parseFloat(el.dataset.count);
    var divide = parseFloat(el.dataset.divide || 1);
    var suffix = el.dataset.suffix || '';
    var prefix = el.dataset.prefix || '';
    var decimals = parseInt(el.dataset.decimals || 0, 10);
    var dur = 1800;
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = (target * eased) / divide;
      el.textContent = prefix + (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString('en-IN')) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function initCounters() {
    var els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(animateCounter);
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCounter(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* --------------------------------------------- progress bars on scroll */
  function initProgressBars() {
    var els = document.querySelectorAll('.progress__bar[data-value]');
    if (!els.length) return;
    var run = function (el) { el.style.width = el.dataset.value + '%'; };
    if (!('IntersectionObserver' in window)) { els.forEach(run); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); obs.unobserve(en.target); }
      });
    }, { threshold: 0.3 });
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ----------------------------------------------------- generic tabs */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (wrap) {
      var tabs = wrap.querySelectorAll('[data-tab]');
      tabs.forEach(function (t) {
        t.addEventListener('click', function () {
          tabs.forEach(function (x) {
            x.classList.remove('is-active');
            x.setAttribute('aria-selected', 'false');
          });
          t.classList.add('is-active');
          t.setAttribute('aria-selected', 'true');
          var group = wrap.dataset.tabs;
          document.querySelectorAll('[data-tab-panel][data-tab-group="' + group + '"]').forEach(function (p) {
            p.classList.toggle('is-active', p.dataset.tabPanel === t.dataset.tab);
          });
          wrap.dispatchEvent(new CustomEvent('tabchange', { detail: t.dataset.tab }));
        });
      });
    });
  }

  /* ------------------------------------------------------- accordions */
  function initAccordions() {
    document.addEventListener('click', function (e) {
      var trg = e.target.closest('.acc-trigger');
      if (!trg) return;
      var item = trg.closest('.acc-item');
      var acc = trg.closest('.accordion');
      var isOpen = item.classList.contains('is-open');
      if (acc && acc.dataset.single !== 'false') {
        acc.querySelectorAll('.acc-item.is-open').forEach(function (x) {
          x.classList.remove('is-open');
          x.querySelector('.acc-trigger').setAttribute('aria-expanded', 'false');
        });
      }
      item.classList.toggle('is-open', !isOpen);
      trg.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  /* ------------------------------------------------- smooth anchor jump */
  function initSmoothAnchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href') === '#') return;
      var target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* -------------------------------------------------- copy-to-clipboard */
  function copyText(text, onDone) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      ta.remove();
      if (onDone) onDone();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone || function () {}, fallback);
    } else fallback();
  }

  /* ---------------------------------------------------- sticky CTA bar */
  function initStickyCta() {
    var bar = document.querySelector('.sticky-cta');
    if (!bar) return;
    bar.classList.add('is-enabled');
    document.body.classList.add('has-sticky-cta');
  }

  /* -------------------------------------------------------- URL params */
  function param(name) {
    return new URLSearchParams(location.search).get(name);
  }

  /* ------------------------------------------------------------- boot */
  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    if (global.Layout) Layout.mount();
    Icon.hydrate(document);
    Img.hydrate(document);
    initScrollUi();
    initReveal();
    initCounters();
    initProgressBars();
    initTabs();
    initAccordions();
    initSmoothAnchors();
    initStickyCta();

    /* page-specific init hook */
    if (typeof global.pageInit === 'function') {
      global.pageInit();
      /* re-run enhancements for injected content */
      Icon.hydrate(document);
      Img.hydrate(document);
      watchReveal(document);
      initCounters();
      initProgressBars();
      initTabs();
    }
  });

  global.App = {
    copyText: copyText,
    watchReveal: watchReveal,
    param: param,
    animateCounter: animateCounter
  };
})(window);
