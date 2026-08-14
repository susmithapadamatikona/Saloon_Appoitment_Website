/* ==========================================================================
   toast.js — toast notification system
   Toast.show(msg, type?, title?, timeout?)
   Types: success | error | info | warning | rose
   ========================================================================== */
(function (global) {
  'use strict';

  var ICONS = {
    success: 'check-circle',
    error: 'x-circle',
    info: 'info',
    warning: 'alert-triangle',
    rose: 'sparkles'
  };
  var TITLES = {
    success: 'Success',
    error: 'Something went wrong',
    info: 'Heads up',
    warning: 'Warning',
    rose: 'Lumière'
  };

  function stack() {
    var el = document.getElementById('toast-stack');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast-stack';
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'false');
      document.body.appendChild(el);
    }
    return el;
  }

  function dismiss(t) {
    if (t.dataset.leaving) return;
    t.dataset.leaving = '1';
    t.classList.add('is-leaving');
    setTimeout(function () { t.remove(); }, 340);
  }

  var Toast = {
    show: function (msg, type, title, timeout) {
      type = ICONS[type] ? type : 'info';
      timeout = timeout === undefined ? 4200 : timeout;

      var t = document.createElement('div');
      t.className = 'toast toast--' + type;
      t.setAttribute('role', 'status');
      t.innerHTML =
        '<div class="toast__icon">' + Icon.get(ICONS[type]) + '</div>' +
        '<div class="toast__body">' +
        '<div class="toast__title">' + (title || TITLES[type]) + '</div>' +
        '<div class="toast__msg">' + msg + '</div>' +
        '</div>' +
        '<button class="toast__close" aria-label="Dismiss notification">' + Icon.get('x') + '</button>' +
        '<div class="toast__bar"></div>';

      var s = stack();
      s.appendChild(t);
      while (s.children.length > 4) s.firstElementChild.remove();

      t.querySelector('.toast__close').addEventListener('click', function () { dismiss(t); });

      if (timeout > 0) {
        var bar = t.querySelector('.toast__bar');
        bar.style.transition = 'transform ' + timeout + 'ms linear';
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { bar.style.transform = 'scaleX(0)'; });
        });
        var timer = setTimeout(function () { dismiss(t); }, timeout);
        t.addEventListener('mouseenter', function () { clearTimeout(timer); bar.style.transition = 'none'; bar.style.transform = 'scaleX(1)'; });
        t.addEventListener('mouseleave', function () { timer = setTimeout(function () { dismiss(t); }, 2200); bar.style.transition = 'transform 2200ms linear'; bar.style.transform = 'scaleX(0)'; });
      }
      return t;
    },
    success: function (m, t) { return Toast.show(m, 'success', t); },
    error: function (m, t) { return Toast.show(m, 'error', t); },
    info: function (m, t) { return Toast.show(m, 'info', t); },
    warning: function (m, t) { return Toast.show(m, 'warning', t); },
    rose: function (m, t) { return Toast.show(m, 'rose', t); }
  };

  global.Toast = Toast;
})(window);
