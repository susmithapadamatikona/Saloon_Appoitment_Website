/* ==========================================================================
   darkmode.js — theme switcher (persists via Store, respects OS preference)
   Loaded early in <head> region of body to avoid flash of wrong theme.
   ========================================================================== */
(function (global) {
  'use strict';

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function apply(theme) {
    if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.removeAttribute('data-theme');
  }

  function current() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  var Dark = {
    init: function () {
      var saved = null;
      try { saved = JSON.parse(localStorage.getItem('lumiere.theme')); } catch (e) {}
      apply(saved || (systemPrefersDark() ? 'dark' : 'light'));
    },
    toggle: function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem('lumiere.theme', JSON.stringify(next)); } catch (e) {}
      if (global.Toast) {
        Toast.info(next === 'dark' ? 'Dark mode on — easy on the eyes.' : 'Light mode on — bright and fresh.', 'Theme changed');
      }
      return next;
    },
    set: function (t) {
      apply(t);
      try { localStorage.setItem('lumiere.theme', JSON.stringify(t)); } catch (e) {}
    },
    current: current
  };

  Dark.init();

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('#theme-toggle, [data-theme-toggle]');
    if (btn) Dark.toggle();
  });

  global.Dark = Dark;
})(window);
