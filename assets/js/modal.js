/* ==========================================================================
   modal.js — modal system (declarative + programmatic + confirm helper)
   Declarative:  <button data-modal-open="id">  /  [data-modal-close]
   Programmatic: Modal.open(id) / Modal.close(id) / Modal.confirm(opts)
   ========================================================================== */
(function (global) {
  'use strict';

  var openStack = [];

  function focusables(el) {
    return el.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
  }

  function open(id) {
    var m = document.getElementById(id);
    if (!m) return;
    m.classList.add('is-open');
    m.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    openStack.push(m);
    var f = focusables(m);
    if (f.length) setTimeout(function () { f[0].focus(); }, 60);
  }

  function close(target) {
    var m = typeof target === 'string' ? document.getElementById(target) : target;
    if (!m) m = openStack[openStack.length - 1];
    if (!m) return;
    m.classList.remove('is-open');
    m.setAttribute('aria-hidden', 'true');
    openStack = openStack.filter(function (x) { return x !== m; });
    if (!openStack.length) document.body.classList.remove('no-scroll');
  }

  /* Build a modal shell on demand */
  function ensure(id, opts) {
    var m = document.getElementById(id);
    if (m) return m;
    o = opts || {};
    m = document.createElement('div');
    m.className = 'modal' + (o.center ? ' modal--center' : '');
    m.id = id;
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.setAttribute('aria-hidden', 'true');
    m.innerHTML =
      '<div class="modal__backdrop" data-modal-close></div>' +
      '<div class="modal__dialog ' + (o.size ? 'modal__dialog--' + o.size : '') + '">' +
      (o.head === false ? '' :
        '<div class="modal__head"><div><h3>' + (o.title || '') + '</h3>' +
        (o.sub ? '<p>' + o.sub + '</p>' : '') + '</div>' +
        '<button class="modal__close" data-modal-close aria-label="Close dialog">' + Icon.get('x') + '</button></div>') +
      '<div class="modal__body">' + (o.body || '') + '</div>' +
      (o.foot ? '<div class="modal__foot">' + o.foot + '</div>' : '') +
      '</div>';
    document.body.appendChild(m);
    return m;
  }

  /**
   * Confirm dialog helper.
   * Modal.confirm({title, message, confirmText, cancelText, danger, icon, onConfirm})
   */
  function confirm(o) {
    o = o || {};
    var id = 'modal-confirm-dyn';
    var old = document.getElementById(id);
    if (old) old.remove();

    var toneCls = o.danger ? 'background:rgba(229,57,53,.12);color:#E53935' : 'background:var(--light-pink);color:var(--primary-rose)';
    var m = document.createElement('div');
    m.className = 'modal modal--center';
    m.id = id;
    m.setAttribute('role', 'alertdialog');
    m.setAttribute('aria-modal', 'true');
    m.innerHTML =
      '<div class="modal__backdrop" data-modal-close></div>' +
      '<div class="modal__dialog modal__dialog--sm">' +
      '<div class="modal__body">' +
      '<div class="modal__icon" style="' + toneCls + '">' + Icon.get(o.icon || (o.danger ? 'alert-triangle' : 'help-circle')) + '</div>' +
      '<h3 style="margin-bottom:10px">' + (o.title || 'Are you sure?') + '</h3>' +
      '<p class="text-muted" style="line-height:1.65">' + (o.message || '') + '</p>' +
      '</div>' +
      '<div class="modal__foot">' +
      '<button class="btn btn--ghost" data-modal-close>' + (o.cancelText || 'Keep it') + '</button>' +
      '<button class="btn ' + (o.danger ? 'btn--danger' : 'btn--primary') + '" data-confirm-yes>' + (o.confirmText || 'Confirm') + '</button>' +
      '</div></div>';
    document.body.appendChild(m);

    m.querySelector('[data-confirm-yes]').addEventListener('click', function () {
      close(m);
      setTimeout(function () { m.remove(); }, 400);
      if (typeof o.onConfirm === 'function') o.onConfirm();
    });
    m.addEventListener('click', function (e) {
      if (e.target.closest('[data-modal-close]')) setTimeout(function () { m.remove(); }, 400);
    });
    requestAnimationFrame(function () { open(id); });
  }

  /* Global listeners */
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-modal-open]');
    if (opener) { e.preventDefault(); open(opener.dataset.modalOpen); return; }
    var closer = e.target.closest('[data-modal-close]');
    if (closer) { e.preventDefault(); close(closer.closest('.modal')); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openStack.length) close();
  });

  global.Modal = { open: open, close: close, ensure: ensure, confirm: confirm };
})(window);
